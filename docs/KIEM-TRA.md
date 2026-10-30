# Biên bản kiểm tra

Ngày: **2026-10-30** (tiếp nối PR #9 — deploy qua `main`, giữ env chỉ `main`)

Commit menu: **`c8364c5`** ([PR #7](https://github.com/lecuong6868/FLF/pull/7)).  
Kế thừa Pages/docs: **`0ca02c7`** ([PR #8](https://github.com/lecuong6868/FLF/pull/8)) → **`7e2bacc`** ([PR #9](https://github.com/lecuong6868/FLF/pull/9)).  
Lượt này: source PR #9 + workflow chỉ deploy trên **`main`**.

## Phạm vi

Preview tĩnh — header/menu desktop & mobile phương án B. **Không** CMS/AI/MXH. **Không** đổi DNS flf.vn. **Không** bypass bảo vệ nhánh.

## Đã xác minh lại (không mặc định kết quả cũ)

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| PR #7 / #8 / #9 | GitHub API công khai | **open** · menu `c8364c5` · #8 `0ca02c7` · #9 `7e2bacc` |
| Settings → Pages (ảnh khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` | Source = **GitHub Actions** |
| Environment `github-pages` | API deployment-branch-policies | chỉ **`main`** — **giữ nguyên** |
| Workflow Preview Pages (nhánh `aat/**`) | [run 40982695731](https://github.com/lecuong6868/FLF/actions/runs/40982695731) | build **OK** · deploy **fail** (đúng vì env không cho `aat/**`) |
| CI Browser menu test | [run 40982700186](https://github.com/lecuong6868/FLF/actions/runs/40982700186) | **success** trên `7e2bacc` |
| GitHub Pages URL | `curl` / `npm run verify:preview` | **HTTP 404** · `docs/KIEM-TRA-PAGES-REMOTE.json` |
| `GH_TOKEN` / `GITHUB_TOKEN` | env | **rỗng** (len=0) — merge / `workflow_dispatch` → **HTTP 401** |
| Kiểm tra tĩnh local | `npm run check` | **PASS** |
| Kiểm thử trình duyệt local | `FLF_TEST_PORT=4177 npm run test:menu` | **PASS 37/37** — `docs/KIEM-TRA-TRINH-DUYET.json` |
| Kiểm thử menu trên URL HTTPS | `FLF_BASE_URL=… npm run test:menu` | **Chưa chạy** — không có URL 200 |

## Tiêu chí lượt này

- [x] Đọc TASK + quan hệ PR #7/#8/#9; xác định source menu (`c8364c5`)
- [x] Kiểm tra kết nối GitHub (token rỗng → dừng thao tác phụ thuộc)
- [x] Workflow deploy: `push`/`workflow_dispatch` trên **`main`**; giữ env chỉ `main`
- [x] Local `check` + `test:menu` 37/37
- [ ] Merge vào `main` — **chặn: thiếu `GH_TOKEN` (401)**
- [ ] Preview Pages trên `main` success — **phụ thuộc merge**
- [ ] URL HTTPS 200 + CSS/JS/ảnh dưới `/FLF/` — **phụ thuộc deploy**
- [ ] `test:menu` trên URL remote — **phụ thuộc URL trên**

## Giới hạn còn lại

- **Chưa xuất bản** preview HTTPS; **không** gửi link chưa xác minh.
- Thao tác admin: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md) (cấp token **hoặc** merge vào `main` + Run workflow).
- Trang chủ đầy đủ / Next.js + Payload → ngoài phạm vi.
