#!/bin/bash
set -euo pipefail
cd /opt/revive/cms
chmod 700 /opt/revive/cms

if [ ! -f .env ]; then
  umask 077
  KEY="$(openssl rand -hex 20)"
  SECRET="$(openssl rand -hex 20)"
  DB_PASSWORD="$(openssl rand -hex 18)"
  ADMIN_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)"
  cat > .env <<EOF
KEY=${KEY}
SECRET=${SECRET}
DB_PASSWORD=${DB_PASSWORD}
ADMIN_EMAIL=admin@revive.su
ADMIN_PASSWORD=${ADMIN_PASSWORD}
PUBLIC_URL=https://cms.revive.su
EOF
  chmod 600 .env
  echo "wrote /opt/revive/cms/.env"
fi

set -a
# shellcheck disable=SC1091
source /opt/revive/cms/.env
set +a

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'directus_user') THEN
    CREATE ROLE directus_user LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE directus_user LOGIN PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SQL

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='revive_web'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE revive_web OWNER directus_user"
  echo "created database revive_web"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER DATABASE revive_web OWNER TO directus_user"
  echo "database revive_web exists"
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 -d revive_web -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
sudo -u postgres psql -v ON_ERROR_STOP=1 -d revive_web -c "ALTER SCHEMA public OWNER TO directus_user;"
sudo -u postgres psql -v ON_ERROR_STOP=1 -d revive_web -c "GRANT ALL ON SCHEMA public TO directus_user;"
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "REVOKE ALL ON DATABASE revive_crm FROM directus_user;"
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "GRANT ALL ON DATABASE revive_web TO directus_user;"

echo "postgres: directus_user -> revive_web only"

docker compose pull
docker compose up -d
echo "directus container started"
