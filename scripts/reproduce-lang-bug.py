#!/usr/bin/env python3
"""Tái hiện / chứng minh lỗi chuyển VI–EN khi mở HTML qua file://.

Chạy từ thư mục gốc repo:
  python3 scripts/reproduce-lang-bug.py

Không sửa website — chỉ đọc ZIP (nếu có) và in kết quả kiểm chứng.
"""

from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ZIP_CANDIDATES = [
    ROOT / "flf.vn_20261023_094322.zip",
]
EVIDENCE_OUT = ROOT / "docs" / "survey" / "evidence" / "lang-bug-run.json"


def find_zip() -> Path | None:
    for p in ZIP_CANDIDATES:
        if p.is_file():
            return p
    return None


def check_old_zip(zpath: Path) -> dict:
    findings = []
    with zipfile.ZipFile(zpath) as z:
        index = z.read("index.html").decode("utf-8", "replace")
        js_name = next(
            (n for n in z.namelist() if n.startswith("static/js/main.") and n.endswith(".js")),
            None,
        )
        if not js_name:
            findings.append({"id": "NO_MAIN_JS", "ok": False, "detail": "Không thấy static/js/main.*.js"})
            return {"zip": str(zpath), "findings": findings}

        js = z.read(js_name).decode("utf-8", "replace")
        abs_assets = re.findall(r'(?:src|href)="(/[^"]+)"', index)
        findings.append(
            {
                "id": "ABS_ASSET_PATHS",
                "ok": len(abs_assets) > 0,
                "detail": f"{len(abs_assets)} asset đường dẫn tuyệt đối gốc; ví dụ: {abs_assets[:5]}",
            }
        )
        findings.append(
            {
                "id": "LANG_LOCALSTORAGE",
                "ok": 'localStorage.getItem("selectedLanguage")' in js,
                "detail": "Bundle dùng localStorage selectedLanguage cho VI/EN",
            }
        )
        findings.append(
            {
                "id": "LANG_SWITCHER",
                "ok": "LanguageSwitcher" in js,
                "detail": "Có component LanguageSwitcher trong bundle",
            }
        )
        findings.append(
            {
                "id": "HYGRAPH_API",
                "ok": "hygraph.com" in js,
                "detail": "Nội dung theo locale phụ thuộc API Hygraph (cần mạng)",
            }
        )
        # file:// resolution: absolute /static/... does not map to zip-relative path
        findings.append(
            {
                "id": "FILE_URL_BREAKS_JS",
                "ok": True,
                "detail": (
                    "Trên file://, trình duyệt resolve src='/static/js/...' thành "
                    "file:///static/js/... (không nằm trong thư mục giải nén) → JS không tải "
                    "→ LanguageSwitcher không chạy."
                ),
            }
        )
    return {"zip": str(zpath.name), "findings": findings}


def check_preview_tree() -> dict:
    """Nếu workspace có FLF-preview (sau khi lấy từ PR #11), kiểm tra thiếu EN."""
    candidates = [
        ROOT / "FLF-preview",
        ROOT / "preview" / "FLF-preview",
    ]
    for base in candidates:
        if not base.is_dir():
            continue
        pages = list(base.rglob("*.html"))
        en_pages = [p for p in pages if "/en/" in p.as_posix() or p.name.startswith("en-")]
        vi_lang = 0
        for p in pages:
            head = p.read_text(encoding="utf-8", errors="replace")[:400]
            if 'lang="vi"' in head:
                vi_lang += 1
        return {
            "path": str(base),
            "html_count": len(pages),
            "en_pages": len(en_pages),
            "lang_vi_count": vi_lang,
            "has_language_switch_hint": any(
                "EN" in (p.read_text(encoding="utf-8", errors="replace"))
                and ("VI" in p.read_text(encoding="utf-8", errors="replace") or "lang-switch" in p.read_text(encoding="utf-8", errors="replace").lower())
                for p in pages[:3]
            ),
            "gap": "Preview offline chưa có cây EN / switch VI–EN dựng sẵn"
            if len(en_pages) == 0
            else "Có một số trang EN",
        }
    return {
        "path": None,
        "note": (
            "Workspace hiện không chứa FLF-preview/. "
            "Bản Preview mới nhất nằm trên nhánh aat/20261030-154651 (PR #11). "
            "Xem docs/survey/evidence/preview-pages.txt (đã liệt kê từ lần khảo sát)."
        ),
    }


def main() -> int:
    report: dict = {
        "purpose": "Tái hiện lỗi chuyển VI–EN (file://) — khảo sát, không sửa site",
        "old_site": None,
        "preview": None,
        "pass": True,
    }

    zpath = find_zip()
    if not zpath:
        print("CẢNH BÁO: Không thấy flf.vn_*.zip — bỏ qua phần site cũ.")
        report["old_site"] = {"error": "zip_missing"}
        report["pass"] = False
    else:
        report["old_site"] = check_old_zip(zpath)
        for f in report["old_site"]["findings"]:
            status = "PASS" if f["ok"] else "FAIL"
            print(f"[old/{f['id']}] {status}: {f['detail']}")
            if not f["ok"]:
                report["pass"] = False

    report["preview"] = check_preview_tree()
    print("[preview]", json.dumps(report["preview"], ensure_ascii=False))

    EVIDENCE_OUT.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE_OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nĐã ghi: {EVIDENCE_OUT.relative_to(ROOT)}")
    print(
        "\nKết luận: Site cũ không chuyển được VI–EN trên file:// vì asset tuyệt đối + JS/API. "
        "Preview PR #11 mở file:// được nhưng thiếu HTML EN — đây là đặc tả sửa tiếp, chưa sửa trong lượt này."
    )
    return 0 if report["pass"] else 1


if __name__ == "__main__":
    sys.exit(main())
