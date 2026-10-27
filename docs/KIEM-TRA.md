# Biên bản kiểm tra

Ngày: **2026-10-27** (lượt preview HTTPS + flow)

## Phạm vi

Preview thiết kế tĩnh (HTML) — không kiểm thử CMS/backend. Không merge PR #2/#3, không đổi DNS flf.vn.

## URL chính đã kiểm tra

**https://finger-hello-candy-ideas.trycloudflare.com/**

## Đã chạy

| Hạng mục | Cách | Kết quả |
|----------|------|---------|
| Kiểm tra tĩnh | `node scripts/check-pages.mjs` | **PASS** |
| Serve local | `python3 -m http.server 4173` trên bản publish (không zip WP / `.aat`) | 200 |
| Tunnel HTTPS | `cloudflared tunnel --url http://127.0.0.1:4173` | URL chính ở trên |
| Path qua HTTPS | curl `/`, option-a/b, 4 PNG, logo, robots.txt | **200** tất cả |
| Viewport ảnh | Pillow `Image.size` | 1440 và 390 đúng |
| Lightbox / noindex / flows | Có trong `index.html` | Đã đối chiếu chuỗi |

## Tiêu chí đối chiếu

- [x] Hai hướng A/B + mockup desktop/mobile phóng to được  
- [x] Sơ đồ trang  
- [x] Flow khách: trang chủ → lĩnh vực → chi tiết → liên hệ → xác nhận  
- [x] Flow NV/admin: login+2FA → nháp → gửi duyệt → duyệt/sửa → luật sư đối tác → xuất bản  
- [x] Phân biệt minh họa vs đã hoạt động  
- [x] Logo gốc; không địa chỉ/đối tác/thành tích bịa  
- [x] Nhãn bản thiết kế chờ duyệt + noindex  
- [x] URL HTTPS mở được không cần đăng nhập GitHub  
- [ ] GitHub Pages bền (`lecuong6868.github.io/FLF`) — cần admin bật Source = GitHub Actions

## Giới hạn

- Tunnel Cloudflare quick tunnel có thể hết hạn khi máy xưởng tắt.  
- `GH_TOKEN` xưởng **401** — không bật Pages qua API từ agent.
