#!/bin/bash
# Issue Let's Encrypt cert for cms.revive.su and switch Nginx to HTTPS.
# Requires public DNS: cms.revive.su → 157.22.174.7 (HTTP-01).
set -euo pipefail

DOMAIN=cms.revive.su
CONF_HTTP=/opt/revive/cms/nginx.cms.http.conf
CONF_TLS=/opt/revive/cms/nginx.cms.revive.su.conf
ENABLED=/etc/nginx/sites-enabled/cms.revive.su

mkdir -p /var/www/certbot
ln -sfn "$CONF_HTTP" "$ENABLED"
nginx -t
systemctl reload nginx

if ! getent hosts "$DOMAIN" >/dev/null; then
  echo "DNS: $DOMAIN is not published yet. Add Cloudflare A record cms → 157.22.174.7, then re-run."
  exit 1
fi

certbot certonly --webroot -w /var/www/certbot -d "$DOMAIN" \
  --non-interactive --agree-tos --keep-until-expiring \
  --email service@revive.su

ln -sfn "$CONF_TLS" "$ENABLED"
nginx -t
systemctl reload nginx
echo "https://$DOMAIN/admin"
