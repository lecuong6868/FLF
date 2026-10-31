# Biên bản bàn giao — xuất bản Preview lên GitHub Pages

**Ngày kiểm tra:** 2026-10-31T09:11:24Z (UTC)  
**Repo:** [lecuong6868/FLF](https://github.com/lecuong6868/FLF)  
**Tiếp nối:** [PR #19](https://github.com/lecuong6868/FLF/pull/19) (`aat/20261031-160440` · `2b66a218…`)  
**Nguồn nội dung:** [PR #18](https://github.com/lecuong6868/FLF/pull/18) · `fd3a0dcd…` (trang chủ + Giới thiệu VI/EN). Đối chiếu PR #16–#17. **Không** dùng ZIP cũ PR #11.

## Kết luận lượt này

**Chưa xuất bản HTTPS.** `https://lecuong6868.github.io/FLF/` và các trang con vẫn **HTTP 404** lúc 2026-10-31T09:11:24Z.  
**Không** bàn giao link xem cho khách. Không tuyên bố đã deploy.

## Trạng thái PR #19 / main / Pages / quyền

| Mục | Kết quả thực tế |
|-----|-----------------|
| PR #19 | **open**, `mergeable=true`, `mergeable_state=clean`, check `verify-preview` **success** |
| `main` | Vẫn chỉ có `deploy/` + zip WordPress (chưa có `FLF-preview`) |
| Pages Source | **GitHub Actions** (ảnh `.aat/files/Screenshot_2026-10-29_at_19.00.38.png`) |
| Environment `github-pages` | Chỉ nhánh **`main`** — giữ nguyên (không thêm `aat/**`) |
| `GH_TOKEN` agent | Biến có mặt nhưng **độ dài 0** (rỗng) |
| Merge API | `PUT …/pulls/19/merge` → **401 Requires authentication** |
| `git push` | Thất bại: không có credential GitHub |
| `workflow_dispatch` trên `main` | Không gọi được (thiếu token) |

## Phạm vi đã có trong workspace (sẵn sàng deploy khi lên `main`)

| Hạng mục | Chi tiết |
|----------|----------|
| Nội dung | `FLF-preview/`: trang chủ VI/EN, Giới thiệu VI / About EN; logo khớp file anh gửi |
| Workflow | `.github/workflows/preview-pages.yml` publish **toàn bộ** `FLF-preview/` làm gốc site `/FLF/` |
| Form | Preview — **chưa gửi dữ liệu** |
| Offline | Đường dẫn tương đối; mở được bằng `file://` |
| Production | **Không** đụng DNS / `flf.vn` |

## Kiểm thử máy agent (lượt này)

| Kiểm tra | Kết quả |
|----------|---------|
| `npm run verify:home` | **PASS 37** |
| `npm run verify:about` | **PASS 34** |
| `npm run verify:basepath` (mô phỏng `/FLF/`) | **PASS** |
| GET HTTPS Pages (không đăng nhập) | **404** trên `/`, `/vi/`, `/en/`, `/vi/gioi-thieu/` |
| Ảnh 390 / 1440 trên URL HTTPS | Chưa — chờ deploy `main` thành công |

JSON: [`KIEM-TRA-PAGES-20261031.json`](KIEM-TRA-PAGES-20261031.json).

## Anh / admin cần làm tiếp (bắt buộc để có URL)

**Cách nhanh nhất (ưu tiên):** mở [PR #19](https://github.com/lecuong6868/FLF/pull/19) → **Merge** vào `main` (đã xanh, mergeable).

Hoặc cấp `GH_TOKEN` (Contents + Pull requests + Actions: Read and write) vào môi trường agent — chi tiết [`docs/DEPLOY-CAU-HINH.md`](../DEPLOY-CAU-HINH.md).

Sau khi merge:

1. Actions → **Preview Pages** trên `main` phải **success** (artifact có `index.html` ở gốc `_site`).  
2. Chạy: `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`  
3. Chỉ khi PASS mới gửi khách:
   - VI: `https://lecuong6868.github.io/FLF/vi/`
   - EN: `https://lecuong6868.github.io/FLF/en/`
   - Giới thiệu: `https://lecuong6868.github.io/FLF/vi/gioi-thieu/`  
   (nhắc: Preview, form chưa gửi dữ liệu, không phải flf.vn)

## URL bàn giao

**Chưa có.** Chỉ dùng bảng URL trên sau khi có bằng chứng deploy success + HTTP 200 kèm thời điểm và commit SHA trên `main`.
