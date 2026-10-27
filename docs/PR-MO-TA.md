# Gợi ý mô tả Pull Request (dán vào PR)

## Summary

- Bộ mockup duyệt UI/UX hai hướng trang chủ FLF (A hiện đại nền sáng / B trang trọng biên tập), cùng nội dung tiếng Việt mẫu.
- 4 ảnh PNG desktop 1440 & mobile 390; sơ đồ trang; bản nháp trang dịch vụ; đề xuất chọn hướng (chưa phải chấp thuận của khách).
- Không dựng CMS/backend; logo gốc giữ nguyên.

## Xem mockup trên GitHub

Trang so sánh: [`index.html`](../index.html)

| | Desktop 1440 | Mobile 390 |
|---|---|---|
| **A** | ![](../mockups/A-desktop-1440.png) | ![](../mockups/A-mobile-390.png) |
| **B** | ![](../mockups/B-desktop-1440.png) | ![](../mockups/B-mobile-390.png) |

Hoặc mở file trực tiếp:

- [A desktop](../mockups/A-desktop-1440.png) · [A mobile](../mockups/A-mobile-390.png)
- [B desktop](../mockups/B-desktop-1440.png) · [B mobile](../mockups/B-mobile-390.png)
- [Mockup A tương tác](../option-a/) · [Mockup B tương tác](../option-b/)

## Tài liệu

- [Sơ đồ trang](SO-DO-TRANG.md)
- [Nội dung mẫu trang dịch vụ](NOI-DUNG-MAU.md)
- [Đề xuất chọn hướng](DE-XUAT-HUONG.md)
- [Biên bản kiểm tra](KIEM-TRA.md)

## Test plan

- [ ] Mở PR thấy 4 ảnh PNG tải được
- [ ] Mở `index.html` / `option-a` / `option-b` trên GitHub hoặc `python3 -m http.server 4173`
- [ ] Chữ Việt không lỗi; mobile không tràn ngang
- [ ] Khách chọn A / B / A+chi tiết B — chưa merge coi như đã duyệt UI
