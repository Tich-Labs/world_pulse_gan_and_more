#!/usr/bin/env python3
"""Reconcile sheet vote counts to match local roadmap seed targets.

Usage:
  python3 scripts/reconcile_votes.py --url WEB_APP_URL [--targets scripts/roadmap_targets.json] [--dry-run]

This script:
- Calls the Apps Script `getIdeas` action to fetch current ideas and votes
- For each idea where the title matches a target, computes delta = target - current_votes
- Calls `voteIdea` delta times (one increment per call) to increase votes on the sheet

Be careful: this issues multiple POSTs to the Apps Script. Use `--dry-run` to preview.
"""
import argparse
import json
import sys
import time

try:
    import requests
except Exception:
    print('Install requests: pip install requests')
    sys.exit(1)


def post_api(url, action, payload=None):
    body = {'action': action}
    if payload:
        body.update(payload)
    r = requests.post(url, json=body, timeout=20)
    r.raise_for_status()
    try:
        return r.json()
    except Exception:
        return r.text


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--url', '-u', required=True, help='Apps Script Web App URL')
    p.add_argument('--targets', '-t', default='scripts/roadmap_targets.json', help='JSON file mapping title->targetVotes')
    p.add_argument('--delay', '-d', type=float, default=0.12, help='Delay between vote POSTs')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()

    try:
        with open(args.targets, 'r', encoding='utf-8') as fh:
            targets = json.load(fh)
    except Exception as e:
        print('Failed to load targets:', e)
        sys.exit(1)

    print('Fetching ideas from API...')
    res = post_api(args.url, 'getIdeas')
    data = None
    if isinstance(res, dict) and res.get('success'):
        data = res.get('data')
    elif isinstance(res, dict) and 'data' in res:
        data = res.get('data')
    elif isinstance(res, list):
        data = res
    else:
        print('Unexpected response from getIdeas:', res)
        sys.exit(1)

    # Normalize titles to match keys
    title_map = { (item.get('title') or '').strip(): item for item in data }

    actions = []
    for target_title, target_votes in targets.items():
        # try exact match, fallback to case-insensitive
        item = title_map.get(target_title)
        if not item:
            # case-insensitive search
            for k, v in title_map.items():
                if k.lower() == target_title.lower():
                    item = v
                    break
        if not item:
            print(f'WARN: No matching idea found for target title: "{target_title}"')
            continue
        current_votes = int(item.get('votes') or 0)
        delta = int(target_votes) - current_votes
        if delta <= 0:
            print(f'OK: "{target_title}" already has {current_votes} votes (target {target_votes})')
            continue
        actions.append((item['id'], target_title, current_votes, target_votes, delta))

    if not actions:
        print('No vote increments required.')
        return

    print('\nPlanned increments:')
    for aid, title, cur, tgt, d in actions:
        print(f'- {title}: {cur} -> {tgt} (increment {d})')

    if args.dry_run:
        print('\nDry run; no changes made.')
        return

    summary = []
    for idea_id, title, cur, tgt, d in actions:
        print(f'Applying {d} votes to "{title}"...')
        success = 0
        fail = 0
        for i in range(d):
            try:
                r = post_api(args.url, 'voteIdea', {'ideaId': idea_id})
                success += 1
            except Exception as e:
                print('  POST failed:', e)
                fail += 1
            time.sleep(args.delay)
        summary.append((title, success, fail))

    print('\nReconciliation finished:')
    for title, succ, fail in summary:
        print(f'- {title}: votes increment attempts={succ+fail}, successes={succ}, failures={fail}')


if __name__ == '__main__':
    main()
