# Bàn giao — Header & menu phương án B

## Phần kế thừa
- Source **PR #7** commit `c8364c5` (`aat/20261029-132653`): mockup/flow, menu phương án B (Tin tức, Quy định mới, Chuyên mục + 5 chủ đề), backdrop mobile, bộ kiểm thử 37 ca.
- Tiếp nối **PR #8** commit `0ca02c7`: `verify:preview`, `FLF_BASE_URL` cho `test:menu`, docs Pages.
- Tiếp nối **PR #9** commit `7e2bacc`: xác minh lại Pages/Actions; vẫn 404 vì deploy trên `aat/**`.
- Logo gốc khách gửi: `public/brand/logo-color.png`, `public/brand/first-legal-force.png` (trùng `.aat/files/`).
- Workflow Pages: `.github/workflows/preview-pages.yml` · CI menu: `.github/workflows/browser-menu-test.yml`.

## Phần làm trong lượt này (2026-10-30, tiếp PR #9)
- Xác định source menu: `c8364c5` (PR #7); không merge chồng #7+#8+#9 (cùng dòng kế thừa).
- Đưa source PR #9 vào working tree; **đổi chiến lược deploy**: chỉ `push`/`workflow_dispatch` trên **`main`**; **giữ** environment chỉ `main` (không yêu cầu thêm `aat/**`).
- Local: `npm run check` PASS · `npm run test:menu` **37/37 PASS**.
- Xác minh lại HTTPS: vẫn **404**.
- `GH_TOKEN` rỗng: **dừng** merge / `workflow_dispatch` / re-run — không lặp thử credential rỗng.

## Ảnh kiểm tra
| Viewport | File |
|----------|------|
| Desktop 1440 | `mockups/B-desktop-1440.png` |
| Mobile 390 | `mockups/B-mobile-390.png` |
| Mobile menu mở | `mockups/B-mobile-390-menu-open.png` |
| Bản live test-run | `mockups/test-runs/*-live.png` |
| Settings Pages (khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` |

## Phần còn lại (anh David / admin)
1. **Cấp `GH_TOKEN`** (Contents + Pull requests + Actions write trên `lecuong6868/FLF`) **hoặc** tự **Merge** PR preview/menu vào `main`.  
2. Chạy / theo dõi **Preview Pages** trên `main` → đợi `deploy` success.  
3. Khi URL 200: `npm run verify:preview` + `FLF_BASE_URL=… npm run test:menu`.  
4. Không đổi DNS flf.vn; không bật CMS/AI/MXH trong lượt preview.  
5. Sau preview ổn: hoàn thiện trang chủ B; CMS/Dashboard → giai đoạn sau.

## Kiểm tra đã chạy
Xem `docs/KIEM-TRA.md` và `docs/KIEM-TRA-TRINH-DUYET.json`.
