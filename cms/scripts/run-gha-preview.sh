#!/usr/bin/env bash
# Điều phối bản thử CMS trên GitHub Actions runner:
# sinh secret → seed → start Next → cloudflared Quick Tunnel → nghiệm thu HTTP.
# Không commit mật khẩu. Gọi từ .github/workflows/cms-preview.yml.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "${ROOT}/.." && pwd)"
EVIDENCE_DIR="${REPO_ROOT}/docs/acceptance/evidence"
mkdir -p "${EVIDENCE_DIR}" "${ROOT}/.preview-run"

PORT="${PORT:-3000}"
KEEP_ALIVE_MINUTES="${KEEP_ALIVE_MINUTES:-75}"
BASE_LOCAL="http://127.0.0.1:${PORT}"

rand() { openssl rand -base64 48 | tr -d '\n/+=' | head -c "${1:-48}"; }

echo "::group::Sinh secret & mật khẩu seed (mask)"
PAYLOAD_SECRET="$(rand 48)"
ADMIN_PASS="$(rand 28)"
EDITOR_PASS="$(rand 28)"
ADMIN_EMAIL="${SEED_ADMIN_EMAIL:-admin@flf-preview.local}"
EDITOR_EMAIL="${SEED_EDITOR_EMAIL:-editor@flf-preview.local}"

# Che trong log Actions
echo "::add-mask::${PAYLOAD_SECRET}"
echo "::add-mask::${ADMIN_PASS}"
echo "::add-mask::${EDITOR_PASS}"

CRED_FILE="${ROOT}/.preview-run/credentials.env"
umask 077
cat >"${CRED_FILE}" <<EOF
PAYLOAD_SECRET=${PAYLOAD_SECRET}
SEED_ADMIN_EMAIL=${ADMIN_EMAIL}
SEED_ADMIN_PASSWORD=${ADMIN_PASS}
SEED_EDITOR_EMAIL=${EDITOR_EMAIL}
SEED_EDITOR_PASSWORD=${EDITOR_PASS}
PREVIEW_MODE=true
SEED_UPDATE_PASSWORD=true
EOF
chmod 600 "${CRED_FILE}"
echo "Đã ghi credentials (local runner only): ${CRED_FILE}"
echo "::endgroup::"

# DATABASE_URL đã có từ workflow (Postgres service)
: "${DATABASE_URL:?Thiếu DATABASE_URL}"

export PAYLOAD_SECRET
export SEED_ADMIN_EMAIL="${ADMIN_EMAIL}"
export SEED_ADMIN_PASSWORD="${ADMIN_PASS}"
export SEED_EDITOR_EMAIL="${EDITOR_EMAIL}"
export SEED_EDITOR_PASSWORD="${EDITOR_PASS}"
export PREVIEW_MODE=true
export SEED_UPDATE_PASSWORD=true
export NODE_ENV=production

echo "::group::Cài cloudflared (Quick Tunnel, không cần tài khoản)"
if ! command -v cloudflared >/dev/null 2>&1; then
  curl -fsSL -o /tmp/cloudflared.deb \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
  sudo dpkg -i /tmp/cloudflared.deb
fi
cloudflared --version
echo "::endgroup::"

CF_LOG="${ROOT}/.preview-run/cloudflared.log"
echo "::group::Khởi động Cloudflare Quick Tunnel"
cloudflared tunnel --no-autoupdate --url "${BASE_LOCAL}" >"${CF_LOG}" 2>&1 &
echo $! >"${ROOT}/.preview-run/cloudflared.pid"

TUNNEL_URL=""
for i in $(seq 1 60); do
  if grep -Eo 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' "${CF_LOG}" >/tmp/tunnel-url.txt 2>/dev/null; then
    TUNNEL_URL="$(head -n1 /tmp/tunnel-url.txt)"
    break
  fi
  sleep 1
done
if [ -z "${TUNNEL_URL}" ]; then
  echo "Không lấy được URL trycloudflare.com — log cloudflared:"
  cat "${CF_LOG}" || true
  exit 1
fi
echo "Tunnel URL: ${TUNNEL_URL}"
echo "::endgroup::"

export NEXT_PUBLIC_SERVER_URL="${TUNNEL_URL}"
export PAYLOAD_PUBLIC_SERVER_URL="${TUNNEL_URL}"

