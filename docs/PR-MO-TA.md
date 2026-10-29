# Gợi ý mô tả Pull Request (dán vào PR)

## Summary

- Hoàn thiện **header + menu desktop/mobile phương án B** trên nền mockup PR #5 (khách đã chọn B từ PR #3).
- Chuyên mục có submenu: Đầu tư, Thuế, Quản trị doanh nghiệp, Quản trị rủi ro, Giấy phép → `chuyen-muc/?chu-de=…`.
- Menu mobile: mở/đóng, Escape, aria, focus trap, backdrop; desktop dropdown hỗ trợ bàn phím.
- Kế thừa logo khách; không CMS/AI/MXH; chưa làm lại toàn bộ trang chủ.

## Test plan

- [ ] `npm run check` → PASS
- [ ] `python3 -m http.server 4173` → mở `/option-b/` ở 1440px và 390px: không tràn ngang
- [ ] Mobile: mở menu, Escape đóng, Tab không thoát panel, submenu Chuyên mục mở được
- [ ] Click Đầu tư / Thuế… → trang Chuyên mục lọc đúng `chu-de`
- [ ] Ảnh: `mockups/B-desktop-1440.png`, `mockups/B-mobile-390.png`

Chi tiết bàn giao: [`BAN-GIAO-HEADER.md`](BAN-GIAO-HEADER.md) · [`KIEM-TRA.md`](KIEM-TRA.md)
