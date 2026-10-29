# Biên bản kiểm tra

Ngày: **2026-10-29** (lượt kiểm thử trình duyệt header/menu — tiếp nối PR #6)

Commit nền: `4ff2ffe` (PR #6 / `aat/20261029-121508`). Các sửa trong lượt này nằm trên nhánh AAT hiện tại (chưa merge).

## Phạm vi

Preview tĩnh — header/menu desktop & mobile phương án B (+ CSS tương thích A). Không CMS/AI/MXH. Không nghiệm thu trang chủ hoàn chỉnh.

## Đã chạy (kết quả thật)

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| Kiểm tra tĩnh | `npm run check` | **PASS** |
| Chromium trên agent | Thiếu lib hệ thống → bootstrap `.local-browser-libs` (không sudo) + `source scripts/browser-env.sh` | **OK** — Chromium Playwright chạy được |
| Kiểm thử trình duyệt | `FLF_TEST_PORT=4177 npm run test:menu` | **PASS 37/37** — xem `docs/KIEM-TRA-TRINH-DUYET.json` |
| Desktop 1440 | Menu, dropdown Chuyên mục, 5 `chu-de`, Escape, overflow, JS | **PASS** |
| Mobile 390 | Mở/đóng, backdrop, Escape, Tab/Shift+Tab, focus trap, trả focus, accordion 5 chủ đề, overflow | **PASS** |
| Ảnh chụp DOM thật | `mockups/B-desktop-1440.png`, `B-mobile-390.png`, `B-mobile-390-menu-open.png` (+ `mockups/test-runs/*-live.png`) | **OK** |
| CI dự phòng | `.github/workflows/browser-menu-test.yml` | Sẵn sàng chạy sau khi push |
| GitHub Pages HTTPS | `https://lecuong6868.github.io/FLF/` | **CHƯA** — HTTP 404; Settings Pages chưa bật / chưa deploy. Token agent không đủ quyền enable. |
| Tunnel Cloudflare | Đã xác minh kỹ thuật nhanh rồi **tắt** | **Không** dùng làm URL bàn giao chính |

## Lỗi đã sửa trong lượt này

| Lỗi | Nguyên nhân | Sửa |
|-----|-------------|-----|
| Click accordion Chuyên mục / link mobile bị chặn | `.menu-backdrop` `z-index` cao hơn `.mobile-panel` → backdrop chặn pointer | Hạ backdrop xuống `z-index: 1`; `header-inner` + `mobile-panel` = `z-index: 2` (option-b & option-a) |

## Tiêu chí lượt này

- [x] Kế thừa đúng source PR #6 (`4ff2ffe`)
- [x] Chromium chạy được trên môi trường hỗ trợ (libs cục bộ)
- [x] Desktop 1440 + mobile 390: menu, dropdown, 5 `chu-de`, a11y mobile
- [x] Không tràn ngang; không lỗi JS ảnh hưởng thao tác
- [x] Ảnh chụp thật từ Chromium
- [x] Cập nhật docs + script duy trì kiểm thử
- [ ] URL preview HTTPS bền (GitHub Pages) — **cần admin bật Pages + hệ thống push nhánh**
- [ ] PR cập nhật / tiếp nối #6 — **hệ thống AAT commit/push** (agent không tự push)

## Giới hạn còn lại

- Agent **không** commit/push theo yêu cầu xưởng.
- GitHub Pages chưa công khai; không tuyên bố có link HTTPS bàn giao.
- Trang chủ đầy đủ / CMS Next.js → ngoài phạm vi lượt này.
