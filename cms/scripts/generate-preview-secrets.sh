#!/usr/bin/env bash
# Sinh secret/mật khẩu mạnh cho bản thử CMS. KHÔNG commit output.
# Cách dùng: bash cms/scripts/generate-preview-secrets.sh
# Kết quả ghi vào cms/.preview-credentials (đã gitignore) và in biến môi trường mẫu.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/.preview-credentials"
umask 077

rand() { openssl rand -base64 48 | tr -d '\n/+=' | head -c "${1:-48}"; }

PAYLOAD_SECRET="$(rand 48)"
ADMIN_PASS="$(rand 28)"
EDITOR_PASS="$(rand 28)"
ADMIN_EMAIL="${SEED_ADMIN_EMAIL:-admin@flf-preview.local}"
EDITOR_EMAIL="${SEED_EDITOR_EMAIL:-editor@flf-preview.local}"

cat >"$OUT" <<EOF
# FLF CMS — thông tin đăng nhập bản THỬ (sinh $(date -u +%Y-%m-%dT%H:%M:%SZ))
# Gửi qua kênh an toàn (tin nhắn riêng / password manager). KHÔNG dán vào PR công khai.
# Đổi mật khẩu ngay khi dùng thật / lên production.

PAYLOAD_SECRET=${PAYLOAD_SECRET}
SEED_ADMIN_EMAIL=${ADMIN_EMAIL}
SEED_ADMIN_PASSWORD=${ADMIN_PASS}
SEED_EDITOR_EMAIL=${EDITOR_EMAIL}
SEED_EDITOR_PASSWORD=${EDITOR_PASS}
PREVIEW_MODE=true
SEED_ON_START=true
SEED_UPDATE_PASSWORD=true
EOF

chmod 600 "$OUT"

echo "Đã ghi: ${OUT}"
echo
echo "=== Dán vào biến môi trường dịch vụ (Render / Railway / VPS) ==="
echo "PAYLOAD_SECRET=${PAYLOAD_SECRET}"
echo "SEED_ADMIN_EMAIL=${ADMIN_EMAIL}"
echo "SEED_ADMIN_PASSWORD=${ADMIN_PASS}"
echo "SEED_EDITOR_EMAIL=${EDITOR_EMAIL}"
echo "SEED_EDITOR_PASSWORD=${EDITOR_PASS}"
echo "PREVIEW_MODE=true"
echo "SEED_ON_START=true"
echo "SEED_UPDATE_PASSWORD=true"
echo
echo "=== Gửi khách (kênh an toàn) ==="
echo "Admin: ${ADMIN_EMAIL} / (xem file .preview-credentials)"
echo "Editor: ${EDITOR_EMAIL} / (xem file .preview-credentials)"
echo "Nhắc khách: đây là bản thử noindex — đổi mật khẩu trước khi dùng thật."
