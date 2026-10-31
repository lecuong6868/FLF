# Renew web FLF (www.flf.vn) — Preview HTML

Dự án làm mới website **First Legal Force**. Kiến trúc sản phẩm đã chốt (giai đoạn sau): **Next.js + Payload CMS + PostgreSQL**.  
**Lượt này:** Preview HTML song ngữ (trang chủ, Giới thiệu, **Quy định mới**, **Chuyên mục**) — mở được qua `file://` và dưới base path `/FLF/` khi deploy Pages. **Không** đổi DNS / site production `flf.vn`. **Không** làm Dashboard giả bằng localStorage.

Nguồn Preview đầy đủ mới nhất được đối chiếu từ [PR #21](https://github.com/lecuong6868/FLF/pull/21) (kế thừa #18–#20); **không** dùng ZIP cũ chỉ có trang chủ và **không** ghi đè trang Giới thiệu.

## Cài đặt & chạy (tiếng Việt)

Yêu cầu: **Node.js 18+** (kiểm thử / đóng gói) và/hoặc **Python 3** (máy chủ tĩnh).

### Cách 1 — Mở offline (không cần cài gì)

1. Mở `FLF-preview/index.html` bằng Chrome / Edge / Firefox.  
2. Chọn **Tiếng Việt** hoặc **English**.  
3. Menu **Quy định mới** / **Chuyên mục** (EN: **New regulations** / **Topics**) dẫn tới trang thật — không liên kết chết.  
4. Nút **VI | EN** giữ đúng trang tương ứng bằng đường dẫn tương đối (`file://` OK).

### Cách 2 — Máy chủ tĩnh

```bash
cd /đường/dẫn/renew-web-flf
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"   # nếu dùng nvm
npm start
# hoặc: python3 -m http.server 4173 --directory FLF-preview
```

Mở: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)

| Đường dẫn | Nội dung |
|-----------|----------|
| `/vi/` | Trang chủ VI |
| `/en/` | Trang chủ EN |
| `/vi/gioi-thieu/` | Giới thiệu |
| `/en/about/` | About |
| `/vi/quy-dinh-moi/` | Quy định mới (danh sách trống đã xác minh + mẫu bố cục) |
| `/en/regulations/` | New regulations |
| `/vi/chuyen-muc/` | Chuyên mục (nhóm + bài minh họa) |
| `/en/topics/` | Topics |

### Cách 3 — Kiểm thử & đóng gói ZIP

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm install                                          # chỉ cần nếu chạy Playwright capture
npm run verify                                       # home + about + sections + base path
npm run pack:offline                                 # tạo FLF-preview.zip
```

Sinh lại trang section (khi sửa generator):

```bash
npm run gen:sections
```

## Cấu trúc chính

| Đường dẫn | Mô tả |
|-----------|--------|
| `FLF-preview/` | Bản Preview (xuất bản Pages / đóng ZIP) |
| `scripts/gen-bilingual-sections.mjs` | Sinh trang Quy định / Chuyên mục VI–EN |
| `scripts/verify-sections-bilingual.mjs` | Kiểm thử hai mục điều hướng mới |
| `docs/acceptance/BAN-GIAO-SECTIONS.md` | Biên bản bàn giao lượt này |
| `docs/NEXT-DASHBOARD.md` | Đầu việc Dashboard thật (bước tiếp theo) |
| `.github/workflows/preview-pages.yml` | Deploy GitHub Pages (nhánh `main`) |

## Phạm vi đã xong / chưa xong

- **Đã:** trang chủ + Giới thiệu VI/EN; **Quy định mới** + **Chuyên mục** VI/EN; menu/header/footer/mobile đồng bộ; chuyển ngữ giữ trang; quy định công khai để **trống rõ ràng** (không bịa văn bản); ZIP đóng gói qua `npm run pack:offline`.  
- **Chưa / không làm trong lượt này:** Dashboard quản trị thật; AI; MXH; chatbot; Tin tức song ngữ đầy đủ; HTTPS Pages công khai (cần merge `main` + workflow). **Không** tuyên bố đã xuất bản nếu chưa kiểm chứng HTTP 200.

## Việc anh cần làm tiếp

Xem `docs/NEXT-DASHBOARD.md` và mục “Việc anh cần làm tiếp” trong `docs/acceptance/BAN-GIAO-SECTIONS.md`.

## Triển khai VPS (giai đoạn sau)

Xem `deploy/README.md`. Không dùng cho Preview khách trong lượt này.
