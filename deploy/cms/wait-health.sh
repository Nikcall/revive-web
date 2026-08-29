#!/bin/bash
set -euo pipefail
for i in $(seq 1 30); do
  code=$(curl -s -o /tmp/cms-health.txt -w '%{http_code}' http://127.0.0.1:8055/server/health || echo 000)
  echo "try=$i code=$code"
  if [ "$code" = "200" ]; then
    cat /tmp/cms-health.txt
    echo
    docker ps --filter name=revive-cms --format '{{.Names}} {{.Status}}'
    exit 0
  fi
  sleep 3
done
echo "Directus did not become healthy"
docker ps -a --filter name=revive-cms
docker logs revive-cms --tail 80
exit 1
