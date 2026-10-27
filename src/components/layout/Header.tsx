'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { Dictionary } from '@/i18n/dictionaries/vi'
import type { AppLocale } from '@/i18n/config'

type NavItem = { label: string; href: string }

export function Header({
  locale,
  dict,
  items,
}: {
  locale: AppLocale
  dict: Dictionary
  items: NavItem[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const viPath = pathname?.replace(`/${locale}`, '/vi') || '/vi'
  const enPath = pathname?.replace(`/${locale}`, '/en') || '/en'

  const defaults: NavItem[] = [
    { label: dict.nav.about, href: '/about' },
    { label: dict.nav.services, href: '/services' },
    { label: dict.nav.partners, href: '/partners' },
    { label: dict.nav.news, href: '/news' },
    { label: dict.nav.contact, href: '/contact' },
  ]
  const nav = items?.length ? items : defaults

  return (
    <header className="site-header">
      <div className="container-flf site-header-inner">
        <Link href={`/${locale}`} className="logo-link" aria-label={dict.brand}>
          <Image src="/brand/logo-color.png" alt="" width={40} height={40} priority />
          <span>FLF</span>
        </Link>

        <nav aria-label="Main">
          <ul className="nav-list" data-open={open || undefined}>
            {nav.map((item) => {
              const href = `/${locale}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
              const current = pathname === href || pathname?.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link href={href} aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="lang-switch" aria-label={dict.a11y.lang}>
            <Link href={viPath} aria-current={locale === 'vi' ? 'true' : undefined} hrefLang="vi">
              VI
            </Link>
            <Link href={enPath} aria-current={locale === 'en' ? 'true' : undefined} hrefLang="en">
              EN
            </Link>
          </div>
          <button type="button" className="mobile-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="container-flf" style={{ paddingBottom: '1rem' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
            {nav.map((item) => {
              const href = `/${locale}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
              return (
                <li key={href}>
                  <Link href={href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </header>
  )
}
