# FLF — Preview thiết kế (phương án B đã chọn)

Trang **preview tĩnh** First Legal Force (`www.flf.vn`) theo **phương án B**, kế thừa PR #5–#8.

> **Bản thiết kế chờ duyệt** · `noindex` · **Không** phải website chính thức · **Không** đổi DNS flf.vn.  
> Lượt này (tiếp PR #8): xác minh lại Pages/Actions; menu từ `c8364c5` (PR #7). **Chưa** có URL HTTPS đã kiểm chứng (site vẫn 404). CMS / trang chủ đầy đủ → lượt sau.

## Cài đặt & chạy (tiếng Việt)

Yêu cầu: **Python 3** hoặc **Node.js 18+**.

### Cách 1 — Python (nhanh)

```bash
cd /đường/dẫn/renew-web-flf
python3 -m http.server 4173
```

Mở trình duyệt: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)  
Phương án B: [http://127.0.0.1:4173/option-b/](http://127.0.0.1:4173/option-b/)

### Cách 2 — npm

```bash
# Nếu dùng nvm:
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

npm start
```

Mở: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)

## Kiểm tra

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm install
npm run check
```

### Kiểm thử trình duyệt header/menu (Playwright)

Trên máy đủ thư viện hệ thống (hoặc CI Ubuntu):

```bash
npx playwright install chromium   # hoặc: npx playwright install --with-deps chromium
npm run test:menu
```

Trên máy agent tối giản (thiếu `libglib-2.0.so.0`…, không có sudo):

```bash
npm run bootstrap:browser          # tải .deb Debian → .local-browser-libs/ (đã .gitignore)
source scripts/browser-env.sh
npx playwright install chromium
FLF_TEST_PORT=4177 npm run test:menu
```

Kết quả JSON: [`docs/KIEM-TRA-TRINH-DUYET.json`](docs/KIEM-TRA-TRINH-DUYET.json) · ảnh: `mockups/B-*.png`, `mockups/test-runs/`.

### Khi đã có URL HTTPS (GitHub Pages)

```bash
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu
```

Chụp lại mockup đầy đủ trang:

```bash
source scripts/browser-env.sh   # nếu cần
npm run capture
```

## Menu đã hoàn thiện (phương án B)

| Mục | Đích |
|-----|------|
| Trang chủ / Giới thiệu / Lĩnh vực / Đối tác / Liên hệ | Neo trên trang chủ (`#…`) |
| Tin tức | `option-b/tin-tuc/` |
| Quy định mới | `option-b/quy-dinh-moi/` |
| Chuyên mục → Đầu tư, Thuế, Quản trị doanh nghiệp, Quản trị rủi ro, Giấy phép | `option-b/chuyen-muc/?chu-de=…` |

Menu mobile: mở/đóng, Escape, aria, focus trap, backdrop (backdrop **không** chặn click panel).

Logo: `public/brand/` (file khách gửi — không chỉnh họa tiết).

## Preview HTTPS

URL kỳ vọng: `https://lecuong6868.github.io/FLF/` (base path `/FLF/`).

- Settings → Pages → Source = **GitHub Actions**: khách đã xác nhận bằng ảnh (2026-10-29) — **không** yêu cầu bật lại.
- Hiện site vẫn **404**; deploy Actions gần nhất fail trước khi có ảnh Settings.
- Điểm chặn đã xác minh thêm: environment `github-pages` chỉ cho phép nhánh **`main`** — cần thêm **`aat/**`**. Chi tiết: [`docs/DEPLOY-CAU-HINH.md`](docs/DEPLOY-CAU-HINH.md) · [`docs/PREVIEW-URL.md`](docs/PREVIEW-URL.md).

## Tài liệu

| File | Nội dung |
|------|----------|
| [`docs/BAN-GIAO-HEADER.md`](docs/BAN-GIAO-HEADER.md) | Kế thừa / sửa / việc còn lại |
| [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) | Biên bản kiểm tra |
| [`docs/KIEM-TRA-TRINH-DUYET.json`](docs/KIEM-TRA-TRINH-DUYET.json) | Chi tiết 37 ca Playwright |
| [`docs/DEPLOY-CAU-HINH.md`](docs/DEPLOY-CAU-HINH.md) | Cấu hình deploy / điểm chặn quyền |
| [`docs/SO-DO-TRANG.md`](docs/SO-DO-TRANG.md) | Sơ đồ & flow |
| [`docs/PREVIEW-URL.md`](docs/PREVIEW-URL.md) | URL GitHub Pages & duy trì preview |
| [`docs/COMPANY_VERIFICATION.md`](docs/COMPANY_VERIFICATION.md) | Thông tin công ty đã/đang xác minh |

## Deploy VPS (bản WordPress/React cũ)

Script nginx cũ nằm trong [`deploy/`](deploy/) — dùng cho zip hiện tại trên VPS, **không** phải stack Next.js mới.
