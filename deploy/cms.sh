#!/usr/bin/env bash
# FLF CMS (Payload Dashboard) – chạy thử trên VPS FLF, có link HTTPS xem được.
# Image do GitHub Actions build sẵn (ghcr.io/lecuong6868/flf-cms) – VPS chỉ tải về chạy, không build.
# Không đụng dự án khác:
#   - mọi thứ nằm trong ~/FLF-cms (docker compose riêng tên "flfcms")
#   - nginx chỉ thêm 1 file: /etc/nginx/sites-available/flf-cms
#   - app chỉ mở cổng nội bộ 127.0.0.1:3010
# Dùng:
#   sudo bash cms.sh            # cài lần đầu hoặc cập nhật bản mới
#   sudo bash cms.sh check      # xem tình trạng, không thay đổi gì
#   sudo bash cms.sh password   # xem lại tài khoản đăng nhập
set -euo pipefail

IP_DASH="68-183-136-251"
DOMAIN="${CMS_DOMAIN:-cms.${IP_DASH}.sslip.io}"
IMAGE="ghcr.io/lecuong6868/flf-cms:latest"
PORT=3010
SITE_CONF=/etc/nginx/sites-available/flf-cms
MODE="${1:-deploy}"

say()  { printf '\n\033[1;34m== %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32mOK\033[0m  %s\n' "$*"; }
warn() { printf '  \033[33m!!\033[0m  %s\n' "$*"; }
die()  { printf '\n\033[1;31mDỪNG: %s\033[0m\nGửi nguyên màn hình này cho Claude.\n' "$*"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Cần chạy bằng sudo: sudo bash $0 $MODE"
OWNER="${SUDO_USER:-root}"
HOME_DIR="$(getent passwd "$OWNER" | cut -d: -f6)"
DIR="$HOME_DIR/FLF-cms"
dc() { docker compose -p flfcms -f "$DIR/docker-compose.yml" --env-file "$DIR/.env" "$@"; }

show_login() {
  [ -f "$DIR/.env" ] || die "Chưa cài CMS"
  . "$DIR/.env"
  printf '\n\033[1;32mLink Dashboard:\033[0m https://%s/admin\n' "$DOMAIN"
  printf 'Admin : %s  /  %s\nEditor: %s  /  %s\n' "$SEED_ADMIN_EMAIL" "$SEED_ADMIN_PASSWORD" "$SEED_EDITOR_EMAIL" "$SEED_EDITOR_PASSWORD"
  printf '(Mật khẩu chỉ lưu trong %s – đừng dán lên chat công khai.)\n' "$DIR/.env"
}

# ---------- Kiểm tra ----------
say "Kiểm tra máy chủ"
ok "RAM: $(free -h | awk '/Mem:/{print $2" tổng, "$7" trống"}'); swap: $(free -h | awk '/Swap:/{print $2}')"
SWAP_MB=$(free -m | awk '/Swap:/{print $2}')
[ "${SWAP_MB:-0}" -ge 1500 ] || warn "Swap < 1.5 GB. Nên chạy trước: sudo bash ~/FLF/deploy/swap-2g.sh"
ok "Ổ đĩa trống: $(df -h "$HOME_DIR" | awk 'NR==2{print $4}')"
P80="$(ss -ltnpH '( sport = :80 )' 2>/dev/null | grep -oE 'users:\(\("[^"]+' | head -1 | sed 's/users:(("//' || true)"
[ -z "$P80" ] || [ "$P80" = "nginx" ] || die "Cổng 80 đang do '$P80' giữ (không phải nginx của FLF)."
command -v nginx >/dev/null || die "Chưa có nginx. Chạy trước: sudo bash ~/FLF/deploy/setup.sh"
if ss -ltnH "( sport = :$PORT )" | grep -q . && ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^flfcms-'; then
  die "Cổng $PORT đang do chương trình khác dùng."
fi

if [ "$MODE" = "check" ]; then
  command -v docker >/dev/null && dc ps 2>/dev/null || warn "Chưa có Docker / chưa cài CMS"
  curl -s -o /dev/null -w "  /admin nội bộ: HTTP %{http_code}\n" "http://127.0.0.1:$PORT/admin" || true
  exit 0
fi
[ "$MODE" = "password" ] && { show_login; exit 0; }

# ---------- Docker ----------
say "Docker"
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh || die "Cài Docker thất bại"
fi
docker compose version >/dev/null 2>&1 || die "Thiếu docker compose plugin"
ok "$(docker --version)"

# ---------- Cấu hình (tạo 1 lần, giữ nguyên khi cập nhật) ----------
say "Cấu hình trong $DIR"
mkdir -p "$DIR"
if [ ! -f "$DIR/.env" ]; then
  rnd() { openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c "$1"; }
  cat > "$DIR/.env" <<EOF
POSTGRES_USER=flf
POSTGRES_PASSWORD=$(rnd 32)
POSTGRES_DB=flf
PAYLOAD_SECRET=$(rnd 48)
SEED_ADMIN_EMAIL=admin@flf.vn
SEED_ADMIN_PASSWORD=$(rnd 16)
SEED_EDITOR_EMAIL=editor@flf.vn
SEED_EDITOR_PASSWORD=$(rnd 16)
EOF
  ok "Đã tạo mật khẩu ngẫu nhiên (.env, chỉ root/chủ đọc được)"
fi
chmod 600 "$DIR/.env"; chown "$OWNER" "$DIR" "$DIR/.env"

cat > "$DIR/docker-compose.yml" <<EOF
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes: [pgdata:/var/lib/postgresql/data]
    mem_limit: 256m
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}']
      interval: 5s
      retries: 20
  cms:
    image: $IMAGE
    restart: unless-stopped
    ports: ['127.0.0.1:$PORT:3000']
    mem_limit: 700m
    environment:
      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}
      PAYLOAD_SECRET: \${PAYLOAD_SECRET}
      PAYLOAD_PUBLIC_SERVER_URL: https://$DOMAIN
      NEXT_PUBLIC_SERVER_URL: https://$DOMAIN
      PREVIEW_MODE: 'true'
      SEED_ON_START: 'true'
      SEED_UPDATE_PASSWORD: 'true'
      SEED_ADMIN_EMAIL: \${SEED_ADMIN_EMAIL}
      SEED_ADMIN_PASSWORD: \${SEED_ADMIN_PASSWORD}
      SEED_EDITOR_EMAIL: \${SEED_EDITOR_EMAIL}
      SEED_EDITOR_PASSWORD: \${SEED_EDITOR_PASSWORD}
    volumes: [media:/app/media]
    depends_on:
      postgres: {condition: service_healthy}
