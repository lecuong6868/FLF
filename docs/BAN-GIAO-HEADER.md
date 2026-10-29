# Bàn giao — Header & menu phương án B

## Phần kế thừa
- Source **PR #6** commit `4ff2ffe` (`aat/20261029-121508`): mockup/flow, menu phương án B (Tin tức, Quy định mới, Chuyên mục + 5 chủ đề).
- Logo gốc khách gửi: `public/brand/logo-color.png`, `public/brand/first-legal-force.png`.
- Nội dung công ty đã xác minh — **không** bịa địa chỉ/đối tác.
- Workflow Pages: `.github/workflows/preview-pages.yml`.

## Phần sửa trong lượt kiểm thử trình duyệt (tiếp nối PR #6)
- **Bug:** `.menu-backdrop` phủ lên `.mobile-panel` → không click được accordion Chuyên mục / link mobile. Sửa z-index (option-b + option-a).
- Bootstrap Chromium không sudo: `scripts/bootstrap-browser-libs.sh`, `scripts/browser-env.sh`.
- Kiểm thử Playwright: `scripts/test-header-menu.mjs` (`npm run test:menu`) — 37 ca desktop/mobile.
- CI: `.github/workflows/browser-menu-test.yml`.
- Ảnh DOM thật cập nhật: `mockups/B-desktop-1440.png`, `B-mobile-390.png`, `B-mobile-390-menu-open.png` + `mockups/test-runs/`.

## Ảnh kiểm tra
| Viewport | File |
|----------|------|
| Desktop 1440 | `mockups/B-desktop-1440.png` |
| Mobile 390 | `mockups/B-mobile-390.png` |
| Mobile menu mở | `mockups/B-mobile-390-menu-open.png` |
| Bản live test-run | `mockups/test-runs/*-live.png` |

## Phần còn lại (lượt tiếp / anh David)
1. **Admin** bật GitHub Pages (Source = GitHub Actions) → xác minh `https://lecuong6868.github.io/FLF/` HTTP 200.
2. Hệ thống AAT commit/push nhánh → cập nhật hoặc mở PR tiếp nối #6 (không tự merge).
3. Hoàn thiện **trang chủ** phương án B rồi xuất bản lại preview.
4. Chốt địa chỉ trụ sở công khai (`docs/COMPANY_VERIFICATION.md`).
5. Triển khai Next.js + Payload trên nền UI B — CMS, Dashboard, SEO/redirect 301.
6. Giai đoạn 2–3: MXH, AI đăng bài (có duyệt), chatbot.

## Kiểm tra đã chạy
Xem `docs/KIEM-TRA.md` và `docs/KIEM-TRA-TRINH-DUYET.json` (37/37 PASS trên agent sau khi bootstrap libs).
