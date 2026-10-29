# URL preview chính & bàn giao

## Trạng thái URL HTTPS công khai (xác minh 2026-10-29)

| Mục | Giá trị |
|-----|---------|
| GitHub Pages (URL bền, ưu tiên) | `https://lecuong6868.github.io/FLF/` — **HTTP 404** tại thời điểm kiểm tra. Chưa bật Source = GitHub Actions hoặc chưa có deploy thành công. |
| Tunnel trycloudflare | **Không** gắn làm URL bàn giao chính (tạm, mất khi tiến trình xưởng kết thúc). |
| Xem ngay trên máy | `python3 -m http.server 4173` → http://127.0.0.1:4173/ · Phương án B: http://127.0.0.1:4173/option-b/ |

**Không báo đã có link HTTPS công khai** cho đến khi Pages trả HTTP 200 và menu tải được.

## Cách duy trì preview (GitHub Pages)

1. Admin repo `lecuong6868/FLF`: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
2. Đảm bảo workflow [`.github/workflows/preview-pages.yml`](../.github/workflows/preview-pages.yml) chạy trên nhánh `aat/**` hoặc `main` sau khi hệ thống AAT push.
3. Vào **Actions → Preview Pages** xem job `deploy` thành công; URL environment `github-pages`.
4. Kiểm tra công khai (không đăng nhập):
   - `curl -sI https://lecuong6868.github.io/FLF/` → 200
   - `curl -sI https://lecuong6868.github.io/FLF/option-b/` → 200
   - `curl -sI https://lecuong6868.github.io/FLF/public/brand/logo-color.png` → 200
5. Giữ `robots.txt` + meta `noindex` + banner «Bản thiết kế chờ duyệt». **Không** sửa DNS / website flf.vn đang chạy.

## Cách duyệt nhanh (local hoặc Pages)

1. Desktop (~1440px) và cửa sổ hẹp (~390px) — menu không tràn ngang.
2. Banner «Bản thiết kế chờ duyệt» + `noindex`.
3. Menu: Tin tức, Quy định mới, Chuyên mục → 5 chủ đề (`?chu-de=`).
4. Mobile: mở/đóng, backdrop, Escape, focus trả về nút Menu.
5. AI/MXH/CMS **chưa** chạy (chỉ minh họa).

## Quyền còn thiếu

| Thiếu | Chi tiết |
|-------|----------|
| Admin bật Pages | Settings → Pages → Source = **GitHub Actions** |
| Push từ agent | Hệ thống AAT commit/push; agent không tự push |
| Token API | Token môi trường agent **không** đủ quyền enable Pages (401) |

## PR chứa thay đổi

Tiếp nối **PR #6** (`https://github.com/lecuong6868/FLF/pull/6`). Nhánh làm việc do hệ thống AAT tạo/cập nhật PR; **không** tự merge. Gắn hướng dẫn local + mục Pages vào mô tả PR; **không** gắn URL tunnel tạm.
