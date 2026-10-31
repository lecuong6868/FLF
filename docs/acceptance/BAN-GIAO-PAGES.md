# Biên bản bàn giao — xuất bản Preview lên GitHub Pages

**Ngày:** 2026-10-31  
**Repo:** [lecuong6868/FLF](https://github.com/lecuong6868/FLF)  
**Nguồn nội dung:** [PR #18](https://github.com/lecuong6868/FLF/pull/18) · nhánh `aat/20261031-144113` · commit `fd3a0dcde80b4a4b6321133c4c911e6ed84c7c6d`  
**Đối chiếu:** PR #16–#17 (trang chủ + Giới thiệu). **Không** dùng bản ZIP cũ PR #11.

## Phạm vi đã làm trong workspace

| Hạng mục | Chi tiết |
|----------|----------|
| Nội dung | `FLF-preview/`: trang chủ VI/EN, Giới thiệu VI / About EN, option-b minh họa (không tuyên bố song ngữ đủ) |
| Workflow | `.github/workflows/preview-pages.yml` publish **toàn bộ** `FLF-preview/` làm gốc site `/FLF/` |
| CI file | `.github/workflows/browser-menu-test.yml` chạy `verify:home` + `verify:about` + `verify:basepath` |
| Form | Trang chủ ghi rõ Preview — **chưa gửi dữ liệu** (`data-preview-form`, note trong HTML + `home.js`) |
| Offline | Đường dẫn tương đối; mở `FLF-preview/index.html` bằng `file://` vẫn được |
| Production | **Không** đụng DNS / `flf.vn` |

## Kiểm thử đã chạy (máy agent)

| Kiểm tra | Kết quả |
|----------|---------|
| `npm run verify:home` | **PASS 37** |
| `npm run verify:about` | **PASS 34** |
| `npm run verify:basepath` (mô phỏng `/FLF/`) | **PASS** (HTTP 200 + roundtrip VI↔EN) |
| `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview` | **FAIL** (14 đường dẫn 404) |
| GET `https://lecuong6868.github.io/FLF/` (không đăng nhập) | HTTP **404** lúc 2026-10-31T09:07Z |
| Ảnh trình duyệt 390 / 1440 trên URL HTTPS | Chưa — chờ deploy `main` thành công |

Chi tiết JSON: [`KIEM-TRA-PAGES-20261031.json`](KIEM-TRA-PAGES-20261031.json).

Ảnh chụp offline trang chủ đã có sẵn trong `FLF-preview/screenshots/home-20261031/` (từ PR #17/#18).

## Điểm chặn deploy HTTPS

1. Environment **`github-pages` chỉ cho phép nhánh `main`**. Push/`deploy` từ `aat/**` bị từ chối (*Branch is not allowed to deploy to github-pages*).  
2. Agent **`GH_TOKEN` rỗng** → không đủ quyền merge PR vào `main`, không `workflow_dispatch` trên `main`, không re-run Actions qua API.  
3. Settings → Pages → Source = **GitHub Actions** đã bật (không thiếu bước “bật Pages”); thiếu bước **đưa commit Preview lên `main` và để job deploy chạy xong**.

Chi tiết quyền cần cấp: [`docs/DEPLOY-CAU-HINH.md`](../DEPLOY-CAU-HINH.md).

## URL bàn giao (chỉ dùng sau khi verify:preview PASS)

Sau khi Actions trên `main` xanh và `npm run verify:preview` thoát 0:

- Trang chủ tiếng Việt: `https://lecuong6868.github.io/FLF/vi/`  
- Trang chủ tiếng Anh: `https://lecuong6868.github.io/FLF/en/`  
- Giới thiệu (đã xác minh): `https://lecuong6868.github.io/FLF/vi/gioi-thieu/`  
- About (EN): `https://lecuong6868.github.io/FLF/en/about/`

**Hiện tại chưa được phép gửi các URL trên cho khách** vì chưa có HTTP 200 đã xác minh.

## Anh / admin cần làm tiếp

1. Merge PR xưởng này (hoặc cấp `GH_TOKEN` đủ quyền Contents + PR + Actions).  
2. Chờ / chạy workflow **Preview Pages** trên **`main`**.  
3. Chạy `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`.  
4. Kiểm tra nhanh 390px / 1440px: trang chủ VI↔EN, Giới thiệu↔About, menu, CSS/ảnh.  
5. Gửi khách **chỉ** các URL đã PASS — nhắc đây là Preview, form chưa gửi dữ liệu, chưa phải site chính thức.
