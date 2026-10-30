# Bàn giao — Header & menu phương án B

## Phần kế thừa
- Source **PR #7** commit `c8364c5` (`aat/20261029-132653`): mockup/flow, menu phương án B (Tin tức, Quy định mới, Chuyên mục + 5 chủ đề), backdrop mobile, bộ kiểm thử 37 ca.
- Tiếp nối **PR #8** commit `0ca02c7` (`aat/20261029-145123`): `verify:preview`, `FLF_BASE_URL` cho `test:menu`, docs Pages.
- Logo gốc khách gửi: `public/brand/logo-color.png`, `public/brand/first-legal-force.png`.
- Nội dung công ty đã xác minh — **không** bịa địa chỉ/đối tác.
- Workflow Pages: `.github/workflows/preview-pages.yml` · CI menu: `.github/workflows/browser-menu-test.yml`.

## Phần làm trong lượt này (2026-10-30, tiếp PR #8)
- Xác định đúng bản menu: `c8364c5` (PR #7); bản Pages/docs: `0ca02c7` (PR #8).
- Khôi phục source PR #8 vào working tree; cập nhật workflow (configure-pages, `.nojekyll`, tóm tắt lỗi đúng điểm chặn).
- Xác minh lại URL: vẫn **404**; run deploy gần nhất vẫn fail *Pages has been enabled* (trước ảnh Settings).
- Đối chiếu ảnh Settings: Source đã **GitHub Actions** — **không** yêu cầu bật lại.
- Phát hiện environment `github-pages` chỉ cho phép nhánh **`main`** → cần thêm **`aat/**`**.
- `GH_TOKEN` rỗng: **không** re-run Actions / **không** sửa environment qua API.
- Local: `npm run check` + `npm run test:menu` (xem `KIEM-TRA.md`).

## Ảnh kiểm tra
| Viewport | File |
|----------|------|
| Desktop 1440 | `mockups/B-desktop-1440.png` |
| Mobile 390 | `mockups/B-mobile-390.png` |
| Mobile menu mở | `mockups/B-mobile-390-menu-open.png` |
| Bản live test-run | `mockups/test-runs/*-live.png` |
| Settings Pages (khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` |

## Phần còn lại (anh David / admin)
1. **Environments → github-pages → Deployment branches:** thêm `aat/**` (xem [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md)).
2. **Re-run** [Preview Pages 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) (hoặc chờ AAT push nhánh mới).
3. Khi URL 200: `npm run verify:preview` + `FLF_BASE_URL=… npm run test:menu`.
4. Không merge PR chỉ để deploy; không đổi DNS flf.vn.
5. Sau preview ổn: hoàn thiện trang chủ B; CMS/Dashboard → giai đoạn sau.

## Kiểm tra đã chạy
Xem `docs/KIEM-TRA.md` và `docs/KIEM-TRA-TRINH-DUYET.json`.
