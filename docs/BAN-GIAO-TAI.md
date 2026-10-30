# Bàn giao tải — FLF-preview.zip

Ngày xác minh: **2026-10-30** (lượt tiếp PR #11).

## Báo cáo thực tế PR #11

| Hạng mục | Thực tế |
|----------|---------|
| PR | https://github.com/lecuong6868/FLF/pull/11 — **open** |
| Tiêu đề | AAT xưởng: FLF: đóng gói HTML mở trực tiếp để xem thử |
| Head | `aat/20261030-154651` @ `15ed82c2bff89c9a3635dfd53568d2cdf83147f2` |
| Base | `main` |
| Gói trong commit | Có — `FLF-preview.zip` (2 436 515 byte) + thư mục `FLF-preview/` phương án B |
| Kiểm thử trong PR | Báo **17/17 PASS** offline; form chỉ minh họa |

Không dựng lại website; tận dụng gói đã có trên commit trên.

## Link tải ổn định (đã tải thử)

```
https://raw.githubusercontent.com/lecuong6868/FLF/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip
```

Dự phòng (302 → cùng raw URL):

```
https://github.com/lecuong6868/FLF/raw/15ed82c2bff89c9a3635dfd53568d2cdf83147f2/FLF-preview.zip
```

URL nhánh (cùng tệp, kém ổn định hơn SHA):

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-154651/FLF-preview.zip
```

## Bằng chứng tải HTTP

| Kiểm tra | Kết quả |
|----------|---------|
| HTTP status | **200** |
| `Content-Type` | `application/zip` |
| Bytes tải | **2436515** |
| Magic header | `50 4B 03 04` (`PK\x03\x04`) |
| MD5 khớp workspace | `b9075516a277363aa2d82dde487d45d6` |
| Giải nén | OK — 27 entry; có `FLF-preview/index.html`, `option-b/`, logo, font Noto |

## Kiểm thử sau giải nén (`file://`)

Nguồn: đúng ZIP vừa tải từ URL trên → giải nén → `npm run verify:offline`.

**17/17 PASS**, gồm:

- Logo / CSS header / nav desktop  
- Dropdown Chuyên mục 5 chủ đề  
- Link Tin tức dùng `…/index.html`  
- Mobile 390: mở menu, backdrop, Escape đóng  
- Liên hệ: hiện *«Minh họa giao diện — chưa có backend. Yêu cầu liên hệ chưa được gửi. Không có thông báo gửi thành công giả.»*  
- Không lỗi console  

Ảnh: `mockups/offline/B-*-file.png`, `FLF-preview/screenshots/`.

## Anh cần làm tiếp

1. Gửi khách **URL raw theo SHA** ở trên (không gửi link trang PR).  
2. Nhờ khách giải nén và mở `FLF-preview/index.html` để duyệt phương án B.  
3. Sau khi chốt giao diện: merge PR #11 (hoặc tương đương) vào `main` nếu muốn bản sao trên `main`; cấp quyền DNS / Pages khi làm HTTPS.  
4. Giai đoạn sau: CMS (Next.js + Payload), MXH, AI — ngoài phạm vi gói offline.  
