# URL preview chính & bàn giao

## Trạng thái xác minh (2026-10-30 — tiếp nối PR #8)

| Mục | Giá trị |
|-----|---------|
| Menu kế thừa | Commit `c8364c5` · [PR #7](https://github.com/lecuong6868/FLF/pull/7) · nhánh `aat/20261029-132653` |
| Bản bàn giao Pages | Commit `0ca02c7` · [PR #8](https://github.com/lecuong6868/FLF/pull/8) · nhánh `aat/20261029-145123` |
| GitHub Pages URL | `https://lecuong6868.github.io/FLF/` — **HTTP 404** (xác minh lại 2026-10-30) |
| `has_pages` (API repo) | **true** |
| Settings → Pages (ảnh khách) | Source = **GitHub Actions** — `.aat/files/Screenshot_2026-10-29_at_19.00.38.png`, `…19.03.09.png` (sau lượt deploy lỗi) |
| Workflow Preview Pages gần nhất | [run 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) · build **OK** · deploy **fail** · *Failed to create deployment (status: 404)… Ensure GitHub Pages has been enabled* · commit `0ca02c7` (trước ảnh Settings) |
| CI menu | [run 40838837019](https://github.com/lecuong6868/FLF/actions/runs/40838837019) **success** trên `0ca02c7` |
| Environment `github-pages` | Có; **Deployment branches** chỉ liệt kê **`main`** (API) — nhánh `aat/**` chưa được thêm |
| Token agent | `GH_TOKEN` **rỗng** — không re-run workflow / không sửa environment qua API |

**Chưa có URL HTTPS công khai đã kiểm chứng HTTP 200** — không tuyên bố đã có preview.

## Điểm chặn đã xác minh (không hỏi lại Source Pages)

1. **Re-run sau khi Source = GitHub Actions:** lượt deploy lỗi gần nhất chạy *trước* ảnh Settings khách gửi. Cần một lượt Preview Pages mới (Re-run hoặc push `aat/**`). Agent không có `GH_TOKEN` để tự re-run.
2. **Deployment branches:** Settings → Environments → `github-pages` → thêm pattern **`aat/**`** (hiện chỉ `main`). Nếu thiếu, deploy từ nhánh xưởng có thể tiếp tục thất bại dù Pages Source đúng.

Thao tác duy nhất ưu tiên: mở https://github.com/lecuong6868/FLF/settings/environments → `github-pages` → Deployment branches → thêm `aat/**` → Actions → [Preview Pages run 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) → **Re-run failed jobs** (hoặc chờ hệ thống AAT push nhánh mới).

## Cách xác minh khi URL đã lên

```bash
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu
```

Giữ `robots.txt` + meta `noindex` + banner «Bản thiết kế chờ duyệt». **Không** sửa DNS / website flf.vn.

Chi tiết: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).
