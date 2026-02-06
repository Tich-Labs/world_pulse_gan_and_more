#!/usr/bin/env python3
"""
Bulk import WorldPulse JSON data into a Google Apps Script Web App.

Usage:
  python3 scripts/bulk_post_to_apps_script.py --url YOUR_WEB_APP_URL --file worldpulse-data.json

The script expects the JSON structure produced by the front-end export:
{
  "ideas": [ { id,title,description,submitter,category,votes,timestamp }, ... ],
  "stories": [ { id,title,author,content,votes,timestamp,url }, ... ]
}

It will POST each idea as action `submitIdea` and each story as `submitStory`.
The Apps Script `submitIdea`/`submitStory` handlers should accept the fields used here.

Requires: requests (pip install requests)
"""
import argparse
import json
import sys
import time

try:
    import requests
except Exception:
    print('This script requires the requests package. Install with: pip install requests')
    sys.exit(1)


def post_action(url, action, data, timeout=15):
    payload = { 'action': action, 'data': data }
    try:
        r = requests.post(url, json=payload, timeout=timeout)
        r.raise_for_status()
        try:
            return True, r.json()
        except Exception:
            return True, r.text
    except Exception as e:
        return False, str(e)


def main():
    p = argparse.ArgumentParser(description='Bulk POST WorldPulse data to Apps Script web app')
    p.add_argument('--url', '-u', required=True, help='Deployed Apps Script Web App URL')
    p.add_argument('--file', '-f', default='worldpulse-data.json', help='Path to exported JSON file')
    p.add_argument('--delay', '-d', type=float, default=0.15, help='Delay between requests (seconds)')
    p.add_argument('--dry-run', action='store_true', help='Show what would be posted without sending')
    args = p.parse_args()

    try:
        with open(args.file, 'r', encoding='utf-8') as fh:
            data = json.load(fh)
    except Exception as e:
        print('Failed to read JSON file:', e)
        sys.exit(1)

    ideas = data.get('ideas') or []
    stories = data.get('stories') or []

    print(f'Found {len(ideas)} ideas and {len(stories)} stories in {args.file}')

    if args.dry_run:
        print('\nDry run mode — showing first 3 items of each type:')
        for it in ideas[:3]:
            print('IDEA ->', {k: it.get(k) for k in ('title','submitter','category')})
        for st in stories[:3]:
            print('STORY ->', {k: st.get(k) for k in ('title','author')})
        return

    success_count = 0
    fail_count = 0

    # Post ideas
    for idx, it in enumerate(ideas, start=1):
        payload = {
            'title': it.get('title') or it.get('name') or '',
            'description': it.get('description') or it.get('userStory') or '',
            'category': it.get('category') or 'Feature',
            'userId': it.get('submitter') or ''
        }
        ok, resp = post_action(args.url, 'submitIdea', payload)
        if ok:
            success_count += 1
            print(f'[Idea {idx}/{len(ideas)}] OK: {payload["title"]}')
        else:
            fail_count += 1
            print(f'[Idea {idx}/{len(ideas)}] FAIL: {payload["title"]} — {resp}')
        time.sleep(args.delay)

    # Post stories
    for idx, st in enumerate(stories, start=1):
        payload = {
            'title': st.get('title') or '',
            'author': st.get('author') or '',
            'content': st.get('content') or st.get('description') or '',
            'url': st.get('url') or ''
        }
        ok, resp = post_action(args.url, 'submitStory', payload)
        if ok:
            success_count += 1
            print(f'[Story {idx}/{len(stories)}] OK: {payload["title"]}')
        else:
            fail_count += 1
            print(f'[Story {idx}/{len(stories)}] FAIL: {payload["title"]} — {resp}')
        time.sleep(args.delay)

    print(f'Finished. successes={success_count} failures={fail_count}')


if __name__ == '__main__':
    main()
