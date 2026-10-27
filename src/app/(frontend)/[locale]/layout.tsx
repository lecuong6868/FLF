import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { isLocale, type AppLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getCompanyInfo, getNavigation } from '@/lib/payload'
import { absoluteUrl } from '@/lib/seo/build'

export async function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = (isLocale(raw) ? raw : 'vi') as AppLocale
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: {
      default: 'First Legal Force',
      template: '%s | First Legal Force',
    },
    description:
      locale === 'vi'
        ? 'First Legal Force — tư vấn đa lĩnh vực, hợp tác với đối tác hành nghề luật sư.'
        : 'First Legal Force — multi-disciplinary advisory partnering with law practices.',
    alternates: {
      languages: {
        vi: absoluteUrl('/vi'),
        en: absoluteUrl('/en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'First Legal Force',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      images: [{ url: absoluteUrl('/brand/logo-color.png') }],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as AppLocale
  const dict = getDictionary(locale)

  let company = null
  let navItems: { label: string; href: string }[] = []
  try {
    const [companyInfo, navigation] = await Promise.all([
      getCompanyInfo(locale),
      getNavigation(locale),
    ])
    company = companyInfo
    navItems =
      navigation?.main?.map((item) => ({
        label: item.label || '',
        href: item.href || '/',
      })) || []
  } catch {
    // DB chưa sẵn sàng
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {dict.a11y.skip}
      </a>
      <Header locale={locale} dict={dict} items={navItems} />
      <div id="main">{children}</div>
      <Footer locale={locale} dict={dict} company={company} />
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
        }}
      />
    </>
  )
}
