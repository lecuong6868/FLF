import Script from 'next/script'
import React from 'react'

import { EditorBar } from '@/components/edit/EditKit'
import { getEditor, getSettings, getTheme, href, type Lang, mediaUrl, T, themeCss, TOPICS } from '@/lib/site'

/** Khung chung mọi trang: đầu trang (menu), chân trang, nút hỏi trợ lý, thanh công cụ sửa (khi đăng nhập). */
export async function Shell({ lang, path = '', adminHref = '/admin', children }: { lang: Lang; path?: string; adminHref?: string; children: React.ReactNode }) {
  const [{ settings, nav }, theme, editor] = await Promise.all([getSettings(lang), getTheme(), getEditor()])
  const css = themeCss(theme)
  const t = T[lang]
  const other: Lang = lang === 'vi' ? 'en' : 'vi'
  const logo = mediaUrl(settings?.logo as never) || '/brand/logo-color.png'
  const previewMode = process.env.PREVIEW_MODE === 'true'
  const brand = settings?.companyTradeName?.replace(/\s*\(FLF\)\s*$/, '') || 'First Legal Force'

  // Đường dẫn của mục menu (không có /vi, /en) để đánh dấu trang đang xem
  const bare = (h: string) => h.replace(/^\/(vi|en)(?=\/|#|$)/, '').replace(/^\/?/, '/').split('#')[0]
  const isActive = (h: string) => {
    if (h.includes('#')) return false
    const b = bare(h)
    return b !== '/' && (path === b || path.startsWith(b + '/'))
  }
  const isTopics = (h: string) => bare(h) === '/chuyen-muc'
  const topicLinks = Object.entries(TOPICS).map(([k, v]) => (
    <li key={k}><a href={`/${lang}/chuyen-muc?a=${k}`}>{v[lang]}</a></li>
  ))
  const makeLinks = (mobile: boolean) => nav.map((n, i) => {
    const cur = isActive(n.href) ? { 'aria-current': 'page' as const } : {}
    const ext = n.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return isTopics(n.href) ? (
      <li key={i} className="has-children">
        <a href={href(n.href, lang)} {...cur}>{n.label}{mobile ? null : <span className="nav-caret" aria-hidden="true">▾</span>}</a>
        <ul className="submenu">{topicLinks}</ul>
      </li>
    ) : (
      <li key={i}><a href={href(n.href, lang)} {...cur} {...ext}>{n.label}</a></li>
    )
  })
  const langSwitch = (label: string) => (
    <nav className="lang-switch" aria-label={label}>
      {(['vi', 'en'] as Lang[]).map((l, i) => (
        <React.Fragment key={l}>
          {i ? <span className="sep" aria-hidden="true">·</span> : null}
          {l === lang ? <span aria-current="true">{l.toUpperCase()}</span> : <a href={`/${l}${path}`} lang={l} hrefLang={l}>{l.toUpperCase()}</a>}
        </React.Fragment>
      ))}
    </nav>
  )

  return (
    <div lang={lang} id="top" className="ce-site">
      {css ? <style id="flf-theme" dangerouslySetInnerHTML={{ __html: css }} /> : null}
      {editor ? <EditorBar lang={lang} userName={(editor as { name?: string; email?: string }).name || (editor as { email?: string }).email || ''} role={(editor as { role?: string }).role || ''} adminHref={adminHref} /> : null}
      <a className="skip" href="#main">{t.skip}</a>
      {previewMode && !editor ? (
        <div className="review-bar" role="note"><span>{t.preview}</span><a href={`/${other}${path}`}>{t.other}</a></div>
      ) : null}
      <header className="site-header">
        <div className="wrap hdr">
          <a className="brand" href={`/${lang}`} aria-label={`${brand} — ${t.home}`}>
            <img src={logo} alt="" width={44} height={44} />
            <strong>{brand}</strong>
          </a>
          <nav className="nav-desktop" aria-label="Menu"><ul>{makeLinks(false)}</ul></nav>
          <div className="hdr-tools">
            {langSwitch('Language')}
            <a className="btn btn-sm" href={`/${lang}#lien-he`}>{t.cta}</a>
            <button className="menu-toggle" type="button" data-menu-toggle data-label-open={t.open} data-label-close={t.close}
              aria-expanded="false" aria-controls="mobile-nav" aria-label={t.open}>{t.menu}</button>
          </div>
        </div>
        <div className="menu-backdrop" data-menu-backdrop hidden></div>
        <div className="mobile-panel" id="mobile-nav" data-mobile-panel hidden aria-hidden="true">
          <nav aria-label="Menu mobile">
            <ul>
              {makeLinks(true)}
              <li><a href={`/${lang}#lien-he`}>{t.cta}</a></li>
              <li><a href={`/${other}${path}`} lang={other}>{other === 'en' ? 'English (EN)' : 'Tiếng Việt (VI)'}</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="wrap">
          <div className="ft-grid">
            <div>
              <strong className="ft-brand">{brand}</strong>
              {settings?.companyLegalName ? <>{settings.companyLegalName}<br /></> : null}
              {settings?.taxCode ? <>{t.taxCode}: {settings.taxCode}<br /></> : null}
              {settings?.publicAddress || settings?.registeredAddress || null}
            </div>
            <div>
              <strong>{t.explore}</strong>
              {nav.filter((n) => !n.href.includes('#')).map((n, i) => (
                <React.Fragment key={i}><a href={href(n.href, lang)}>{n.label}</a><br /></React.Fragment>
              ))}
            </div>
            <div>
              <strong>{t.contact}</strong>
              {settings?.phone ? <><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a><br /></> : null}
              {settings?.email ? <><a href={`mailto:${settings.email}`}>{settings.email}</a><br /></> : null}
              {settings?.facebookUrl ? <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a> : null}
              {settings?.facebookUrl && settings?.linkedinUrl ? ' · ' : null}
              {settings?.linkedinUrl ? <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a> : null}
              <div style={{ marginTop: 12 }}>{langSwitch('Language (footer)')}</div>
            </div>
          </div>
          <div className="ft-bottom">© {brand}. {t.disclaimer}</div>
        </div>
      </footer>
      <a className="float-ask" href={`/${lang}#hoi`} aria-label={t.ask}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16v11H9l-5 4z" /></svg>
        <span>{t.ask}</span>
      </a>
      <Script src="/site.js" strategy="afterInteractive" />
    </div>
  )
}
