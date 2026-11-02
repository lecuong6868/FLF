# Nghiệm thu Preview — trang Giới thiệu / About VI–EN (2026-10-31)

## Phạm vi đã hoàn thành

- Trang chủ VI/EN (kế thừa PR #16 / bàn giao PR #17).
- **Mới:** trang Giới thiệu `FLF-preview/vi/gioi-thieu/index.html` và About `FLF-preview/en/about/index.html`.
- Menu trang chủ trỏ tới trang Giới thiệu / About; chuyển **VI | EN** trên trang Giới thiệu giữ đúng cặp About.
- Nội dung: nhu cầu khách, tiếp nhận vấn đề, phạm vi, đầu ra; hợp tác công ty luật 1–2 câu; không bịa chứng nhận/thành tích; giữ logo; địa chỉ chờ xác nhận; MST `0314193708`.
- Form liên hệ vẫn chỉ trên trang chủ (minh họa, không gửi / không báo thành công giả).

**Không** tuyên bố toàn site đã song ngữ hay sẵn sàng production. **Không** merge / thay flf.vn đang chạy.

## Kiểm thử đã chạy

| Kiểm tra | Kết quả |
|----------|---------|
| `npm run verify:home` | PASS (37) |
| `npm run verify:about` | PASS (34) |
| Đóng gói `npm run pack:offline` + giải nén smoke | PASS |
| Roundtrip liên kết VI About → EN About → VI (resolve đường dẫn tương đối) | PASS |
| Asset cục bộ từ trang Giới thiệu | PASS |
| Chụp trình duyệt 390px / 1440px (Playwright) | **CHƯA CHẠY** — Chromium thiếu `libglib-2.0.so.0`, môi trường không có quyền `sudo apt` |

Bằng chứng cấu trúc: `FLF-preview/screenshots/about-20261031/capture-results.json`.  
Ảnh viewport trang chủ từ phiên trước vẫn nằm tại `FLF-preview/screenshots/home-20261031/` (không tái chụp được trên máy này).

## Gói ZIP

| Trường | Giá trị |
|--------|---------|
| File | `FLF-preview.zip` |
| Kích thước | xem SHA sau khi pack lần cuối trong workspace |
| SHA-256 | cập nhật trong `BAN-GIAO.md` / JSON kèm theo |

URL tải công khai theo **tên nhánh** sau khi hệ thống push (không dùng ZIP cũ PR #11).

## Việc anh / khách cần làm tiếp

1. Mở `FLF-preview/vi/gioi-thieu/index.html` và `en/about/index.html` trên máy anh (390 & 1440) vì máy build chưa chụp được.
2. Chốt địa chỉ/SĐT hiển thị; duyệt tên đối tác pháp lý nếu cần nêu.
3. Sau push: tải thử raw/jsDelivr không đăng nhập, gửi khách link + SHA-256.
4. Việc sau: song ngữ Tin tức / Quy định / Chuyên mục; rồi CMS / MXH / AI.
