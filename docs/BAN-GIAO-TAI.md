# Bàn giao tải — FLF-preview.zip

Ngày xác minh: **2026-10-30** (sửa URL sau PR #11–#13 — việc xử lý `[đã ẩn]`).

## Báo cáo thực tế PR #11 / #12 / #13

| Hạng mục | Thực tế |
|----------|---------|
| PR #11 | https://github.com/lecuong6868/FLF/pull/11 — **open** · nhánh `aat/20261030-154651` · đóng gói `FLF-preview.zip` phương án B |
| PR #12 | https://github.com/lecuong6868/FLF/pull/12 — **open** · bàn giao raw GitHub theo commit SHA |
| PR #13 | https://github.com/lecuong6868/FLF/pull/13 — **open** · đổi URL chính sang jsDelivr theo commit SHA |
| Gói | `FLF-preview.zip` · **2 436 515 byte** · không dựng lại website |
| Blob ZIP (git) | giống nhau trên PR #11 / #12 / #13 |

## `[đã ẩn]` — đã xác minh

- Trong **file repo** (README / `BAN-GIAO-TAI` của PR #13): URL **đủ** commit hex.
- Trong **tóm tắt bàn giao / body PR / tệp `.aat/files/…đã.md`**: chuỗi hex bị thay bằng `[đã ẩn]` → URL cụt → khách không tải được.
- **Không** đổi CDN thêm; chuyển URL chính sang raw GitHub **theo tên nhánh** (không hex).

Chi tiết: [`NGUYEN-NHAN-LOI-TAI.md`](NGUYEN-NHAN-LOI-TAI.md).

## Link tải ổn định (đã tải thử lại — không đăng nhập)

**Chính (gửi khách) — một dòng, copy nguyên:**

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-154651/FLF-preview.zip
```

File chỉ chứa URL: [`URL-TAI.txt`](URL-TAI.txt)

**Dự phòng (cùng nội dung byte):**

```
https://raw.githubusercontent.com/lecuong6868/FLF/aat/20261030-191204/FLF-preview.zip
```

```
https://cdn.jsdelivr.net/gh/lecuong6868/FLF@aat/20261030-154651/FLF-preview.zip
```

> **Không** gửi: link trang PR, `…/blob/…` (HTML), `github.com/…/raw/…` nếu client không follow 302, hoặc URL có commit SHA dài dễ bị hệ thống che thành `[đã ẩn]`.

## Bằng chứng tải HTTP (đúng URL chính ở trên)

| Kiểm tra | Kết quả |
|----------|---------|
| HTTP status | **200** |
| Redirect | **0** |
| `Content-Type` | `application/zip` |
| Bytes tải | **2436515** |
| Magic header | `50 4B 03 04` (`PK\x03\x04`) |
| SHA-256 | xem `docs/DOWNLOAD-VERIFY.json` (trường `sha256`) |
| MD5 | `b9075516a277363aa2d82dde487d45d6` |
| Giải nén | OK — 27 entry; `FLF-preview/index.html`, `option-b/`, logo, font Noto |
| So với gói PR #11 | Byte-identical |

## Kiểm thử sau giải nén (`file://`)

Nguồn: ZIP vừa tải từ **URL chính** → giải nén → `npm run verify:offline`.

Kỳ vọng: **17/17 PASS** (logo, CSS, font, menu desktop/mobile, liên kết nội bộ, form chỉ minh họa — không báo gửi thành công giả).

Ảnh: `mockups/offline/B-*-file.png`, `FLF-preview/screenshots/`.

## Anh cần làm tiếp

1. Gửi khách **URL chính** (nhánh, không SHA) hoặc nội dung `docs/URL-TAI.txt`.
2. Nhờ khách giải nén → mở `FLF-preview/index.html` để duyệt phương án B.
3. Cấp **token GitHub hợp lệ** nếu muốn tạo Release asset (`/releases/download/...`) — phiên này token 401 Bad credentials.
4. Sau khi chốt UI: merge gói lên `main`; giai đoạn CMS / MXH / AI ngoài phạm vi offline.
