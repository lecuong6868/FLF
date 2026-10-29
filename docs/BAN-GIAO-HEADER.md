# Bàn giao — Header & menu phương án B

## Phần kế thừa
- Source **PR #7** commit `c8364c5` (`aat/20261029-132653`): mockup/flow, menu phương án B (Tin tức, Quy định mới, Chuyên mục + 5 chủ đề), sửa backdrop mobile, bộ kiểm thử 37 ca.
- Logo gốc khách gửi: `public/brand/logo-color.png`, `public/brand/first-legal-force.png`.
- Nội dung công ty đã xác minh — **không** bịa địa chỉ/đối tác.
- Workflow Pages: `.github/workflows/preview-pages.yml` · CI menu: `.github/workflows/browser-menu-test.yml`.

## Phần làm trong lượt xác minh PR #7
- Xác minh lại: PR mở, Pages vẫn 404, deploy Actions fail đúng lỗi *Pages has been enabled*, CI menu **success** trên `c8364c5`.
- Chạy lại local: `npm run check` + `npm run test:menu` → **37/37 PASS**.
- Thêm `npm run verify:preview` và hỗ trợ `FLF_BASE_URL` cho `test:menu` (chạy trên bản đã deploy khi có URL).
- Làm rõ workflow Pages (tóm tắt lỗi quyền) + [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).
- **Không** lặp thử enable Pages bằng token; **không** đổi DNS flf.vn.

## Ảnh kiểm tra
| Viewport | File |
|----------|------|
| Desktop 1440 | `mockups/B-desktop-1440.png` |
| Mobile 390 | `mockups/B-mobile-390.png` |
| Mobile menu mở | `mockups/B-mobile-390-menu-open.png` |
| Bản live test-run | `mockups/test-runs/*-live.png` |

## Phần còn lại (anh David / admin)
1. **Admin** bật GitHub Pages (Source = GitHub Actions) → xác minh `https://lecuong6868.github.io/FLF/` HTTP 200.
2. Chạy `npm run verify:preview` và `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu`.
3. Hệ thống AAT commit/push nhánh → cập nhật PR #7 (không tự merge).
4. Hoàn thiện **trang chủ** phương án B rồi xuất bản lại preview.
5. Chốt địa chỉ trụ sở công khai (`docs/COMPANY_VERIFICATION.md`).
6. Triển khai Next.js + Payload — CMS, Dashboard, SEO/redirect 301; giai đoạn 2–3: MXH, AI, chatbot.

## Kiểm tra đã chạy
Xem `docs/KIEM-TRA.md` và `docs/KIEM-TRA-TRINH-DUYET.json` (37/37 PASS local; CI success trên PR #7).
