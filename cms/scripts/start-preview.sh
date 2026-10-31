#!/usr/bin/env bash
# Khởi động CMS trên dịch vụ thử / container.
# Hỗ trợ DATABASE_URI (tên trong TASK) lẫn DATABASE_URL.
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ] && [ -n "${DATABASE_URI:-}" ]; then
  export DATABASE_URL="${DATABASE_URI}"
fi

: "${DATABASE_URL:?Thiếu DATABASE_URL hoặc DATABASE_URI}"
: "${PAYLOAD_SECRET:?Thiếu PAYLOAD_SECRET}"

# URL công khai: Render/Railway thường cung cấp (runtime — không phụ thuộc bake lúc build)
if [ -z "${PAYLOAD_PUBLIC_SERVER_URL:-}" ]; then
  if [ -n "${RENDER_EXTERNAL_URL:-}" ]; then
    export PAYLOAD_PUBLIC_SERVER_URL="${RENDER_EXTERNAL_URL}"
  elif [ -n "${RAILWAY_PUBLIC_DOMAIN:-}" ]; then
    export PAYLOAD_PUBLIC_SERVER_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
  elif [ -n "${NEXT_PUBLIC_SERVER_URL:-}" ]; then
    export PAYLOAD_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}"
  fi
fi
export NEXT_PUBLIC_SERVER_URL="${PAYLOAD_PUBLIC_SERVER_URL:-${NEXT_PUBLIC_SERVER_URL:-}}"

export PREVIEW_MODE="${PREVIEW_MODE:-true}"

echo "[start] PREVIEW_MODE=${PREVIEW_MODE} SERVER=${PAYLOAD_PUBLIC_SERVER_URL:-unset}"

# Seed lần đầu / cập nhật mật khẩu thử (không in mật khẩu ra log)
if [ "${SEED_ON_START:-false}" = "true" ]; then
  if [ -z "${SEED_ADMIN_EMAIL:-}" ] || [ -z "${SEED_ADMIN_PASSWORD:-}" ]; then
    echo "[start] SEED_ON_START=true nhưng thiếu SEED_ADMIN_EMAIL/PASSWORD — bỏ qua seed"
  else
    echo "[start] chạy seed..."
    npx --yes tsx src/scripts/seed.ts || {
      echo "[start] seed thất bại — vẫn thử khởi động app"
    }
  fi
fi

# Ưu tiên standalone server của Next
if [ -f "server.js" ]; then
  exec node server.js
fi
if [ -f "apps/cms/server.js" ]; then
  exec node apps/cms/server.js
fi

exec npx --yes next start -H 0.0.0.0 -p "${PORT:-3000}"
