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
sleep 5
docker compose ps

echo ""
echo "Nuxt is running on http://127.0.0.1:3000"
echo "Configure Nginx to proxy revive.su → localhost:3000"
