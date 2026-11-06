import Script from 'next/script'
import React from 'react'

import { EditorBar } from '@/components/edit/EditKit'
import { getEditor, getSettings, getTheme, href, type Lang, mediaUrl, T, themeCss, TOPICS } from '@/lib/site'

export async function Shell({ lang, path = '', adminHref = '/admin', children }: { lang: Lang; path?: string; adminHref?: string; children: React.ReactNode }) {
  const [{ settings, nav }, theme, editor] = await Promise.all([getSettings(lang), getTheme(), getEditor()])
  const css = themeCss(theme)
  const t = T[lang]
  const other: Lang = lang === 'vi' ? 'en' : 'vi'
  const logo = mediaUrl(settings?.logo as never) || '/brand/logo-color.png'
  const previewMode = process.env.PREVIEW_MODE === 'true'
  // Mục "Chuyên mục" tự có menu xổ xuống các chủ đề (Đầu tư, Thuế…)
  const isTopics = (h: string) => /^\/?(vi\/|en\/)?chuyen-muc\/?$/.test(h.replace(/^\/(vi|en)(?=\/)/, ''))
  const topicLinks = Object.entries(TOPICS).map(([k, v]) => (
    <li key={k}><a href={`/${lang}/chuyen-muc?chu-de=${k}`}>{v[lang]}</a></li>
  ))
  const makeLinks = (mobile: boolean) => nav.map((n, i) =>
    isTopics(n.href) ? (
      <li key={i} className="nav-item has-children">
        <a href={href(n.href, lang)} className={mobile ? undefined : 'nav-parent'} aria-haspopup="true">
          {n.label}{mobile ? null : <span className="nav-caret" aria-hidden="true">▾</span>}
        </a>
        <ul className="submenu">{topicLinks}</ul>
      </li>
    ) : (
      <li key={i}>
        <a href={href(n.href, lang)} {...(n.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {n.label}
        </a>
      </li>
    ),
  )
  const langSwitch = (label: string) => (
    <nav className="lang-switch" aria-label={label}>
      {(['vi', 'en'] as Lang[]).map((l) =>
        l === lang ? (
          <span key={l} aria-current="true">{l.toUpperCase()}</span>
        ) : (
          <a key={l} href={`/${l}${path}`} lang={l} hrefLang={l}>{l.toUpperCase()}</a>
        ),
      )}
    </nav>
  )

  return (
    <div lang={lang} id="top" className="ce-site">
      {css ? <style id="flf-theme" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {editor ? <EditorBar lang={lang} userName={(editor as { name?: string; email?: string }).name || (editor as { email?: string }).email || ''} role={(editor as { role?: string }).role || ''} adminHref={adminHref} /> : null}
      <a className="skip" href="#main">{t.skip}</a>
      {previewMode && !editor ? (
        <div className="review-bar" role="note">
          <span>{t.preview}</span>
          <a href={`/${other}${path}`}>{t.other}</a>
        </div>
      ) : null}
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href={`/${lang}`} aria-label={`${settings?.companyTradeName || 'First Legal Force'} — ${t.home}`}>
            <img src={logo} alt="Logo First Legal Force" width={52} height={52} />
            <span className="brand-lockup">
              <strong>First Legal Force</strong>
              <em>{lang === 'vi' ? 'Tư vấn đa lĩnh vực' : 'Multidisciplinary advisory'}</em>
            </span>
          </a>
          <nav className="nav-desktop" aria-label="Menu"><ul>{makeLinks(false)}</ul></nav>
          <div className="header-tools">
            {langSwitch('Language')}
            <a className="btn btn-sm header-cta" href={`/${lang}#contact`}>{t.cta}</a>
            <button className="menu-toggle" type="button" data-menu-toggle data-label-open={t.open} data-label-close={t.close}
              aria-expanded="false" aria-controls="mobile-nav" aria-label={t.open}>
              {t.menu}
            </button>
          </div>
        </div>
        <div className="menu-backdrop" data-menu-backdrop hidden></div>
        <div className="mobile-panel" id="mobile-nav" data-mobile-panel hidden aria-hidden="true">
          <nav aria-label="Menu mobile">
            <ul>
              {makeLinks(true)}
              <li><a href={`/${other}${path}`} lang={other}>{other === 'en' ? 'English (EN)' : 'Tiếng Việt (VI)'}</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <img src="/brand/first-legal-force.png" alt="FIRST - LEGAL FORCE" className="wordmark" width={220} height={80} />
            {settings?.companyLegalName ? <p>{settings.companyLegalName}</p> : null}
            {settings?.taxCode ? <p>{t.taxCode}: {settings.taxCode}</p> : null}
            {settings?.publicAddress ? <p className="muted">{settings.publicAddress}</p> : null}
            {settings?.phone ? <p>{settings.phone}</p> : null}
            {settings?.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
          </div>
          <div className="footer-social">
            <span>{t.connect}</span>
            {settings?.facebookUrl ? <a href={settings.facebookUrl} rel="noopener noreferrer" target="_blank">Facebook</a> : null}
            {settings?.linkedinUrl ? <a href={settings.linkedinUrl} rel="noopener noreferrer" target="_blank">LinkedIn</a> : null}
            {langSwitch('Language (footer)')}
          </div>
        </div>
      </footer>
      <Script src="/site.js" strategy="afterInteractive" />
    </div>
  )
}
