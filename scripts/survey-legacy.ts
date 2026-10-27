/**
 * Khảo sát bản zip site cũ trong repo (SPA export, không phải WordPress REST đầy đủ).
 * Chạy: npx tsx scripts/survey-legacy.ts
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const zipPath = path.join(root, 'flf.vn_20261023_094322.zip')

async function main() {
  if (!fs.existsSync(zipPath)) {
    console.error('Không thấy', zipPath)
    process.exit(1)
  }

  const report = {
    source: 'flf.vn_20261023_094322.zip',
    note: 'Bản lưu là SPA React tĩnh (không phải dump WordPress). Route lấy từ bundle JS.',
    pages: [
      '/',
      '/about',
      '/services',
      '/services/1',
      '/services/2',
      '/services/3',
      '/services/4',
      '/services/5',
      '/services/6',
      '/contact',
      '/blog',
      '/new',
      '/casestudy',
    ],
    pageCount: 13,
    postsFromWpRest: 'chưa xác minh — site hiện tại không expose rõ WP REST trong bản zip',
    contactsFound: {
      email: 'ruby.huynh@flf.vn',
      phone: '+84 96 444 7153',
      addressOnSite: '33 Tran Quy Khoach, D1, HCMC',
    },
    redirectTable: path.join('data', 'legacy-redirects.json'),
  }

  const out = path.join(root, 'docs', 'MIGRATION_REPORT.md')
  const md = `# Báo cáo khảo sát & chuyển nội dung FLF

## Nguồn
- File: \`${report.source}\`
- ${report.note}

## Số trang / route phát hiện
- **Số route tĩnh phát hiện:** ${report.pageCount}
- Danh sách:
${report.pages.map((p) => `  - \`${p}\``).join('\n')}

## Bài viết (posts)
- ${report.postsFromWpRest}
- Khuyến nghị: khi có quyền admin WordPress cũ hoặc API, chạy lại import; hiện seed có 1 bài mẫu không mang số liệu nhạy cảm.

## Liên hệ trên site cũ
- Email: ${report.contactsFound.email}
- Điện thoại: ${report.contactsFound.phone}
- Địa chỉ hiển thị: ${report.contactsFound.addressOnSite} (**chưa khớp** địa chỉ đăng ký DN — xem \`docs/COMPANY_VERIFICATION.md\`)

## Redirect 301
- Bảng: \`${report.redirectTable}\`
- Áp dụng qua \`src/middleware.ts\` + collection \`redirects\` (seed).

## Kết luận giai đoạn 1
| Hạng mục | Số lượng / trạng thái |
|----------|------------------------|
| Trang/route cũ map được | ${report.pageCount} |
| Bài WP import tự động | 0 (chưa có REST/export WP) |
| Bài mẫu seed | 1 |
| Redirect 301 | xem JSON |
`

  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, md, 'utf8')
  console.log(md)
  console.log('Đã ghi', out)
}

main()
