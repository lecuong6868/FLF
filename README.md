# FLF — Bản xem thử offline (phương án B)

Đóng gói giao diện **phương án B** (chuỗi PR #7 → #8 → #9 → #10 trên [lecuong6868/FLF](https://github.com/lecuong6868/FLF)) thành bản xem thử **không cần cài đặt**.

> **Bản thiết kế chờ duyệt** · `noindex` · Không phải website chính thức flf.vn · Không đổi DNS.  
> Form liên hệ / CMS / AI / MXH: **chưa có backend** — chỉ minh họa giao diện.

## Cách xem nhanh (khuyến nghị)

1. Tải / lấy file **`FLF-preview.zip`** trong thư mục gốc repo (sau khi chạy đóng gói).
2. Giải nén.
3. Mở **`FLF-preview/index.html`** bằng Chrome / Edge / Firefox (giao thức `file://`).

Không cần Node, Python, server hay GitHub Pages.

Thư mục đã giải nén sẵn (nếu đã chạy script): `FLF-preview/option-b/index.html`.

## Cài đặt & đóng gói lại

Yêu cầu: **Node.js 18+** (chỉ khi muốn đóng gói / kiểm thử tự động).

```bash
# Nếu dùng nvm:
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

cd /đường/dẫn/renew-web-flf
npm install
npm run pack:offline
```

Kết quả:

| Đường dẫn | Mô tả |
|-----------|--------|
| `FLF-preview.zip` | Gói bàn giao — giải nén rồi mở `index.html` (~2,3 MB kèm ảnh) |
| `FLF-preview/` | Thư mục tương ứng trong zip |
| `FLF-preview/screenshots/` | Ảnh 1440px / 390px (file://) |
| `FLF-preview/docs/KIEM-TRA-OFFLINE.md` | Biên bản kiểm thử offline |
| `docs/OFFLINE-PACK.json` | Metadata kích thước / thời điểm đóng gói |

## Kiểm thử

### Offline qua `file://` (bắt buộc theo nhiệm vụ lần này)

```bash
npm run bootstrap:browser   # máy agent thiếu lib Playwright
source scripts/browser-env.sh
npx playwright install chromium
npm run verify:offline
```

Hoặc một lệnh: `npm run offline` (đóng gói + kiểm thử).

Ảnh chụp: `mockups/offline/B-desktop-1440-file.png`, `B-mobile-390-file.png`, `B-mobile-390-menu-open-file.png`.  
Biên bản: `docs/KIEM-TRA-OFFLINE.json`.

### Menu / trang (HTTP local, tuỳ chọn)

```bash
npm run check
npm run test:menu
python3 -m http.server 4173
# mở http://127.0.0.1:4173/option-b/
```

## Nội dung phương án B

| Mục | Đích |
|-----|------|
| Trang chủ / Giới thiệu / Lĩnh vực / Đối tác / Liên hệ | Neo trên trang chủ |
| Tin tức | `option-b/tin-tuc/index.html` |
| Quy định mới | `option-b/quy-dinh-moi/index.html` |
| Chuyên mục (5 chủ đề) | `option-b/chuyen-muc/index.html?chu-de=…` |

Logo: `public/brand/` (file khách gửi — không chỉnh họa tiết).  
Font: local trong `public/fonts/` (không phụ thuộc Google Fonts khi mở offline).

## Việc đã chỉnh cho offline

- Đường dẫn menu dùng `…/index.html` (trình duyệt không tự mở thư mục qua `file://`).
- Font Noto local thay Google Fonts.
- Nút liên hệ: hiện rõ **minh họa / chưa gửi** — không báo gửi thành công giả.
- `history.replaceState` bọc try/catch trên `file://`.

## Tài liệu thêm

| File | Nội dung |
|------|----------|
| [`docs/COMPANY_VERIFICATION.md`](docs/COMPANY_VERIFICATION.md) | MST / địa chỉ đã đối chiếu |
| [`docs/BAN-GIAO-HEADER.md`](docs/BAN-GIAO-HEADER.md) | Kế thừa menu |
| [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) | Biên bản kiểm tra chung |
| [`deploy/`](deploy/) | Script VPS cho bản web cũ (zip WordPress/React) — không dùng cho mockup này |

## Chưa làm trong gói này

- Merge / GitHub Pages HTTPS, đổi DNS flf.vn  
- Next.js + Payload CMS + PostgreSQL (giai đoạn 1 sản phẩm)  
- Kết nối Facebook / LinkedIn / Zalo, AI đăng bài, chatbot  
