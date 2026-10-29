# FLF — Preview thiết kế (phương án B đã chọn)

Trang **preview tĩnh** First Legal Force (`www.flf.vn`) theo **phương án B** (khách chọn từ PR #3), kế thừa menu/flow từ PR #5 và preview từ PR #4.

> **Bản thiết kế chờ duyệt** · `noindex` · **Không** phải website chính thức · **Không** đổi DNS flf.vn.  
> Lượt này hoàn thiện **header + menu desktop/mobile** (Tin tức, Quy định mới, Chuyên mục + 5 chủ đề). CMS / AI / MXH / trang chủ đầy đủ → lượt sau.

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
npm run check
```

Chụp lại ảnh mockup (cần Playwright):

```bash
npm install
npx playwright install chromium
npm run capture
```

## Menu đã hoàn thiện (phương án B)

| Mục | Đích |
|-----|------|
| Trang chủ / Giới thiệu / Lĩnh vực / Đối tác / Liên hệ | Neo trên trang chủ (`#…`) |
| Tin tức | `option-b/tin-tuc/` |
| Quy định mới | `option-b/quy-dinh-moi/` |
| Chuyên mục → Đầu tư, Thuế, Quản trị doanh nghiệp, Quản trị rủi ro, Giấy phép | `option-b/chuyen-muc/?chu-de=…` |

Menu mobile: mở/đóng, Escape, aria, focus trap, backdrop.

Logo: `public/brand/` (file khách gửi — không chỉnh họa tiết).

## Tài liệu

| File | Nội dung |
|------|----------|
| [`docs/BAN-GIAO-HEADER.md`](docs/BAN-GIAO-HEADER.md) | Kế thừa / sửa / việc còn lại |
| [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) | Biên bản kiểm tra |
| [`docs/SO-DO-TRANG.md`](docs/SO-DO-TRANG.md) | Sơ đồ & flow |
| [`docs/PREVIEW-URL.md`](docs/PREVIEW-URL.md) | URL GitHub Pages |
| [`docs/COMPANY_VERIFICATION.md`](docs/COMPANY_VERIFICATION.md) | Thông tin công ty đã/đang xác minh |

## Deploy VPS (bản WordPress/React cũ)

Script nginx cũ nằm trong [`deploy/`](deploy/) — dùng cho zip hiện tại trên VPS, **không** phải stack Next.js mới.
