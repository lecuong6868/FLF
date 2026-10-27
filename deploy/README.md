# Triển khai FLF lên VPS (Docker Compose + Caddy)

VPS khách đã xác nhận: **68.183.136.251**. Tên miền: `flf.vn` / `www.flf.vn`.

Khách **no-code** — team kỹ thuật chạy các bước dưới đây; không yêu cầu khách SSH chỉnh tay ngoài cung cấp DNS / mật khẩu khi được hỏi.

Script nhanh (sau khi đã có Docker + file `.env`):

```bash
sudo bash deploy/setup-docker.sh
sudo bash deploy/setup-docker.sh check
```

`deploy/setup.sh` là bản **web tĩnh nginx** cũ — giữ tham chiếu, không dùng cho stack Next/Payload.

## 1. Chuẩn bị trên VPS

```bash
# SSH vào VPS bằng tài khoản có quyền sudo
sudo bash deploy/swap-2g.sh          # nếu RAM nhỏ
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
# Cài Docker (nếu chưa): https://docs.docker.com/engine/install/ubuntu/
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"      # đăng nhập lại sau lệnh này
```

## 2. Clone & cấu hình

```bash
sudo mkdir -p /opt/flf && sudo chown "$USER":"$USER" /opt/flf
cd /opt/flf
git clone https://github.com/lecuong6868/FLF.git repo
cd repo
cp .env.example .env
nano .env   # điền PAYLOAD_SECRET, POSTGRES_PASSWORD, SEED_*, SMTP_*, SITE_ADDRESS
```

DNS: trỏ bản ghi **A** của `@` và `www` về `68.183.136.251` trước khi bật HTTPS (Caddy tự xin Let's Encrypt).

## 3. Chạy

```bash
cd /opt/flf/repo
docker compose up -d --build
```

Seed admin lần đầu (trong container app hoặc máy có `DATABASE_URL` trỏ vào Postgres Compose):

```bash
# Ví dụ exec vào network compose
docker compose run --rm -e DATABASE_URL="postgresql://flf:MAT_KHAU@db:5432/flf" app \
  sh -c "node --version" 
# Khuyến nghị: copy .env đủ biến rồi:
docker compose exec app sh -c "npx tsx scripts/seed.ts"
# Nếu image production không có tsx/devDeps, chạy seed từ máy CI/local trỏ DATABASE_URL vào VPS (port 5432 chỉ mở nội bộ — dùng SSH tunnel):
# ssh -L 5432:127.0.0.1:5432 user@68.183.136.251
# DATABASE_URL=postgresql://flf:...@127.0.0.1:5432/flf npm run seed
```

Kiểm tra:

```bash
curl -s http://127.0.0.1/api/health
# hoặc qua domain sau khi DNS OK
curl -sI https://www.flf.vn/vi
```

## 4. Script hỗ trợ

| File | Việc |
|------|------|
| `deploy/swap-2g.sh` | Thêm 2GB swap nếu thiếu RAM |
| `deploy/setup.sh` | Bản cũ phục vụ **web tĩnh nginx** — giữ để tham chiếu; **stack mới dùng Docker Compose** như trên |
| `deploy/backup-db.sh` | Sao lưu Postgres định kỳ |

## 5. Backup DB định kỳ

```bash
sudo cp deploy/backup-db.sh /opt/flf/backup-db.sh
sudo chmod +x /opt/flf/backup-db.sh
# Cron mỗi ngày 02:30
echo '30 2 * * * root /opt/flf/backup-db.sh' | sudo tee /etc/cron.d/flf-backup
```

File backup mặc định: `/opt/flf/backups/`. Giữ 14 bản gần nhất.

## 6. Cập nhật phiên bản mới

```bash
cd /opt/flf/repo
git pull
docker compose up -d --build
```

## 7. Lưu ý bảo mật

- Không mở port Postgres ra internet.
- Đổi toàn bộ mật khẩu trong `.env`.
- Bật 2FA cho tài khoản admin sau seed.
- SMTP và API MXH/AI chỉ điền khi sẵn sàng (giai đoạn 2/3).
