# Bàn giao phiên trang chủ VI/EN

## Đường dẫn trang đã sửa

| Trang | Đường dẫn trong repo / ZIP |
|-------|----------------------------|
| Điểm vào | `FLF-preview/index.html` |
| Trang chủ VI | `FLF-preview/vi/index.html` |
| Trang chủ EN | `FLF-preview/en/index.html` |
| CSS/JS | `FLF-preview/assets/styles.css`, `FLF-preview/assets/home.js` |

## Bằng chứng kiểm tra

- Biên bản: `docs/acceptance/NGHIEM-THU-TRANG-CHU-20261031.md`
- Ảnh 390/1440: `FLF-preview/screenshots/home-20261031/`
- Kết quả máy: `FLF-preview/screenshots/home-20261031/capture-results.json`
- Script: `npm run verify:home`, `npm run capture:home` (cần Playwright + `source scripts/browser-env.sh`)

## ZIP

- File trong repo: `FLF-preview.zip` (~4,4 MB)
- Đã giải nén và kiểm tra lại chuyển VI↔EN từ gói ZIP: **OK**

## URL tải công khai

**Chưa xác minh được tải công khai** tại thời điểm bàn giao (HTTP 404 trên raw GitHub theo nhánh `aat/20261031-112548`). Sau khi hệ thống push/PR, anh kiểm tra lại URL theo **tên nhánh đầy đủ** (không dùng SHA bị che), ví dụ:

`https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261031-112548/FLF-preview.zip`

Chỉ báo “tải được” khi HTTP GET công khai trả 200.
