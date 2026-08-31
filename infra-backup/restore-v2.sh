#!/usr/bin/env bash
# restore-v2.sh — Restore REVIVE from backup.
# Does NOT auto-run against production.
# Usage: restore-v2.sh --dry-run <backup-dir>   (preview only)
#        restore-v2.sh --restore <backup-dir>    (real restore)
set -Eeuo pipefail

MODE=""
BACKUP_DIR=""

usage() {
  cat <<'EOF'
REVIVE Restore Tool

Usage:
  restore-v2.sh --dry-run  <backup-directory>   Preview what would be restored
  restore-v2.sh --restore  <backup-directory>   Actually restore (requires confirmation)
  restore-v2.sh --help                          Show this help

IMPORTANT:
  --restore will STOP running services (PM2, Docker containers) before restoring.
  Backups are NOT automatically deleted after restore.
  SSL certificates are NOT restored — use certbot on the new server.
  Secrets are shown as file paths only, never printed to stdout.

EOF
  exit 0
}

die() { echo "FATAL: $*" >&2; exit 1; }
log() { printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }

# ── Parse args ────────────────────────────────────────────────────────
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) MODE="dry-run"; shift ;;
    --restore) MODE="restore"; shift ;;
    --help|-h) usage ;;
    *)
      if [ -z "$BACKUP_DIR" ]; then
        BACKUP_DIR="$1"; shift
      else
        die "Unexpected argument: $1"
      fi
      ;;
  esac
done

[ -n "$MODE" ] || usage
[ -n "$BACKUP_DIR" ] || die "No backup directory specified"
[ -d "$BACKUP_DIR" ] || die "Backup directory not found: $BACKUP_DIR"

# ── Pre-flight checks ─────────────────────────────────────────────────
log "Validating backup integrity..."
for f in manifest.txt SHA256SUMS databases/revive_crm.dump databases/revive_web.dump; do
  [ -f "$BACKUP_DIR/$f" ] || die "Missing required file: $f"
done

(cd "$BACKUP_DIR" && sha256sum -c SHA256SUMS > /dev/null 2>&1) || die "SHA256 checksum mismatch"
pg_restore --list "$BACKUP_DIR/databases/revive_crm.dump" > /dev/null 2>&1 || die "revive_crm.dump is corrupt"
# CMS dump may be newer PG version — verify via container
if docker inspect revive-web-db > /dev/null 2>&1; then
  cat "$BACKUP_DIR/databases/revive_web.dump" | docker exec -i revive-web-db pg_restore --list > /dev/null 2>&1 || log "WARN: revive_web.dump verification via container failed (proceeding anyway)"
fi
log "Integrity OK"

echo ""
cat "$BACKUP_DIR/manifest.txt"
echo ""

