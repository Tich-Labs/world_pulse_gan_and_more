#!/usr/bin/env python3
"""
Push projects JSON to the WorldPulse Apps Script endpoint using action 'submitProject'.
Usage:
  pip install requests
  ./scripts/push_projects.py --api-url <API_URL> --file scripts/sample_projects.json

Options:
  --dry-run  Show payloads without sending
"""
import argparse
import json
import sys

try:
    import requests
except Exception:
    print('Please install requests: pip install requests')
    sys.exit(1)


def load_projects(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def push_project(api_url, project):
    payload = {
        'action': 'submitProject',
        'data': project
    }
    headers = {'Content-Type': 'application/json'}
    resp = requests.post(api_url, json=payload, headers=headers, timeout=30)
    return resp


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--api-url', required=True, help='Apps Script deployment URL')
    p.add_argument('--file', required=True, help='JSON file with array of projects')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()

    projects = load_projects(args.file)
    if not isinstance(projects, list):
        print('Project file must contain a JSON array')
        sys.exit(1)

    for i, project in enumerate(projects, 1):
        print(f"[{i}/{len(projects)}] Project: {project.get('name')[:50]}")
        if args.dry_run:
            print(json.dumps({'action':'submitProject','data': project}, indent=2))
            continue

        try:
            resp = push_project(args.api_url, project)
            print('  Status:', resp.status_code)
            print('  Response:', resp.text[:1000])
        except Exception as e:
            print('  Error:', str(e))


if __name__ == '__main__':
    main()
