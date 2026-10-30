# Biên bản kiểm tra

Ngày: **2026-10-30** (tiếp nối PR #8 — xác minh Pages sau ảnh Settings)

Commit menu: **`c8364c5`** ([PR #7](https://github.com/lecuong6868/FLF/pull/7)).  
Commit Pages/docs nền: **`0ca02c7`** ([PR #8](https://github.com/lecuong6868/FLF/pull/8)).  
Cập nhật workflow/docs lượt này trên nhánh AAT hiện tại (chưa merge).

## Phạm vi

Preview tĩnh — header/menu desktop & mobile phương án B. **Không** CMS/AI/MXH. **Không** nghiệm thu trang chủ hoàn chỉnh. **Không** merge PR chỉ để deploy.

## Đã xác minh lại (không mặc định kết quả cũ)

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| PR #7 / #8 | GitHub API | **open** · #7 `c8364c5` · #8 `0ca02c7` |
| Settings → Pages (ảnh khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` | Source = **GitHub Actions** — không yêu cầu bật lại |
| Repo `has_pages` | API | **true** |
| Environment `github-pages` branch policy | API deployment-branch-policies | chỉ **`main`** — thiếu `aat/**` |
| Workflow Preview Pages | [run 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) | **build success** · **deploy failure** · *Ensure GitHub Pages has been enabled* (lượt chạy *trước* ảnh Settings) |
| CI Browser menu test | [run 40838837019](https://github.com/lecuong6868/FLF/actions/runs/40838837019) | **success** trên `0ca02c7` |
| GitHub Pages URL | `curl` `https://lecuong6868.github.io/FLF/` | **HTTP 404** |
| `GH_TOKEN` agent | env | **rỗng** — không re-run / không sửa environment |
| Kiểm tra tĩnh local | `npm run check` | **PASS** |
| Kiểm thử trình duyệt local | `FLF_TEST_PORT=4177 npm run test:menu` | **PASS 37/37** — `docs/KIEM-TRA-TRINH-DUYET.json` |
| Xác minh URL remote | `npm run verify:preview` | **CHƯA ĐẠT** — 12/12 đường dẫn HTTP 404 · `docs/KIEM-TRA-PAGES-REMOTE.json` |
| Kiểm thử menu trên URL HTTPS | `FLF_BASE_URL=… npm run test:menu` | **Chưa chạy** — không có URL 200 |

## Tiêu chí lượt này

- [x] Đọc TASK + bàn giao + PR #8 + workflow; xác định commit menu (`c8364c5`) / Pages (`0ca02c7`)
- [x] Kiểm tra Pages / environment / Actions (không yêu cầu bật lại Source)
- [x] Không merge PR chỉ để kích hoạt deploy; không lặp thử token thiếu quyền
- [x] Cập nhật workflow diagnostics + docs điểm chặn
- [ ] Re-run Preview Pages đến kết quả cuối — **chặn: thiếu `GH_TOKEN`**
- [ ] URL HTTPS 200 + CSS/JS/ảnh dưới `/FLF/` — **phụ thuộc deploy**
- [ ] `test:menu` trên URL remote — **phụ thuộc URL trên**

## Giới hạn còn lại

- **Chưa xuất bản** preview HTTPS bền; **không** gửi link chưa xác minh.
- Thao tác admin: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md) (thêm `aat/**` + Re-run).
- Trang chủ đầy đủ / Next.js + Payload → ngoài phạm vi.
