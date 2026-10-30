#!/usr/bin/env bash
# Nạp LD_LIBRARY_PATH + FONTCONFIG cho Chromium Playwright khi máy agent thiếu lib hệ thống.
# Cách dùng: source scripts/browser-env.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIB_ROOT="${FLF_BROWSER_LIBS:-$ROOT/.local-browser-libs/root}"

if [[ ! -d "$LIB_ROOT/usr/lib/x86_64-linux-gnu" ]]; then
  echo "CHƯA CÓ thư viện cục bộ tại $LIB_ROOT" >&2
  echo "Chạy: bash scripts/bootstrap-browser-libs.sh" >&2
  return 1 2>/dev/null || exit 1
fi

export LD_LIBRARY_PATH="$LIB_ROOT/usr/lib/x86_64-linux-gnu:$LIB_ROOT/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
export FONTCONFIG_PATH="$LIB_ROOT/etc/fonts"
export FONTCONFIG_FILE="$LIB_ROOT/etc/fonts/fonts.conf"
# Chromium tìm font qua fontconfig; thêm font dự án vào XDG data
export XDG_DATA_DIRS="$LIB_ROOT/usr/share${XDG_DATA_DIRS:+:$XDG_DATA_DIRS}"

echo "OK browser env: LD_LIBRARY_PATH đã trỏ tới .local-browser-libs"
