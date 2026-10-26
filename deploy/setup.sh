#!/usr/bin/env bash
# FLF (www.flf.vn) – cài / cập nhật web tĩnh trên VPS bằng nginx.
# Mọi code + dữ liệu FLF nằm trong ~/FLF. Không đụng dự án khác:
#   - chỉ thêm 1 file nginx riêng: /etc/nginx/sites-available/flf.vn
#   - dừng ngay nếu cổng 80/443 đang do phần mềm khác (Apache, Caddy, Docker…) giữ
#   - kiểm tra cấu hình nginx trước khi nạp lại; lỗi thì gỡ file của FLF và dừng
# Dùng:
#   sudo bash setup.sh          # cài lần đầu hoặc cập nhật bản mới từ GitHub
#   sudo bash setup.sh ssl      # bật HTTPS (khi tên miền đã trỏ về VPS này)
#   sudo bash setup.sh check    # chỉ xem tình trạng, không thay đổi gì
set -euo pipefail

REPO_URL="https://github.com/lecuong6868/FLF.git"
DOMAINS=(flf.vn www.flf.vn)
SITE_CONF=/etc/nginx/sites-available/flf.vn
MODE="${1:-deploy}"

say()  { printf '\n\033[1;34m== %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32mOK\033[0m  %s\n' "$*"; }
warn() { printf '  \033[33m!!\033[0m  %s\n' "$*"; }
die()  { printf '\n\033[1;31mDỪNG: %s\033[0m\nKhông có gì bị thay đổi thêm. Gửi nguyên màn hình này cho Claude.\n' "$*"; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Cần chạy bằng sudo: sudo bash $0 $MODE"

# ~ của người đang đăng nhập (sudo giữ SUDO_USER); root thì là /root
OWNER="${SUDO_USER:-root}"
HOME_DIR="$(getent passwd "$OWNER" | cut -d: -f6)"
[ -n "$HOME_DIR" ] && [ -d "$HOME_DIR" ] || die "Không tìm thấy thư mục nhà của $OWNER"
FLF="$HOME_DIR/FLF"

# ---------- 1. Kiểm tra (chỉ đọc) ----------
say "Kiểm tra máy chủ"
. /etc/os-release 2>/dev/null && ok "Hệ điều hành: ${PRETTY_NAME:-?}"
ok "Người dùng: $OWNER  → thư mục FLF: $FLF"
ok "RAM: $(free -h | awk '/Mem:/{print $2" tổng, "$7" còn trống"}'); swap: $(free -h | awk '/Swap:/{print $2}')"
ok "Ổ đĩa trống: $(df -h "$HOME_DIR" | awk 'NR==2{print $4}')"

listen_owner() { ss -ltnpH "( sport = :$1 )" 2>/dev/null | grep -oE 'users:\(\("[^"]+' | head -1 | sed 's/users:(("//'; }
P80="$(listen_owner 80 || true)"; P443="$(listen_owner 443 || true)"
ok "Cổng 80: ${P80:-trống}   Cổng 443: ${P443:-trống}"
for p in "$P80" "$P443"; do
  if [ -n "$p" ] && [ "$p" != "nginx" ]; then
    die "Cổng web đang do '$p' giữ (dự án khác). Em không tự cài nginx đè lên để tránh làm hỏng dự án đó."
  fi
done

if command -v docker >/dev/null 2>&1; then
  ok "Docker đang chạy: $(docker ps --format '{{.Names}}' 2>/dev/null | tr '\n' ' ' || true)"
fi
if [ -d /etc/nginx/sites-enabled ]; then
  ok "Các site nginx đang có: $(ls /etc/nginx/sites-enabled 2>/dev/null | tr '\n' ' ')"
  OTHER="$(grep -RlsE "server_name[^;]*\bflf\.vn\b" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | grep -v "flf.vn$" || true)"
  [ -z "$OTHER" ] || die "Tên miền flf.vn đã nằm trong cấu hình khác: $OTHER"
fi

MYIPS="$(hostname -I 2>/dev/null) $(curl -fsS4 --max-time 5 https://api.ipify.org 2>/dev/null || true)"
DNS_OK=1
for d in "${DOMAINS[@]}"; do
  ip="$(getent ahostsv4 "$d" 2>/dev/null | awk 'NR==1{print $1}' || true)"
  if [ -n "$ip" ] && grep -qw "$ip" <<<"$MYIPS"; then ok "DNS $d → $ip (đúng VPS này)"
  else warn "DNS $d → ${ip:-chưa có} (chưa trỏ về VPS này)"; DNS_OK=0; fi
done

[ "$MODE" = "check" ] && { say "Chỉ kiểm tra – không thay đổi gì."; exit 0; }

# ---------- 2. HTTPS ----------
if [ "$MODE" = "ssl" ]; then
  [ "$DNS_OK" = 1 ] || die "Tên miền chưa trỏ về VPS này nên chưa xin chứng chỉ HTTPS được."
  [ -f "$SITE_CONF" ] || die "Chưa cài site FLF. Chạy: sudo bash $0 trước."
  say "Bật HTTPS (Let's Encrypt) chỉ cho ${DOMAINS[*]}"
  command -v certbot >/dev/null || { apt-get update -qq; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq certbot python3-certbot-nginx; }
  certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect \
    -d flf.vn -d www.flf.vn
  nginx -t && systemctl reload nginx
  ok "Xong. Mở https://www.flf.vn để xem."
  exit 0
fi

# ---------- 3. Cài phần mềm còn thiếu ----------
say "Cài phần mềm còn thiếu (nginx, git, unzip, acl)"
NEED=()
for b in nginx git unzip setfacl; do command -v "$b" >/dev/null || NEED+=("$b"); done
if [ "${#NEED[@]}" -gt 0 ]; then
  PKGS="${NEED[*]}"; PKGS="${PKGS/setfacl/acl}"
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq $PKGS
  ok "Đã cài: $PKGS"
else ok "Đủ cả rồi"; fi

# ---------- 4. Thư mục ~/FLF: code + bản phát hành + sao lưu ----------
say "Tải code FLF vào $FLF"
install -d -o "$OWNER" -g "$(id -gn "$OWNER")" -m 755 "$FLF" "$FLF/releases" "$FLF/backups" "$FLF/logs"
if [ -d "$FLF/repo/.git" ]; then
  sudo -u "$OWNER" git -C "$FLF/repo" pull -q --ff-only
else
  sudo -u "$OWNER" git clone -q --depth 1 "$REPO_URL" "$FLF/repo"
fi
ok "Phiên bản code: $(sudo -u "$OWNER" git -C "$FLF/repo" log -1 --format='%h %s')"
cp "$0" "$FLF/setup.sh" 2>/dev/null || true; chmod 755 "$FLF/setup.sh" 2>/dev/null || true

ZIP="$(ls -t "$FLF"/repo/*.zip 2>/dev/null | head -1 || true)"
TS="$(date +%Y%m%d-%H%M%S)"; REL="$FLF/releases/$TS"
mkdir -p "$REL"
if [ -n "$ZIP" ]; then
  unzip -q "$ZIP" -d "$REL"; ok "Giải nén $(basename "$ZIP")"
elif [ -f "$FLF/repo/index.html" ]; then
  cp -a "$FLF/repo/." "$REL/"; rm -rf "$REL/.git" "$REL/deploy"; ok "Dùng thẳng file trong repo"
else
  die "Repo không có file zip hay index.html"
fi
[ -f "$REL/index.html" ] || die "Bản giải nén không có index.html"
rm -f "$REL/.htaccess"
chown -R "$OWNER":"$(id -gn "$OWNER")" "$REL"; find "$REL" -type d -exec chmod 755 {} +; find "$REL" -type f -exec chmod 644 {} +

[ -L "$FLF/site" ] && cp -P "$FLF/site" "$FLF/backups/site-truoc-$TS"
ln -sfn "$REL" "$FLF/site"
ok "Site đang dùng: $REL"
ls -1dt "$FLF"/releases/* 2>/dev/null | tail -n +6 | xargs -r rm -rf || true   # giữ 5 bản gần nhất
ls -1dt "$FLF"/backups/site-truoc-* 2>/dev/null | tail -n +6 | xargs -r rm -f || true

# nginx (www-data) chỉ cần quyền "đi qua" thư mục nhà, không đọc được file khác
setfacl -m u:www-data:x "$HOME_DIR"
ok "Cho nginx đi qua $HOME_DIR (chỉ quyền x, không xem được nội dung)"

# ---------- 5. Cấu hình nginx riêng cho FLF ----------
say "Cấu hình nginx cho ${DOMAINS[*]}"
if [ -f "$SITE_CONF" ] && ! grep -q "managed-by: FLF setup.sh" "$SITE_CONF"; then
  die "Đã có file $SITE_CONF không do script này tạo – em không ghi đè."
fi
if [ ! -f "$SITE_CONF" ] || ! grep -q "Certbot" "$SITE_CONF"; then
  [ -f "$SITE_CONF" ] && cp "$SITE_CONF" "$FLF/backups/nginx-flf.vn.$TS"
  V6=""; [ -e /proc/net/if_inet6 ] && V6="    listen [::]:80;"
  cat >"$SITE_CONF" <<EOF
# managed-by: FLF setup.sh – code tại $FLF
server {
    listen 80;
$V6
    server_name ${DOMAINS[*]};
    root $FLF/site;
    index index.html;
    access_log /var/log/nginx/flf.access.log;
    error_log  /var/log/nginx/flf.error.log;

    location /static/ { expires 30d; add_header Cache-Control "public, immutable"; try_files \$uri =404; }
    location ~* \.map\$ { return 404; }
    location / { try_files \$uri \$uri/ /index.html; }
}
EOF
  ok "Đã tạo $SITE_CONF"
else ok "Giữ nguyên $SITE_CONF (có thể đã có HTTPS)"; fi
ln -sfn "$SITE_CONF" /etc/nginx/sites-enabled/flf.vn
if ! nginx -t 2>"$FLF/logs/nginx-test.log"; then
  cat "$FLF/logs/nginx-test.log"
  rm -f /etc/nginx/sites-enabled/flf.vn
  die "Cấu hình nginx lỗi – đã gỡ riêng site FLF, các site khác giữ nguyên."
fi
systemctl enable -q nginx; systemctl reload nginx 2>/dev/null || systemctl start nginx
ok "nginx đã nạp cấu hình"

if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw status | grep -qE "^(80|Nginx)" || { ufw allow 'Nginx Full' >/dev/null; ok "Mở tường lửa cổng 80/443"; }
fi

# ---------- 6. Tự kiểm tra ----------
say "Tự kiểm tra"
code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: www.flf.vn' http://127.0.0.1/)"
[ "$code" = 200 ] && ok "Trang chủ trả 200" || warn "Trang chủ trả $code"
code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: www.flf.vn' http://127.0.0.1/about)"
[ "$code" = 200 ] && ok "Trang /about trả 200" || warn "Trang /about trả $code"

if [ "$DNS_OK" = 1 ]; then
  echo; echo "Tên miền đã trỏ đúng. Bật HTTPS: sudo bash $FLF/setup.sh ssl"
else
  echo; echo "Tên miền chưa trỏ về VPS này. Vào nơi quản lý tên miền flf.vn, sửa bản ghi A của @ và www thành IP của VPS này,"
  echo "đợi vài phút rồi chạy: sudo bash $FLF/setup.sh ssl"
fi
echo "Cập nhật bản mới sau này: sudo bash $FLF/setup.sh"
