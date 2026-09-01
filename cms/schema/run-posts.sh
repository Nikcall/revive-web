#!/bin/bash
# Posts collection bootstrap — run on VPS.
# Usage: bash cms/schema/run-posts.sh
set -e
cd "$(dirname "$0")/.."

# Copy schema if running from local
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/posts-schema.mjs" ] && [ ! -f "schema/posts-schema.mjs" ]; then
  mkdir -p schema
  cp "$SCRIPT_DIR/posts-schema.mjs" schema/
fi
if [ -f "$SCRIPT_DIR/posts-bootstrap.mjs" ] && [ ! -f "schema/posts-bootstrap.mjs" ]; then
  mkdir -p schema
  cp "$SCRIPT_DIR/posts-bootstrap.mjs" schema/
fi

. /opt/revive/cms/.env 2>/dev/null || true
export DIRECTUS_URL="${DIRECTUS_URL:-http://localhost:8055}"
export DIRECTUS_ADMIN_EMAIL="${ADMIN_EMAIL:-admin@revive.su}"
export DIRECTUS_ADMIN_PASSWORD="${ADMIN_PASSWORD:-p3oZoEQVXUEDgl8UUCZ3}"

node schema/posts-bootstrap.mjs
