#!/bin/bash
set -euo pipefail
set -a
# shellcheck disable=SC1091
source /opt/revive/cms/.env
set +a
python3 - <<'PY'
import json, os, urllib.request

base = 'http://127.0.0.1:8055'
email = os.environ['ADMIN_EMAIL']
password = os.environ['ADMIN_PASSWORD']

def api(path, method='GET', body=None, token=None):
    req = urllib.request.Request(base + path, method=method)
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', 'Bearer ' + token)
    data = None if body is None else json.dumps(body).encode()
    with urllib.request.urlopen(req, data=data, timeout=30) as res:
        return json.loads(res.read().decode() or '{}')

login = api('/auth/login', 'POST', {'email': email, 'password': password})
token = login['data']['access_token']
print('ROLES', json.dumps(api('/roles?limit=-1', token=token), ensure_ascii=False)[:4000])
print('POLICIES', json.dumps(api('/policies?limit=-1', token=token), ensure_ascii=False)[:4000])
print('PERMS', json.dumps(api('/permissions?limit=-1', token=token), ensure_ascii=False)[:4000])
PY