echo "::group::Seed dữ liệu"
cd "${ROOT}"
npx --yes tsx src/scripts/seed.ts | tee "${EVIDENCE_DIR}/seed.log"
echo "::endgroup::"

echo "::group::Khởi động Next.js (standalone hoặc next start)"
START_LOG="${ROOT}/.preview-run/next.log"
if [ -f "${ROOT}/.next/standalone/server.js" ]; then
  # Standalone: copy static + public cạnh server.js nếu chưa có
  mkdir -p "${ROOT}/.next/standalone/.next"
  if [ -d "${ROOT}/.next/static" ] && [ ! -d "${ROOT}/.next/standalone/.next/static" ]; then
    cp -a "${ROOT}/.next/static" "${ROOT}/.next/standalone/.next/static"
  fi
  if [ -d "${ROOT}/public" ] && [ ! -d "${ROOT}/.next/standalone/public" ]; then
    cp -a "${ROOT}/public" "${ROOT}/.next/standalone/public"
  fi
  (
    cd "${ROOT}/.next/standalone"
    export PORT HOSTNAME=0.0.0.0
    export DATABASE_URL PAYLOAD_SECRET PREVIEW_MODE
    export NEXT_PUBLIC_SERVER_URL PAYLOAD_PUBLIC_SERVER_URL
    export SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD SEED_EDITOR_EMAIL SEED_EDITOR_PASSWORD
    node server.js
  ) >"${START_LOG}" 2>&1 &
else
  (
    export PORT HOSTNAME=0.0.0.0
    npx --yes next start -H 0.0.0.0 -p "${PORT}"
  ) >"${START_LOG}" 2>&1 &
fi
echo $! >"${ROOT}/.preview-run/next.pid"
echo "::endgroup::"

ACCEPT_RC=0

echo "::group::Nghiệm thu HTTP (localhost)"
export BASE_URL="${BASE_LOCAL}"
export ACCEPT_OUT="${EVIDENCE_DIR}/http-accept-local.log"
if ! npx --yes tsx src/scripts/http-accept.ts; then
  ACCEPT_RC=1
  echo "http-accept local FAIL"
fi
echo "::endgroup::"

echo "::group::Nghiệm thu HTTP (qua tunnel công khai)"
export BASE_URL="${TUNNEL_URL}"
export ACCEPT_OUT="${EVIDENCE_DIR}/http-accept-tunnel.log"
if ! npx --yes tsx src/scripts/http-accept.ts; then
  ACCEPT_RC=1
  echo "http-accept tunnel FAIL"
fi
echo "::endgroup::"

echo "::group::test:access (Payload in-process)"
if ! npx --yes tsx src/scripts/test-access.ts | tee "${EVIDENCE_DIR}/test-access.log"; then
  ACCEPT_RC=1
  echo "test:access FAIL"
fi
echo "::endgroup::"

echo "${TUNNEL_URL}" >"${ROOT}/.preview-run/tunnel-url.txt"

# Ghi biên bản (KHÔNG ghi mật khẩu)
REPORT="${REPO_ROOT}/docs/acceptance/CMS-PREVIEW-TUNNEL-RUN.md"
{
  echo "# Nghiệm thu — CMS Preview Tunnel (GitHub Actions)"
  echo
  echo "- Thời điểm UTC: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- Commit: ${GITHUB_SHA:-local}"
  echo "- Run: ${GITHUB_SERVER_URL:-}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-n/a}"
  echo "- Tunnel: ${TUNNEL_URL}/admin"
  echo "- PREVIEW_MODE: true (noindex)"
  echo "- Kết quả tổng: $([ "${ACCEPT_RC}" = "0" ] && echo PASS || echo FAIL)"
  echo "- Admin email: ${ADMIN_EMAIL}"
  echo "- Editor email: ${EDITOR_EMAIL}"
  echo "- Mật khẩu: **không ghi vào repo** (Job Summary nếu private / webhook / kênh an toàn)"
  echo
  echo "## Kết quả"
  echo
  echo '```'
  echo "--- http-accept (local) ---"
  tail -n 40 "${EVIDENCE_DIR}/http-accept-local.log" 2>/dev/null || true
  echo
  echo "--- http-accept (tunnel) ---"
  tail -n 40 "${EVIDENCE_DIR}/http-accept-tunnel.log" 2>/dev/null || true
  echo
  echo "--- test-access ---"
  tail -n 30 "${EVIDENCE_DIR}/test-access.log" 2>/dev/null || true
  echo '```'
} >"${REPORT}"

