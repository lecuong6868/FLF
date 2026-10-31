# Nghiệm thu trang chủ Preview VI/EN — 2026-10-31

**Nhánh:** `aat/20261031-112548`  
**Phạm vi báo hoàn thành:** trang chủ + chuyển ngôn ngữ trang chủ (theo TASK).  
**Nguồn Preview gốc:** PR #11 (`aat/20261030-154651`, `FLF-preview/`).  
**Khảo sát tham chiếu:** PR #15 → `docs/survey/`.

## Đã đạt

| Hạng mục | Kết quả |
|----------|---------|
| HTML dựng sẵn `vi/index.html`, `en/index.html` | Đạt |
| `index.html` điểm vào | Đạt (chọn VI/EN hoặc refresh → VI) |
| Nội dung mới: hero, giới thiệu, lĩnh vực, quy trình, vì sao chọn, CTA | Đạt |
| Hợp tác công ty luật chỉ 1–2 câu trong giới thiệu | Đạt |
| Không bịa số liệu / chứng nhận / khách hàng / địa chỉ suy đoán | Đạt (MST 0314193708; địa chỉ chờ xác nhận) |
| Logo khách giữ nguyên | Đạt |
| Chuyển VI↔EN bằng liên kết tương đối, không API / localStorage / fetch | Đạt |
| Form Preview: không gửi; không báo gửi thành công giả | Đạt |
| Menu / footer / CTA / metadata song ngữ trên trang chủ | Đạt |
| Không tự nhận trang Tin tức / Quy định / Chuyên mục đã có EN | Đạt (EN không link option-b như bản EN) |
| Kiểm thử cấu trúc `npm run verify:home` | **35/35 PASS** |
| Kiểm thử trình duyệt `file://` 390 & 1440 (VI + EN) | **PASS** — xem ảnh + `capture-results.json` |
| Không tràn ngang; không lỗi JS console | Đạt |
| Menu mobile mở/đóng | Đạt (ảnh `*-390-menu-open.png`) |
| Roundtrip VI→EN→VI trên `file://` | Đạt |
| `FLF-preview.zip` đóng gói + giải nén kiểm tra lại | Đạt (script `pack:offline`) |

## Ảnh kiểm tra

Thư mục: `FLF-preview/screenshots/home-20261031/`

- `vi-home-1440.png`, `vi-home-390.png`, `vi-home-390-menu-open.png`
- `en-home-1440.png`, `en-home-390.png`, `en-home-390-menu-open.png`
- `capture-results.json`

## Còn lại (ngoài phạm vi phiên này)

1. Song ngữ các trang `option-b` (Tin tức / Quy định mới / Chuyên mục).
2. Trang Giới thiệu / Lĩnh vực / Liên hệ / Chính sách bảo mật tách URL theo sitemap khảo sát.
3. Khách chốt địa chỉ/SĐT hiển thị, danh sách đối tác pháp lý được nêu tên, xác nhận nhóm “Tuân thủ & giấy phép”.
4. CMS Next.js + Payload, MXH, AI — giai đoạn sau.
5. **URL tải ZIP công khai:** chưa xác minh được tải công khai từ remote (nhánh làm việc chưa được hệ thống push tại thời điểm viết biên bản). Sau khi push/PR, URL dạng raw/jsDelivr theo **tên nhánh đầy đủ** `aat/20261031-112548` (không dùng SHA bị che) cần kiểm tra lại bằng HTTP GET công khai trước khi báo “tải được”.

## Cách mở nhanh

Giải nén `FLF-preview.zip` → mở `index.html` hoặc `vi/index.html` / `en/index.html`.
