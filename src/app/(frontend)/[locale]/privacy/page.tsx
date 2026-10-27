import Link from 'next/link'
import { notFound } from 'next/navigation'

import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { hreflangAlternates } from '@/lib/seo/build'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  const dict = getDictionary(locale)
  return {
    title: dict.privacy.title,
    alternates: hreflangAlternates('/privacy'),
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  return (
    <section className="section">
      <div className="container-flf prose-flf">
        <h1 className="section-title">{dict.privacy.title}</h1>
        {locale === 'vi' ? (
          <>
            <p>
              Chính sách này mô tả cách First Legal Force (FLF) thu thập và xử lý dữ liệu cá nhân khi
              bạn sử dụng website hoặc gửi form liên hệ, phù hợp Nghị định 13/2023/NĐ-CP về bảo vệ
              dữ liệu cá nhân.
            </p>
            <h2>Dữ liệu thu thập</h2>
            <p>
              Khi bạn gửi form liên hệ, chúng tôi có thể thu thập họ tên, email, số điện thoại và nội
              dung tin nhắn. Việc gửi form yêu cầu bạn tích chọn đồng ý xử lý dữ liệu.
            </p>
            <h2>Mục đích</h2>
            <p>Phản hồi yêu cầu liên hệ, cải thiện dịch vụ website, và tuân thủ nghĩa vụ pháp lý.</p>
            <h2>Lưu trữ & bảo mật</h2>
            <p>
              Dữ liệu được lưu trên hệ thống của FLF với kiểm soát truy cập. Không bán dữ liệu cá
              nhân cho bên thứ ba vì mục đích thương mại.
            </p>
            <h2>Quyền của chủ thể dữ liệu</h2>
            <p>
              Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân bằng cách liên hệ qua
              trang <Link href={`/${locale}/contact`}>Liên hệ</Link>.
            </p>
            <p>
              Nội dung chi tiết có thể được cập nhật trong Dashboard (Cài đặt website → Chính sách
              bảo mật) mà không cần sửa code.
            </p>
          </>
        ) : (
          <>
            <p>
              This policy describes how First Legal Force (FLF) collects and processes personal data
              when you use the website or submit the contact form, consistent with Vietnam’s Decree
              13/2023/ND-CP on personal data protection.
            </p>
            <h2>Data we collect</h2>
            <p>
              Through the contact form we may collect your name, email, phone number, and message.
              Submitting the form requires explicit consent.
            </p>
            <h2>Purpose</h2>
            <p>Responding to inquiries, improving the website experience, and legal compliance.</p>
            <h2>Storage & security</h2>
            <p>
              Data is stored in FLF systems with access controls. We do not sell personal data for
              commercial purposes.
            </p>
            <h2>Your rights</h2>
            <p>
              You may request access, correction, or deletion via the{' '}
              <Link href={`/${locale}/contact`}>Contact</Link> page.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
