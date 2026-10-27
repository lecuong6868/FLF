#!/usr/bin/env bash
# FLF — triển khai stack Next.js + Payload + Postgres + Caddy bằng Docker Compose.
# Thay cho setup.sh (bản web tĩnh nginx cũ). Chạy trên VPS: sudo bash deploy/setup-docker.sh
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/lecuong6868/FLF.git}"
FLF_ROOT="${FLF_ROOT:-/opt/flf}"
MODE="${1:-deploy}"

say()  { printf '\n\033[1;34m== %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32mOK\033[0m  %s\n' "$*"; }
warn() { printf '  \033[33m!!\033[0m  %s\n' "$*"; }
die()  { printf '\n\033[1;31mDỪNG: %s\033[0m\n' "$*"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Cần sudo: sudo bash $0 $MODE"

OWNER="${SUDO_USER:-root}"
command -v docker >/dev/null || die "Chưa có Docker. Cài: curl -fsSL https://get.docker.com | sh"
docker compose version >/dev/null 2>&1 || die "Thiếu docker compose plugin"

say "Thư mục $FLF_ROOT"
install -d -o "$OWNER" -g "$(id -gn "$OWNER")" -m 755 "$FLF_ROOT" "$FLF_ROOT/backups"
if [ -d "$FLF_ROOT/repo/.git" ]; then
  sudo -u "$OWNER" git -C "$FLF_ROOT/repo" pull --ff-only
else
  sudo -u "$OWNER" git clone "$REPO_URL" "$FLF_ROOT/repo"
fi
ok "Code: $(sudo -u "$OWNER" git -C "$FLF_ROOT/repo" log -1 --format='%h %s')"

ENV_FILE="$FLF_ROOT/repo/.env"
if [ ! -f "$ENV_FILE" ]; then
  sudo -u "$OWNER" cp "$FLF_ROOT/repo/.env.example" "$ENV_FILE"
  warn "Đã tạo $ENV_FILE từ .env.example — hãy điền PAYLOAD_SECRET, POSTGRES_PASSWORD, SMTP, SITE_ADDRESS rồi chạy lại."
  die "Chưa cấu hình .env"
fi

if [ "$MODE" = "check" ]; then
  say "docker compose ps"
  (cd "$FLF_ROOT/repo" && docker compose ps)
  curl -sf http://127.0.0.1/api/health && ok "health OK" || warn "health chưa trả lời"
  exit 0
fi

say "Build & chạy"
cd "$FLF_ROOT/repo"
docker compose up -d --build
ok "Stack đã lên. Seed (lần đầu): xem deploy/README.md"
ok "HTTPS: Caddy tự xin khi DNS @/www trỏ về VPS và SITE_ADDRESS đúng trong .env"
echo "Backup DB: sudo bash $FLF_ROOT/repo/deploy/backup-db.sh"
