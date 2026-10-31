# FLF — Bản xem thử offline (VI / EN)

## Cách mở (không cần cài đặt)

1. Giải nén `FLF-preview.zip` (nếu nhận gói ZIP).
2. Mở file `index.html` bằng Chrome / Edge / Firefox.
3. Hoặc mở trực tiếp:
   - `vi/index.html` — trang chủ tiếng Việt
   - `en/index.html` — trang chủ tiếng Anh
   - `vi/gioi-thieu/index.html` — Giới thiệu (VI)
   - `en/about/index.html` — About (EN)
   - `vi/quy-dinh-moi/index.html` — Quy định mới (VI)
   - `en/regulations/index.html` — New regulations (EN)
   - `vi/chuyen-muc/index.html` — Chuyên mục (VI)
   - `en/topics/index.html` — Topics (EN)
4. Nút **VI | EN** trên header/footer dẫn tới trang đối ứng bằng đường dẫn tương đối — hoạt động khi không có mạng (`file://`).

Không cần Node, Python hay server để xem Preview offline này.

Khi đã deploy GitHub Pages từ `main`, cùng nội dung phục vụ dưới base path `/FLF/`
(ví dụ `https://lecuong6868.github.io/FLF/vi/`). Đường dẫn tương đối giữ nguyên offline và trên Pages.

## Cấu trúc gói

| Đường dẫn | Nội dung |
|-----------|----------|
| `index.html` | Điểm vào → chọn / chuyển tới `vi/` |
| `vi/` · `en/` | Cây trang song ngữ |
| `vi/quy-dinh-moi/` · `en/regulations/` | Quy định mới (danh sách trống + mẫu bố cục) |
| `vi/chuyen-muc/` · `en/topics/` | Chuyên mục / Topics |
| `assets/` | CSS + JS menu/form/lọc chuyên mục (cục bộ) |
| `public/brand/` | Logo khách (giữ nguyên) |
| `public/fonts/` | Font local (offline) |
| `option-b/` | Mockup VI cũ (tham khảo) — menu chính dùng cây `vi/`/`en/` |
| `docs/` | Xác minh công ty + biên bản |
| `screenshots/` | Ảnh kiểm tra 390px / 1440px (các lượt trước) |

## Phạm vi phiên này

- Đã làm: trang chủ; Giới thiệu/About; **Quy định mới** + **Chuyên mục** VI/EN; menu đồng bộ; chuyển ngữ giữ đúng trang; quy định chưa xác minh → trạng thái trống rõ ràng.
- Chưa làm: Dashboard CMS thật; AI; MXH; chatbot; Tin tức song ngữ đầy đủ.

## Lưu ý

- Đây là **bản thiết kế chờ duyệt**, không phải website chính thức [flf.vn](https://www.flf.vn).
- Không bịa số liệu, chứng nhận, khách hàng hay địa chỉ chưa xác nhận.
- MST đã xác minh: `0314193708`. Địa chỉ hiển thị công khai: chờ khách chốt.
