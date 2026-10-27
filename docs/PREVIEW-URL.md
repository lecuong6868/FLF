# URL preview chính & bàn giao

## URL chính (HTTPS, không cần đăng nhập GitHub)

| Mục | Giá trị |
|-----|---------|
| **URL chính** | **https://finger-hello-candy-ideas.trycloudflare.com/** |
| Nhãn | Bản thiết kế chờ duyệt · noindex |
| Nội dung | Trang so sánh A/B, mockup phóng to, sơ đồ trang, flow khách, flow NV/admin |

Mở trực tiếp bằng trình duyệt — **không** yêu cầu đăng nhập GitHub.

## Cách duyệt nhanh

1. Desktop (~1440px) và cửa sổ hẹp (~390px).  
2. Banner «Bản thiết kế chờ duyệt» + `noindex`.  
3. Phóng to 4 PNG; mở mockup A/B tương tác.  
4. Đọc sơ đồ trang + flow khách + flow nhân viên/admin (gồm bước luật sư đối tác).  
5. Bảng «minh họa vs đã hoạt động» — form/CMS/MXH **chưa** chạy.

## Bằng chứng kiểm tra (2026-10-27)

Qua URL chính (HTTPS):

| Path | HTTP |
|------|------|
| `/` | 200 |
| `/option-a/` | 200 |
| `/option-b/` | 200 |
| `/mockups/A-desktop-1440.png` | 200 |
| `/mockups/A-mobile-390.png` | 200 |
| `/mockups/B-desktop-1440.png` | 200 |
| `/mockups/B-mobile-390.png` | 200 |
| `/public/brand/logo-color.png` | 200 |
| `/robots.txt` | 200 |

Kích thước ảnh mockup: A-desktop **1440×2328**, A-mobile **390×3122**, B-desktop **1440×2457**, B-mobile **390×3070**.  
`node scripts/check-pages.mjs` → **PASS**.

## Độ bền URL

- URL trycloudflare.com ở trên là **quick tunnel** từ máy xưởng (phục vụ đúng lúc bàn giao). Có thể tắt khi phiên agent kết thúc.  
- **URL bền:** bật GitHub Pages (admin repo) → `https://lecuong6868.github.io/FLF/` nhờ workflow `.github/workflows/preview-pages.yml`.

## Quyền còn thiếu cho Pages ổn định

| Thiếu | Chi tiết |
|-------|----------|
| Admin bật Pages | Settings → Pages → Source = **GitHub Actions** (hiện `has_pages: false`) |
| Push từ agent | `GH_TOKEN` môi trường xưởng trả **401**; agent **không** commit/push (hệ thống AAT sẽ làm) |

## PR chứa thay đổi

Nhánh làm việc hiện tại do hệ thống AAT tạo PR (không merge #2/#3). Gắn URL chính vào mô tả PR.
