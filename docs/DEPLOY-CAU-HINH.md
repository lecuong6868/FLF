# Cấu hình triển khai Preview HTTPS (GitHub Pages)

Mục tiêu lượt này: xuất bản thư mục **`FLF-preview`** (trang chủ + Giới thiệu VI/EN từ PR #18) lên URL HTTPS công khai để khách xem thử — **không** bàn giao ZIP / mã nguồn; **không** đổi DNS / website production `flf.vn`.

## URL kỳ vọng (sau khi deploy `main` thành công)

| Trang | URL |
|-------|-----|
| Điểm vào | https://lecuong6868.github.io/FLF/ |
| Trang chủ VI | https://lecuong6868.github.io/FLF/vi/ |
| Trang chủ EN | https://lecuong6868.github.io/FLF/en/ |
| Giới thiệu VI | https://lecuong6868.github.io/FLF/vi/gioi-thieu/ |
| About EN | https://lecuong6868.github.io/FLF/en/about/ |

Base path: `/FLF/` (tên repo). Asset / menu / chuyển VI↔EN dùng đường dẫn tương đối — vẫn mở được offline bằng `file://`.

## Đã xác minh cấu hình Pages

| Mục | Trạng thái |
|-----|------------|
| Settings → Pages → Source | **GitHub Actions** (ảnh khách 2026-10-29 trong `.aat/files/`) |
| Enforce HTTPS | Bật |
| Custom domain | Trống (không gắn flf.vn) |
| Environment `github-pages` | Chỉ nhánh **`main`** — **giữ nguyên**, không thêm `aat/**` |
| Workflow | `.github/workflows/preview-pages.yml` — publish nội dung `FLF-preview/` |

## Chiến lược deploy (đã chốt)

1. Giữ environment chỉ cho **`main`**.
2. Workflow chỉ `build` + `deploy` khi `github.ref == refs/heads/main`.
3. Merge nhánh có `FLF-preview` (nguồn PR #18, commit `fd3a0dcd…`) vào **`main`** → Actions tự deploy.  
   **Ưu tiên merge [PR #19](https://github.com/lecuong6868/FLF/pull/19)** (đã mergeable/clean). Không cần mở PR Preview mới.
4. Xác minh: `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`.

Lỗi đã thấy khi chạy từ `aat/**`:  
`Branch "aat/…" is not allowed to deploy to github-pages due to environment protection rules.`

## Việc admin / chủ repo cần làm

### B. Tự merge (không cấp token) — **ưu tiên, ~1 phút**

1. Mở [PR #19](https://github.com/lecuong6868/FLF/pull/19) → **Merge** vào **`main`**.  
2. Vào Actions → **Preview Pages** — nếu chưa chạy: **Run workflow** → chọn **`main`**.  
3. Chờ `build` + `deploy` **success** (artifact `_site` có `index.html` ở gốc).  
4. Mở các URL bảng trên (HTTP **200**, không cần đăng nhập).  
5. Chạy `FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview`.

### A. Cấp kết nối GitHub cho agent (qua giao diện AAT)

1. Mở AAT → **Kết nối → Dịch vụ bên thứ 3 → GitHub**.  
2. Làm theo hướng dẫn trên màn hình (không dùng Terminal, không dán token vào chat).  
3. Token / app cần quyền trên repo **`lecuong6868/FLF`**:
   - **Contents:** Read and write  
   - **Pull requests:** Read and write  
   - **Actions:** Read and write  
4. Biến môi trường agent: **`GH_TOKEN`** phải có giá trị khác rỗng.  
   Lượt 2026-10-31T09:28Z: `GH_TOKEN` **length=0** → không merge / push / `workflow_dispatch` được.

## Không làm

- Không thêm `aat/**` vào Deployment branches.  
- Không đổi DNS / production `flf.vn`.  
- Không mở rộng CMS / AI / MXH trong lượt này.  
- Không coi link raw GitHub / jsDelivr / trang PR là link xem web.  
- Không tuyên bố preview HTTPS hoàn tất khi URL vẫn 404.  
- Không tạo thêm PR Preview chồng khi vẫn thiếu credential.
