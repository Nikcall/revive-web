#!/bin/sh
set -e

echo "=== Revive Web — Nuxt production deploy ==="

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo "Edit .env with real secrets, then re-run this script."
  exit 1
fi

echo "Building and starting Nuxt..."
docker compose up -d --build

echo "Waiting for healthcheck..."
for i in $(seq 1 15); do
  status=$(docker inspect --format '{{.State.Health.Status}}' revive-web 2>/dev/null || echo "unknown")
  if [ "$status" = "healthy" ]; then
    break
  fi
  sleep 2
done
docker compose ps

echo ""
echo "Nuxt is running on http://127.0.0.1:3000"
echo "Configure Nginx to proxy revive.su → localhost:3000"
