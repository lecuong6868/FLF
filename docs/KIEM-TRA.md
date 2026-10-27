# Biên bản kiểm tra

Ngày: **2026-10-27**

## Phạm vi

Mockup so sánh UI/UX (HTML tĩnh) — không kiểm thử CMS/backend.

## Đã chạy

| Hạng mục | Lệnh / cách | Kết quả |
|----------|-------------|---------|
| Kiểm tra tĩnh file + cụm từ tiếng Việt | `npm run check` | **PASS** — đủ file bắt buộc, có cụm «Đồng hành…», «Nội dung đề xuất…», «NĐ 13/2023»; không phát hiện cụm số liệu bịa trong `shared/content.js` |
| Render 4 PNG desktop/mobile | `npm run render:mockups` (`python3 scripts/render-mockups.py`) | **OK** — `A-desktop-1440.png` (1440×2328), `A-mobile-390.png` (390×3122), `B-desktop-1440.png` (1440×2457), `B-mobile-390.png` (390×3070); kích thước file > 170 KB mỗi ảnh |
| Serve trang so sánh | `python3 -m http.server 4173` | **200** cho `/`, `/option-a/`, `/option-b/`, 4 PNG, logo, `shared/content.js` |
| CSS chống tràn ngang | Đọc `option-a/styles.css`, `option-b/styles.css` | Có `overflow-x: hidden` |
| Playwright `npm run capture` | `npx playwright` + Chromium | **Không chạy được trên máy xưởng** — thiếu `libglib-2.0.so.0`, `playwright install-deps` cần sudo. Đã dùng renderer Pillow + logo gốc thay thế; HTML mockup vẫn là nguồn sự thật để mở tương tác. |

## Tiêu chí duyệt (đã đối chiếu trên PNG + HTML)

- [x] Chữ tiếng Việt có dấu trên PNG và trong `shared/content.js`
- [x] Mobile 390px: cột đơn, nút menu, CTA đủ lớn; CSS `overflow-x: hidden`
- [x] Desktop 1440px: menu, hero, lĩnh vực, quy trình, đối tác pháp lý, CTA
- [x] Logo file gốc `public/brand/logo-color.png` / `first-legal-force.png`
- [x] Không tên đối tác / không số liệu thành tích / không cam kết kết quả

## Giới hạn bàn giao

- Không có URL preview hosting sống ngoài GitHub ở môi trường xưởng.  
- Khách xem được ảnh PNG và HTML **trực tiếp trên PR/GitHub** (đường dẫn tương đối trong `docs/PR-MO-TA.md`) — không bắt buộc chạy lệnh local.  
- Chưa coi phương án nào đã được khách chấp thuận.
