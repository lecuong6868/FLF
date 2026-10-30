# Gợi ý mô tả Pull Request (dán vào PR tiếp nối PR #9)

## Summary

- Tiếp nối **PR #9** / kế thừa menu **PR #7** (`c8364c5`): đưa source preview/menu vào nhánh xưởng; **không** dựng lại CMS.
- Đổi workflow Preview Pages: chỉ chạy trên **`push`/`workflow_dispatch` nhánh `main`**; **giữ** environment `github-pages` chỉ cho `main` (không thêm `aat/**`).
- Local: `npm run check` PASS · `npm run test:menu` **37/37 PASS**.
- URL `https://lecuong6868.github.io/FLF/` vẫn **404** — agent **`GH_TOKEN` rỗng** nên chưa merge vào `main` / chưa `workflow_dispatch`.
- Sau khi merge PR này (hoặc #9 tương đương) vào **`main`**, Actions sẽ deploy; xác minh HTTPS 200 trước khi bàn giao link.

## Test plan

- [x] Quan hệ PR #7/#8/#9 · source menu `c8364c5`
- [x] `npm run check` → PASS
- [x] `source scripts/browser-env.sh && npm run test:menu` → PASS 37/37 (local)
- [ ] Merge vào `main` (cần quyền / `GH_TOKEN`)
- [ ] Preview Pages trên `main` → deploy xanh
- [ ] `https://lecuong6868.github.io/FLF/` HTTP 200
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`
- [ ] `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu`

Chi tiết: [`BAN-GIAO-HEADER.md`](BAN-GIAO-HEADER.md) · [`KIEM-TRA.md`](KIEM-TRA.md) · [`PREVIEW-URL.md`](PREVIEW-URL.md) · [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md)
