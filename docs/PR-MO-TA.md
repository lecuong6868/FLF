# Gợi ý mô tả Pull Request (dán vào PR tiếp nối #6)

## Summary

- Tiếp nối **PR #6** (`4ff2ffe`): kiểm thử trình duyệt thật header/menu phương án B (desktop 1440 + mobile 390).
- **Sửa bug:** backdrop mobile che panel → không click được accordion Chuyên mục / link (z-index option-b & option-a).
- Thêm `npm run test:menu` (37 ca), bootstrap libs Chromium không sudo, workflow CI `browser-menu-test.yml`.
- Cập nhật ảnh DOM thật + `docs/KIEM-TRA.md` / `PREVIEW-URL.md`. **Chưa** bật được GitHub Pages (cần admin).

## Test plan

- [x] `npm run check` → PASS
- [x] `source scripts/browser-env.sh && npm run test:menu` → PASS 37/37
- [x] Desktop: dropdown Chuyên mục, 5 `chu-de`, Escape, không tràn ngang
- [x] Mobile: mở/đóng, backdrop, Escape, focus trap, trả focus, accordion 5 chủ đề
- [ ] Admin: Settings → Pages → Source = GitHub Actions → xác minh `https://lecuong6868.github.io/FLF/` HTTP 200
- [ ] Không merge cho đến khi Pages (hoặc hạ tầng HTTPS bền khác) được xác minh nếu đó là tiêu chí bàn giao

Chi tiết: [`BAN-GIAO-HEADER.md`](BAN-GIAO-HEADER.md) · [`KIEM-TRA.md`](KIEM-TRA.md) · [`KIEM-TRA-TRINH-DUYET.json`](KIEM-TRA-TRINH-DUYET.json) · [`PREVIEW-URL.md`](PREVIEW-URL.md)
