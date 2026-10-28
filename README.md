# FLF — Preview thiết kế chờ duyệt

Trang **preview tĩnh** để khách duyệt hai hướng UI/UX First Legal Force (`www.flf.vn`) trước khi phát triển Next.js + Payload CMS.

> **Bản thiết kế chờ duyệt** · `noindex` · **Không** phải website chính thức · **Không** đổi DNS flf.vn · Flow Dashboard / AI / MXH chỉ là **minh họa**.

Nguồn mockup tận dụng từ PR #3 / #4. Lượt này bổ sung menu **Tin tức**, **Quy định mới**, **Chuyên mục** (danh sách + bài mẫu), cập nhật sơ đồ trang và flow xuất bản web → MXH.

## Xem nhanh

| Đầu ra | Đường dẫn |
|--------|-----------|
| **URL preview** | [`docs/PREVIEW-URL.md`](docs/PREVIEW-URL.md) |
| Trang so sánh + flow | [`index.html`](index.html) |
| Phương án A | [`option-a/`](option-a/) — gồm `tin-tuc/`, `quy-dinh-moi/`, `chuyen-muc/` |
| Phương án B | [`option-b/`](option-b/) — cùng cấu trúc mục |
| 4 ảnh PNG (1440 / 390) | [`mockups/`](mockups/) |
| Sơ đồ & flow | [`docs/SO-DO-TRANG.md`](docs/SO-DO-TRANG.md) |
| Biên bản kiểm tra | [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) |

Logo gốc: `public/brand/` (không chỉnh họa tiết).

## Phân biệt ba mục nội dung

| Mục | Ý nghĩa |
|-----|---------|
| Tin tức | Hoạt động / thông báo FLF |
| Quy định mới | Cập nhật văn bản/chính sách + metadata hiệu lực |
| Chuyên mục | Bài phân tích theo chủ đề (bộ lọc minh họa) |

Bộ lọc, tìm kiếm, trạng thái rỗng và giá trị metadata trên preview đều mang nhãn **minh họa** — không phải văn bản pháp lý thật.

## Cài đặt & chạy (máy local)

Yêu cầu: **Python 3** (đủ để xem) hoặc **Node.js 18+**.

### Cách 1 — Python

```bash
python3 -m http.server 4173
```

Mở: http://127.0.0.1:4173/

### Cách 2 — npm

```bash
# bật Node nếu dùng nvm
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm start
```

Mở: http://127.0.0.1:4173/

### Kiểm tra tĩnh

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
node scripts/check-pages.mjs
```

### Sinh lại trang mục (nếu sửa template)

```bash
node scripts/gen-section-pages.mjs
```

### Render lại 4 PNG mockup (tuỳ chọn)

```bash
npm run render:mockups
```

## Xuất bản preview HTTPS (GitHub Pages)

1. Repo công khai `lecuong6868/FLF`.
2. Admin bật: **Settings → Pages → Source = GitHub Actions**.
3. Workflow [`.github/workflows/preview-pages.yml`](.github/workflows/preview-pages.yml) publish tài nguyên thiết kế (không gồm `.aat/`, zip WordPress).
4. URL dạng: `https://lecuong6868.github.io/FLF/`

Tunnel trycloudflare chỉ tạm thời — xem `docs/PREVIEW-URL.md`.

## Phạm vi / không làm trong lượt này

- Không merge PR cũ, không đổi DNS `flf.vn`.
- Không dựng backend, CMS, đăng nhập thật, đăng MXH, chatbot.
- Không bịa địa chỉ, đối tác, thành tích, số hiệu/ngày hiệu lực văn bản thật.

## Việc anh cần làm tiếp

1. Mở URL trong `docs/PREVIEW-URL.md` (hoặc chạy local theo hướng dẫn trên), duyệt A/B và các mục Tin tức / Quy định mới / Chuyên mục.
2. Nếu cần URL HTTPS bền: bật GitHub Pages (Source = GitHub Actions) bằng tài khoản admin repo.
3. Xác nhận địa chỉ & SĐT công khai (`docs/COMPANY_VERIFICATION.md`).
4. Sau khi chọn UI → triển khai khung Next.js + Payload (giai đoạn 1).
