# Bàn giao Preview — trang chủ + Giới thiệu VI/EN

## Đã làm trong việc này

1. Đọc PR #15 (khảo sát), #16 (trang chủ), #17 (bàn giao ZIP); dùng source mới nhất nhánh `aat/20261031-140556` / PR #17 — **không** dùng ZIP cũ PR #11.
2. Viết trang Giới thiệu VI + About EN (HTML dựng sẵn, cùng phong cách trang chủ).
3. Cập nhật menu trang chủ; chuyển ngữ giữ đúng trang Giới thiệu; `file://` không API / fetch / localStorage.
4. `npm run verify` PASS; đóng `FLF-preview.zip`; kiểm tra giải nén + liên kết/asset.
5. README tiếng Việt (repo + trong gói Preview).

## ZIP (trong workspace hiện tại)

| | |
|--|--|
| File | `FLF-preview.zip` |
| Kích thước | **4 599 098 bytes** (~4,39 MB) |
| SHA-256 | `84b4d8b7a5d61902432d1ac7cff258cb266a669d4aa8e7710f825ddf0ad8424f` |

URL gợi ý (thay `<nhánh>` bằng tên nhánh sau khi hệ thống push; agent **không** push):

- https://raw.githubusercontent.com/lecuong6868/FLF/\<nhánh\>/FLF-preview.zip
- https://cdn.jsdelivr.net/gh/lecuong6868/FLF@\<nhánh\>/FLF-preview.zip

Sau push: tải thử không đăng nhập (HTTP 200), đối chiếu SHA-256, rồi gửi khách.

## Chưa kiểm tra trên máy build

- Screenshot trình duyệt thật 390px / 1440px cho trang Giới thiệu (thiếu lib Chromium).
- URL tải công khai HTTP 200 theo nhánh hiện tại (chưa push từ agent — theo yêu cầu không commit/push).

## Phạm vi đúng

Chỉ **trang chủ + Giới thiệu** VI/EN. Chưa toàn site song ngữ; chưa production.
