# URL Preview chính & trạng thái xác minh

## Trạng thái (2026-10-31)

| Mục | Giá trị |
|-----|---------|
| Nguồn nội dung | PR #18 · `aat/20261031-144113` · `fd3a0dcde80b4a4b6321133c4c911e6ed84c7c6d` |
| Đối chiếu | PR #16–#17; **không** dùng PR #11 |
| Settings → Pages | Source = **GitHub Actions** (ảnh khách 2026-10-29) |
| Environment `github-pages` | Chỉ **`main`** (giữ nguyên) |
| `GH_TOKEN` agent | **rỗng** |
| `https://lecuong6868.github.io/FLF/` | HTTP **404** — chưa deploy từ `main` |
| Local `npm run verify` | **PASS** (home + about + basepath `/FLF/`) |

**Chưa có URL HTTPS công khai đã kiểm chứng HTTP 200** — không gửi link cho khách ở thời điểm này.

## URL dùng sau khi `verify:preview` PASS

- VI: https://lecuong6868.github.io/FLF/vi/
- EN: https://lecuong6868.github.io/FLF/en/
- Giới thiệu: https://lecuong6868.github.io/FLF/vi/gioi-thieu/
- About: https://lecuong6868.github.io/FLF/en/about/

Chi tiết: [`acceptance/BAN-GIAO-PAGES.md`](acceptance/BAN-GIAO-PAGES.md) · [`DEPLOY-CAU-HINH.md`](DEPLOY-CAU-HINH.md).
