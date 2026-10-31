# Renew web FLF (www.flf.vn)

Dự án làm mới website First Legal Force: từ WordPress/SPA cũ sang nền tảng hiện đại (**Next.js + Payload CMS + PostgreSQL** — giai đoạn sau). Hiện tại repo tập trung **Preview HTML offline** song ngữ trang chủ.

## Xem Preview trang chủ (VI / EN) — không cần cài đặt

1. Giải nén `FLF-preview.zip` (nếu có) hoặc mở thư mục `FLF-preview/`.
2. Mở `FLF-preview/index.html` bằng trình duyệt (Chrome / Edge / Firefox).
3. Chọn **Tiếng Việt** hoặc **English**, hoặc dùng nút **VI | EN** trên trang chủ.
4. Kiểm tra offline: có thể mở qua `file://` — không cần mạng để đọc nội dung hay đổi ngôn ngữ.

| File | Mô tả |
|------|--------|
| `FLF-preview/vi/index.html` | Trang chủ tiếng Việt |
| `FLF-preview/en/index.html` | Trang chủ tiếng Anh |
| `docs/survey/` | Khảo sát + đặc tả (PR #15) |
| `docs/acceptance/` | Biên bản nghiệm thu phiên này |

## Chạy kiểm thử / đóng gói (tùy chọn, cần Node)

```bash
npm install
npm run verify:home      # kiểm tra cấu trúc trang chủ VI/EN
npm run pack:offline    # tạo lại FLF-preview.zip
npm run capture:home    # chụp 390px & 1440px (cần Playwright)
```

Máy chủ tĩnh tạm (không bắt buộc):

```bash
python3 -m http.server 4173
# rồi mở http://127.0.0.1:4173/FLF-preview/
```

## Kiến trúc đã chốt (không đổi trong Preview)

- Website triển khai sau này: Next.js + Payload CMS + PostgreSQL.
- Preview offline chỉ là HTML/CSS/JS cục bộ để duyệt nội dung & UI.

## Thông tin công ty đã xác minh

Xem `docs/COMPANY_VERIFICATION.md` — giữ logo; địa chỉ hiển thị công khai chờ khách xác nhận.

## Triển khai VPS (giai đoạn sau)

Xem `deploy/README.md`.
