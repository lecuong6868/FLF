# Nhận xét đề xuất chọn hướng UI

**Trạng thái:** Đề xuất của team để khách thảo luận — **chưa coi phương án nào đã được khách chấp thuận.**

## Tóm tắt hai hướng

| | Phương án A | Phương án B |
|---|---|---|
| Cảm giác | Tư vấn doanh nghiệp hiện đại, dễ đọc | Tư vấn trang trọng, biên tập rõ |
| Nền | Sáng, nhiều khoảng trắng | Xanh đen chủ đạo ở hero/footer |
| Typography | Source Serif 4 + Manrope | Libre Baskerville + Sora |
| Điểm mạnh | Quét nội dung nhanh, thân thiện SME | Thương hiệu “nặng ký”, phân tầng rõ |
| Rủi ro | Có thể bị xem là “ít cá tính” nếu không giữ hero đủ mạnh | Hero tối có thể cần ảnh/không khí thật khi làm production |

## Đề xuất team (để khách phản hồi)

**Ưu tiên phương án A làm hướng mặc định cho giai đoạn 1**, vì:

1. Phù hợp thông điệp “đồng hành doanh nghiệp” — sáng, rõ CTA, dễ mở rộng sang trang lĩnh vực.  
2. Dễ đạt Core Web Vitals / accessibility trên nền sáng (độ tương phản chữ–nền ổn định).  
3. Vẫn giữ đúng palette logo (navy `#003050`, đỏ `#a02020`) nên không lệch nhận diện.

**Giữ 1–2 chi tiết từ B** nếu khách thích cảm giác trang trọng hơn:

- Đánh số mục kiểu biên tập (`01 — …`) ở các trang nội dung dài.  
- Wordmark `First Legal Force` ở footer (file gốc đã gửi).  
- Hero có khối typography lớn hơn cho slogan thương hiệu.

## Câu hỏi cần khách trả lời

1. Chọn **A**, **B**, hay **A + vài chi tiết B**?  
2. Hero có được dùng ảnh văn phòng/đội ngũ thật sau này không (hiện mockup dùng logo gốc, không stock giả)?  
3. Danh sách lĩnh vực đề xuất: giữ / bỏ / đổi tên nhóm nào?  
4. Địa chỉ & SĐT hiển thị công khai (xem `COMPANY_VERIFICATION.md`).

## Tiếp theo sau khi khách chọn

- Áp hướng đã chọn vào template Next.js + Payload (repo/PR giai đoạn 1 đã có khung).  
- Không merge/deploy production chỉ dựa trên mockup này.
