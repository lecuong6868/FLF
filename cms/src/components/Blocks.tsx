import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { AskBox } from '@/components/AskBox'
import { ContactForm } from '@/components/ContactForm'
import { Filters } from '@/components/Filters'
import { ProjectCard, ProjectFeature } from '@/components/ProjectCard'
import { DOC_FIELDS, DOC_STATUS, PROJECT_FIELDS, PROJECT_ROLES, href, type Lang, mediaAlt, mediaUrl, T, TOPICS } from '@/lib/shared'

/* eslint-disable @typescript-eslint/no-explicit-any */
type B = Record<string, any>

/** Dữ liệu tự động cho các khối "Dự án", "VBPL + Chuyên mục" (trang lấy sẵn rồi truyền vào). */
export type BlockData = {
  projects?: any[]
  docs?: any[]
  articles?: any[]
  settings?: any
}

const PAD: Record<string, string> = { compact: '48px', large: '128px' }
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
  text ? <>{text.split('\n').map((l, i, a) => <React.Fragment key={i}>{l}{i < a.length - 1 ? <br /> : null}</React.Fragment>)}</> : null

const Btn = ({ l, lang, outline, light }: { l?: B; lang: Lang; outline?: boolean; light?: boolean }) =>
  l?.label ? <a className={outline ? `btn-outline${light ? ' light' : ''}` : 'btn'} href={href(l.href || '#', lang)}>{l.label}</a> : null

const Arrow = ({ l, lang }: { l?: B; lang: Lang }) =>
  l?.label ? <a className="link-arrow" href={href(l.href || '#', lang)}>{l.label}</a> : null

const Eyebrow = ({ t }: { t?: string }) => (t ? <p className="eyebrow">{t}</p> : null)

const ICON_PATHS: Record<string, React.ReactNode> = {
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  board: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 9h18M8 13h3M8 16h6" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h4" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  deal: <><path d="M3 12l4-4 4 3 3-3 7 7-4 4-6-5-4 3z" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="1" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
}
export const Icon = ({ name, color }: { name?: string; color?: string }) => (
  <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke={color || 'var(--red)'} strokeWidth="1.6">{ICON_PATHS[name || 'shield'] || ICON_PATHS.shield}</svg>
)
const accColor = (a?: string) => (a === 'red' ? 'var(--red)' : a === 'green' ? '#1f5a44' : 'var(--navy)')

const lines = (t?: string) => (t || '').split('\n').map((s) => s.trim()).filter(Boolean)
const fmtDate = (d?: string) => (d ? String(d).slice(0, 10).split('-').reverse().join('/') : '')

/* ---------------- Khối mới (thiết kế A) ---------------- */

function HeroAsk({ b, lang }: { b: B; lang: Lang }) {
  const img = mediaUrl(b.image)
  return (
    <section className="hero on-dark" style={ap(b)}>
      {img ? <div className="hero-bg" style={{ backgroundImage: `url(${img})` }} aria-hidden="true" /> : null}
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>{b.headline}</h1>
          {b.sub ? <p className="hero-sub">{b.sub}</p> : null}
          <div className="btn-row"><Btn l={b.primary} lang={lang} /><Btn l={b.secondary} lang={lang} outline light /></div>
        </div>
        <AskBox lang={lang} eyebrow={b.askEyebrow} title={b.askTitle} suggestions={(b.suggestions || []).map((s: B) => s.text).filter(Boolean)} disclaimer={b.disclaimer} />
      </div>
    </section>
  )
}

function PageHero({ b, lang }: { b: B; lang: Lang }) {
  return (
    <section className="page-hero on-dark" style={ap(b)}>
      <div className="wrap">
        <h1>{b.title}</h1>
        {b.lead ? <p className="lead">{b.lead}</p> : null}
        {b.primary?.label || b.secondary?.label ? <div className="btn-row"><Btn l={b.primary} lang={lang} /><Btn l={b.secondary} lang={lang} outline light /></div> : null}
      </div>
    </section>
  )
}

function SecHead({ b, lang, more }: { b: B; lang: Lang; more?: B }) {
  if (!b.eyebrow && !b.title) return null
  return (
    <div className="sec-head">
      <div><Eyebrow t={b.eyebrow} />{b.title ? <h2 className="h2">{b.title}</h2> : null}</div>
      <Arrow l={more} lang={lang} />
    </div>
  )
}

