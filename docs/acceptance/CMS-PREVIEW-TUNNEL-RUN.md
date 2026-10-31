# Nghiệm thu — CMS Preview Tunnel (lần này)

**Kết luận: CHƯA ĐẠT** — chưa có bằng chứng chạy thật (URL tunnel + login `/admin` thành công).  
**Không đánh dấu đạt** theo tiêu chí TASK.

## Thời điểm & phạm vi

| Hạng mục | Giá trị |
|----------|---------|
| Thời điểm UTC | 2026-10-31T15:44:55Z |
| Repo | `lecuong6868/FLF` |
| PR liên quan | #25 (nhánh `aat/20261031-222020`) + nhánh AAT hiện tại |
| Mục tiêu | Link tạm `*.trycloudflare.com/admin` + tự kiểm HTTP/login/phân quyền |

## Việc đã hiện thực trong repo

1. Giữ / cập nhật khung `cms/` (Next.js + Payload 3 + PostgreSQL), seed, phân quyền admin/editor.
2. Workflow `.github/workflows/cms-preview.yml` (`workflow_dispatch`): Postgres → build → seed → Cloudflare Quick Tunnel → `http-accept` + `test:access` → Job Summary → giữ tunnel 30–90 phút.
3. Script `cms/scripts/run-gha-preview.sh`, `cms/src/scripts/http-accept.ts`.
4. **Sửa lỗi CI Docker:** Dockerfile trước đó không `COPY .npmrc` trước `npm ci` → peer deps fail (`npm ci --include=dev` exit 1 trên run #41214779210). Đã copy `.npmrc` + `npm ci` với `NODE_ENV=development`.
5. Job `build-evidence` (PR/push) đặt `continue-on-error: true` để không chặn đường nghiệm thu chính (tunnel).
6. `npm run typecheck` trên máy xưởng: **PASS** (sau khi có Node 22.23.4).
7. Logo từ `.aat/files/` chép vào `cms/public/brand/`.
8. README tiếng Việt (root + `cms/`) hướng dẫn cài/chạy và xem `/admin` qua Actions.

## Việc đã tự kiểm trên máy xưởng

| Kiểm tra | Kết quả |
|----------|---------|
| Parse YAML workflow | OK |
| `bash -n` scripts preview | OK |
| `tsc --noEmit` | PASS |
| `GET /admin` + login HTTP thật | **Không chạy được** (RAM ~1 GiB, không Docker; build `/admin` OOM đã biết) |
| `workflow_dispatch` qua API | **HTTP 401 Requires authentication** — máy xưởng không có `GH_TOKEN` / `gh auth` |

### Trích bằng chứng chặn dispatch

```
POST /repos/lecuong6868/FLF/actions/workflows/cms-preview.yml/dispatches
→ 401 {"message":"Requires authentication","status":"401"}
```

### Run Actions trước đó (PR #25, sự kiện pull_request — không phải workflow_dispatch)

- Run `41214779210`: job Docker build **failure** (`npm ci` thiếu `.npmrc`); job tunnel **skipped** (chỉ chạy khi `workflow_dispatch`).
- **Chưa từng có** run `workflow_dispatch` thành công → **chưa có** URL `trycloudflare.com` và log `http-accept` thật.

## Chặn cụ thể & quyền anh cần cấp

| Bước bị chặn | Nguyên nhân | Quyền / thao tác anh cần (không dùng Terminal) |
|--------------|-------------|--------------------------------------------------|
| Kích hoạt tunnel | Máy xưởng không có token GitHub Actions | Vào GitHub → **Actions** → **CMS Preview** → **Run workflow** → chọn nhánh có `cms/` + workflow → Run. *Hoặc* cấp cho team token/PAT có quyền `actions:write` (và ideally `contents:read`) trên repo `lecuong6868/FLF`. |
| Nút Run ổn định | Workflow chưa nằm trên `main` | **Merge** PR có workflow vào `main` (hoặc khi Run workflow nhớ chọn đúng nhánh feature). |
| Nhận mật khẩu seed | Repo đang **public** | Thêm secret Actions tên `PREVIEW_CREDENTIALS_WEBHOOK` (Discord/Slack), **hoặc** tạm đặt repo Private rồi chạy lại, **hoặc** nhận mật khẩu qua kênh riêng kèm Run ID khi job còn sống. |
| (Tuỳ chọn) Bản thử lâu hơn 90 phút | Không bắt buộc cho tiêu chí lần này | Quyền Render↔GitHub + Neon connection string (xem `CMS-PREVIEW-DEPLOY.md`). |

## Khi nào được đánh dấu ĐẠT

Có đủ:

1. Job Summary / artifact ghi URL `https://….trycloudflare.com/admin`.
2. Log `http-accept-*.log` **PASS** (GET `/admin`, login admin có token, editor không đăng được / admin đăng được).
3. Bản thử noindex (`PREVIEW_MODE=true`).

## Việc anh làm tiếp (UI GitHub)

1. Sau khi hệ thống đẩy code/PR: mở **Actions → CMS Preview → Run workflow** (chọn đúng nhánh).
2. Đợi job xong phần nghiệm thu → mở **Summary** lấy link `/admin`.
3. Nhận mật khẩu (webhook / private / nhắn team) → đăng nhập thử.
4. Nếu muốn tunnel luôn bấm được từ UI: merge workflow vào `main`.
5. Khi hết bản thử: đồng ý VPS ~24 USD/tháng + DNS khi chạy chính thức.
