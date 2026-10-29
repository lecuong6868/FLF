# Bàn giao — Header & menu phương án B

## Phần kế thừa
- Toàn bộ mockup/flow từ **PR #5** (`aat/20261028-083939`): `option-a/`, `option-b/`, `shared/`, `docs/`, preview Pages.
- Logo gốc khách gửi: `public/brand/logo-color.png`, `public/brand/first-legal-force.png` (copy từ `.aat/files/`).
- Nội dung công ty đã xác minh (MST, tên pháp lý) — **không** bịa địa chỉ/đối tác.
- Nhánh `aat/20261029-110343` **không có commit** (timeout/auth) → không có code dang dở để merge.

## Phần sửa trong lượt này
- Menu **Chuyên mục** có submenu 5 mục: Đầu tư, Thuế, Quản trị doanh nghiệp, Quản trị rủi ro, Giấy phép → link `chuyen-muc/?chu-de=…` (đích hợp lệ, lọc chip trên trang danh sách).
- Header/menu **desktop**: dropdown hover + bàn phím (Enter/Space/ArrowDown, Escape).
- Menu **mobile**: mở/đóng, backdrop, Escape, `aria-expanded` / `aria-hidden` / `inert`, khóa scroll body, focus trap + trả focus về nút Menu, accordion submenu.
- CSS phương án B cho submenu; CSS tối thiểu tương thích ở phương án A (cùng `shared/render.js`).
- Cập nhật `scripts/check-pages.mjs`, `scripts/gen-section-pages.mjs`, README.

## Ảnh kiểm tra
| Viewport | File |
|----------|------|
| Desktop 1440 | `mockups/B-desktop-1440.png` |
| Mobile 390 | `mockups/B-mobile-390.png` |
| Mobile menu mở (nếu chụp thêm) | `mockups/B-mobile-390-menu-open.png` |

## Phần còn lại (lượt tiếp)
1. Hoàn thiện **trang chủ** phương án B (hero + các section) rồi xuất bản link preview.
2. Chốt địa chỉ trụ sở công khai với khách (xem `docs/COMPANY_VERIFICATION.md`).
3. Triển khai Next.js + Payload (PR #2) trên nền UI B đã chọn — CMS, Dashboard, SEO/redirect 301.
4. Giai đoạn 2–3: MXH, AI đăng bài (có duyệt), chatbot.

## Kiểm tra đã chạy
Xem `docs/KIEM-TRA.md` (cập nhật kết quả thật của lượt này).
