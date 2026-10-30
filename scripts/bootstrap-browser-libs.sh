#!/usr/bin/env bash
# Tải & giải nén thư viện Debian cần cho Chromium Playwright (không cần sudo).
# Chỉ dùng khi máy thiếu libglib / libnss / libX11… (môi trường agent tối giản).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_DIR="$ROOT/.local-browser-libs"
DEBS="$BASE_DIR/debs"
LIB_ROOT="$BASE_DIR/root"
MIRROR="${DEBIAN_MIRROR:-http://deb.debian.org/debian}"
DIST="${DEBIAN_DIST:-trixie}"

mkdir -p "$DEBS" "$LIB_ROOT"
echo "Tải Packages index ($DIST)…"
curl -fsSL "$MIRROR/dists/$DIST/main/binary-amd64/Packages.gz" | gzip -dc > /tmp/flf-pkgs-index
if [[ ! -f /tmp/flf-contents ]]; then
  echo "Tải Contents index…"
  curl -fsSL "$MIRROR/dists/$DIST/main/Contents-amd64.gz" | gzip -dc > /tmp/flf-contents
fi

# Gói lõi (tên package Debian)
CORE_PKGS=(
  libglib2.0-0t64 libnss3 libnssutil3 libsmime3 libnspr4
  libatk1.0-0t64 libatk-bridge2.0-0t64 libatspi2.0-0t64
  libdbus-1-3 libcups2t64 libasound2t64 libgbm1 libdrm2
  libxcb1 libxkbcommon0 libx11-6 libx11-xcb1 libxext6
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxi6 libxtst6
  libxau6 libxdmcp6 libxrender1 libxshmfence1
  libxcb-dri3-0 libxcb-render0 libxcb-shm0 libxcb-present0 libxcb-sync1 libxcb-xfixes0
  libcairo2 libcairo-gobject2 libpango-1.0-0 libpangocairo-1.0-0 libpangoft2-1.0-0
  libpixman-1-0 libepoxy0 libwayland-client0 libwayland-server0
  libexpat1 libfontconfig1 libfreetype6 libharfbuzz0b libpng16-16t64
  libffi8 libpcre2-8-0 libselinux1 libmount1 libblkid1 libuuid1
  libbrotli1 libbz2-1.0 libdatrie1 libgraphite2-3 libthai0 libthai-data libfribidi0
  libatomic1 libgcc-s1 "libstdc++6" libgomp1
  libegl1 libgl1 libgles2 libglvnd0 libudev1
  libssl3t64 libavahi-common3 libavahi-client3
  libgnutls30t64 libgmp10 libhogweed6t64 libnettle8t64 libtasn1-6
  libidn2-0 libunistring5 libp11-kit0
  libkeyutils1 libkrb5-3 libk5crypto3 libkrb5support0 libgssapi-krb5-2 libcom-err2
  fontconfig-config fonts-dejavu-core fonts-liberation
)

download_pkg() {
  local pkg="$1"
  local path
  path=$(awk -v p="$pkg" '
    $0=="Package: "p {ok=1}
    ok && /^Filename:/ {print $2; exit}
    ok && /^$/ {ok=0}
  ' /tmp/flf-pkgs-index)
  if [[ -z "$path" ]]; then
    echo "  bỏ qua (không tìm thấy): $pkg" >&2
    return 0
  fi
  local f
  f=$(basename "$path")
  if [[ ! -f "$DEBS/$f" ]]; then
    echo "  tải $f"
    curl -fsSL -o "$DEBS/$f" "$MIRROR/$path"
  fi
  dpkg-deb -x "$DEBS/$f" "$LIB_ROOT"
}

echo "Giải nén gói lõi…"
for pkg in "${CORE_PKGS[@]}"; do
  download_pkg "$pkg"
done

# Bổ sung theo ldd nếu Chromium đã cài
CHROME="${PLAYWRIGHT_CHROMIUM:-$HOME/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome}"
if [[ -x "$CHROME" ]]; then
  export LD_LIBRARY_PATH="$LIB_ROOT/usr/lib/x86_64-linux-gnu:$LIB_ROOT/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
  for round in 1 2 3 4 5; do
    missing=$(ldd "$CHROME" 2>/dev/null | awk '/not found/{print $1}' | sort -u || true)
    [[ -z "$missing" ]] && break
    echo "Round $round — còn thiếu: $missing"
    for lib in $missing; do
      pkg=$(awk -v lib="$lib" '$1 ~ lib"$" {split($2,a,"/"); print a[length(a)]; exit}' /tmp/flf-contents)
      [[ -n "$pkg" ]] && download_pkg "$pkg"
    done
  done
  leftover=$(ldd "$CHROME" 2>/dev/null | awk '/not found/{print $1}' | sort -u || true)
  if [[ -n "$leftover" ]]; then
    echo "VẪN THIẾU: $leftover" >&2
    exit 1
  fi
fi

echo "XONG: thư viện tại $LIB_ROOT"
echo "Nạp môi trường: source scripts/browser-env.sh"
