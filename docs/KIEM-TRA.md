# Biên bản kiểm tra

Ngày: **2026-10-28** (bổ sung Tin tức / Quy định mới / Chuyên mục + flow MXH)

## Phạm vi

Preview thiết kế tĩnh (HTML) — không kiểm thử CMS/backend/AI/API MXH. Không đổi DNS flf.vn.

## URL HTTPS công khai

**Chưa gắn URL chính mới.** Tunnel trycloudflare phiên trước không còn mặc định hoạt động. GitHub Pages chưa xác minh (cần admin bật Source = GitHub Actions). Xem local: `python3 -m http.server 4173`.

## Đã chạy

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| Kiểm tra tĩnh | `node scripts/check-pages.mjs` | **PASS** |
| Serve local | `python3 -m http.server 4173` | `/`, option-a/b, tin-tuc, quy-dinh-moi, chuyen-muc, PNG, robots → **200** |
| Viewport ảnh | `npm run render:mockups` + Pillow | Desktop 1440 / mobile 390 |
| Menu / liên kết | Đối chiếu nav + trang mục A/B | Có Tin tức, Quy định mới, Chuyên mục; quay lại danh sách |
| Bộ lọc minh họa | Chuyên mục «Quản trị rủi ro» → empty state | Có |
| Mobile | `overflow-x: hidden` trên body option A/B | Không cố ý tràn ngang |
| noindex / nhãn chờ duyệt | meta robots + review-bar | Có trên trang chủ và trang mục |

## Tiêu chí đối chiếu

- [x] Hai hướng A/B + mockup desktop/mobile  
- [x] Menu bổ sung Quy định mới & Chuyên mục; giữ Tin tức  
- [x] Trang danh sách + bài mẫu; metadata quy định; bộ lọc / tìm / empty  
- [x] Sơ đồ trang + flow nguồn → AI → duyệt → web → MXH (lỗi kênh, retry giới hạn, chống trùng, pause)  
- [x] Phân biệt UI xem được vs AI/MXH giai đoạn 2  
- [x] Logo gốc; không bịa địa chỉ / đối tác / văn bản pháp lý thật  
- [x] Nhãn bản thiết kế chờ duyệt + noindex  
- [ ] URL HTTPS bền (GitHub Pages) — cần admin  

## Giới hạn

- Agent không commit/push; không giả định tunnel còn sống.  
- Form / CMS / đăng MXH / chatbot: chưa hoạt động.
