# Biên bản kiểm thử bản offline (file://)

Ngày: **2026-10-30**

## Gói bàn giao

| Hạng mục | Giá trị |
|----------|---------|
| File | `FLF-preview.zip` (2 436 515 byte ≈ 2,32 MB) |
| Commit / URL tải | `15ed82c` · xem `docs/BAN-GIAO-TAI.md` |
| Thư mục | `FLF-preview/` |
| Entry | `FLF-preview/index.html` → `option-b/index.html` |
| Script đóng gói | `npm run pack:offline` (`scripts/pack-offline-preview.mjs`) |

## Kết quả `file://`

Lệnh: `npm run verify:offline` → **17/17 PASS**

| Kiểm tra | Kết quả |
|----------|---------|
| CSS / header / logo tải đủ | PASS |
| Menu desktop + dropdown 5 chủ đề | PASS |
| Link Tin tức dùng `index.html` | PASS |
| Điều hướng trang con | PASS |
| Liên hệ: minh họa, không gửi thành công giả | PASS |
| Mobile 390: mở/đóng, backdrop, Escape | PASS |
| Lọc `?chu-de=` trên file:// | PASS |
| Không lỗi JS console | PASS |

## Ảnh chụp

- `mockups/offline/B-desktop-1440-file.png`
- `mockups/offline/B-mobile-390-file.png`
- `mockups/offline/B-mobile-390-menu-open-file.png`

## Kiểm thử bổ sung (HTTP local)

- `npm run check` — cấu trúc trang
- `npm run test:menu` — **37/37 PASS**

## Hạn chế còn lại

- Một số trình duyệt (Safari cũ) có thể hạn chế `history.replaceState` trên `file://` — bộ lọc chủ đề vẫn chạy, chỉ URL thanh địa chỉ có thể không đổi.
- Font dùng Noto local (không còn Libre Baskerville / Sora từ Google) để mở offline.
- Nút «So sánh hai hướng» trỏ `../index.html` (trang so sánh trong repo); trong ZIP vẫn có launcher gốc nhưng không kèm option-a.
- Chưa có HTTPS GitHub Pages / CMS / AI / MXH (đúng phạm vi nhiệm vụ).
