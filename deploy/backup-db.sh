#!/usr/bin/env bash
# Sao lưu Postgres FLF (Docker Compose). Chạy bằng cron trên VPS.
set -euo pipefail

ROOT="${FLF_ROOT:-/opt/flf/repo}"
OUT="${FLF_BACKUP_DIR:-/opt/flf/backups}"
KEEP="${FLF_BACKUP_KEEP:-14}"
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"
cd "$ROOT"

docker compose exec -T db pg_dump -U "${POSTGRES_USER:-flf}" "${POSTGRES_DB:-flf}" \
  | gzip > "$OUT/flf-$TS.sql.gz"

ls -1t "$OUT"/flf-*.sql.gz 2>/dev/null | tail -n +"$((KEEP + 1))" | xargs -r rm -f
echo "OK backup $OUT/flf-$TS.sql.gz"
