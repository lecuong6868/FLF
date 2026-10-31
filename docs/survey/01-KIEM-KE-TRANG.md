# (1) Kiểm kê trang & mức đầy đủ VI/EN

Ngày: **2026-10-31** · Nguồn: `https://www.flf.vn`, ZIP `flf.vn_20261023_094322.zip`, Preview PR #11 (`FLF-preview/`).

## A. Website đang chạy (www.flf.vn) — SPA React + Hygraph

SPA shell: mọi path HTTP 200 trả cùng `index.html` (~3,5 KB) + “You need to enable JavaScript…”. Nội dung thật render phía client.

| Route (client) | Vai trò quan sát được | VI | EN | Ghi chú |
|----------------|----------------------|----|----|---------|
| `/` | Trang chủ / dịch vụ nổi bật | Có (UI + copy) | Một phần (i18n + API locales) | LanguageSwitcher: `localStorage`, **không** đổi URL `/vi`\|`/en` |
| `/about` | Giới thiệu + số liệu marketing | Có | Một phần | Số liệu 40+/50+/25+ **chưa xác minh** |
| `/services` | Mô tả dịch vụ + danh sách | Có | Một phần | Nhắc FLF & TCHNLS |
| `/services/1`…`/6` | Chi tiết dịch vụ | Có (trong bundle) | Có (cặp dịch trong JS) | 6 dịch vụ trong router |
| `/contact` | Liên hệ | Có | Một phần | SĐT, email, địa chỉ web cũ |
| `/team` | Đội ngũ | Có (route) | ? | Nội dung phụ thuộc CMS/JS — chưa crawl sâu offline |
| `/blog`, `/blog/…` | Blog | Có (query Hygraph `locales`) | Phụ thuộc bản ghi `en` trên CMS | Cần mạng + API |
| `/casestudy` | Case study | Tương tự blog | Tương tự | |
| `/news`, `/schedule`, `/new` | Route trong bundle | ? | ? | Có trong JS; mức nội dung live **chưa** kiểm chứng đầy đủ |
| `/en`, `/vi`, `/en/about`… | Catch-all SPA | — | — | **Không** phải HTML song ngữ dựng sẵn; cùng một shell |

### Tài nguyên & liên kết chuyển ngữ (site cũ)

| Hạng mục | Hiện trạng |
|----------|------------|
| Logo / icon | Bundle + `/apple-icon-*.png`, SVG logo trong `/static/media/` |
| Font | Google Fonts (Parisienne, Space Grotesk) — **cần mạng** |
| CMS | Hygraph `api-ap-northeast-1.hygraph.com/.../master` |
| Chuyển ngữ | Component `LanguageSwitcher` → `i18next.changeLanguage` + `localStorage.selectedLanguage` (`vi`\|`en`) |
| URL hreflang / `/vi` `/en` | **Không** dùng làm nguồn sự thật ngôn ngữ |

### Liên hệ công khai (site cũ — chưa đối chiếu MST)

- Điện thoại: `+84 96 444 7153`  
- Email: `ruby.huynh@flf.vn`  
- Địa chỉ trên web: `33 Tran Quy Khoach, D1, HCMC` — **không khớp** địa chỉ MST đã ghi ở tài liệu xác minh trước (01 Trần Khánh Dư…) → Preview **không** nên tự đổi địa chỉ.

## B. Preview offline mới nhất (PR #11 — phương án B)

Entry: `FLF-preview/index.html` → `option-b/index.html`.

| Trang (đường dẫn tương đối) | VI | EN | Menu/footer/CTA | Mở `file://` |
|-----------------------------|----|----|-----------------|--------------|
| `option-b/index.html` (Trang chủ + section Giới thiệu / Lĩnh vực / Đối tác / Liên hệ) | Có | **Không** | Có (VI) | Được (tài nguyên local) |
| `option-b/tin-tuc/index.html` | Có | **Không** | Có | Được |
| `option-b/tin-tuc/bai-mau.html` | Có | **Không** | Có | Được |
| `option-b/quy-dinh-moi/index.html` | Có | **Không** | Có | Được |
| `option-b/quy-dinh-moi/bai-mau.html` | Có | **Không** | Có | Được |
| `option-b/quy-dinh-moi/chua-hieu-luc.html` | Có | **Không** | Có | Được |
| `option-b/quy-dinh-moi/du-thao.html` | Có | **Không** | Có | Được |
| `option-b/chuyen-muc/index.html` (+ `?chu-de=`) | Có | **Không** | Có | Được |
| `option-b/chuyen-muc/bai-mau.html` | Có | **Không** | Có | Được |
| `option-b/chuyen-muc/thue-minh-hoa.html` | Có | **Không** | Có | Được |
| `option-b/chuyen-muc/tuan-thu-minh-hoa.html` | Có | **Không** | Có | Được |
| Trang lĩnh vực riêng (1 URL / dịch vụ) | Chỉ section trên home | **Không** | — | Chưa tách trang |
| Chính sách bảo mật | **Thiếu** | **Thiếu** | — | — |
| Form NĐ 13/2023 đầy đủ | Minh họa, không gửi | **Thiếu EN** | CTA có | — |

Danh sách file: `evidence/preview-pages.txt` (12 HTML).

### Tài nguyên Preview

| Loại | Đường dẫn | Offline |
|------|-----------|---------|
| Logo khách | `public/brand/logo-color.png`, `first-legal-force.png` | Có |
| Font local | `public/fonts/NotoSans-*.ttf`, `NotoSerif-*.ttf` | Có |
| CSS/JS | `option-b/styles.css`, `shared/content.js`, `shared/render.js` | Có |
| Nút VI/EN | **Không có** | — |

## C. Tổng hợp mức đầy đủ song ngữ

| Nguồn | VI | EN | Chuyển ngữ offline | Đủ tiêu chí Preview sắp sửa? |
|-------|----|----|--------------------|------------------------------|
| flf.vn live | Đủ UI | Một phần (i18n + CMS) | **Không** (`file://` gãy) | Không (không phải Preview) |
| ZIP site cũ | Shell | Bundle i18n | **Không** | Không |
| FLF-preview PR #11 | Đủ mockup B | **0 trang** | Không có control | **Chưa** — đây là việc sửa tiếp |

## D. Screenshot / MXH đính kèm (`.aat/files/`)

| Tệp | Nội dung quan sát |
|-----|-------------------|
| `Screenshot_2026-10-29_at_19.00.38.png` / `19.03.09.png` | GitHub Pages Settings: Source = **GitHub Actions**; chưa có workflow deploy thành công trên UI |
| `Logo_color.png`, `First_Legal_Force.png` | Logo giữ nguyên — dùng cho Preview |
| Facebook / LinkedIn `.md` | Chưa đọc được nội dung Page (login / 403) |
