# Biên bản bàn giao — xuất bản Preview lên GitHub Pages

**Ngày kiểm tra:** 2026-10-31T09:28:47Z (UTC)  
**Repo:** [lecuong6868/FLF](https://github.com/lecuong6868/FLF)  
**Workspace:** `aat/20261031-162711` (đồng bộ nội dung PR #18 + workflow PR #19/#20)  
**Nguồn nội dung:** [PR #18](https://github.com/lecuong6868/FLF/pull/18) · `fd3a0dcd…` (trang chủ + Giới thiệu VI/EN). Đối chiếu PR #16–#17. **Không** dùng ZIP cũ PR #11.

## Kết luận lượt này

**Chưa xuất bản HTTPS.** `https://lecuong6868.github.io/FLF/` và các trang con vẫn **HTTP 404** lúc 2026-10-31T09:28:47Z.  
**Không** bàn giao link xem cho khách. Không tuyên bố đã deploy.  
**Không** tạo thêm PR Preview chồng (theo TASK) — dùng PR đã sẵn.

## Trạng thái PR / main / Pages / quyền

| Mục | Kết quả thực tế |
|-----|-----------------|
| PR #18 | **open**, mergeable, nội dung trang chủ + Giới thiệu |
| PR #19 | **open**, `mergeable=true`, `mergeable_state=clean` — **ưu tiên Merge** |
| PR #20 | **open**, mergeable/clean — cùng gói; thừa nếu đã merge #19 |
| `main` | Vẫn chỉ có `deploy/` + zip WordPress (chưa có `FLF-preview`) |
| Pages Source | **GitHub Actions** (ảnh `.aat/files/Screenshot_2026-10-29_at_19.00.38.png`) |
| Environment `github-pages` | Chỉ nhánh **`main`** — giữ nguyên (không thêm `aat/**`) |
| `GH_TOKEN` agent | Biến có mặt nhưng **độ dài 0** (rỗng) |
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
| GET HTTPS Pages (không đăng nhập) | **404** trên `/`, `/vi/`, `/en/`, `/vi/gioi-thieu/`, `/en/about/` |
| Ảnh 390 / 1440 trên URL HTTPS | Chưa — chờ deploy `main` thành công |

JSON: [`KIEM-TRA-PAGES-20261031.json`](KIEM-TRA-PAGES-20261031.json).

## Anh / admin cần làm tiếp (bắt buộc để có URL)

### Cách nhanh nhất (~1 phút) — **ưu tiên**

1. Mở [PR #19](https://github.com/lecuong6868/FLF/pull/19) → **Merge** vào `main`.  
2. Actions → **Preview Pages** trên `main` phải **success**.  
3. Chạy: `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`  
4. Chỉ khi PASS mới gửi khách các URL bên dưới.

### Cách cấp quyền cho agent (lần sau tự merge)

Trong giao diện AAT: **Kết nối → Dịch vụ bên thứ 3 → GitHub** (làm theo hướng dẫn từng bước trên màn hình).  
Token cần quyền repo `lecuong6868/FLF`: Contents + Pull requests + Actions (Read and write).  
Gắn vào môi trường agent tên **`GH_TOKEN`** (hiện đang rỗng).  
**Không** gửi token trong chat / Terminal / tệp.

Chi tiết: [`docs/DEPLOY-CAU-HINH.md`](../DEPLOY-CAU-HINH.md).

## URL bàn giao (chỉ dùng sau khi verify:preview PASS)

- Root: https://lecuong6868.github.io/FLF/  
- VI: https://lecuong6868.github.io/FLF/vi/  
- EN: https://lecuong6868.github.io/FLF/en/  
- Giới thiệu: https://lecuong6868.github.io/FLF/vi/gioi-thieu/  
- About: https://lecuong6868.github.io/FLF/en/about/  

**Hiện tại: chưa có** (HTTP 404). Nhắc khách: đây là Preview, form chưa gửi dữ liệu, không phải `flf.vn`.
