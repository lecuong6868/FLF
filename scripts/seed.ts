/**
 * Seed admin + nội dung mẫu + redirects.
 * Chạy: npm run seed
 * Biến môi trường bắt buộc: DATABASE_URL, PAYLOAD_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import legacyRedirects from '../data/legacy-redirects.json'

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('Thiếu SEED_ADMIN_EMAIL hoặc SEED_ADMIN_PASSWORD')
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('Thiếu DATABASE_URL')
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (!existing.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name: process.env.SEED_ADMIN_NAME || 'FLF Admin',
        role: 'admin',
        twoFactorEnabled: false,
      },
      overrideAccess: true,
    })
    console.log('✓ Đã tạo admin:', email)
  } else {
    console.log('· Admin đã tồn tại:', email)
  }

  await payload.updateGlobal({
    slug: 'company-info',
    data: {
      legalName: 'CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM',
      tradeName: 'First Legal Force (FLF)',
      internationalName: 'VIETNAM LAW UNION SOLUTION JOINT STOCK COMPANY',
      taxId: '0314193708',
      address: '01 Trần Khánh Dư, Phường Tân Định, Thành phố Hồ Chí Minh, Việt Nam',
      displayAddress: '',
      phone: '+84 96 444 7153',
      email: 'ruby.huynh@flf.vn',
      representative: 'Lê Chí Cường',
      facebookUrl: 'https://www.facebook.com/firstlegalforce',
      linkedinUrl: 'https://www.linkedin.com/company/firstlegalforce/home/',
      verificationNotes:
        'MST & địa chỉ đăng ký đối chiếu masothue.com (2026-10-27). Địa chỉ website cũ 33 Trần Quý Khoách chưa khớp cổng ĐKD → để trống displayAddress. SĐT website +84 96 444 7153; ĐKD ghi 028 3868 1188.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'vi',
    data: {
      siteName: 'First Legal Force',
      tagline: 'Tư vấn đa lĩnh vực · Đồng hành doanh nghiệp',
      homeIntro:
        'First Legal Force kết nối chuyên gia tư vấn và đối tác hành nghề luật sư, hỗ trợ doanh nghiệp quản trị rủi ro trong hoạt động kinh doanh.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'First Legal Force',
      tagline: 'Multi-disciplinary advisory · Business partnership',
      homeIntro:
        'First Legal Force connects advisors and partner law practices to help businesses manage operational risk.',
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'vi',
    data: {
      main: [
        { label: 'Giới thiệu', href: '/about' },
        { label: 'Lĩnh vực tư vấn', href: '/services' },
        { label: 'Đối tác pháp lý', href: '/partners' },
        { label: 'Tin tức', href: '/news' },
        { label: 'Liên hệ', href: '/contact' },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      main: [
        { label: 'About', href: '/about' },
        { label: 'Practice areas', href: '/services' },
        { label: 'Legal partners', href: '/partners' },
        { label: 'News', href: '/news' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    overrideAccess: true,
  })

  const areas = [
    {
      slug: 'thanh-lap-doanh-nghiep-fdi',
      order: 1,
      requiresLawyerReview: true,
      vi: {
        title: 'Thành lập doanh nghiệp có vốn đầu tư nước ngoài',
        summary:
          'Hỗ trợ quy trình thành lập và các thủ tục liên quan cho doanh nghiệp có yếu tố nước ngoài, phối hợp đối tác hành nghề luật sư khi cần.',
      },
      en: {
        title: 'Foreign-invested enterprise establishment',
        summary:
          'Support for establishment procedures for foreign-invested enterprises, collaborating with partner law practices when required.',
      },
    },
    {
      slug: 'dang-ky-quyen-tac-gia',
      order: 2,
      requiresLawyerReview: true,
      vi: {
        title: 'Đăng ký quyền tác giả',
        summary:
          'Tư vấn quy trình đăng ký quyền tác giả cho tác phẩm và phần mềm theo quy định hiện hành.',
      },
      en: {
        title: 'Copyright registration',
        summary:
          'Guidance on copyright registration procedures for works and software under applicable rules.',
      },
    },
    {
      slug: 'giay-phep-lao-dong',
      order: 3,
      requiresLawyerReview: true,
      vi: {
        title: 'Giấy phép lao động cho người nước ngoài',
        summary:
          'Đồng hành các bước chuẩn bị hồ sơ và thủ tục liên quan giấy phép lao động theo khung pháp lý hiện hành.',
      },
      en: {
        title: 'Work permits for foreign nationals',
        summary:
          'Support preparing dossiers and related work-permit procedures under the current legal framework.',
      },
    },
    {
      slug: 'tu-van-tech-blockchain',
      order: 4,
      requiresLawyerReview: true,
      vi: {
        title: 'Tư vấn Tech, Blockchain & Crypto',
        summary:
          'Tư vấn tuân thủ và quản trị rủi ro cho doanh nghiệp công nghệ, fintech và lĩnh vực liên quan tài sản số (không phải lời khuyên đầu tư).',
      },
      en: {
        title: 'Tech, Blockchain & Crypto advisory',
        summary:
          'Compliance and risk advisory for technology, fintech, and digital-asset-related businesses (not investment advice).',
      },
    },
    {
      slug: 'tu-van-ma',
      order: 5,
      requiresLawyerReview: true,
      vi: {
        title: 'Tư vấn mua bán và sáp nhập (M&A)',
        summary:
          'Hỗ trợ doanh nghiệp ở các bước chuẩn bị và phối hợp chuyên gia/đối tác pháp lý trong giao dịch M&A.',
      },
      en: {
        title: 'Mergers & acquisitions advisory',
        summary:
          'Support preparing and coordinating with specialists and legal partners on M&A transactions.',
      },
    },
    {
      slug: 'giay-phep-kinh-doanh-dau-tu',
      order: 6,
      requiresLawyerReview: true,
      vi: {
        title: 'Giấy phép kinh doanh & đầu tư',
        summary:
          'Tư vấn thủ tục giấy phép kinh doanh và các thủ tục đầu tư liên quan, tùy ngành nghề và điều kiện pháp lý.',
      },
      en: {
        title: 'Business & investment licensing',
        summary:
          'Advisory on business licensing and related investment procedures, depending on sector and legal conditions.',
      },
    },
    {
      slug: 'quan-tri-doanh-nghiep',
      order: 7,
      requiresLawyerReview: false,
      vi: {
        title: 'Tư vấn quản trị doanh nghiệp',
        summary:
          'Đồng hành các vấn đề quản trị, quy trình nội bộ và phát triển tổ chức — mang tính tư vấn quản trị, không thay thế dịch vụ luật sư khi pháp lý yêu cầu.',
      },
      en: {
        title: 'Corporate governance advisory',
        summary:
          'Support on governance, internal processes, and organizational development — management advisory, not a substitute for licensed legal practice where required.',
      },
    },
  ]

  for (const area of areas) {
    const found = await payload.find({
      collection: 'practice-areas',
      where: { slug: { equals: area.slug } },
      limit: 1,
    })
    if (found.docs.length) {
      console.log('· Practice area exists:', area.slug)
      continue
    }
    await payload.create({
      collection: 'practice-areas',
      locale: 'vi',
      data: {
        slug: area.slug,
        order: area.order,
        requiresLawyerReview: area.requiresLawyerReview,
        title: area.vi.title,
        summary: area.vi.summary,
      },
      overrideAccess: true,
    })
    await payload.update({
      collection: 'practice-areas',
      id: (
        await payload.find({
          collection: 'practice-areas',
          where: { slug: { equals: area.slug } },
          limit: 1,
        })
      ).docs[0].id,
      locale: 'en',
      data: {
        title: area.en.title,
        summary: area.en.summary,
      },
      overrideAccess: true,
    })
    console.log('✓ Practice area:', area.slug)
  }

  for (const r of legacyRedirects as { fromPath: string; toPath: string; note?: string }[]) {
    const found = await payload.find({
      collection: 'redirects',
      where: { fromPath: { equals: r.fromPath } },
      limit: 1,
    })
    if (found.docs.length) continue
    await payload.create({
      collection: 'redirects',
      data: {
        fromPath: r.fromPath,
        toPath: r.toPath,
        permanent: true,
        note: r.note,
      },
      overrideAccess: true,
    })
  }
  console.log('✓ Redirects seeded')

  // Sample non-legal post (published) — dùng user admin để qua workflow
  const sampleSlug = 'chao-mung-website-moi'
  const sample = await payload.find({
    collection: 'posts',
    where: { slug: { equals: sampleSlug } },
    limit: 1,
  })
  if (!sample.docs.length) {
    const adminUser = (
      await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })
    ).docs[0]

    const created = await payload.create({
      collection: 'posts',
      locale: 'vi',
      data: {
        title: 'Website First Legal Force phiên bản mới',
        slug: sampleSlug,
        excerpt:
          'FLF nâng cấp nền tảng nội dung và quy trình duyệt bài để phục vụ khách hàng tốt hơn.',
        status: 'draft',
        isLegalContent: false,
        lawyerApproved: false,
        author: adminUser.id,
      },
      user: adminUser,
      overrideAccess: true,
    })

    await payload.update({
      collection: 'posts',
      id: created.id,
      locale: 'vi',
      data: {
        status: 'published',
        publishedAt: new Date().toISOString(),
      },
      user: adminUser,
      overrideAccess: true,
    })

    await payload.update({
      collection: 'posts',
      id: created.id,
      locale: 'en',
      data: {
        title: 'The new First Legal Force website',
        excerpt:
          'FLF upgraded its content platform and editorial workflow to better serve clients.',
      },
      user: adminUser,
      overrideAccess: true,
    })
    console.log('✓ Sample post created')
  }

  console.log('Seed hoàn tất.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
