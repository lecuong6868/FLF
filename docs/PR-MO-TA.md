# Gợi ý mô tả Pull Request (dán vào PR #7 hoặc PR tiếp nối)

## Summary

- Tiếp nối **PR #7** (`c8364c5`): xác minh lại trạng thái triển khai + chạy lại kiểm thử header/menu phương án B (desktop 1440 + mobile 390).
- Local: `npm run check` + `npm run test:menu` → **PASS 37/37**. CI *Browser menu test* trên cùng commit: **success**.
- Preview HTTPS: workflow *Preview Pages* **build OK / deploy FAIL** vì GitHub Pages chưa bật (URL vẫn 404). Thêm `verify:preview`, hỗ trợ `FLF_BASE_URL`, tài liệu [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).
- **Chưa** có URL HTTPS bàn giao đã xác minh. Agent **không** đủ quyền bật Pages.

## Test plan

- [x] Xác minh PR #7 / commit / Actions (không mặc định kết quả cũ)
- [x] `npm run check` → PASS
- [x] `source scripts/browser-env.sh && npm run test:menu` → PASS 37/37
- [x] Desktop: dropdown Chuyên mục, 5 `chu-de`, Escape, không tràn ngang
- [x] Mobile: mở/đóng, backdrop, Escape, focus trap, accordion 5 chủ đề
- [ ] Admin: Settings → Pages → Source = GitHub Actions → `https://lecuong6868.github.io/FLF/` HTTP 200
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu`
- [ ] Không merge chỉ vì “đã có mockup” nếu tiêu chí bàn giao yêu cầu URL HTTPS

Chi tiết: [`BAN-GIAO-HEADER.md`](BAN-GIAO-HEADER.md) · [`KIEM-TRA.md`](KIEM-TRA.md) · [`PREVIEW-URL.md`](PREVIEW-URL.md) · [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md)
