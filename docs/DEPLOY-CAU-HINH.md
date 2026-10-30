# Cấu hình triển khai preview (review qua PR)

Bàn giao khi **chưa** xuất bản được HTTPS công khai. Không yêu cầu khách chạy Terminal. **Không** yêu cầu bật lại Source = GitHub Actions (đã có ảnh Settings).

## Mục tiêu

Xuất bản preview tĩnh (header/menu phương án B) tại:

- `https://lecuong6868.github.io/FLF/`
- `https://lecuong6868.github.io/FLF/option-b/`

từ dòng kế thừa PR #7 (`c8364c5`) / PR #8 (`0ca02c7`) trở đi — **không** đổi DNS flf.vn, **không** merge PR chỉ để kích hoạt deploy.

## Đã có sẵn trong repo

| Thành phần | Đường dẫn |
|------------|-----------|
| Workflow publish | `.github/workflows/preview-pages.yml` |
| Workflow kiểm thử menu | `.github/workflows/browser-menu-test.yml` |
| Script xác minh URL | `scripts/verify-preview-url.mjs` (`npm run verify:preview`) |
| Script menu trên URL deploy | `FLF_BASE_URL=… npm run test:menu` |
| noindex / robots | `option-b/index.html`, `robots.txt` |
| Ảnh Settings Pages (khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` |

## Việc admin cần làm (một lần — khác với bật Source Pages)

1. Mở https://github.com/lecuong6868/FLF/settings/environments  
2. Chọn environment **`github-pages`**.  
3. **Deployment branches**: thêm pattern **`aat/**`** (hiện API chỉ có `main`). Có thể giữ `main`.  
4. Actions → [Preview Pages #40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) → **Re-run failed jobs**  
   (hoặc để hệ thống AAT push nhánh `aat/**` — workflow tự chạy).  
5. Khi job `deploy` xanh: mở `https://lecuong6868.github.io/FLF/option-b/` (không cần đăng nhập).  
6. (Tuỳ chọn) `npm run verify:preview` và `FLF_BASE_URL=… npm run test:menu`.

## Bằng chứng đã thu thập (2026-10-30)

| Kiểm tra | Kết quả |
|----------|---------|
| `GET https://lecuong6868.github.io/FLF/` | HTTP **404** |
| Repo `has_pages` | **true** |
| Ảnh Settings Pages | Source = **GitHub Actions** (khách gửi; không yêu cầu làm lại) |
| Preview Pages `0ca02c7` | build OK · deploy fail · *Ensure GitHub Pages has been enabled* · [run 40838830940](https://github.com/lecuong6868/FLF/actions/runs/40838830940) |
| Environment branch policy | chỉ **`main`** |
| `GH_TOKEN` agent | **rỗng** — không re-run / không PATCH environment |

## Không làm

- Không merge PR chỉ để kích hoạt deploy.  
- Không lặp thử enable Pages qua API bằng token đã biết thiếu quyền.  
- Không đổi DNS flf.vn / không mua hosting.
