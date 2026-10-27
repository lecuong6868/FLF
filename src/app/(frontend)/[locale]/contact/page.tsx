import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/forms/ContactForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getCompanyInfo } from '@/lib/payload'
import { breadcrumbJsonLd, hreflangAlternates } from '@/lib/seo/build'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  const dict = getDictionary(locale)
  return {
    title: dict.contact.title,
    description: dict.contact.lead,
    alternates: hreflangAlternates('/contact'),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let company = null
  try {
    company = await getCompanyInfo(locale)
  } catch {
    // ignore
  }

  return (
    <section className="section">
      <div className="container-flf">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: dict.nav.home, path: `/${locale}` },
            { name: dict.contact.title, path: `/${locale}/contact` },
          ])}
        />
        <h1 className="section-title">{dict.contact.title}</h1>
        <p className="section-lead">{dict.contact.lead}</p>
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            marginTop: '2rem',
          }}
        >
          <ContactForm locale={locale} dict={dict} />
          <aside className="service-link">
            <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>{dict.brand}</h2>
            <p style={{ margin: '0 0 0.75rem', lineHeight: 1.7 }}>
              {company?.displayAddress || company?.address || '—'}
            </p>
            {company?.phone ? <p style={{ margin: '0 0 0.35rem' }}>{company.phone}</p> : null}
            {company?.email ? <p style={{ margin: 0 }}>{company.email}</p> : null}
          </aside>
        </div>
      </div>
    </section>
  )
}
