# FLF — Bản xem thử offline (phương án B)

Gói HTML mở trực tiếp bằng trình duyệt (`file://`), **không cần cài đặt**. Kế thừa giao diện phương án B từ chuỗi PR #7 → #10; đóng gói tại PR #11.

> **Bản thiết kế chờ duyệt** · Không phải website chính thức flf.vn · Không đổi DNS.  
> Form liên hệ / CMS / AI / MXH: **chưa có backend** — chỉ minh họa, không báo gửi thành công giả.

## Link tải trực tiếp (gửi khách)

**Copy nguyên một dòng sau** (hoặc mở [`docs/URL-TAI.txt`](docs/URL-TAI.txt)):

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-154651/FLF-preview.zip
```

| Hạng mục | Giá trị |
|----------|---------|
| **URL tải (chính)** | raw GitHub theo **tên nhánh** `aat/20261030-154651` (không chứa chuỗi hex) |
| Dung lượng | **2 436 515 byte** (~**2,32 MB**) |
| HTTP khi tải | **200** · `application/zip` · **0 redirect** · không cần đăng nhập |
| Chữ ký ZIP | magic `PK\x03\x04` · SHA-256 trong [`docs/DOWNLOAD-VERIFY.json`](docs/DOWNLOAD-VERIFY.json) |
| PR chứa gói | [#11](https://github.com/lecuong6868/FLF/pull/11) |

**Dự phòng** (cùng file):

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-191204/FLF-preview.zip
```

> **Không** gửi link trang PR, `…/blob/…` (trả HTML), hay `github.com/…/raw/…` nếu trình duyệt/client không follow 302.  
> **Không** gửi URL có commit SHA dài ở giữa — hệ thống bàn giao dễ che thành `[đã ẩn]` làm hỏng đường dẫn (đã gặp ở PR #12/#13).

## Cách xem (no-code)

1. Dán **URL tải (chính)** vào trình duyệt → tải `FLF-preview.zip`.
2. Giải nén (Windows: chuột phải → Extract All; macOS: double-click).
3. Mở **`FLF-preview/index.html`** bằng Chrome / Edge / Firefox.

Không cần Node, Python, server hay GitHub Pages.

## Vì sao đổi URL lần này (PR #11 → #12 → #13)

| Lần | URL chính | Kết quả thực tế |
|-----|-----------|-----------------|
| PR #12 | `raw.githubusercontent.com/…/<commit-sha>/FLF-preview.zip` | Endpoint tải được, nhưng SHA bị bàn giao che → khách nhận URL cụt |
| PR #13 | `cdn.jsdelivr.net/gh/…@<commit-sha>/FLF-preview.zip` | Cùng vấn đề che hex (`[đã ẩn]`); tệp scrap trong `.aat/files/` chỉ còn URL hỏng |
| **Lần này** | `raw.githubusercontent.com/…/aat/20261030-154651/FLF-preview.zip` | **Không hex** trong URL · HTTP 200 · ZIP đủ 2 436 515 byte · đã giải nén + mở `index.html` |

Chi tiết: [`docs/NGUYEN-NHAN-LOI-TAI.md`](docs/NGUYEN-NHAN-LOI-TAI.md), [`docs/BAN-GIAO-TAI.md`](docs/BAN-GIAO-TAI.md).

## Kiểm thử trên tệp vừa tải

1. `GET` URL chính (không đăng nhập, follow redirect) → 200, `application/zip`, magic ZIP, đúng dung lượng.
2. Giải nén không lỗi (27 entry; có `index.html`, `option-b/`, logo, font Noto).
3. Mở `file://…/FLF-preview/option-b/index.html` → Playwright **17/17 PASS** (logo, font/CSS, menu desktop + mobile 390, form chỉ minh họa).
4. Ảnh: `mockups/offline/`, `FLF-preview/screenshots/`.

## Nội dung phương án B

| Mục | Đích |
|-----|------|
| Trang chủ / Giới thiệu / Lĩnh vực / Đối tác / Liên hệ | Neo trên trang chủ |
| Tin tức | `option-b/tin-tuc/index.html` |
| Quy định mới | `option-b/quy-dinh-moi/index.html` |
| Chuyên mục (5 chủ đề) | `option-b/chuyen-muc/index.html?chu-de=…` |

Logo: `public/brand/` (file khách gửi). Font Noto local trong `public/fonts/`.

## Cài đặt / chạy lại kiểm thử (tuỳ chọn, cần Node 18+)

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm install
npm run bootstrap:browser
source scripts/browser-env.sh
npx playwright install chromium
npm run verify:download   # tải lại đúng URL chính + đối chiếu SHA-256
npm run verify:offline    # kiểm gói offline qua file://
# hoặc: npm run offline   # đóng gói lại + kiểm thử
```

## Quyền còn thiếu

Phiên này **không** tạo được GitHub Release (token API 401). Nếu anh cấp token ghi repo, có thể gắn asset Release để có URL `/releases/download/...` còn ngắn hơn.
