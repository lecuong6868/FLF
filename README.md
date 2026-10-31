# Renew web FLF

Tái dựng website **First Legal Force (FLF)** — `www.flf.vn` — trên nền hiện đại (Next.js + Payload CMS + PostgreSQL).

## Cấu trúc repo

| Thư mục / file | Mục đích |
|----------------|----------|
| `cms/` | Dashboard — Next.js + Payload CMS + PostgreSQL |
| `FLF-preview/` | Bản HTML xem trước (giữ nguyên) |
| `deploy/` | Script VPS/nginx cho site tĩnh |
| `render.yaml` | Blueprint Render (phương án phụ) |
| `.github/workflows/cms-preview.yml` | **Bản thử `/admin`**: Postgres + build + Cloudflare Tunnel |
| `docs/acceptance/` | Biên bản nghiệm thu |

## Xem Dashboard `/admin` (khách no-code) — khuyến nghị

Không cần máy mạnh, không cần tài khoản Render/Railway.

1. Mở GitHub repo → tab **Actions** → workflow **CMS Preview**.
2. Bấm **Run workflow** (có thể chọn giữ tunnel 30–90 phút, mặc định 75).
3. Đợi job chạy (build ~5–15 phút trên runner đủ RAM).
4. Mở **Summary** của job → lấy link `https://….trycloudflare.com/admin`.
5. Đăng nhập bằng tài khoản seed (xem bên dưới).

Chi tiết: [docs/acceptance/CMS-PREVIEW-TUNNEL.md](docs/acceptance/CMS-PREVIEW-TUNNEL.md).

### Mật khẩu seed

- Mỗi lần chạy sinh mật khẩu **ngẫu nhiên mạnh**.
- Repo đang **public** → mật khẩu **không** in ra Summary công khai. Anh chọn một cách:
  - Thêm secret `PREVIEW_CREDENTIALS_WEBHOOK` (Discord/Slack) để nhận mật khẩu riêng, hoặc
  - Tạm đặt repo **Private** rồi chạy lại, hoặc
  - Nhắn team kênh riêng kèm Run ID.
- Bản thử **noindex**, dữ liệu tạm **mất** khi job hết giờ.

### Chạy lại / tắt sớm

- Hết giờ tunnel tắt → **Run workflow** lại.
- Tắt sớm: **Cancel** job trên Actions.

## Chạy CMS trên máy local (dev)

Cần Node `^22.23.4` và **RAM ≥ 4 GiB** (máy ~1 GiB sẽ OOM khi build `/admin`).

```bash
cd cms
cp .env.example .env
# hoặc: bash scripts/generate-preview-secrets.sh
npm install
docker compose up -d postgres   # hoặc: npm run pg:embedded
npm run dev
npm run seed
```

Admin: http://localhost:3000/admin

Kiểm tra:

```bash
npm run typecheck
npm run test:access
npm run accept:http   # khi server đang chạy
npm run build && npm start
```

Xem thêm: [cms/README.md](cms/README.md).

## Chuyển VPS (~24 USD/tháng)

Khi chạy chính thức (không còn bản thử tunnel):

- Máy ≥4 GiB RAM khuyến nghị; Postgres bền vững.
- `PREVIEW_MODE=false`; nginx + HTTPS; DNS `flf.vn`.
- Site tĩnh: `sudo bash deploy/setup.sh` (xem `deploy/README.md`).
- CMS: Docker (`cms/Dockerfile`) hoặc `npm run build && npm start`.

## Việc anh cần làm tiếp

1. Sau khi code lên GitHub: **Actions → CMS Preview → Run workflow** → lấy link `/admin` trong Summary.
2. Nhận mật khẩu (webhook / repo private / nhắn team).
3. Xác nhận địa chỉ hiển thị công khai + SĐT footer.
4. Đồng ý VPS (~24 USD/tháng) + DNS khi rời bản thử.
5. Giai đoạn sau: 2FA, nối Preview → CMS, MXH, AI/chatbot.

## Ghi chú

- `FLF-preview/` không bị sửa trong đợt Dashboard này.
- Phương án tunnel **không** đòi token cloud; Render/Neon vẫn là phương án phụ nếu anh muốn bản thử lâu hơn 90 phút (xem `cms/README.md`).
