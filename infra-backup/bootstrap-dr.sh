#!/usr/bin/env bash
# bootstrap-dr.sh — Install all REVIVE prerequisites on a clean Debian VM.
# Run as root on a fresh Debian 12 (Bookworm) minimal install.
# Usage: curl -fsSL <url>/bootstrap-dr.sh | bash
#        or: scp + bash bootstrap-dr.sh
set -Eeuo pipefail

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
die() { log "FATAL: $*"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Must run as root"

log "=== REVIVE DR Bootstrap ==="
log "Target: clean Debian 12"

# ── 1. System update ──────────────────────────────────────────────────
log "Updating system..."
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y -qq

# ── 2. Essential packages ─────────────────────────────────────────────
log "Installing base packages..."
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
  curl wget git gnupg2 ca-certificates lsb-release \
  sudo unzip tar jq htop net-tools

# ── 3. Docker ─────────────────────────────────────────────────────────
if command -v docker &>/dev/null; then
  log "Docker already installed: $(docker --version)"
else
  log "Installing Docker..."
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] \
    https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable --now docker
  log "Docker: $(docker --version)"
fi

# ── 4. PostgreSQL (host) ──────────────────────────────────────────────
if command -v psql &>/dev/null; then
  log "PostgreSQL already installed: $(psql --version)"
else
  log "Installing PostgreSQL 16..."
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/pg.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pg.gpg] \
    http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql-16 postgresql-client-16
  systemctl enable --now postgresql
  log "PostgreSQL: $(psql --version)"
fi

# ── 5. Node.js 20.x ──────────────────────────────────────────────────
if command -v node &>/dev/null; then
  log "Node.js already installed: $(node --version)"
else
  log "Installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
  log "Node.js: $(node --version)"
fi

# ── 6. PM2 ────────────────────────────────────────────────────────────
if command -v pm2 &>/dev/null; then
  log "PM2 already installed: $(pm2 --version)"
else
  log "Installing PM2..."
  npm install -g pm2
  pm2 startup systemd -u root --hp /root
  log "PM2: $(pm2 --version)"
fi

# ── 7. Nginx ──────────────────────────────────────────────────────────
if command -v nginx &>/dev/null; then
  log "Nginx already installed: $(nginx -v 2>&1)"
else
  log "Installing Nginx..."
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx
  systemctl enable --now nginx
  log "Nginx: $(nginx -v 2>&1)"
fi

# ── 8. Create directory structure ─────────────────────────────────────
log "Creating REVIVE directory structure..."
mkdir -p /var/www/{revive-crm,revive-web}
mkdir -p /opt/revive/{cms,infra/{scripts,backups,docs}}

# ── 9. PostgreSQL users ──────────────────────────────────────────────
log "Creating PostgreSQL users..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='revive'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE revive WITH LOGIN PASSWORD 'revive_dr_test';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='directus_user'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE directus_user WITH LOGIN PASSWORD 'directus_dr_test';"

log "=== BOOTSTRAP COMPLETE ==="
log ""
log "Installed components:"
log "  Docker:     $(docker --version 2>/dev/null || echo 'N/A')"
log "  PostgreSQL: $(psql --version 2>/dev/null || echo 'N/A')"
log "  Node.js:    $(node --version 2>/dev/null || echo 'N/A')"
log "  PM2:        $(pm2 --version 2>/dev/null || echo 'N/A')"
log "  Nginx:      $(nginx -v 2>&1 || echo 'N/A')"
log ""
log "Next steps:"
log "  1. Transfer backup: scp -r /var/backups/revive/<backup> root@<this-vm>:/var/backups/revive/"
log "  2. Transfer infra:  scp -r /opt/revive/infra/scripts root@<this-vm>:/opt/revive/infra/"
log "  3. Run: /opt/revive/infra/scripts/restore-v2.sh --dry-run /var/backups/revive/<backup>"
log "  4. Run: /opt/revive/infra/scripts/restore-v2.sh --restore /var/backups/revive/<backup>"