write_summary() {
  {
    echo "## FLF CMS — bản thử tạm (Cloudflare Quick Tunnel)"
    echo
    echo "**Đây là bản thử** — noindex, dữ liệu tạm có thể mất khi job kết thúc."
    echo
    echo "| Hạng mục | Giá trị |"
    echo "|----------|---------|"
    echo "| Admin URL | ${TUNNEL_URL}/admin |"
    echo "| Nghiệm thu | $([ "${ACCEPT_RC}" = "0" ] && echo PASS || echo FAIL) |"
    echo "| Giữ sống | ~${KEEP_ALIVE_MINUTES} phút (hoặc Cancel job) |"
    echo "| Admin email | \`${ADMIN_EMAIL}\` |"
    echo "| Editor email | \`${EDITOR_EMAIL}\` |"
    echo "| Commit | \`${GITHUB_SHA:-local}\` |"
    echo
    if [ "${REPO_IS_PRIVATE:-false}" = "true" ]; then
      echo "### Mật khẩu seed (repo **private** — chỉ collaborator thấy Summary)"
      echo
      echo "- Admin password: \`${ADMIN_PASS}\`"
      echo "- Editor password: \`${EDITOR_PASS}\`"
      echo
      echo "Đổi mật khẩu trước khi dùng thật / lên VPS."
    else
      echo "### Mật khẩu seed"
      echo
      echo "> Repo đang **public** — **không** in mật khẩu vào Summary/log."
      echo "> Cách lấy mật khẩu an toàn:"
      echo "> 1. Đặt secret \`PREVIEW_CREDENTIALS_WEBHOOK\` (Discord/Slack webhook) rồi chạy lại workflow."
      echo "> 2. Tạm chuyển repo sang **private**, chạy lại \`workflow_dispatch\`."
      echo "> 3. Nhắn team (kênh riêng) kèm Run ID \`${GITHUB_RUN_ID:-n/a}\` trong lúc job còn sống."
    fi
    echo
    echo "Khi hết giờ job, tunnel tắt. Chạy lại: Actions → **CMS Preview** → Run workflow."
    echo
    echo "Chuyển chính thức: VPS ~24 USD/tháng (xem README)."
  } >>"${GITHUB_STEP_SUMMARY:-/dev/null}"
}
write_summary

if [ -n "${PREVIEW_CREDENTIALS_WEBHOOK:-}" ]; then
  echo "::group::Gửi credentials qua webhook riêng"
  MSG="FLF CMS preview
URL: ${TUNNEL_URL}/admin
Admin: ${ADMIN_EMAIL} / ${ADMIN_PASS}
Editor: ${EDITOR_EMAIL} / ${EDITOR_PASS}
Run: ${GITHUB_RUN_ID:-local}"
  # Discord dùng "content", Slack incoming dùng "text" — gửi cả hai cho tương thích
  if command -v jq >/dev/null 2>&1; then
    PAYLOAD="$(jq -n --arg m "$MSG" '{content:$m, text:$m}')"
  else
    # Escape thô cho JSON
    ESC="${MSG//\\/\\\\}"
    ESC="${ESC//\"/\\\"}"
    ESC="${ESC//$'\n'/\\n}"
    PAYLOAD="{\"content\":\"${ESC}\",\"text\":\"${ESC}\"}"
  fi
  curl -fsS -X POST "${PREVIEW_CREDENTIALS_WEBHOOK}" \
    -H 'Content-Type: application/json' \
    -d "${PAYLOAD}" \
    || echo "Webhook gửi thất bại (không làm fail job)"
  echo "::endgroup::"
fi

echo "${ACCEPT_RC}" >"${ROOT}/.preview-run/accept-exit-code.txt"
echo "ACCEPT_RC=${ACCEPT_RC}" >>"${GITHUB_ENV:-/dev/null}"

if [ "${ACCEPT_RC}" != "0" ]; then
  echo "Nghiệm thu FAIL — workflow sẽ upload artifact rồi giữ tunnel (bước sleep riêng)."
  exit "${ACCEPT_RC}"
fi

echo "Nghiệm thu PASS. Tunnel URL: ${TUNNEL_URL}/admin"
# Sleep do workflow step riêng sau upload artifact.
exit 0
