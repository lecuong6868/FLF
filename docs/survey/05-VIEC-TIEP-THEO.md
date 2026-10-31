# (5) Việc tiếp theo (~25 phút mỗi việc)

Mỗi việc đủ nhỏ để một phiên AAT ~25 phút. **Chưa** đánh dấu hoàn thành/nghiệm thu Preview song ngữ.

| # | Việc (~25 phút) | Đầu ra mong đợi | Phụ thuộc anh/khách |
|---|-----------------|-----------------|---------------------|
| 1 | Chốt cây thư mục `vi/` + `en/` trên Preview B (copy khung từ PR #11) | Sơ đồ file + 1 trang home VI & EN trống nội dung | Không |
| 2 | Thêm Language switch tương đối (giữ đúng trang) trên header home VI↔EN | Click EN/VI đổi được trên `file://` | Không |
| 3 | Dịch + gắn metadata (`title`, `description`, `lang`) cho home EN | Home EN đọc được offline | Duyệt tone EN |
| 4 | Nhân bản menu/footer/CTA shared content VI+EN (không API) | `content.vi.js` / `content.en.js` hoặc object `{vi,en}` | Không |
| 5 | Tạo trang `gioi-thieu` VI/EN theo khung nhu cầu + 1–2 câu đối tác luật | 2 HTML + link menu | Không |
| 6 | Tách 2–3 trang lĩnh vực VI/EN theo ma trận (mục 1–2 trước) | HTML + CTA riêng | Khách xác nhận tên lĩnh vực |
| 7 | Trang lĩnh vực “Tuân thủ & giấy phép” chỉ sau khi khách xác nhận | HTML hoặc ghi “tạm ẩn” | **Khách** |
| 8 | Form liên hệ minh họa + checkbox NĐ 13 VI/EN (không gửi giả) | UI + copy pháp lý cơ bản | Luật sư/đối tác duyệt copy NĐ 13 |
| 9 | Trang chính sách bảo mật VI/EN khung | HTML draft | Khách duyệt |
| 10 | Kiểm thử `file://`: menu, footer, CTA, form, metadata ở 390 & 1440 (VI và EN) | Biên bản + ảnh | Không |
| 11 | Đóng gói lại `FLF-preview.zip` (tài nguyên local, README mở offline) | ZIP + `KIEM-TRA-OFFLINE` | Không |
| 12 | Anh xác nhận địa chỉ/SĐT hiển thị công khai (MST vs web cũ) | Cập nhật `COMPANY_VERIFICATION` | **Anh/khách** |
| 13 | Anh gửi danh sách đối tác pháp lý được phép nêu tên | Trang đối tác hoặc giữ placeholder | **Anh/khách** |
| 14 | Anh chọn hướng UI A / B / A+chi tiết B (tài liệu đề xuất cũ) | 1 quyết định ghi nhận | **Anh** |
| 15 | Rà WordPress/Hygraph: liệt kê bài blog/case cần redirect 301 | Bảng URL cũ → mới | Có thể cần export CMS |
| 16 | Chuẩn bị (không nộp) checklist hồ sơ app Facebook/LinkedIn giai đoạn 2 | Checklist | Quyền admin Page |

## Thứ tự gợi ý 4 phiên tới

1. Việc **1 → 2 → 3 → 4** (nền tảng song ngữ offline).  
2. Việc **5 → 6 → 10** (nội dung + kiểm thử).  
3. Việc **8 → 9 → 11** (form/pháp lý khung + đóng gói).  
4. Việc **12 → 13 → 14** (chờ anh) song song **15**.

## Ngoài phạm vi các việc trên

- Không đổi hosting / production flf.vn.  
- Không xử lý lại link ZIP cũ (PR #12–#14).  
- Không bật AI đăng bài / chatbot (giai đoạn 2–3).  
- Không commit/push từ agent khách nếu hệ thống AAT tự xử lý — tuân theo quy trình repo.
