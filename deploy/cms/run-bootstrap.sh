#!/bin/bash
set -euo pipefail
set -a
# shellcheck disable=SC1091
source /opt/revive/cms/.env
set +a
export DIRECTUS_URL=http://127.0.0.1:8055
export DIRECTUS_ADMIN_EMAIL="$ADMIN_EMAIL"
export DIRECTUS_ADMIN_PASSWORD="$ADMIN_PASSWORD"
cd /opt/revive/cms/bootstrap
echo "=== cms:services #1 ==="
node schema/services-prices.mjs
echo "=== cms:services #2 ==="
node schema/services-prices.mjs
