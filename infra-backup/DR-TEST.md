# REVIVE Disaster Recovery Test

## Prerequisites

- Clean Debian 12 (Bookworm) VM: 2–4 vCPU, 4 GB RAM, 40 GB disk
- Network: NAT/isolated. Do NOT point revive.su DNS here.
- SSH access as root

## VM Setup

### 1. Bootstrap

```bash
# On the clean VM
scp bootstrap-dr.sh root@<DR-VM-IP>:/root/
ssh root@<DR-VM-IP>
bash /root/bootstrap-dr.sh
```

### 2. Transfer backup

From your local machine:

```bash
scp -r root@157.22.174.7:/var/backups/revive/2026-08-30_174049 root@<DR-VM-IP>:/var/backups/revive/
```

### 3. Transfer infra scripts

```bash
scp -r root@157.22.174.7:/opt/revive/infra/scripts root@<DR-VM-IP>:/opt/revive/infra/
```

### 4. Clone repos

```bash
mkdir -p /var/www
git clone https://github.com/Nikcall/revive-crm.git /var/www/revive-crm
git clone https://github.com/Nikcall/revive-web.git /var/www/revive-web
```

If repos are private, use a deploy key or temp public visibility:

```bash
# On GitHub temporarily
gh repo edit Nikcall/revive-crm --visibility public
gh repo edit Nikcall/revive-web --visibility public

# Clone
git clone https://github.com/Nikcall/revive-crm.git /var/www/revive-crm
git clone https://github.com/Nikcall/revive-web.git /var/www/revive-web

# Restore visibility
gh repo edit Nikcall/revive-crm --visibility private
gh repo edit Nikcall/revive-web --visibility private
```

### 5. CMS directory

```bash
mkdir -p /opt/revive/cms
```

## Run Restore

### Dry run first

```bash
/opt/revive/infra/scripts/restore-v2.sh --dry-run /var/backups/revive/2026-08-30_174049
```

Review the output. Confirm it shows:
- Databases: revive_crm + revive_web → host PostgreSQL
- CRM storage → /var/www/revive-crm/server/storage/
- Docker volumes restored
- Config files restored
- Secrets restored

### Real restore

```bash
/opt/revive/infra/scripts/restore-v2.sh --restore /var/backups/revive/2026-08-30_174049
```

Type `YES` when prompted.

**Do NOT manually fix anything if restore fails.** Record the error and fix the script.

## Smoke Test

### CRM

```bash
# PM2 process
pm2 list
# Should show: revive-crm → online

# API health
curl -s http://127.0.0.1:3001/api/health
# Should return: {"status":"ok"}

# Database
sudo -u postgres psql -d revive_crm -c "SELECT count(*) FROM orders;"
sudo -u postgres psql -d revive_crm -c "SELECT count(*) FROM clients;"
sudo -u postgres psql -d revive_crm -c "SELECT count(*) FROM price_items;"
# Compare with production counts
```

### Directus CMS

```bash
# Database
sudo -u postgres psql -d revive_web -c "SELECT count(*) FROM directus_settings;"
sudo -u postgres psql -d revive_web -c "SELECT count(*) FROM price_items;"
# Should match production (30 tables, data present)
```

### Nuxt site

```bash
# Container
docker ps | grep revive-web
# Should show: running

# Pages
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/prices
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/contacts
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/catalog
# All should return: 200
```

### End-to-end: price catalog

```bash
# CRM API
curl -s http://127.0.0.1:3001/api/public/pricelist | jq '.items | length'
# Should return > 0

# Nuxt proxy
curl -s http://127.0.0.1:3000/api/catalog | jq '.items | length'
# Should return same count
```

### End-to-end: test lead

```bash
# Create test lead
curl -s -X POST http://127.0.0.1:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"name":"DR TEST LEAD","phone":"+79001234567","device":"Test Device","problem":"DR test","source":"dr-test"}'

# Check in CRM
curl -s http://127.0.0.1:3001/api/public/leads | jq '.[] | select(.name=="DR TEST LEAD")'
# Should return the lead
```

### Telegram bot

```bash
pm2 list | grep telegram
# Verify process exists and .env is restored
cat /var/www/revive-crm/integrations/telegram-bot/.env | head -3
# Do NOT activate bot token on two servers simultaneously
```

### Nginx

```bash
nginx -t
# Should pass
```

## DR Checklist

```
[ ] bootstrap-dr.sh completed
[ ] backup transferred (2026-08-30_174049)
[ ] repos cloned
[ ] restore-v2.sh --dry-run: OK
[ ] restore-v2.sh --restore: OK
[ ] revive_crm restored (DB integrity OK)
[ ] revive_web restored (30 tables, Directus data present)
[ ] CRM starts (PM2 online)
[ ] CRM API health: ok
[ ] CRM data present (clients, orders, leads, price)
[ ] CRM storage restored (documents, photos)
[ ] Nuxt starts (container running)
[ ] Nuxt healthy (/ → 200)
[ ] /prices → 200
[ ] /api/catalog → works
[ ] CRM → Nuxt catalog works (prices match)
[ ] Test lead created
[ ] Test lead visible in CRM
[ ] Directus infrastructure starts
[ ] Nginx config valid
[ ] PM2 config restored
[ ] backup SHA256 valid
[ ] no production DNS changed
[ ] no production data modified
```

## After Successful DR Test

```
DR VERIFIED
     ↓
Update cron to use backup-v2.sh
     ↓
Set up external/off-site backup
     ↓
Write OPERATIONS.md
     ↓
Ready for Proxmox migration
```
