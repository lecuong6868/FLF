# Gợi ý mô tả Pull Request (dán vào PR #8 hoặc PR tiếp nối)

## Summary

- Tiếp nối **PR #8** / kế thừa menu **PR #7** (`c8364c5`): xác minh lại GitHub Pages sau ảnh Settings (Source = GitHub Actions).
- URL `https://lecuong6868.github.io/FLF/` vẫn **404**. Deploy gần nhất ([run 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940)) fail *Ensure GitHub Pages has been enabled* — chạy **trước** ảnh Settings.
- Phát hiện environment `github-pages` chỉ cho phép nhánh **`main`**; cần thêm **`aat/**`**. Cập nhật workflow (configure-pages, `.nojekyll`, tóm tắt lỗi) + docs.
- Agent **`GH_TOKEN` rỗng** — không re-run Actions. **Không** yêu cầu bật lại Source Pages. **Không** merge chỉ để deploy.

## Test plan

- [x] Xác minh PR #7/#8 / commit / Actions / environment policy
- [x] `npm run check` → PASS
- [x] `source scripts/browser-env.sh && npm run test:menu` → PASS 37/37 (local)
- [ ] Admin: Environments → github-pages → Deployment branches thêm `aat/**`
- [ ] Re-run Preview Pages (hoặc AAT push `aat/**`) → deploy xanh
- [ ] `https://lecuong6868.github.io/FLF/` HTTP 200
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu`

Chi tiết: [`BAN-GIAO-HEADER.md`](BAN-GIAO-HEADER.md) · [`KIEM-TRA.md`](KIEM-TRA.md) · [`PREVIEW-URL.md`](PREVIEW-URL.md) · [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md)
