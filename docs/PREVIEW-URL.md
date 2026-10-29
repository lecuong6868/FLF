# URL preview chính & bàn giao

## Trạng thái xác minh (2026-10-29 — tiếp nối PR #7)

| Mục | Giá trị |
|-----|---------|
| Commit PR #7 | `c8364c5` · nhánh `aat/20261029-132653` · [PR #7](https://github.com/lecuong6868/FLF/pull/7) |
| GitHub Pages (URL bền, ưu tiên) | `https://lecuong6868.github.io/FLF/` — **HTTP 404** (xác minh lại lượt này). Pages **chưa** bật. |
| Workflow Preview Pages | Job **build** thành công; job **deploy** thất bại với: *Ensure GitHub Pages has been enabled* ([run 40829931244](https://github.com/lecuong6868/FLF/actions/runs/40829931244)) |
| CI menu test trên cùng commit | **success** ([run 40829936322](https://github.com/lecuong6868/FLF/actions/runs/40829936322)) |
| CDN công cộng (jsDelivr…) | File tải được nhưng HTML `text/plain` — **không** dùng làm preview trình duyệt |
| Tunnel / hosting trả phí | **Không** dùng |
| Xem ngay trên máy | `python3 -m http.server 4173` → http://127.0.0.1:4173/option-b/ |

**Không báo đã có link HTTPS công khai** — chưa xác minh HTTP 200 trên URL bàn giao.

## Cách duy trì preview (GitHub Pages)

1. **Admin** repo `lecuong6868/FLF`: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
2. Đảm bảo workflow [`.github/workflows/preview-pages.yml`](../.github/workflows/preview-pages.yml) chạy trên nhánh `aat/**` hoặc `main` (sau khi hệ thống AAT push).
3. **Actions → Preview Pages** → job `deploy` thành công; URL environment `github-pages`.
4. Xác minh không đăng nhập:

```bash
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run test:menu
```

5. Giữ `robots.txt` + meta `noindex` + banner «Bản thiết kế chờ duyệt». **Không** sửa DNS / website flf.vn.

Chi tiết cấu hình review qua PR: [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).

## Quyền / kết nối còn thiếu

| Thiếu | Chi tiết |
|-------|----------|
| Admin bật Pages | Settings → Pages → Source = **GitHub Actions** (một lần) |
| Token agent | `GH_TOKEN` môi trường xưởng **rỗng** / không đủ quyền enable Pages — **không** lặp thử API enable |
| Push từ agent | Hệ thống AAT commit/push; agent không tự push theo yêu cầu xưởng |
| Hosting thay thế đã cấp quyền | Không có (VPS chưa đồng ý; Surge/Netlify chưa có token; Origin/Cursor share tắt trên cloud) |

## PR chứa thay đổi

Tiếp nối **PR #7** (`https://github.com/lecuong6868/FLF/pull/7`). Nhánh do hệ thống AAT tạo/cập nhật; **không** tự merge. Gắn hướng dẫn local + mục Pages vào mô tả PR; **không** gắn URL chưa xác minh.
