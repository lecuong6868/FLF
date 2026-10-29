# Biên bản kiểm tra

Ngày: **2026-10-29** (hoàn thiện header/menu phương án B)

## Phạm vi

Preview tĩnh — header/menu desktop & mobile phương án B (+ CSS tương thích A). Không CMS/AI/MXH.

## Đã chạy (kết quả thật)

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| Kiểm tra tĩnh | `node scripts/check-pages.mjs` | **PASS** |
| Smoke nav Chuyên mục | `node` eval `shared/content.js` | **PASS** — 5 mục con + `?chu-de=` |
| Serve HTTP | `python3 -m http.server 4173` + `curl` | **200** cho `/`, `/option-b/`, tin-tuc, chuyen-muc, `?chu-de=thue`, logo |
| Mockup PNG | `python3 scripts/render-mockups.py` (+ ảnh menu mở Pillow) | **OK** `mockups/B-desktop-1440.png`, `B-mobile-390.png`, `B-mobile-390-menu-open.png` |
| Playwright browser | `npx playwright` Chromium | **CHƯA CHẠY ĐƯỢC** — thiếu `libglib-2.0.so.0` trên máy agent (`error while loading shared libraries`). Không dành thời gian cài lại deps hệ thống. |
| Overflow 390/1440 bằng browser | phụ thuộc Playwright | **Chưa đo DOM thật**; CSS có `overflow-x: hidden` trên `body`. |
| Escape / focus trap bằng browser | phụ thuộc Playwright | **Chưa chạy UI thật**; code đã có Escape, aria, focus trap, backdrop (đã kiểm tra tĩnh + smoke). |
| Lint/build Next.js | — | **Không áp dụng** (lượt này không dựng Next.js) |
| GitHub Pages HTTPS | Settings → Actions | **Chưa chạy được** — cần admin bật Pages |

## Tiêu chí lượt này

- [x] Kế thừa PR #5; nhánh `aat/20261029-110343` không có code dang dở
- [x] Menu: Tin tức, Quy định mới, Chuyên mục + 5 chủ đề
- [x] Logo khách; không bịa thông tin công ty
- [x] Mobile a11y trong code (mở/đóng, Escape, aria, focus)
- [x] Liên kết chuyên mục hợp lệ
- [ ] Screenshot DOM thật từ Chromium — bị chặn môi trường
- [ ] URL preview HTTPS — cần admin

## Giới hạn

- Agent không commit/push theo yêu cầu xưởng.  
- Trang chủ đầy đủ / xuất bản preview → lượt tiếp theo.
