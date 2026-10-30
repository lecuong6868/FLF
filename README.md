# FLF — Bản xem thử offline (phương án B)

Gói HTML mở trực tiếp bằng trình duyệt (`file://`), **không cần cài đặt**. Kế thừa giao diện phương án B từ chuỗi PR #7 → #10; đóng gói tại PR #11.

> **Bản thiết kế chờ duyệt** · Không phải website chính thức flf.vn · Không đổi DNS.  
> Form liên hệ / CMS / AI / MXH: **chưa có backend** — chỉ minh họa, không báo gửi thành công giả.

## Link tải trực tiếp (gửi khách)

| Hạng mục | Giá trị |
|----------|---------|
| **URL tải** | https://raw.githubusercontent.com/lecuong6868/FLF/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip |
| URL dự phòng (cùng tệp) | https://github.com/lecuong6868/FLF/raw/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip |
| Dung lượng | **2 436 515 byte** (~**2,32 MB**) |
| Commit SHA | `15ed82c2bff89c9a3635dfd53568d2cdf83147f2` |
| Nhánh chứa | `aat/20261030-154651` (PR [#11](https://github.com/lecuong6868/FLF/pull/11)) |
| Content-Type khi tải | `application/zip` · HTTP **200** |

> Link PR không phải link tải. Dùng URL `raw.githubusercontent.com` / `…/raw/…` ở trên.

## Cách xem (no-code)

1. Tải `FLF-preview.zip` bằng link trên (hoặc lấy file cùng tên ở gốc repo).
2. Giải nén.
3. Mở **`FLF-preview/index.html`** bằng Chrome / Edge / Firefox.

Không cần Node, Python, server hay GitHub Pages.

## Kiểm thử đã xác minh (2026-10-30)

1. Tải lại đúng URL gửi khách → HTTP 200, `application/zip`, magic `PK\x03\x04`, đúng 2 436 515 byte.
2. Giải nén → mở `file://…/FLF-preview/option-b/index.html`.
3. Playwright: **17/17 PASS** (logo, font/CSS, menu desktop + 5 chủ đề, trang Tin tức, mobile 390 mở/đóng/backdrop/Escape, form chỉ minh họa).
4. Ảnh: `FLF-preview/screenshots/` và `mockups/offline/`.

Chi tiết: [`docs/BAN-GIAO-TAI.md`](docs/BAN-GIAO-TAI.md), [`docs/KIEM-TRA-OFFLINE.json`](docs/KIEM-TRA-OFFLINE.json).

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

## Chưa làm trong gói này

- Merge lên `main` / GitHub Pages HTTPS, đổi DNS flf.vn  
- Next.js + Payload CMS + PostgreSQL  
- Facebook / LinkedIn / Zalo, AI đăng bài, chatbot  
