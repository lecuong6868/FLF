# Renew web FLF (www.flf.vn) — Preview HTML

Dự án làm mới website **First Legal Force**. Kiến trúc sản phẩm đã chốt (giai đoạn sau): Next.js + Payload CMS + PostgreSQL.  
**Lượt này:** xuất bản **Preview HTML** (trang chủ + Giới thiệu VI/EN) lên GitHub Pages dưới base path `/FLF/` để khách xem thử HTTPS — **không** đổi DNS / site production `flf.vn`.

Nguồn nội dung: [PR #18](https://github.com/lecuong6868/FLF/pull/18) (`fd3a0dcd…`), đối chiếu PR #16–#17. Không dùng bản cũ PR #11.

## Cài đặt & chạy local (tiếng Việt)

Yêu cầu: **Node.js 18+** (cho kiểm thử) và/hoặc **Python 3** (máy chủ tĩnh).

### Cách 1 — Mở offline (không cần cài gì)

1. Mở file `FLF-preview/index.html` bằng Chrome / Edge / Firefox.  
2. Chọn **Tiếng Việt** hoặc **English**.  
3. Hoạt động qua `file://`: asset cục bộ, đường dẫn tương đối — không cần API để đổi ngôn ngữ.

### Cách 2 — Máy chủ tĩnh

```bash
cd /đường/dẫn/renew-web-flf
npm start
# hoặc: python3 -m http.server 4173 --directory FLF-preview
```

Mở: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)  
(Trang chủ VI: `/vi/` · EN: `/en/` · Giới thiệu: `/vi/gioi-thieu/` · About: `/en/about/`)

### Cách 3 — Kiểm thử tự động

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"   # nếu dùng nvm
npm install                                          # chỉ cần nếu chạy Playwright capture
npm run verify                                       # home + about + mô phỏng base path /FLF/
```

Xác minh URL HTTPS sau khi Pages deploy xong:

```bash
FLF_BASE_URL=https://lecuong6868.github.io/FLF npm run verify:preview
```

## Cấu trúc chính

| Đường dẫn | Mô tả |
|-----------|--------|
| `FLF-preview/` | Bản Preview xuất bản lên Pages |
| `FLF-preview/vi/index.html` | Trang chủ tiếng Việt |
| `FLF-preview/en/index.html` | Trang chủ tiếng Anh |
| `FLF-preview/vi/gioi-thieu/` | Giới thiệu (VI) |
| `FLF-preview/en/about/` | About (EN) |
| `.github/workflows/preview-pages.yml` | Deploy GitHub Pages (chỉ `main`) |
| `docs/DEPLOY-CAU-HINH.md` | Cấu hình & quyền deploy |
| `docs/acceptance/BAN-GIAO-PAGES.md` | Biên bản bàn giao Pages |

## GitHub Pages

- URL gốc kỳ vọng: `https://lecuong6868.github.io/FLF/` — **hiện vẫn 404** (chưa có deployment trên `main`).  
- Settings → Pages → Source = **GitHub Actions** (đã bật).  
- Environment `github-pages` **chỉ** nhánh `main` → cần **merge vào main** rồi chờ workflow **Preview Pages** thành công.  
- Lượt 2026-10-31: [PR #19](https://github.com/lecuong6868/FLF/pull/19) **mergeable + checks xanh**, nhưng agent `GH_TOKEN` **rỗng** → merge API **401**. Chi tiết: `docs/DEPLOY-CAU-HINH.md`, `docs/acceptance/BAN-GIAO-PAGES.md`.

Form liên hệ trên Preview **chỉ minh họa** — ghi rõ chưa gửi dữ liệu / chưa có backend.

## Phạm vi đã xong / chưa xong

- **Đã:** trang chủ VI+EN; Giới thiệu/About; chuyển ngữ giữ đúng trang; form Preview không báo gửi giả; workflow publish `FLF-preview`; `npm run verify` local **PASS** (home 37, about 34, basepath `/FLF/`).  
- **Chưa:** HTTPS công khai HTTP 200 (chờ merge `main` — ưu tiên merge PR #19); song ngữ Tin tức / Quy định / Chuyên mục; CMS; AI; MXH. **Chưa** tuyên bố toàn site hoàn tất / **chưa** gửi link Pages cho khách.

## Triển khai VPS (giai đoạn sau)

Xem `deploy/README.md`. Không dùng cho Preview khách trong lượt này.
