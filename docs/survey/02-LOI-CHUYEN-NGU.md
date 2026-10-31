# (2) Lỗi chuyển Việt–Anh khi mở HTML qua `file://`

**Trạng thái:** đã tái hiện & ghi nguyên nhân từ source — **chưa sửa code Preview trong lượt này.**

## Tóm tắt nguyên nhân

Có **hai lớp lỗi/khoảng trống** liên quan chuyển ngữ:

1. **Site cũ (ZIP / build production):** mở `file://` thì **không tải được JS** → LanguageSwitcher không chạy; ngay cả khi online, ngôn ngữ dựa `localStorage` + API Hygraph, **không** có HTML `/vi` & `/en` dựng sẵn.  
2. **Preview PR #11 (offline):** mở `file://` được, nhưng **không có bản EN** và **không có nút chuyển ngữ** → không đáp ứng tiêu chí Preview sắp sửa.

## Cách tái hiện (đã chạy trong môi trường khảo sát)

### A. Site cũ trong ZIP

```bash
python3 scripts/reproduce-lang-bug.py
# hoặc thủ công:
# 1. Giải nén flf.vn_20261023_094322.zip
# 2. Mở index.html bằng trình duyệt (Open File → file://...)
# 3. DevTools → Network: /static/js/main.*.js và /static/css/... trả lỗi
#    (trình duyệt resolve thành file:///static/... thay vì thư mục cạnh index.html)
```

**Quan sát kỳ vọng:** trang không render app (hoặc chỉ thấy “You need to enable JavaScript…”); **không** bấm được VI/EN.

### B. Preview offline

```text
Mở FLF-preview/option-b/index.html bằng file://
→ Menu, logo, font local OK
→ Không có control VI | EN trên header/footer
→ Không tồn tại thư mục en/ hay file *.en.html
```

### C. Đối chứng online (không phải `file://`)

Trên `https://www.flf.vn`, LanguageSwitcher đổi `localStorage.selectedLanguage` và gọi `i18next.changeLanguage`; nội dung CMS lấy `locales: [vi|en]`. URL kiểu `/about` **không** đổi thành `/en/about`. Path `/en` vẫn là SPA catch-all.

## Bằng chứng từ source

| ID | Bằng chứng | File |
|----|------------|------|
| ABS_ASSET_PATHS | `index.html` dùng `src="/static/js/..."`, `href="/static/css/..."` (đường dẫn tuyệt đối gốc) | `evidence/old-index-absolute-assets.txt` |
| LANG_VIA_LOCALSTORAGE | `localStorage.getItem("selectedLanguage")`; class `LanguageSwitcher_*` | `evidence/old-js-lang-snippets.txt` |
| LANG_NEEDS_NETWORK_API | GraphQL Hygraph `locales: $locales` | cùng file snippets + `lang-bug-evidence.json` |
| PREVIEW_NO_EN | 12 HTML, tất cả `lang="vi"`, 0 cây `en/` | `evidence/preview-pages.txt` |
| FILE_URL_RESOLUTION | File JS tồn tại tại `./static/js/...` nhưng `file:///static/js/...` **không** tồn tại | `scripts/reproduce-lang-bug.py` (assert) |

JSON tổng hợp: `evidence/lang-bug-evidence.json`.

## Hệ quả cho bản Preview sắp sửa

Tiêu chí đã chốt (TASK): HTML VI/EN **dựng sẵn**, tài nguyên cục bộ, liên kết **tương đối**, chuyển ngữ **giữ đúng trang**, chạy **không mạng**.

→ Lượt sửa tiếp **không** được dựa `localStorage` + API như site cũ; phải sinh cặp trang (ví dụ `vi/option-b/...` ↔ `en/option-b/...`) và link tương đối giữa hai ngôn ngữ cùng “slot” trang.
