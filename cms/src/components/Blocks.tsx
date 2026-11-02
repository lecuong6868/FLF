import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { href, type Lang, mediaAlt, mediaUrl, T } from '@/lib/shared'

/* eslint-disable @typescript-eslint/no-explicit-any */
type B = Record<string, any>

const PAD: Record<string, string> = { compact: '2.5rem', large: '7rem' }
/** Màu nền / chữ / khoảng cách riêng của một phần. */
export function ap(b: B): React.CSSProperties {
  const a = b.appearance || {}
  const st: React.CSSProperties = {}
  if (a.bg) st.background = a.bg
  if (a.text) st.color = a.text
  if (PAD[a.spacing]) { st.paddingTop = PAD[a.spacing]; st.paddingBottom = PAD[a.spacing] }
  return st
}

const Lines = ({ text }: { text?: string | null }) =>
  text ? (
    <>
      {text.split('\n').map((l, i, a) => (
        <React.Fragment key={i}>
          {l}
          {i < a.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </>
  ) : null

const Link = ({ l, lang, cls }: { l?: B; lang: Lang; cls: string }) =>
  l?.label ? <a className={cls} href={href(l.href || '#', lang)}>{l.label}</a> : null

const Img = ({ m, cls }: { m: any; cls?: string }) => {
  const u = mediaUrl(m)
  return u ? <img className={cls} src={u} alt={mediaAlt(m)} loading="lazy" style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} /> : null
}

function Hero({ b, lang, page }: { b: B; lang: Lang; page: boolean }) {
  const img = mediaUrl(b.image)
  return (
    <section style={ap(b)} className={page ? 'page-hero' : 'hero'}>
      <div className="hero-plane" aria-hidden="true">
        {img ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} /> : null}
        <div className="hero-plane-shade"></div>
        {img ? null : <img className="hero-mark" src="/brand/logo-color.png" alt="" />}
      </div>
      <div className="wrap hero-copy">
        {b.eyebrow ? <p className="eyebrow">{b.eyebrow}</p> : null}
        {b.masthead ? <p className="masthead">{b.masthead}</p> : null}
        <h1><Lines text={b.headline} /></h1>
        {b.sub ? <p className="hero-sub"><Lines text={b.sub} /></p> : null}
        <div className="hero-cta">
          <Link l={b.primary} lang={lang} cls="btn" />
          <Link l={b.secondary} lang={lang} cls="text-link" />
        </div>
      </div>
    </section>
  )
}

function Cards({ b, lang }: { b: B; lang: Lang }) {
  const style = b.style || 'about'
  const items: B[] = b.items || []
  const sectionCls = { about: 'about', services: 'services', why: 'about', navy: 'band-navy' }[style as string] || 'about'
  const card = (it: B, i: number, cls: string) => (
    <article className={cls} key={i}>
      <Img m={it.image} />
      {it.title ? <h3>{it.title}</h3> : null}
      {it.text ? <p><Lines text={it.text} /></p> : null}
      {it.link?.label ? <p><Link l={it.link} lang={lang} cls="text-link" /></p> : null}
    </article>
  )
  const cols = b.columns && b.columns !== 'auto' ? { display: 'grid', gridTemplateColumns: `repeat(${b.columns}, minmax(0, 1fr))`, gap: '1.5rem' } as React.CSSProperties : undefined
  const grid =
    cols ? (
      <div className="cols-grid" style={cols}>{items.map((it, i) => card(it, i, style === 'services' ? 'service-item' : style === 'about' ? 'point' : 'why-item'))}</div>
    ) : style === 'services' ? (
      <div className="services-rail">{items.map((it, i) => card(it, i, 'service-item'))}</div>
    ) : style === 'about' ? (
      <div className="about-grid">{items.map((it, i) => card(it, i, 'point'))}</div>
    ) : (
      <div className="why-grid">{items.map((it, i) => card(it, i, 'why-item'))}</div>
    )
  return (
    <section style={ap(b)} id={b.anchor || undefined} className={`section ${sectionCls}`}>
      <div className={`wrap${style === 'about' && !items.some((x) => x.image) ? ' narrow' : ''}`}>
        <div className="section-head">
          {b.index ? <p className="section-index">{b.index}</p> : null}
          {b.title ? <h2>{b.title}</h2> : null}
          {b.lead ? <p className="lead dropcap"><Lines text={b.lead} /></p> : null}
          {b.note ? <p className="note"><Lines text={b.note} /></p> : null}
        </div>
        {items.length ? grid : null}
        {b.more?.label ? <p style={{ margin: '1.75rem 0 0' }}><Link l={b.more} lang={lang} cls="text-link" /></p> : null}
      </div>
    </section>
  )
}

function Steps({ b }: { b: B }) {
  const items: B[] = b.items || []
  const n = (i: number) => String(i + 1).padStart(2, '0')
  if (b.style === 'intake') {
    return (
      <section style={ap(b)} id={b.anchor || undefined} className="section services">
        <div className="wrap">
          {b.index ? <p className="section-index">{b.index}</p> : null}
          {b.title ? <h2>{b.title}</h2> : null}
          {b.note ? <p className="note"><Lines text={b.note} /></p> : null}
          <ol className="intake-list">
            {items.map((s, i) => (
              <li key={i}><span className="n">{n(i)}</span><div><h3>{s.title}</h3><p><Lines text={s.text} /></p></div></li>
            ))}
          </ol>
        </div>
      </section>
    )
  }
  return (
    <section style={ap(b)} id={b.anchor || undefined} className="section process">
      <div className="wrap">
        {b.index ? <p className="section-index light">{b.index}</p> : null}
        {b.title ? <h2>{b.title}</h2> : null}
        {b.note ? <p className="note"><Lines text={b.note} /></p> : null}
        <ol className="steps">
          {items.map((s, i) => (
            <li className="step" key={i}><span className="step-n">{n(i)}</span><div><h3>{s.title}</h3><p><Lines text={s.text} /></p></div></li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Text({ b }: { b: B }) {
  return (
    <section style={ap(b)} id={b.anchor || undefined} className="section about">
      <div className="wrap narrow">
        {b.index ? <p className="section-index">{b.index}</p> : null}
        {b.title ? <h2>{b.title}</h2> : null}
        <Img m={b.image} />
        {b.content ? <div className="article-body"><RichText data={b.content} /></div> : null}
      </div>
    </section>
  )
}

function Contact({ b, lang }: { b: B; lang: Lang }) {
  const t = T[lang]
  return (
    <section style={ap(b)} id={b.anchor || 'contact'} className="section contact">
      <div className="wrap contact-frame">
        {b.title ? <h2>{b.title}</h2> : null}
        {b.lead ? <p className="lead"><Lines text={b.lead} /></p> : null}
        <form className="contact-form" data-preview-form action="#" method="post" noValidate>
          <label>{t.name}<input type="text" name="name" autoComplete="name" /></label>
          <label>{t.email}<input type="email" name="email" autoComplete="email" /></label>
          <label>{t.message}<textarea name="message"></textarea></label>
          {b.consent ? (
            <label className="consent"><input type="checkbox" name="consent" value="1" /><span>{b.consent}</span></label>
          ) : null}
          <div className="form-actions"><button className="btn" type="submit">{b.button || t.send}</button></div>
          <p className="form-note" data-form-note hidden tabIndex={-1} role="status">{t.formNote}</p>
        </form>
        {b.privacy ? <p className="privacy"><Lines text={b.privacy} /></p> : null}
      </div>
    </section>
  )
}

function Cta({ b, lang }: { b: B; lang: Lang }) {
  return (
    <section style={ap(b)} className="cta-band">
      <div className="wrap">
        {b.title ? <h2>{b.title}</h2> : null}
        <div className="hero-cta">
          <Link l={b.primary} lang={lang} cls="btn" />
          <Link l={b.secondary} lang={lang} cls="text-link" />
        </div>
      </div>
    </section>
  )
}

export function BlockView({ b, lang, isHome }: { b: B; lang: Lang; isHome: boolean }) {
  switch (b.blockType) {
    case 'hero': return <Hero b={b} lang={lang} page={!isHome} />
    case 'cards': return <Cards b={b} lang={lang} />
    case 'steps': return <Steps b={b} />
    case 'text': return <Text b={b} />
    case 'contact': return <Contact b={b} lang={lang} />
    case 'cta': return <Cta b={b} lang={lang} />
    default: return null
  }
}

export function Blocks({ blocks, lang, isHome }: { blocks: B[] | null | undefined; lang: Lang; isHome: boolean }) {
  return (
    <>
      {(blocks || []).filter((b) => !b.appearance?.hidden).map((b, i) => (
        <BlockView key={b.id || i} b={b} lang={lang} isHome={isHome} />
      ))}
    </>
  )
}
