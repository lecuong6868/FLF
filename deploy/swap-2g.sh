#!/usr/bin/env bash
# Thêm 2 GB swap (bộ nhớ dự phòng trên ổ đĩa) cho VPS – an toàn, chạy lại nhiều lần không sao.
# Không dừng/khởi động lại dịch vụ nào, không đụng dữ liệu dự án.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Cần chạy bằng sudo"; exit 1; }
echo "Trước:"; free -h
if swapon --show=NAME --noheadings | grep -q .; then
  echo "VPS đã có swap:"; swapon --show; echo "Không làm gì thêm."; exit 0
fi
FREE_MB=$(df -Pm / | awk 'NR==2{print $4}')
[ "$FREE_MB" -gt 5120 ] || { echo "Ổ đĩa chỉ còn ${FREE_MB} MB (<5 GB) – không thêm swap để tránh đầy ổ."; exit 1; }
[ -e /swapfile ] && { echo "/swapfile đã tồn tại nhưng không bật – dừng để anh kiểm tra."; exit 1; }
fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
chmod 600 /swapfile
mkswap /swapfile >/dev/null
swapon /swapfile
grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo 'vm.swappiness=10' > /etc/sysctl.d/90-swap.conf && sysctl -q -p /etc/sysctl.d/90-swap.conf
echo "Sau:"; free -h
echo "Xong: đã có 2 GB swap, tự bật lại sau khi khởi động máy."
