# Cấu hình triển khai preview (review qua PR)

Bàn giao khi **chưa** xuất bản được HTTPS công khai vì thiếu quyền. Không yêu cầu khách chạy Terminal hay gửi lại tệp.

## Mục tiêu

Xuất bản preview tĩnh (header/menu phương án B) tại:

- `https://lecuong6868.github.io/FLF/`
- `https://lecuong6868.github.io/FLF/option-b/`

từ đúng commit PR #7 (`c8364c5` hoặc commit mới hơn trên cùng dòng kế thừa), **không** đổi DNS flf.vn, **không** dịch vụ trả phí.

## Đã có sẵn trong repo

| Thành phần | Đường dẫn |
|------------|-----------|
| Workflow publish | `.github/workflows/preview-pages.yml` |
| Workflow kiểm thử menu | `.github/workflows/browser-menu-test.yml` |
| Script xác minh URL | `scripts/verify-preview-url.mjs` (`npm run verify:preview`) |
| Script kiểm thử menu trên URL đã deploy | `FLF_BASE_URL=… npm run test:menu` |
| noindex / robots | `option-b/index.html`, `robots.txt` |

Workflow **build** đã chạy thành công trên PR #7; chỉ **deploy** bị chặn vì Pages chưa bật.

## Việc admin cần làm (1–2 phút)

1. Mở https://github.com/lecuong6868/FLF/settings/pages  
2. **Build and deployment → Source** chọn **GitHub Actions** → Save.  
3. Vào **Actions → Preview Pages** → Run workflow (hoặc push lại nhánh `aat/**`).  
4. Khi job `deploy` xanh: mở `https://lecuong6868.github.io/FLF/option-b/` (không cần đăng nhập).  
5. (Tuỳ chọn) Nhờ team chạy `npm run verify:preview` và `FLF_BASE_URL=… npm run test:menu`.

## Bằng chứng lỗi hiện tại (không cần thử lại enable API)

- Pages site API / URL: **404**
- Actions deploy (commit `c8364c5`): *Failed to create deployment (status: 404)… Ensure GitHub Pages has been enabled*
- Token môi trường agent: không dùng để bật Pages (đã xác định thiếu quyền ở lượt trước; lượt này **không** lặp thử)

## Phương án dự phòng (chỉ khi admin không muốn Pages)

Cần **một** trong các kết nối chưa có:

- Token Surge/Netlify/Cloudflare Pages (miễn phí) gắn Secrets repo, hoặc  
- VPS đã đồng ý (~24 USD/tháng) + DNS — **ngoài** phạm vi preview thiết kế hiện tại.

Chưa cấu hình các secret đó trong repo để tránh phát sinh dịch vụ khi chưa được cấp.
