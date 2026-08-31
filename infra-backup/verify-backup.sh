#!/usr/bin/env bash
# verify-backup.sh — Verify REVIVE backup integrity (read-only, no changes).
# Usage: verify-backup.sh <backup-directory>
set -Eeuo pipefail

BACKUP_DIR="${1:?Usage: verify-backup.sh <backup-directory>}"
[ -d "$BACKUP_DIR" ] || { echo "FATAL: $BACKUP_DIR is not a directory"; exit 1; }

PASS=0
FAIL=0
WARN=0

check() {
  local label="$1"; shift
  if "$@" > /dev/null 2>&1; then
    echo "  [PASS] $label"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $label"
    FAIL=$((FAIL + 1))
  fi
}

warn() {
  echo "  [WARN] $1"
  WARN=$((WARN + 1))
}

echo "=== VERIFY BACKUP: $BACKUP_DIR ==="
echo ""

# ── Required files ─────────────────────────────────────────────────────
echo "--- Required files ---"
check "manifest.txt exists" test -f "$BACKUP_DIR/manifest.txt"
check "manifest.json exists" test -f "$BACKUP_DIR/manifest.json"
check "SHA256SUMS exists" test -f "$BACKUP_DIR/SHA256SUMS"
check "revive_crm.dump exists" test -f "$BACKUP_DIR/databases/revive_crm.dump"
check "revive_web.dump exists" test -f "$BACKUP_DIR/databases/revive_web.dump"
check "crm-storage.tar.gz exists" test -f "$BACKUP_DIR/files/crm-storage.tar.gz"
echo ""

# ── SHA256 verification ───────────────────────────────────────────────
echo "--- SHA256 integrity ---"
if [ -f "$BACKUP_DIR/SHA256SUMS" ]; then
  CHECK_RESULT="$(cd "$BACKUP_DIR" && sha256sum -c SHA256SUMS 2>&1)"
  CHECK_EXIT=$?
  if [ $CHECK_EXIT -eq 0 ]; then
    echo "  [PASS] All checksums match"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] Checksum mismatches:"
    echo "$CHECK_RESULT" | grep FAILED || true
    FAIL=$((FAIL + 1))
  fi
fi
echo ""

# ── PostgreSQL dumps readable ─────────────────────────────────────────
echo "--- PostgreSQL dump readability ---"
for dump in "$BACKUP_DIR"/databases/*.dump; do
  [ -f "$dump" ] || continue
  name=$(basename "$dump")
  if [ "$name" = "revive_web.dump" ]; then
    # CMS dump may be newer PG version — verify via container
    if docker inspect revive-web-db > /dev/null 2>&1; then
      if cat "$dump" | docker exec -i revive-web-db pg_restore --list > /dev/null 2>&1; then
        TABLES=$(cat "$dump" | docker exec -i revive-web-db pg_restore --list 2>/dev/null | grep -c "^[0-9]" || true)
        echo "  [PASS] $name: readable via container ($TABLES entries)"
        PASS=$((PASS + 1))
      else
        echo "  [FAIL] $name: pg_restore --list failed"
        FAIL=$((FAIL + 1))
      fi
    else
      echo "  [WARN] $name: container revive-web-db not available, skipping"
      WARN=$((WARN + 1))
    fi
  else
    check "$name: pg_restore --list" pg_restore --list "$dump"
    TABLES=$(pg_restore --list "$dump" 2>/dev/null | grep -c "^[0-9]" || true)
    echo "       ($TABLES catalog entries)"
  fi
done
echo ""

# ── Tar archives readable ─────────────────────────────────────────────
echo "--- Tar archive readability ---"
for archive in "$BACKUP_DIR"/files/*.tar.gz "$BACKUP_DIR"/files/docker-volumes/*.tar.gz; do
  [ -f "$archive" ] || continue
  name=$(basename "$archive")
  check "$name: tar -tzf" tar -tzf "$archive"
done
echo ""

# ── Secrets chmod ─────────────────────────────────────────────────────
echo "--- Secrets permissions ---"
for sec in "$BACKUP_DIR"/secrets/*.env; do
  [ -f "$sec" ] || continue
  name=$(basename "$sec")
  PERMS=$(stat -c %a "$sec" 2>/dev/null || echo "???")
  if [ "$PERMS" = "600" ]; then
    echo "  [PASS] $name permissions=$PERMS"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $name permissions=$PERMS (expected 600)"
    FAIL=$((FAIL + 1))
  fi
done
echo ""

# ── Backup age ────────────────────────────────────────────────────────
echo "--- Backup age ---"
if [ -f "$BACKUP_DIR/manifest.txt" ]; then
  DATE_LINE=$(grep "Date (UTC):" "$BACKUP_DIR/manifest.txt" | head -1 | sed 's/.*:\s*//')
  echo "  Backup date: $DATE_LINE"
  # Calculate age in hours
  BACKUP_EPOCH=$(date -d "$DATE_LINE" +%s 2>/dev/null || echo 0)
  NOW_EPOCH=$(date +%s)
  if [ "$BACKUP_EPOCH" -gt 0 ]; then
    AGE_HOURS=$(( (NOW_EPOCH - BACKUP_EPOCH) / 3600 ))
    echo "  Age: ${AGE_HOURS} hours"
    if [ "$AGE_HOURS" -gt 48 ]; then
      warn "Backup is older than 48 hours"
    fi
  fi
fi
echo ""

# ── Summary ───────────────────────────────────────────────────────────
echo "=== SUMMARY ==="
echo "  PASS: $PASS"
echo "  FAIL: $FAIL"
echo "  WARN: $WARN"
if [ "$FAIL" -gt 0 ]; then
  echo "  RESULT: FAILED"
  exit 1
else
  echo "  RESULT: OK"
  exit 0
fi
