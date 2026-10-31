# FLF — Bản xem thử offline (trang chủ + Giới thiệu VI / EN)

## Cách mở (không cần cài đặt)

1. Giải nén `FLF-preview.zip` (nếu nhận gói ZIP).
2. Mở file `index.html` bằng Chrome / Edge / Firefox.
3. Hoặc mở trực tiếp:
   - `vi/index.html` — trang chủ tiếng Việt
   - `en/index.html` — trang chủ tiếng Anh
   - `vi/gioi-thieu/index.html` — Giới thiệu (VI)
   - `en/about/index.html` — About (EN)
4. Nút **VI | EN** trên header/footer dẫn tới trang đối ứng bằng đường dẫn tương đối — hoạt động khi không có mạng (`file://`). Trên trang Giới thiệu, chuyển ngữ vẫn giữ đúng trang About.

Không cần Node, Python hay server để xem Preview offline này.

Khi đã deploy GitHub Pages từ `main`, cùng nội dung phục vụ dưới base path `/FLF/`
(ví dụ `https://lecuong6868.github.io/FLF/vi/`). Đường dẫn tương đối giữ nguyên offline và trên Pages.

## Cấu trúc gói

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Điểm vào → chọn / chuyển tới `vi/` |
| `vi/index.html` | Trang chủ VI |
| `en/index.html` | Trang chủ EN |
| `vi/gioi-thieu/index.html` | Giới thiệu VI |
| `en/about/index.html` | About EN |
| `assets/` | CSS + JS menu/form (cục bộ) |
| `public/brand/` | Logo khách (giữ nguyên) |
| `public/fonts/` | Font local (offline) |
| `option-b/` | Trang mẫu VI cũ (Tin tức / Quy định / Chuyên mục) — **chưa** có bản EN |
| `docs/` | Xác minh công ty + biên bản nghiệm thu |
| `screenshots/` | Ảnh kiểm tra 390px / 1440px |

## Phạm vi phiên này

- Đã làm: trang chủ VI + EN; trang Giới thiệu / About VI + EN; chuyển ngôn ngữ offline giữ đúng trang; form liên hệ trên trang chủ minh họa (không báo gửi thành công giả).
- Chưa làm: song ngữ các trang Tin tức / Quy định / Chuyên mục / lĩnh vực riêng / CMS / AI / MXH.

## Lưu ý

- Đây là **bản thiết kế chờ duyệt**, không phải website chính thức [flf.vn](https://www.flf.vn).
- Không bịa số liệu, chứng nhận, khách hàng hay địa chỉ chưa xác nhận.
- MST đã xác minh: `0314193708`. Địa chỉ hiển thị công khai: chờ khách chốt.
