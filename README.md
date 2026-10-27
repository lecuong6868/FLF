# FLF — Preview thiết kế chờ duyệt

Trang **preview tĩnh HTTPS** để khách duyệt hai hướng UI/UX First Legal Force (`www.flf.vn`) trước khi phát triển Next.js + Payload CMS.

> **Bản thiết kế chờ duyệt** · `noindex` · **Không** phải website chính thức · **Không** đổi DNS flf.vn · Flow Dashboard/MXH/AI chỉ là **minh họa**.

Nguồn mockup tận dụng từ [PR #3](https://github.com/lecuong6868/FLF/pull/3); lượt này bổ sung sơ đồ, flow khách / nhân viên–admin, lightbox phóng to, nhãn chờ duyệt và xuất bản preview công khai.

## Xem nhanh

| Đầu ra | Đường dẫn |
|--------|-----------|
| **URL preview chính** | [`docs/PREVIEW-URL.md`](docs/PREVIEW-URL.md) |
| Trang so sánh + flow | [`index.html`](index.html) |
| Phương án A (hiện đại) | [`option-a/`](option-a/) |
| Phương án B (trang trọng) | [`option-b/`](option-b/) |
| 4 ảnh PNG (1440 / 390) | [`mockups/`](mockups/) |
| Sơ đồ trang | [`docs/SO-DO-TRANG.md`](docs/SO-DO-TRANG.md) |
| Biên bản kiểm tra | [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) |

Logo gốc: `public/brand/` (từ tài nguyên đã gửi — không chỉnh họa tiết).

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
# export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm start
```

Mở: http://127.0.0.1:4173/

### Kiểm tra tĩnh

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
node scripts/check-pages.mjs
```

### Render lại 4 PNG mockup (tuỳ chọn)

```bash
npm run render:mockups
```

## Xuất bản preview HTTPS (GitHub Pages)

1. Repo công khai `lecuong6868/FLF` (đã đúng).
2. Người có quyền **admin** bật: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Workflow [`.github/workflows/preview-pages.yml`](.github/workflows/preview-pages.yml) sẽ publish chỉ tài nguyên thiết kế (không gồm `.aat/`, zip WordPress).
4. URL dạng: `https://lecuong6868.github.io/FLF/`

Nếu chưa bật Pages, xem URL tunnel / ghi chú quyền trong `docs/PREVIEW-URL.md`.

## Phạm vi / không làm trong lượt này

- Không merge PR #2 / #3, không đổi DNS `flf.vn`.
- Không dựng backend, CMS, đăng nhập thật, đăng MXH, chatbot.
- Không bịa địa chỉ, đối tác, thành tích, cam kết chưa xác minh.

## Việc anh cần làm tiếp

1. Mở URL trong `docs/PREVIEW-URL.md`, duyệt A/B (hoặc A + chi tiết B).
2. Nếu URL GitHub Pages chưa lên: bật Pages (Source = GitHub Actions) bằng tài khoản admin repo.
3. Xác nhận địa chỉ & SĐT công khai (`docs/COMPANY_VERIFICATION.md`).
4. Sau khi chọn UI → triển khai khung Next.js + Payload (giai đoạn 1).
