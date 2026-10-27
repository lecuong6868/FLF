# FLF — Bộ mockup duyệt UI/UX

Bộ **hai phương án trang chủ** (A / B) cùng nội dung tiếng Việt mẫu để khách chọn hướng giao diện trước khi phát triển tiếp website First Legal Force (`www.flf.vn`).

> Đây **không** phải bản khách đã chấp thuận. Lượt này **không** dựng lại backend/CMS, không merge/deploy production.

## Xem nhanh

| Đầu ra | Đường dẫn |
|--------|-----------|
| Trang so sánh | [`index.html`](index.html) |
| Phương án A (hiện đại, nền sáng) | [`option-a/`](option-a/) |
| Phương án B (trang trọng, biên tập) | [`option-b/`](option-b/) |
| 4 ảnh mockup PNG | [`mockups/`](mockups/) |
| Sơ đồ trang | [`docs/SO-DO-TRANG.md`](docs/SO-DO-TRANG.md) |
| Bản nháp trang dịch vụ | [`docs/NOI-DUNG-MAU.md`](docs/NOI-DUNG-MAU.md) |
| Đề xuất chọn hướng | [`docs/DE-XUAT-HUONG.md`](docs/DE-XUAT-HUONG.md) |
| Biên bản kiểm tra | [`docs/KIEM-TRA.md`](docs/KIEM-TRA.md) |

Logo gốc nằm ở `public/brand/` (sao chép từ tài nguyên đã gửi — không chỉnh sửa họa tiết).

## Cài đặt & chạy

Yêu cầu: **Node.js 18+** (khuyến nghị 22) hoặc chỉ cần **Python 3** nếu chỉ xem HTML.

### Cách 1 — Python (nhanh)

```bash
python3 -m http.server 4173
```

Mở: http://127.0.0.1:4173/

### Cách 2 — npm

```bash
npm install
npm start
```

Mở: http://127.0.0.1:4173/

### Tạo / cập nhật 4 mockup PNG

Cách khuyến nghị trên máy không đủ dependency Chromium:

```bash
npm run render:mockups
```

Ảnh ghi vào `mockups/A-desktop-1440.png`, `A-mobile-390.png`, `B-desktop-1440.png`, `B-mobile-390.png` (logo gốc + font Noto trong `public/fonts/`).

Nếu máy đã có đủ lib cho Playwright Chromium:

```bash
npm install
npx playwright install chromium
npm run capture
```

### Kiểm tra tĩnh

```bash
npm run check
```

## Hai phương án

- **A:** Tư vấn doanh nghiệp hiện đại, nhiều khoảng trắng, nền sáng, navy + đỏ theo logo.  
- **B:** Tư vấn trang trọng, typography điểm nhấn, navy chủ đạo, bố cục biên tập.

Cùng thông điệp: *FLF — Đồng hành cùng doanh nghiệp trong các vấn đề tư vấn đa lĩnh vực*. Phân biệt rõ phạm vi FLF và phần do đối tác hành nghề luật sư thực hiện. Nhóm lĩnh vực chưa xác minh được ghi là **nội dung đề xuất**.

## Giới hạn môi trường

- Preview hosting công khai phụ thuộc GitHub/PR sau khi hệ thống đẩy nhánh — khách mở PR là thấy ảnh PNG + link file HTML (xem gợi ý [`docs/PR-MO-TA.md`](docs/PR-MO-TA.md)).  
- Nếu chưa có URL preview sống, vẫn xem được ảnh trong `mockups/` và HTML trên GitHub (không bắt buộc chạy lệnh).  
- Máy xưởng thiếu lib Chromium (`libglib`) nên không chụp bằng Playwright; PNG được render bằng script Pillow bám đúng nội dung mockup.  
- Backend Next.js + Payload (PR giai đoạn 1) **không** nằm trong phạm vi lượt mockup này.

## Tham chiếu

- Site hiện tại: https://www.flf.vn  
- Fanpage: https://www.facebook.com/firstlegalforce  
- LinkedIn: https://www.linkedin.com/company/firstlegalforce/home/  
- Khung giai đoạn 1 (tham khảo, không merge ở lượt này): https://github.com/lecuong6868/FLF/pull/2