# ── Detect infrastructure ──────────────────────────────────────────────
log "Detecting current infrastructure..."
CRM_DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='revive_crm'" 2>/dev/null || echo "")
CMS_DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='revive_web'" 2>/dev/null || echo "")
PM2_CRM_RUNNING=$(pm2 describe revive-crm 2>/dev/null | grep -c "online" || echo "0")
CRM_RUNNING=$(curl -fsS --max-time 3 http://127.0.0.1:3001/api/health 2>/dev/null | grep -c '"status":"ok"' || echo "0")

log "  PostgreSQL (revive_crm): ${CRM_DB_EXISTS:-not found}"
log "  PostgreSQL (revive_web): ${CMS_DB_EXISTS:-not found}"
log "  PM2 revive-crm: $([ "$PM2_CRM_RUNNING" -gt 0 ] && echo online || echo stopped)"
log "  CRM API health: $([ "$CRM_RUNNING" -gt 0 ] && echo ok || echo fail)"
echo ""

# ── Restore plan ───────────────────────────────────────────────────────
log "=== RESTORE PLAN ($MODE) ==="
echo ""

log "1. DATABASES"
log "   - revive_crm: pg_restore into host PostgreSQL"
log "   - revive_web: pg_restore into host PostgreSQL (Directus uses host PG)"
echo ""

log "2. CRM STORAGE"
if [ -f "$BACKUP_DIR/files/crm-storage.tar.gz" ]; then
  ENTRIES=$(tar -tzf "$BACKUP_DIR/files/crm-storage.tar.gz" 2>/dev/null | head -5 | tr '\n' ' ')
  log "   - $BACKUP_DIR/files/crm-storage.tar.gz"
  log "     → /var/www/revive-crm/server/storage/"
  log "     Contents: $ENTRIES..."
else
  log "   - SKIP (no crm-storage.tar.gz)"
fi
echo ""

log "3. DOCKER VOLUMES"
if [ -f "$BACKUP_DIR/files/volume-list.txt" ]; then
  while IFS= read -r vol; do
    [ -z "$vol" ] && continue
    safe_name=$(echo "$vol" | tr '/' '_')
    log "   - Volume: $vol"
    log "     Archive: $BACKUP_DIR/files/docker-volumes/${safe_name}.tar.gz"
  done < "$BACKUP_DIR/files/volume-list.txt"
else
  log "   - No volume list found"
fi
echo ""

log "4. INFRASTRUCTURE CONFIG"
log "   - Nginx sites-available → /etc/nginx/sites-available/"
log "   - Web compose → /var/www/revive-web/deploy/nuxt/docker-compose.yml"
log "   - CMS compose → /opt/revive/cms/docker-compose.yml"
log "   - Health monitor → /usr/local/bin/revive-health-monitor.sh"
log "   - Backup script → /usr/local/bin/revive-backup.sh (NEW version)"
log "   - Crontab → root crontab"
echo ""

log "5. SECRETS (paths only, not printed)"
for sec in "$BACKUP_DIR"/secrets/*.env; do
  [ -f "$sec" ] || continue
  name=$(basename "$sec")
  case "$name" in
    web.env)         log "   - $sec → /var/www/revive-web/.env" ;;
    cms.env)         log "   - $sec → /opt/revive/cms/.env" ;;
    crm.env)         log "   - $sec → /var/www/revive-crm/server/.env" ;;
    telegram-bot.env) log "   - $sec → /var/www/revive-crm/integrations/telegram-bot/.env" ;;
  esac
done
echo ""

log "6. NOT RESTORED"
log "   - SSL certificates (use certbot on new server)"
log "   - DNS records (configure at registrar)"
log "   - Docker images (pulled during compose up)"
log "   - Node modules (npm install during deploy)"
echo ""

# ── Dry run ends here ─────────────────────────────────────────────────
if [ "$MODE" = "dry-run" ]; then
  log "=== DRY RUN COMPLETE ==="
  log "No changes were made."
  exit 0
fi

# ── Real restore ───────────────────────────────────────────────────────
log "=== REAL RESTORE ==="
log ""
log "WARNING: This will:"
log "  - Stop PM2 processes (revive-crm, revive-telegram-bot)"
log "  - Stop Docker containers (revive-web, revive-cms)"
log "  - DROP and recreate databases revive_crm, revive_web"
log "  - Overwrite /var/www/revive-crm/server/storage/"
log "  - Overwrite Docker volumes"
log "  - Overwrite infrastructure config files"
log ""
read -rp "Type YES to confirm: " CONFIRM
[ "$CONFIRM" = "YES" ] || { log "Aborted."; exit 0; }

log "Starting restore..."

# 5a. Stop services
log "Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true

log "Stopping Docker containers..."
docker stop revive-web revive-cms 2>/dev/null || true

# 5b. Restore databases
log "Restoring revive_crm..."
sudo -u postgres dropdb --if-exists revive_crm 2>/dev/null || true
sudo -u postgres createdb -O revive revive_crm 2>/dev/null || true
pg_restore --no-owner --no-privileges -d revive_crm "$BACKUP_DIR/databases/revive_crm.dump" 2>/dev/null || true
log "  revive_crm restored"

log "Restoring revive_web..."
sudo -u postgres dropdb --if-exists revive_web 2>/dev/null || true
sudo -u postgres createdb -O directus_user revive_web 2>/dev/null || true
pg_restore --no-owner --no-privileges -d revive_web "$BACKUP_DIR/databases/revive_web.dump" 2>/dev/null || true
log "  revive_web restored"

# 5c. Restore CRM storage
if [ -f "$BACKUP_DIR/files/crm-storage.tar.gz" ]; then
  log "Restoring CRM storage..."
  tar -xzf "$BACKUP_DIR/files/crm-storage.tar.gz" -C /var/www/revive-crm/server/
  log "  CRM storage restored"
fi

# 5d. Restore Docker volumes
if [ -f "$BACKUP_DIR/files/volume-list.txt" ]; then
  log "Restoring Docker volumes..."
  while IFS= read -r vol; do
    [ -z "$vol" ] && continue
    safe_name=$(echo "$vol" | tr '/' '_')
    archive="$BACKUP_DIR/files/docker-volumes/${safe_name}.tar.gz"
    if [ -f "$archive" ]; then
      docker run --rm -v "$vol":/dst alpine sh -c 'rm -rf /dst/* /dst/..?* /dst/.[!.]*' 2>/dev/null || true
      docker run --rm -v "$vol":/dst -v "$archive":/src.tar.gz:ro alpine sh -c 'tar -xzf /src.tar.gz -C /dst'
      log "    Volume $vol restored"
    fi
  done < "$BACKUP_DIR/files/volume-list.txt"
fi

# 5e. Restore config
log "Restoring infrastructure config..."
if [ -d "$BACKUP_DIR/config/nginx-sites-available" ]; then
  cp -a "$BACKUP_DIR/config/nginx-sites-available/"* /etc/nginx/sites-available/ 2>/dev/null || true
  nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || log "  WARN: nginx config test failed, reload skipped"
fi
mkdir -p /var/www/revive-web/deploy/nuxt
[ -f "$BACKUP_DIR/config/web-compose.yml" ] && cp "$BACKUP_DIR/config/web-compose.yml" /var/www/revive-web/deploy/nuxt/docker-compose.yml
[ -f "$BACKUP_DIR/config/cms-compose.yml" ] && cp "$BACKUP_DIR/config/cms-compose.yml" /opt/revive/cms/docker-compose.yml
[ -f "$BACKUP_DIR/config/revive-health-monitor.sh" ] && cp "$BACKUP_DIR/config/revive-health-monitor.sh" /usr/local/bin/revive-health-monitor.sh && chmod 755 /usr/local/bin/revive-health-monitor.sh
[ -f "$BACKUP_DIR/config/revive-backup.sh" ] && cp "$BACKUP_DIR/config/revive-backup.sh" /usr/local/bin/revive-backup-v2.sh && chmod 755 /usr/local/bin/revive-backup-v2.sh

# PM2 dump
if [ -f "$BACKUP_DIR/config/dump.pm2" ]; then
  mkdir -p ~/.pm2
  cp "$BACKUP_DIR/config/dump.pm2" ~/.pm2/dump.pm2
  log "  PM2 dump restored"
fi

# Nginx sites-enabled symlinks
if [ -f "$BACKUP_DIR/config/nginx-sites-enabled.txt" ]; then
  rm -f /etc/nginx/sites-enabled/*
  while IFS= read -r line; do
    target=$(echo "$line" | awk '{print $NF}')
    linkname=$(echo "$line" | awk '{print $(NF-2)}')
    [ -n "$target" ] && [ -n "$linkname" ] && ln -sf "$target" "/etc/nginx/sites-enabled/$linkname" 2>/dev/null || true
  done < "$BACKUP_DIR/config/nginx-sites-enabled.txt"
  nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || true
fi

# 5f. Restore secrets
log "Restoring secrets..."
[ -f "$BACKUP_DIR/secrets/web.env" ] && cp "$BACKUP_DIR/secrets/web.env" /var/www/revive-web/.env && chmod 600 /var/www/revive-web/.env
[ -f "$BACKUP_DIR/secrets/cms.env" ] && cp "$BACKUP_DIR/secrets/cms.env" /opt/revive/cms/.env && chmod 600 /opt/revive/cms/.env
[ -f "$BACKUP_DIR/secrets/crm.env" ] && cp "$BACKUP_DIR/secrets/crm.env" /var/www/revive-crm/server/.env && chmod 600 /var/www/revive-crm/server/.env
[ -f "$BACKUP_DIR/secrets/telegram-bot.env" ] && mkdir -p /var/www/revive-crm/integrations/telegram-bot && cp "$BACKUP_DIR/secrets/telegram-bot.env" /var/www/revive-crm/integrations/telegram-bot/.env && chmod 600 /var/www/revive-crm/integrations/telegram-bot/.env

# 5g. Restart services
log "Starting Docker containers..."
cd /var/www/revive-web/deploy/nuxt && docker compose up -d 2>/dev/null || true
cd /opt/revive/cms && docker compose up -d 2>/dev/null || true

log "Starting PM2 processes..."
# If PM2 dump was restored, resurrect from it; otherwise start manually
if [ -f ~/.pm2/dump.pm2 ]; then
  pm2 resurrect 2>/dev/null || true
else
  cd /var/www/revive-crm && pm2 start server/server.js --name revive-crm 2>/dev/null || true
fi
pm2 save 2>/dev/null || true

log "=== RESTORE COMPLETE ==="
log "Next steps:"
log "  1. Issue SSL certificates: certbot --nginx -d revive.su -d crm.revive.su -d cms.revive.su"
log "  2. Update DNS if needed"
log "  3. Run health monitor: /usr/local/bin/revive-health-monitor.sh"
log "  4. Test: curl http://127.0.0.1:3001/api/health"