function Services({ b, lang }: { b: B; lang: Lang }) {
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap">
        <SecHead b={b} lang={lang} more={b.more} />
        <div className="grid">
          {(b.items || []).map((it: B, i: number) => (
            <article className="svc-card" key={it.id || i}>
              <Icon name={it.icon} />
              {it.title ? <h3>{it.title}</h3> : null}
              {it.text ? <p>{it.text}</p> : null}
              {lines(it.bullets).length ? <ul>{lines(it.bullets).map((x, k) => <li key={k}>{x}</li>)}</ul> : null}
              <Arrow l={it.link} lang={lang} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Special({ b }: { b: B }) {
  return (
    <section id={b.anchor || undefined} className="sec sec-navy on-dark" style={ap(b)}>
      <div className="wrap">
        <Eyebrow t={b.eyebrow} />
        {b.title ? <h2 className="h2" style={{ marginBottom: b.lead ? 16 : 48 }}>{b.title}</h2> : null}
        {b.lead ? <p className="lead" style={{ margin: '0 0 40px', maxWidth: 760 }}>{b.lead}</p> : null}
        <div className="grid-tight">
          {(b.items || []).map((it: B, i: number) => (
            <article className="sp-item" key={it.id || i}>
              <span className="sp-num">{String(i + 1).padStart(2, '0')}</span>
              {it.title ? <h3>{it.title}</h3> : null}
              {it.text ? <p>{it.text}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsTeaser({ b, lang, data }: { b: B; lang: Lang; data: BlockData }) {
  const list = (data.projects || []).slice(0, Math.max(1, Number(b.count) || 3))
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap">
        <SecHead b={b} lang={lang} more={b.more} />
        {list.length ? <div className="grid">{list.map((p) => <ProjectCard key={p.id} p={p} lang={lang} />)}</div>
          : <p className="empty">{lang === 'vi' ? 'Chưa có dự án nào. Đăng nhập rồi vào trang Dự án để thêm.' : 'No projects yet.'}</p>}
      </div>
    </section>
  )
}

function ProjectsList({ b, lang, data }: { b: B; lang: Lang; data: BlockData }) {
  const all = data.projects || []
  const feat = b.showFeatured !== false ? all.find((p) => p.featured) : undefined
  const rest = all.filter((p) => p !== feat)
  const vi = lang === 'vi'
  const opts = (m: Record<string, { vi: string; en: string }>) => Object.entries(m).map(([value, l]) => ({ value, label: l[lang] }))
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap">
        {b.title ? <SecHead b={b} lang={lang} /> : null}
        {feat ? <div style={{ marginBottom: 40 }}><ProjectFeature p={feat} lang={lang} /></div> : null}
        <Filters a={opts(PROJECT_ROLES)} b={opts(PROJECT_FIELDS)} labelA={vi ? 'Vai trò FLF' : 'FLF role'} labelB={vi ? 'Lĩnh vực' : 'Field'}
          allA={vi ? 'Tất cả' : 'All'} allB={vi ? 'Tất cả' : 'All'} empty={vi ? 'Không có dự án phù hợp.' : 'No matching projects.'}>
          <div className="grid">{rest.map((p) => <ProjectCard key={p.id} p={p} lang={lang} />)}</div>
        </Filters>
        {!all.length ? <p className="empty">{vi ? 'Chưa có dự án nào.' : 'No projects yet.'}</p> : null}
      </div>
    </section>
  )
}

function StepCards({ b }: { b: B }) {
  return (
    <section id={b.anchor || undefined} className="sec sec-white" style={ap(b)}>
      <div className="wrap">
        <Eyebrow t={b.eyebrow} />
        {b.title ? <h2 className="h2" style={{ marginBottom: 48 }}>{b.title}</h2> : null}
        <ol className="grid">
          {(b.items || []).map((it: B, i: number) => (
            <li className={`st-card acc-${it.accent || 'navy'}`} key={it.id || i}>
              <span className="st-num">{i + 1}</span>
              <h3>{it.title}</h3>
              {it.text ? <p>{it.text}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StepList({ b }: { b: B }) {
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap two-col">
        <div><Eyebrow t={b.eyebrow} />{b.title ? <h2 className="h2">{b.title}</h2> : null}{b.note ? <p className="lead" style={{ margin: 0, whiteSpace: 'pre-line' }}>{b.note}</p> : null}</div>
        <ol className="sl">
          {(b.items || []).map((it: B, i: number) => (
            <li key={it.id || i}><span className="sl-num">{String(i + 1).padStart(2, '0')}</span><div><h3>{it.title}</h3>{it.text ? <p>{it.text}</p> : null}</div></li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Intro({ b }: { b: B }) {
  const paras = (b.body || '').split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean)
  return (
    <section id={b.anchor || undefined} className="sec sec-white" style={ap(b)}>
      <div className="wrap two-col">
        <div><Eyebrow t={b.eyebrow} />{b.title ? <h2 className="h2" style={{ margin: 0 }}>{b.title}</h2> : null}</div>
        <div>
          {b.lead ? <p className="intro-lead">{b.lead}</p> : null}
          <div className="intro-body">{paras.map((p: string, i: number) => <p key={i}>{p}</p>)}</div>
        </div>
      </div>
    </section>
  )
}

function FeatureCards({ b, lang }: { b: B; lang: Lang }) {
  return (
    <section id={b.anchor || undefined} className="sec sec-sand" style={ap(b)}>
      <div className="wrap">
        <Eyebrow t={b.eyebrow} />
        {b.title ? <h2 className="h2" style={{ marginBottom: 40 }}>{b.title}</h2> : null}
        <div className="grid">
          {(b.items || []).map((it: B, i: number) => (
            <article className={`feat-card acc-${it.accent || 'navy'}`} key={it.id || i}>
              <Icon name={it.icon} color={accColor(it.accent)} />
              {it.title ? <h3>{it.title}</h3> : null}
              {it.text ? <p>{it.text}</p> : null}
            </article>
          ))}
        </div>
        {b.more?.label ? <p style={{ margin: '32px 0 0' }}><Arrow l={b.more} lang={lang} /></p> : null}
      </div>
    </section>
  )
}

export function DocRow({ d, lang }: { d: B; lang: Lang }) {
  const st = DOC_STATUS[d.docStatus]
  const f = DOC_FIELDS[d.docField]
  const date = fmtDate(d.effectiveAt || d.issuedAt || d.publishedAt)
  const url = `/${lang}/quy-dinh-moi/${d.slug}`
  return (
    <article className="doc-row" data-a={d.docStatus || ''} data-b={d.docField || ''} data-search={`${d.title} ${d.docNumber || ''}`.toLowerCase()}>
      <p className="doc-meta">
        {st ? <span className={`st st-${st.tone}`}>{st[lang]}</span> : null}
        {f ? <span>· {f[lang]}</span> : null}
        {d.docNumber ? <span>· {d.docNumber}</span> : null}
        {date ? <span>· {d.effectiveAt ? T[lang].effect : ''} {date}</span> : null}
        {d.status && d.status !== 'published' ? <span className="draft-badge">{d.status === 'pending_review' ? 'Chờ duyệt' : 'Nháp'}</span> : null}
      </p>
      <h3><a href={url}>{d.title}</a></h3>
      {d.excerpt ? <p>{d.excerpt}</p> : null}
    </article>
  )
}

function News({ b, lang, data }: { b: B; lang: Lang; data: BlockData }) {
  const t = T[lang]
  const docs = (data.docs || []).slice(0, Math.max(1, Number(b.count) || 3))
  const arts = (data.articles || []).slice(0, 2)
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap layout" style={{ gap: 56 }}>
        <div className="main-col">
          <div className="sec-head" style={{ marginBottom: 20 }}>
            <div><Eyebrow t={b.eyebrow} />{b.title ? <h2 className="h2">{b.title}</h2> : null}</div>
            <a className="link-arrow" href={`/${lang}/quy-dinh-moi`}>{t.seeAll}</a>
          </div>
          <div className="doc-list">
            {docs.length ? docs.map((d) => <DocRow key={d.id} d={d} lang={lang} />) : <p className="empty">{t.noDocs}</p>}
          </div>
        </div>
        <aside className="topics-card" style={{ flex: '1 1 340px', minWidth: 0 }}>
          <h2>{b.topicsTitle || 'Chuyên mục'}</h2>
          <div className="chip-row" style={{ marginBottom: 20 }}>
            {Object.entries(TOPICS).map(([k, v]) => <a key={k} className="chip" href={`/${lang}/chuyen-muc?a=${k}`}>{v[lang]}</a>)}
          </div>
          {arts.map((a) => (
            <div className="mini" key={a.id}>
              <p className="mini-kicker">{a.topic ? TOPICS[a.topic]?.[lang] : 'Chuyên mục'}</p>
              <h3><a href={`/${lang}/chuyen-muc/${a.slug}`}>{a.title}</a></h3>
            </div>
          ))}
          <a className="link-arrow" href={`/${lang}/chuyen-muc`} style={{ display: 'inline-block', marginTop: 12 }}>{t.seeAll}</a>
        </aside>
      </div>
    </section>
  )
}

function ServiceDetail({ b, lang }: { b: B; lang: Lang }) {
  const t = T[lang]
  return (
    <section id={b.anchor || undefined} className="sec sd" style={{ padding: '80px 0', ...ap(b) }}>
      <div className="wrap two-col">
        <div>
          <Icon name={b.icon} />
          <h2>{b.title}</h2>
          {b.text ? <p className="lead" style={{ margin: '0 0 22px' }}>{b.text}</p> : null}
          {b.situation ? <><p className="sd-label">{t.commonCase}</p><p style={{ margin: '0 0 24px', color: 'var(--body)' }}>{b.situation}</p></> : null}
          <Btn l={b.cta} lang={lang} />
        </div>
        <div>
          {lines(b.items).length ? <><p className="sd-label">{t.whatWeDo}</p><ul className="sd-list">{lines(b.items).map((x, i) => <li key={i}>{x}</li>)}</ul></> : null}
          {b.deliverables ? <><p className="sd-label">{t.youGet}</p><p style={{ margin: 0, color: 'var(--body)' }}>{b.deliverables}</p></> : null}
        </div>
      </div>
    </section>
  )
}

function Faq({ b }: { b: B }) {
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap" style={{ maxWidth: 884 }}>
        <Eyebrow t={b.eyebrow} />
        {b.title ? <h2 className="h2" style={{ marginBottom: 24 }}>{b.title}</h2> : null}
        {(b.items || []).map((it: B, i: number) => (
          <details className="faq" key={it.id || i} open={i === 0}><summary>{it.q}</summary>{it.a ? <p>{it.a}</p> : null}</details>
        ))}
      </div>
    </section>
  )
}

function CtaBand({ b, lang }: { b: B; lang: Lang }) {
  return (
    <section className={`sec ${b.dark ? 'sec-navy on-dark' : 'sec-white'}`} style={{ padding: '72px 0', ...ap(b) }}>
      <div className="wrap cta-band">
        <div style={{ maxWidth: 700 }}>
          {b.title ? <h2 className="h2">{b.title}</h2> : null}
          {b.lead ? <p className="lead" style={{ margin: '12px 0 0' }}>{b.lead}</p> : null}
        </div>
        <div className="btn-row"><Btn l={b.primary} lang={lang} /><Btn l={b.secondary} lang={lang} outline light={!!b.dark} /></div>
      </div>
    </section>
  )
}

function Contact({ b, lang, data }: { b: B; lang: Lang; data: BlockData }) {
  const s = data.settings || {}
  return (
    <section id={b.anchor || 'lien-he'} className="sec sec-white" style={ap(b)}>
      <div className="wrap two-col">
        <div>
          <Eyebrow t={b.eyebrow} />
          {b.title ? <h2 className="h2">{b.title}</h2> : null}
          {b.lead ? <p className="lead" style={{ margin: '0 0 28px' }}><Lines text={b.lead} /></p> : null}
          <p className="contact-info">
            {s.publicAddress || s.registeredAddress ? <>{s.publicAddress || s.registeredAddress}<br /></> : null}
            {s.phone ? <><a href={`tel:${String(s.phone).replace(/\s/g, '')}`}>{s.phone}</a><br /></> : null}
            {s.email ? <a href={`mailto:${s.email}`}>{s.email}</a> : null}
          </p>
        </div>
        <div>
          <ContactForm lang={lang} button={b.button} consentText={b.consent} />
          {b.privacy ? <p className="privacy"><Lines text={b.privacy} /></p> : null}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Khối cũ (vẫn hiển thị nếu còn dùng) ---------------- */

function OldHero({ b, lang }: { b: B; lang: Lang }) {
  return <PageHero b={{ ...b, title: b.headline, lead: b.sub }} lang={lang} />
}
function OldCards({ b, lang }: { b: B; lang: Lang }) {
  if (b.style === 'navy') return <Special b={{ ...b, eyebrow: b.index, lead: b.lead || b.note }} />
  return (
    <section id={b.anchor || undefined} className={`sec ${b.style === 'services' ? 'sec-sand' : ''}`} style={ap(b)}>
      <div className="wrap">
        <Eyebrow t={b.index} />
        {b.title ? <h2 className="h2">{b.title}</h2> : null}
        {b.lead ? <p className="lead"><Lines text={b.lead} /></p> : null}
        {b.note ? <p className="lead" style={{ fontSize: 16 }}><Lines text={b.note} /></p> : null}
        <div className="grid" style={{ marginTop: 32 }}>
          {(b.items || []).map((it: B, i: number) => {
            const img = mediaUrl(it.image)
            return (
              <article className="feat-card" key={it.id || i}>
                {img ? <img src={img} alt={mediaAlt(it.image)} loading="lazy" style={{ borderRadius: 6 }} /> : null}
                {it.title ? <h3>{it.title}</h3> : null}
                {it.text ? <p>{it.text}</p> : null}
                <Arrow l={it.link} lang={lang} />
              </article>
            )
          })}
        </div>
        {b.more?.label ? <p style={{ margin: '28px 0 0' }}><Arrow l={b.more} lang={lang} /></p> : null}
      </div>
    </section>
  )
}
function OldSteps({ b }: { b: B }) {
  return b.style === 'intake'
    ? <StepList b={{ ...b, eyebrow: b.index }} />
    : <StepCards b={{ ...b, eyebrow: b.index, items: (b.items || []).map((x: B, i: number) => ({ ...x, accent: ['red', 'navy', 'red', 'green'][i % 4] })) }} />
}
function Text({ b }: { b: B }) {
  const img = mediaUrl(b.image)
  return (
    <section id={b.anchor || undefined} className="sec" style={ap(b)}>
      <div className="wrap" style={{ maxWidth: 884 }}>
        <Eyebrow t={b.index} />
        {b.title ? <h2 className="h2">{b.title}</h2> : null}
        {img ? <img src={img} alt={mediaAlt(b.image)} style={{ borderRadius: 8, margin: '12px 0 20px' }} /> : null}
        {b.content ? <div className="article-body" style={{ padding: 0 }}><RichText data={b.content} /></div> : null}
      </div>
    </section>
  )
}

export function BlockView({ b, lang, isHome, data = {} }: { b: B; lang: Lang; isHome: boolean; data?: BlockData }) {
  switch (b.blockType) {
    case 'heroAsk': return <HeroAsk b={b} lang={lang} />
    case 'pageHero': return <PageHero b={b} lang={lang} />
    case 'services': return <Services b={b} lang={lang} />
    case 'special': return <Special b={b} />
    case 'projectsTeaser': return <ProjectsTeaser b={b} lang={lang} data={data} />
    case 'projectsList': return <ProjectsList b={b} lang={lang} data={data} />
    case 'stepCards': return <StepCards b={b} />
    case 'stepList': return <StepList b={b} />
    case 'intro': return <Intro b={b} />
    case 'featureCards': return <FeatureCards b={b} lang={lang} />
    case 'news': return <News b={b} lang={lang} data={data} />
    case 'serviceDetail': return <ServiceDetail b={b} lang={lang} />
    case 'faq': return <Faq b={b} />
    case 'ctaBand': return <CtaBand b={b} lang={lang} />
    case 'contact': return <Contact b={b} lang={lang} data={data} />
    // khối cũ
    case 'hero': return isHome ? <HeroAsk b={{ ...b }} lang={lang} /> : <OldHero b={b} lang={lang} />
    case 'cards': return <OldCards b={b} lang={lang} />
    case 'steps': return <OldSteps b={b} />
    case 'text': return <Text b={b} />
    case 'cta': return <CtaBand b={b} lang={lang} />
    default: return null
  }
}

export function Blocks({ blocks, lang, isHome, data }: { blocks: B[] | null | undefined; lang: Lang; isHome: boolean; data?: BlockData }) {
  return <>{(blocks || []).filter((b) => !b.appearance?.hidden).map((b, i) => <BlockView key={b.id || i} b={b} lang={lang} isHome={isHome} data={data} />)}</>
}
