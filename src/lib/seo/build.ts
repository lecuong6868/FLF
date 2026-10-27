import type { AppLocale } from '@/i18n/config'

const siteUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.flf.vn'

export function absoluteUrl(path: string): string {
  const base = siteUrl().replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function organizationJsonLd(company: {
  legalName?: string | null
  tradeName?: string | null
  taxId?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  facebookUrl?: string | null
  linkedinUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService', 'LegalService'],
    name: company.tradeName || 'First Legal Force',
    legalName: company.legalName,
    taxID: company.taxId,
    url: siteUrl(),
    email: company.email,
    telephone: company.phone,
    address: company.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: company.address,
          addressCountry: 'VN',
        }
      : undefined,
    sameAs: [company.facebookUrl, company.linkedinUrl].filter(Boolean),
    logo: absoluteUrl('/brand/logo-color.png'),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function articleJsonLd(input: {
  title: string
  description?: string | null
  path: string
  datePublished?: string | null
  dateModified?: string | null
  locale: AppLocale
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description || undefined,
    inLanguage: input.locale,
    datePublished: input.datePublished || undefined,
    dateModified: input.dateModified || undefined,
    mainEntityOfPage: absoluteUrl(input.path),
    publisher: {
      '@type': 'Organization',
      name: 'First Legal Force',
      logo: absoluteUrl('/brand/logo-color.png'),
    },
  }
}

export function hreflangAlternates(pathWithoutLocale: string) {
  const clean = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`
  return {
    languages: {
      vi: absoluteUrl(`/vi${clean === '/' ? '' : clean}`),
      en: absoluteUrl(`/en${clean === '/' ? '' : clean}`),
      'x-default': absoluteUrl(`/vi${clean === '/' ? '' : clean}`),
    },
  }
}
