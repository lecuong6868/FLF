# URL preview chính & bàn giao

## Trạng thái xác minh (2026-10-30 — tiếp nối PR #9)

| Mục | Giá trị |
|-----|---------|
| Menu kế thừa | Commit `c8364c5` · [PR #7](https://github.com/lecuong6868/FLF/pull/7) |
| Docs/verify | Commit `0ca02c7` · [PR #8](https://github.com/lecuong6868/FLF/pull/8) |
| Bản Pages gần nhất trên nhánh xưởng | Commit `7e2bacc` · [PR #9](https://github.com/lecuong6868/FLF/pull/9) |
| GitHub Pages URL | `https://lecuong6868.github.io/FLF/` — **HTTP 404** (xác minh lại 2026-10-30) |
| Settings → Pages (ảnh khách) | Source = **GitHub Actions** |
| Workflow Preview Pages gần nhất (nhánh `aat/**`) | [run 40982695731](https://github.com/lecuong6868/FLF/actions/runs/40982695731) · build **OK** · deploy **fail** (env chỉ `main`) |
| CI menu | [run 40982700186](https://github.com/lecuong6868/FLF/actions/runs/40982700186) **success** |
| Environment `github-pages` | Chỉ **`main`** — **giữ nguyên** (không thêm `aat/**`) |
| Token agent | `GH_TOKEN` **rỗng** — không merge vào `main`, không `workflow_dispatch` |

**Chưa có URL HTTPS công khai đã kiểm chứng HTTP 200** — không tuyên bố đã có preview.

## Điểm chặn (lượt này)

Deploy từ nhánh `aat/**` **không** thể thành công khi environment chỉ cho `main`. Đường đúng:

1. Merge source preview/menu đã PASS vào **`main`**.  
2. Để workflow Preview Pages chạy trên `main` (hoặc Run workflow chọn `main`).  
3. Xác minh `https://lecuong6868.github.io/FLF/` trả **200** và menu phương án B.

Agent hiện thiếu `GH_TOKEN` có quyền Contents/PR/Actions write — không tự merge được. Chi tiết quyền: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).

## Cách xác minh khi URL đã lên

```bash
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu
```

Giữ `robots.txt` + meta `noindex` + banner «Bản thiết kế chờ duyệt». **Không** sửa DNS / website flf.vn.
