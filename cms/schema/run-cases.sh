#!/bin/bash
set -a
source /opt/revive/cms/.env
set +a
export DIRECTUS_URL=http://127.0.0.1:8055
export DIRECTUS_ADMIN_EMAIL="$ADMIN_EMAIL"
export DIRECTUS_ADMIN_PASSWORD="$ADMIN_PASSWORD"
cd /opt/revive/cms/bootstrap
node schema/cases-bootstrap.mjs
