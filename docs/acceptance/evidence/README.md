# Evidence — CMS Preview

Các file log nghiệm thu (`http-accept-*.log`, `seed.log`, `test-access.log`, …) được **ghi trên GitHub Actions runner** khi chạy workflow **CMS Preview** (`workflow_dispatch`), rồi upload thành artifact `cms-preview-acceptance-<run_id>`.

File `cms-preview-env.txt` ghi ràng buộc máy xưởng AAT (không đủ điều kiện chạy `/admin` tại chỗ).
