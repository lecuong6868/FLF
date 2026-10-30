# Cấu hình triển khai preview (review qua PR)

Bàn giao khi **chưa** xuất bản được HTTPS công khai. Không yêu cầu khách chạy Terminal. **Không** yêu cầu bật lại Source = GitHub Actions (đã có ảnh Settings).

## Mục tiêu

Xuất bản preview tĩnh (header/menu phương án B) tại:

- `https://lecuong6868.github.io/FLF/`
- `https://lecuong6868.github.io/FLF/option-b/`

từ dòng kế thừa PR #7 (`c8364c5`) / PR #8 (`0ca02c7`) / PR #9 (`7e2bacc`) — **không** đổi DNS flf.vn.

## Đã có sẵn trong repo

| Thành phần | Đường dẫn |
|------------|-----------|
| Workflow publish | `.github/workflows/preview-pages.yml` (chỉ `main` + `workflow_dispatch`) |
| Workflow kiểm thử menu | `.github/workflows/browser-menu-test.yml` |
| Script xác minh URL | `scripts/verify-preview-url.mjs` (`npm run verify:preview`) |
| Script menu trên URL deploy | `FLF_BASE_URL=… npm run test:menu` |
| noindex / robots | `option-b/index.html`, `robots.txt` |
| Ảnh Settings Pages (khách) | `.aat/files/Screenshot_2026-10-29_at_19.*.png` |

## Chiến lược deploy (đã chốt lượt này)

1. **Giữ nguyên** environment `github-pages` chỉ cho phép nhánh **`main`** (không thêm `aat/**`).
2. Workflow Preview Pages chỉ chạy khi **push `main`** hoặc **workflow_dispatch chọn `main`**.
3. Merge source preview/menu đã kiểm tra vào `main` → Actions tự deploy → xác minh HTTPS 200.

## Việc admin / chủ repo cần làm

### A. Cấp kết nối cho agent (nếu muốn agent tự merge + theo dõi Actions)

1. Mở https://github.com/settings/tokens (hoặc Fine-grained: https://github.com/settings/personal-access-tokens)  
2. Tạo token cho repo **`lecuong6868/FLF`** với quyền tối thiểu:
   - **Contents:** Read and write (merge / đọc code)
   - **Pull requests:** Read and write (merge PR)
   - **Actions:** Read and write (đọc run, `workflow_dispatch`, re-run)
   - **Pages:** Write (hoặc để Actions `GITHUB_TOKEN` lo khi đã merge)
3. Gắn token vào môi trường agent dưới tên **`GH_TOKEN`** (không để rỗng).  
4. Không cần đổi Settings → Pages (Source đã là GitHub Actions).

### B. Tự merge + chạy Preview trên main (không cấp token)

1. Mở PR chứa source menu cuối (ví dụ [#9](https://github.com/lecuong6868/FLF/pull/9) hoặc PR xưởng mới cùng nội dung) → **Merge** vào `main` (không bypass bảo vệ nhánh).  
2. Vào https://github.com/lecuong6868/FLF/actions/workflows/preview-pages.yml  
   - Nếu chưa chạy sau merge: **Run workflow** → chọn nhánh **`main`** → Run.  
3. Chờ job `build` + `deploy` **success**.  
4. Mở `https://lecuong6868.github.io/FLF/option-b/` (HTTP 200).  
5. (Tuỳ chọn) `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview` và `npm run test:menu`.

## Bằng chứng đã thu thập (2026-10-30 — lượt này)

| Kiểm tra | Kết quả |
|----------|---------|
| `GET https://lecuong6868.github.io/FLF/` | HTTP **404** |
| Ảnh Settings Pages | Source = **GitHub Actions** |
| Environment branch policy | chỉ **`main`** (giữ nguyên theo yêu cầu) |
| Preview Pages trên `aat/**` | build OK · deploy **fail** (đúng vì env không cho `aat/**`) — ví dụ [run 40982695731](https://github.com/lecuong6868/FLF/actions/runs/40982695731) |
| Menu CI | success trên PR #7/#8/#9 |
| Local `npm run check` + `test:menu` | **PASS** · **37/37** |
| `GH_TOKEN` agent | **rỗng** — không merge / không `workflow_dispatch` / không re-run |

## Không làm

- Không thêm `aat/**` vào Deployment branches (đã chốt giữ chỉ `main`).  
- Không lặp thử API bằng token rỗng.  
- Không đổi DNS flf.vn / không mua hosting / không bật CMS·AI·MXH trong lượt này.  
- Không tuyên bố preview hoàn thành khi URL vẫn 404.
