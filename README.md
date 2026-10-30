# FLF — Bản xem thử offline (phương án B)

Gói HTML mở trực tiếp bằng trình duyệt (`file://`), **không cần cài đặt**. Kế thừa giao diện phương án B từ chuỗi PR #7 → #10; đóng gói tại PR #11.

> **Bản thiết kế chờ duyệt** · Không phải website chính thức flf.vn · Không đổi DNS.  
> Form liên hệ / CMS / AI / MXH: **chưa có backend** — chỉ minh họa, không báo gửi thành công giả.

## Link tải trực tiếp (gửi khách)

| Hạng mục | Giá trị |
|----------|---------|
| **URL tải (chính)** | https://cdn.jsdelivr.net/gh/lecuong6868/FLF@15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip |
| URL dự phòng | https://raw.githubusercontent.com/lecuong6868/FLF/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip |
| Dung lượng | **2 436 515 byte** (~**2,32 MB**) |
| **SHA-256** | `5cf4cd68bace42e33465dc7a17d1c817b97e24c4be8117234326d72200be4036` |
| Commit chứa gói | `15ed82c2bff89c9a3635dfd53568d2cdf83147f2` (nhánh `aat/20261030-154651`, PR [#11](https://github.com/lecuong6868/FLF/pull/11)) |
| HTTP khi tải | **200** · `Content-Type: application/zip` · không redirect · không cần đăng nhập |

> **Không** gửi link trang PR, link `…/blob/…` (trả HTML), hay link `github.com/…/raw/…` (302 — client không follow sẽ tải rỗng).

## Cách xem (no-code)

1. Mở **URL tải (chính)** ở trên → trình duyệt tải `FLF-preview.zip`.
2. Giải nén (Windows: chuột phải → Extract All; macOS: double-click).
3. Mở **`FLF-preview/index.html`** bằng Chrome / Edge / Firefox.

Không cần Node, Python, server hay GitHub Pages.

## Vì sao đổi URL (nguyên nhân lỗi PR #12)

Đã tái hiện bằng phiên **không đăng nhập**:

| URL / cách mở | Kết quả thực tế |
|---------------|-----------------|
| `github.com/…/blob/…/FLF-preview.zip` | HTTP 200 nhưng **`text/html`** (trang xem file GitHub), **không phải ZIP** |
| `github.com/…/raw/…` **không** follow redirect | HTTP **302**, body **0 byte** → tải thất bại |
| `raw.githubusercontent.com/…` (URL PR #12) | ZIP hợp lệ, nhưng CSP có `sandbox`; một số client/proxy xử lý kém |
| **`cdn.jsdelivr.net/gh/…@SHA/FLF-preview.zip`** (URL mới) | HTTP **200** trực tiếp, `application/zip`, đủ 2 436 515 byte, không đăng nhập, cache dài |

## Kiểm thử trên tệp vừa tải (2026-10-30)

1. Tải lại đúng **URL chính** (jsDelivr) → HTTP 200, `application/zip`, magic `PK\x03\x04`, **SHA-256 khớp**.
2. Giải nén không lỗi (27 entry; có `index.html`, `option-b/`, logo, font Noto).
3. Mở `file://…/FLF-preview/option-b/index.html` → Playwright **17/17 PASS** (logo, font/CSS, menu desktop + 5 chủ đề, Tin tức, mobile 390 mở/đóng/backdrop/Escape, form chỉ minh họa — không báo gửi thành công giả).
4. Ảnh: `mockups/offline/`, `FLF-preview/screenshots/`.

Chi tiết: [`docs/BAN-GIAO-TAI.md`](docs/BAN-GIAO-TAI.md), [`docs/DOWNLOAD-VERIFY.json`](docs/DOWNLOAD-VERIFY.json).

## Nội dung phương án B

| Mục | Đích |
|-----|------|
| Trang chủ / Giới thiệu / Lĩnh vực / Đối tác / Liên hệ | Neo trên trang chủ |
| Tin tức | `option-b/tin-tuc/index.html` |
| Quy định mới | `option-b/quy-dinh-moi/index.html` |
| Chuyên mục (5 chủ đề) | `option-b/chuyen-muc/index.html?chu-de=…` |

Logo: `public/brand/` (file khách gửi). Font Noto local trong `public/fonts/`.

## Đóng gói / kiểm thử lại (tuỳ chọn, cần Node 18+)

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm install
npm run bootstrap:browser
source scripts/browser-env.sh
npx playwright install chromium
npm run verify:offline   # kiểm gói đã có
# hoặc: npm run offline  # đóng gói lại + kiểm thử
```
