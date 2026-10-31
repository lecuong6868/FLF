# Bàn giao — Quy định mới & Chuyên mục (VI/EN)

**Ngày:** 2026-10-31  
**Nguồn Preview nền:** PR #21 (`aat/20261031-162711`) — không dùng ZIP chỉ có trang chủ; không ghi đè Giới thiệu.  
**Phạm vi lượt này:** hai mục điều hướng **Quy định mới** / **Chuyên mục** + đồng bộ menu; **không** Dashboard / AI / MXH / chatbot.

## Danh sách tệp chính đã thêm / cập nhật

| Tệp / thư mục | Việc |
|---------------|------|
| `FLF-preview/vi/quy-dinh-moi/` | Danh sách trống + `cau-truc-mau.html` |
| `FLF-preview/en/regulations/` | `index.html` + `layout-sample.html` |
| `FLF-preview/vi/chuyen-muc/` | Danh sách nhóm + 3 bài minh họa |
| `FLF-preview/en/topics/` | Topics EN tương ứng |
| `FLF-preview/vi/index.html`, `en/index.html` | Menu + footer trỏ trang mới |
| `FLF-preview/vi/gioi-thieu/`, `en/about/` | Chỉ cập nhật nav (giữ nội dung) |
| `FLF-preview/assets/home.js` | Lọc chuyên mục cục bộ |
| `scripts/gen-bilingual-sections.mjs` | Generator trang section |
| `scripts/verify-sections-bilingual.mjs` | Kiểm thử tự động |
| `scripts/pack-offline-preview.mjs` | Đóng ZIP gồm section mới |
| `README.md`, `FLF-preview/README.md` | Hướng dẫn TIẾNG VIỆT |
| `docs/NEXT-DASHBOARD.md` | Đầu việc Dashboard thật |
| `FLF-preview.zip` | Gói offline (sau `npm run pack:offline`) |

## Kết quả kiểm thử

| Kiểm tra | Đã chạy thực tế? | Kết quả |
|----------|------------------|---------|
| `npm run verify:home` | **Có** | PASS 41 |
| `npm run verify:about` | **Có** | PASS 34 |
| `npm run verify:sections` | **Có** | PASS 126 |
| `npm run verify:basepath` (mô phỏng `/FLF/`) | **Có** | PASS — HTTP 200 các trang section mới |
| `npm run pack:offline` + smoke giải nén | **Có** | `FLF-preview.zip` ~4,41 MB · SHA-256 `3fa61786…d0ec4` |
| Mở `file://` tay (Chrome) toàn bộ menu | **Chưa** trong môi trường agent | Cần anh/khách xác nhận |
| Viewport 390px & 1440px (ảnh mới section) | **Chưa** chụp lại lượt này | Ảnh home/about cũ vẫn trong `screenshots/` |
| Bàn phím: Tab / Escape menu mobile | **Chưa** tay | Logic Escape / focus trap vẫn trong `home.js` |
| GitHub Pages HTTPS HTTP 200 | **Chưa** | Cần merge `main` + workflow; **không** gửi link Pages như đang hoạt động |

Ghi chú: chạy `npm run verify` và `npm run pack:offline` trong biên bản máy agent — xem output terminal đính kèm khi hệ thống push nhánh.

## Quy định nội dung

- Danh sách công khai **trống có chủ đích** (“Chưa có quy định đã xác minh” / “No verified regulations yet”).  
- Trang chi tiết chỉ là **bố cục trường** (số văn bản, cơ quan, ngày, trạng thái, tác động, nguồn) với giá trị `—` / “Chưa xác minh”.  
- Chuyên mục tái sử dụng bài minh họa nhu cầu DN — **không** bịa thành tích FLF.

## Việc anh cần làm tiếp

1. Xem Preview offline (`FLF-preview/index.html` hoặc ZIP) — thử VI/EN, menu Quy định mới & Chuyên mục.  
2. Xác nhận địa chỉ hiển thị công khai + SĐT footer.  
3. **Không** coi localStorage mock là Dashboard; bước sau làm CMS theo `docs/NEXT-DASHBOARD.md`.  
4. Khi cần HTTPS preview: merge vào `main` sau khi kiểm tra workflow Pages; chỉ gửi link khi đã GET HTTP 200 đúng nội dung.  
5. Chuẩn bị quyền DNS / VPS khi chuyển giai đoạn Next.js + Payload + PostgreSQL.
