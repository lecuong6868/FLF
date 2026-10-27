import Image from 'next/image'
import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries/vi'
import type { AppLocale } from '@/i18n/config'

type Company = {
  legalName?: string | null
  tradeName?: string | null
  taxId?: string | null
  address?: string | null
  displayAddress?: string | null
  phone?: string | null
  email?: string | null
  facebookUrl?: string | null
  linkedinUrl?: string | null
}

export function Footer({
  locale,
  dict,
  company,
}: {
  locale: AppLocale
  dict: Dictionary
  company: Company | null
}) {
  const year = new Date().getFullYear()
  const address = company?.displayAddress || company?.address

  return (
    <footer className="site-footer">
      <div className="container-flf footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Image src="/brand/logo-color.png" alt="" width={44} height={44} />
            <strong>{company?.tradeName || dict.brand}</strong>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7, maxWidth: '28rem' }}>
            {company?.legalName}
            {company?.taxId ? ` · MST ${company.taxId}` : ''}
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>{dict.nav.contact}</h2>
          <p style={{ margin: '0 0 0.5rem', lineHeight: 1.7 }}>{address || '—'}</p>
          {company?.phone ? (
            <p style={{ margin: '0 0 0.35rem' }}>
              <a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a>
            </p>
          ) : null}
          {company?.email ? (
            <p style={{ margin: 0 }}>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          ) : null}
        </div>

        <div>
          <h2 style={{ fontSize: '1rem', marginTop: 0 }}>{dict.footer.follow}</h2>
          <p style={{ margin: '0 0 0.5rem' }}>
            {company?.facebookUrl ? (
              <a href={company.facebookUrl} rel="noopener noreferrer" target="_blank">
                Facebook
              </a>
            ) : null}
          </p>
          <p style={{ margin: 0 }}>
            {company?.linkedinUrl ? (
              <a href={company.linkedinUrl} rel="noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            ) : null}
          </p>
          <p style={{ margin: '1rem 0 0' }}>
            <Link href={`/${locale}/privacy`}>{dict.nav.privacy}</Link>
          </p>
        </div>
      </div>
      <div className="container-flf footer-bottom">
        © {year} {company?.tradeName || dict.brand}. {dict.footer.rights}
      </div>
    </footer>
  )
}
