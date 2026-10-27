import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getCompanyInfo, getSiteSettings } from '@/lib/payload'
import { breadcrumbJsonLd, hreflangAlternates } from '@/lib/seo/build'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  const dict = getDictionary(locale)
  return {
    title: dict.about.title,
    description: dict.about.lead,
    alternates: hreflangAlternates('/about'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let company = null
  let settings = null
  try {
    ;[company, settings] = await Promise.all([getCompanyInfo(locale), getSiteSettings(locale)])
  } catch {
    // ignore
  }

  return (
    <section className="section">
      <div className="container-flf">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: dict.nav.home, path: `/${locale}` },
            { name: dict.about.title, path: `/${locale}/about` },
          ])}
        />
        <h1 className="section-title fade-up">{dict.about.title}</h1>
        <p className="section-lead fade-up">{dict.about.lead}</p>
        <div className="prose-flf" style={{ marginTop: '2rem' }}>
          <p>
            {locale === 'vi'
              ? 'First Legal Force (FLF) hoạt động theo mô hình liên kết với các đơn vị hành nghề luật sư và chuyên gia tư vấn đa lĩnh vực, nhằm đồng hành cùng doanh nghiệp trong việc nhận diện và quản trị rủi ro.'
              : 'First Legal Force (FLF) works through partnerships with law practices and multi-disciplinary advisors to help businesses identify and manage risk.'}
          </p>
          {company ? (
            <ul>
              <li>
                <strong>{locale === 'vi' ? 'Tên pháp nhân' : 'Legal name'}:</strong> {company.legalName}
              </li>
              {company.taxId ? (
                <li>
                  <strong>{locale === 'vi' ? 'Mã số thuế' : 'Tax ID'}:</strong> {company.taxId}
                </li>
              ) : null}
              {company.address ? (
                <li>
                  <strong>{locale === 'vi' ? 'Địa chỉ đăng ký' : 'Registered address'}:</strong>{' '}
                  {company.address}
                </li>
              ) : null}
              {company.representative ? (
                <li>
                  <strong>{locale === 'vi' ? 'Người đại diện' : 'Representative'}:</strong>{' '}
                  {company.representative}
                </li>
              ) : null}
            </ul>
          ) : null}
          {settings?.aboutContent ? (
            <p style={{ color: 'var(--flf-muted)' }}>
              {locale === 'vi'
                ? 'Nội dung chi tiết có thể chỉnh trong Dashboard → Cài đặt website.'
                : 'Detailed copy can be edited in Dashboard → Site settings.'}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