volumes:
  pgdata:
  media:
EOF

# ---------- Chạy ----------
say "Tải image và khởi động"
dc pull || die "Không tải được $IMAGE. Kiểm tra GitHub → Actions → 'CMS Image' đã chạy xong và package flf-cms để Public."
dc up -d
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/admin" || true)
  [ "$code" = "200" ] && break; sleep 5
done
[ "${code:-}" = "200" ] && ok "CMS chạy: /admin HTTP 200" || { dc logs --tail 40 cms; die "CMS chưa lên sau 5 phút"; }

# ---------- nginx + HTTPS ----------
say "nginx cho $DOMAIN"
cat > "$SITE_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sf "$SITE_CONF" /etc/nginx/sites-enabled/flf-cms
if ! nginx -t 2>/tmp/flf-cms-nginx.log; then
  rm -f /etc/nginx/sites-enabled/flf-cms; cat /tmp/flf-cms-nginx.log; die "Cấu hình nginx lỗi – đã gỡ file của CMS"
fi
systemctl reload nginx
command -v certbot >/dev/null || { apt-get update -qq; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx; }
certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect -d "$DOMAIN" \
  && ok "HTTPS bật" || warn "Chưa bật được HTTPS – vẫn xem được qua http://$DOMAIN/admin"

show_login
