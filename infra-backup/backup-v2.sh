#!/usr/bin/env bash
# backup-v2.sh — Full REVIVE infrastructure backup.
# Does NOT modify existing revive-backup.sh or cron.
# Usage: backup-v2.sh [backup-root]
set -Eeuo pipefail

# ── Config ──────────────────────────────────────────────────────────────
BACKUP_ROOT="${1:-/var/backups/revive}"
STAMP="$(date -u +%Y-%m-%d_%H%M%S)"
DIR="${BACKUP_ROOT}/${STAMP}"
CRM_DB="revive_crm"
CRM_DB_USER="revive"
CMS_DB="revive_web"
CMS_DB_USER="directus_user"
CRM_STORAGE="/var/www/revive-crm/server/storage"
WEB_ENV="/var/www/revive-web/.env"
CMS_ENV="/opt/revive/cms/.env"
CRM_ENV="/var/www/revive-crm/server/.env"
BOT_ENV="/var/www/revive-crm/integrations/telegram-bot/.env"
PM2_DUMP="$HOME/.pm2/dump.pm2"
CRM_GIT="/var/www/revive-crm"
WEB_GIT="/var/www/revive-web"

log() { printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() { log "FATAL: $*" >&2; exit 1; }

mkdir -p -- "$DIR"/{databases,files/docker-volumes,config,secrets}
trap 'rm -rf -- "$DIR"' ERR

# ── 1. PostgreSQL CRM (host) ──────────────────────────────────────────
log "Dumping $CRM_DB (host)..."
sudo -u postgres pg_dump --format=custom "$CRM_DB" > "$DIR/databases/${CRM_DB}.dump"
pg_restore --list "$DIR/databases/${CRM_DB}.dump" > /dev/null
log "  OK: $(stat -c %s "$DIR/databases/${CRM_DB}.dump") bytes"

# ── 2. PostgreSQL Directus (host — Directus uses network_mode:host) ───
log "Dumping $CMS_DB (host PG, not container)..."
sudo -u postgres pg_dump --format=custom "$CMS_DB" > "$DIR/databases/${CMS_DB}.dump"
pg_restore --list "$DIR/databases/${CMS_DB}.dump" > /dev/null
log "  OK: $(stat -c %s "$DIR/databases/${CMS_DB}.dump") bytes"

# ── 3. CRM storage ───────────────────────────────────────────────────
log "Archiving CRM storage..."
if [ -d "$CRM_STORAGE" ]; then
  tar -czf "$DIR/files/crm-storage.tar.gz" -C "$(dirname "$CRM_STORAGE")" "$(basename "$CRM_STORAGE")"
  tar -tzf "$DIR/files/crm-storage.tar.gz" > /dev/null
  log "  OK: $(stat -c %s "$DIR/files/crm-storage.tar.gz") bytes"
else
  log "  SKIP: $CRM_STORAGE not found"
fi

# ── 4. Docker volumes (active containers only) ───────────────────────
log "Discovering Docker volumes for active containers..."
VOLUME_LIST="$DIR/files/volume-list.txt"
: > "$VOLUME_LIST"

for container in revive-web revive-cms revive-web-db; do
  if docker inspect "$container" > /dev/null 2>&1; then
    mounts=$(docker inspect "$container" --format '{{range .Mounts}}{{if eq .Type "volume"}}{{.Name}} {{end}}{{end}}' 2>/dev/null || true)
    for vol in $mounts; do
      echo "$vol" >> "$VOLUME_LIST"
      safe_name=$(echo "$vol" | tr '/' '_')
      log "  Backing up volume: $vol"
      docker run --rm -v "$vol":/src:ro -v "$DIR/files/docker-volumes":/dst alpine \
        tar -czf "/dst/${safe_name}.tar.gz" -C /src .
      log "    OK: ${safe_name}.tar.gz"
    done
  else
    log "  SKIP: container $container not running"
  fi
done

# ── 5. Infrastructure config ──────────────────────────────────────────
log "Collecting infrastructure config..."
CONF_DIR="$DIR/config"

# Nginx sites-available
cp -a /etc/nginx/sites-available/ "$CONF_DIR/nginx-sites-available/" 2>/dev/null || true

# Nginx sites-enabled (symlinks)
ls -la /etc/nginx/sites-enabled/ > "$CONF_DIR/nginx-sites-enabled.txt" 2>/dev/null || true

# Docker compose files
cp /var/www/revive-web/deploy/nuxt/docker-compose.yml "$CONF_DIR/web-compose.yml" 2>/dev/null || true
cp /opt/revive/cms/docker-compose.yml "$CONF_DIR/cms-compose.yml" 2>/dev/null || true

# Scripts
cp /usr/local/bin/revive-health-monitor.sh "$CONF_DIR/" 2>/dev/null || true
cp /usr/local/bin/revive-backup.sh "$CONF_DIR/" 2>/dev/null || true

# Crontab
crontab -l > "$CONF_DIR/root-crontab.txt" 2>/dev/null || true

# PM2
pm2 list > "$CONF_DIR/pm2-list.txt" 2>/dev/null || true
pm2 save 2>/dev/null || true
[ -f "$PM2_DUMP" ] && cp "$PM2_DUMP" "$CONF_DIR/dump.pm2" && chmod 600 "$CONF_DIR/dump.pm2"

# Nginx effective config (full dump)
nginx -T > "$CONF_DIR/nginx-effective.txt" 2>/dev/null || true

# Versions
cat > "$CONF_DIR/versions.txt" <<VEOF
Docker: $(docker --version 2>/dev/null || echo 'N/A')
Node: $(node --version 2>/dev/null || echo 'N/A')
PostgreSQL: $(psql --version 2>/dev/null || echo 'N/A')
Nginx: $(nginx -v 2>&1 || echo 'N/A')
PM2: $(pm2 --version 2>/dev/null || echo 'N/A')
Git CRM: $(cd /var/www/revive-crm && git rev-parse HEAD 2>/dev/null || echo 'N/A')
Git Web: $(cd /var/www/revive-web && git rev-parse HEAD 2>/dev/null || echo 'N/A')
VEOF

# ── 6. Secrets ────────────────────────────────────────────────────────
log "Copying secrets (chmod 600)..."
SEC_DIR="$DIR/secrets"
[ -f "$WEB_ENV" ] && cp "$WEB_ENV" "$SEC_DIR/web.env" && chmod 600 "$SEC_DIR/web.env"
[ -f "$CMS_ENV" ] && cp "$CMS_ENV" "$SEC_DIR/cms.env" && chmod 600 "$SEC_DIR/cms.env"
[ -f "$CRM_ENV" ] && cp "$CRM_ENV" "$SEC_DIR/crm.env" && chmod 600 "$SEC_DIR/crm.env"
[ -f "$BOT_ENV" ] && cp "$BOT_ENV" "$SEC_DIR/telegram-bot.env" && chmod 600 "$SEC_DIR/telegram-bot.env"
log "  Secrets copied (not logged)"

# ── 7. Manifest ───────────────────────────────────────────────────────
log "Generating manifest..."
CRM_GIT_SHA="$(cd "$CRM_GIT" && git rev-parse HEAD 2>/dev/null || echo 'unknown')"
WEB_GIT_SHA="$(cd "$WEB_GIT" && git rev-parse HEAD 2>/dev/null || echo 'unknown')"
CRM_DUMP_SIZE="$(stat -c %s "$DIR/databases/${CRM_DB}.dump" 2>/dev/null || echo 0)"
CMS_DUMP_SIZE="$(stat -c %s "$DIR/databases/${CMS_DB}.dump" 2>/dev/null || echo 0)"

cat > "$DIR/manifest.txt" <<MEOF
REVIVE Backup Manifest
======================
Date (UTC):     $(date -u +%Y-%m-%dT%H:%M:%SZ)
Hostname:       $(hostname)
Git CRM:        $CRM_GIT_SHA
Git Web:        $WEB_GIT_SHA
DB Dump Size:   revive_crm=${CRM_DUMP_SIZE}B, revive_web=${CMS_DUMP_SIZE}B
Volumes:        $(cat "$VOLUME_LIST" 2>/dev/null | tr '\n' ', ' || echo 'none')
Docker:         $(docker --version 2>/dev/null || echo 'N/A')
Node:           $(node --version 2>/dev/null || echo 'N/A')
PostgreSQL:     $(psql --version 2>/dev/null || echo 'N/A')
Nginx:          $(nginx -v 2>&1 || echo 'N/A')
MEOF

# Also JSON manifest
cat > "$DIR/manifest.json" <<JEOF
{
  "date_utc": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "hostname": "$(hostname)",
  "git_crm": "$CRM_GIT_SHA",
  "git_web": "$WEB_GIT_SHA",
  "databases": {
    "revive_crm": {"size_bytes": $CRM_DUMP_SIZE},
    "revive_web": {"size_bytes": $CMS_DUMP_SIZE}
  },
  "volumes": ['$(paste -sd "','" "$VOLUME_LIST" 2>/dev/null || true)'],
  "versions": {
    "docker": "$(docker --version 2>/dev/null || echo 'N/A')",
    "node": "$(node --version 2>/dev/null || echo 'N/A')",
    "postgresql": "$(psql --version 2>/dev/null || echo 'N/A')",
    "nginx": "$(nginx -v 2>&1 || echo 'N/A')"
  }
}
JEOF

# ── 8. SHA256SUMS ──────────────────────────────────────────────────────
log "Computing SHA256SUMS..."
(cd "$DIR" && find . -type f ! -name 'SHA256SUMS' -exec sha256sum {} \; > SHA256SUMS)
log "  SHA256SUMS created"

# ── 9. Validation ──────────────────────────────────────────────────────
log "Validating backup..."
pg_restore --list "$DIR/databases/${CRM_DB}.dump" > /dev/null
pg_restore --list "$DIR/databases/${CMS_DB}.dump" > /dev/null 2>&1 || log "  WARN: CMS dump verification failed"
tar -tzf "$DIR/files/crm-storage.tar.gz" > /dev/null 2>/dev/null || true
(cd "$DIR" && sha256sum -c SHA256SUMS > /dev/null)

log "============================================"
log "BACKUP COMPLETE: $DIR"
du -sh "$DIR"
log "Files:"
find "$DIR" -type f | sort | while read -r f; do
  sz=$(stat -c %s "$f" 2>/dev/null || echo "?")
  log "  $f ($sz bytes)"
done
log "============================================"
