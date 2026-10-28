# URL preview chính & bàn giao

## Trạng thái URL HTTPS công khai

| Mục | Giá trị |
|-----|---------|
| Tunnel trycloudflare phiên trước | **Không còn mặc định hoạt động** — quick tunnel tạm, không xác minh lại được ở lượt này |
| GitHub Pages bền | `https://lecuong6868.github.io/FLF/` — **chỉ khi** admin bật Pages (Source = GitHub Actions) |
| Xem ngay trên máy | `python3 -m http.server 4173` → http://127.0.0.1:4173/ |

**Không báo đã có link HTTPS công khai** cho đến khi Pages được bật hoặc tunnel mới được xác minh bằng HTTP 200.

## Cách duyệt nhanh (local hoặc Pages)

1. Desktop (~1440px) và cửa sổ hẹp (~390px) — kiểm tra menu không tràn ngang.
2. Banner «Bản thiết kế chờ duyệt» + `noindex`.
3. Mở **Tin tức / Quy định mới / Chuyên mục** (A và B): danh sách, bài mẫu, bộ lọc minh họa, trạng thái rỗng, quay lại danh sách.
4. Quy định mới: metadata số hiệu / cơ quan / hiệu lực / nguồn / người duyệt + nhãn dự thảo / chưa hiệu lực / đang hiệu lực.
5. Đọc sơ đồ trang + flow nguồn → AI nháp → duyệt → web → MXH.
6. Bảng «minh họa vs đã hoạt động» — AI/MXH/CMS **chưa** chạy.

## Bằng chứng kiểm tra (lượt 2026-10-28)

| Hạng mục | Kết quả |
|----------|---------|
| `node scripts/check-pages.mjs` | Xem `docs/KIEM-TRA.md` |
| Serve local `python3 -m http.server 4173` | Chạy trong phiên agent |
| GitHub Pages | Chưa xác minh — cần admin bật Source = GitHub Actions |
| Tunnel Cloudflare mới | Không tạo / không gắn làm URL chính (tránh báo link chết) |

## Quyền còn thiếu

| Thiếu | Chi tiết |
|-------|----------|
| Admin bật Pages | Settings → Pages → Source = **GitHub Actions** |
| Push từ agent | Hệ thống AAT commit/push; agent không tự push |

## PR chứa thay đổi

Nhánh làm việc hiện tại do hệ thống AAT tạo PR. Gắn hướng dẫn local + mục Pages vào mô tả PR; **không** gắn URL tunnel cũ.
