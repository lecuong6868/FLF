import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getCompanyInfo, getPayloadClient } from '@/lib/payload'
import { hreflangAlternates, organizationJsonLd } from '@/lib/seo/build'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  const dict = getDictionary(locale)
  return {
    title: dict.brand,
    description: dict.home.sub,
    alternates: hreflangAlternates('/'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let areas: { id: string | number; title?: string | null; slug?: string | null; summary?: string | null }[] =
    []
  let company = null
  try {
    const payload = await getPayloadClient()
    const [areasRes, companyInfo] = await Promise.all([
      payload.find({
        collection: 'practice-areas',
        locale,
        sort: 'order',
        limit: 6,
        depth: 0,
      }),
      getCompanyInfo(locale),
    ])
    areas = areasRes.docs
    company = companyInfo
  } catch {
    // seed chưa chạy
  }

  return (
    <>
      {company ? <JsonLd data={organizationJsonLd(company)} /> : null}
      <section className="hero">
        <div className="container-flf hero-inner fade-up">
          <div className="hero-brand">
            <Image src="/brand/logo-color.png" alt="" width={56} height={56} priority />
            <div className="hero-brand-name">{dict.brand}</div>
          </div>
          <p style={{ margin: '0 0 0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.85 }}>
            {dict.home.eyebrow}
          </p>
          <h1>{dict.home.headline}</h1>
          <p>{dict.home.sub}</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href={`/${locale}/contact`}>
              {dict.cta.contact}
            </Link>
            <Link className="btn btn-ghost" href={`/${locale}/services`} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.08)' }}>
              {dict.cta.learnMore}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-flf">
          <h2 className="section-title">{dict.services.title}</h2>
          <p className="section-lead">{dict.services.lead}</p>
          <div className="grid-cards">
            {areas.length
              ? areas.map((area) => (
                  <Link
                    key={area.id}
                    className="service-link"
                    href={`/${locale}/services/${area.slug}`}
                  >
                    <h3>{area.title}</h3>
                    <p>{area.summary}</p>
                  </Link>
                ))
              : [
                  locale === 'vi'
                    ? 'Tư vấn doanh nghiệp & đầu tư'
                    : 'Corporate & investment advisory',
                  locale === 'vi' ? 'Tuân thủ & giấy phép' : 'Compliance & licensing',
                  locale === 'vi' ? 'Hợp tác pháp lý chuyên sâu' : 'Specialized legal collaboration',
                ].map((title) => (
                  <div key={title} className="service-link">
                    <h3>{title}</h3>
                    <p>
                      {locale === 'vi'
                        ? 'Nội dung chi tiết sẽ hiển thị sau khi seed/dashboard cập nhật.'
                        : 'Detailed content appears after seed or CMS updates.'}
                    </p>
                  </div>
                ))}
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="btn btn-ghost" href={`/${locale}/services`}>
              {dict.cta.viewAll}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
