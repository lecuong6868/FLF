import React from 'react'

import { type Lang, mediaAlt, mediaUrl, PROJECT_FIELDS, PROJECT_ROLES, T } from '@/lib/shared'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const projectField = (p: any, lang: Lang) =>
  p.field === 'other' && p.fieldLabel ? p.fieldLabel : PROJECT_FIELDS[p.field]?.[lang] || p.fieldLabel || ''

const ExtIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8" /></svg>
)

/** Thẻ 1 dự án: logo, tên, lĩnh vực, giới thiệu, vai trò FLF, nút sang web dự án. */
export function ProjectCard({ p, lang }: { p: any; lang: Lang }) {
  const logo = mediaUrl(p.logo)
  const role = PROJECT_ROLES[p.role]?.[lang]
  return (
    <article className="pj-card" data-a={p.role || ''} data-b={p.field || ''}>
      <div className="pj-head">
        <div className="pj-logo">{logo ? <img src={logo} alt={mediaAlt(p.logo) || p.name} /> : 'Logo'}</div>
        <div>
          <h3>{p.name}{p.status === 'draft' ? <span className="draft-badge">Nháp</span> : null}</h3>
          <p className="pj-field">{projectField(p, lang)}</p>
        </div>
      </div>
      {p.summary ? <p>{p.summary}</p> : null}
      {role ? <p style={{ margin: 0 }}><span className="tag">{role}</span></p> : null}
      <a className="pj-go" href={p.url || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={p.url ? undefined : 'true'}>
        {T[lang].projectDetail} <ExtIcon />
      </a>
    </article>
  )
}

export function ProjectFeature({ p, lang }: { p: any; lang: Lang }) {
  const t = T[lang]
  const cover = mediaUrl(p.cover)
  return (
    <article className="pj-feature">
      <div className="pj-feature-media" style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        {cover ? <span className="skip">{mediaAlt(p.cover)}</span> : '[Ảnh sản phẩm của dự án]'}
      </div>
      <div className="pj-feature-body">
        <p className="eyebrow" style={{ margin: 0 }}>{t.featured}{PROJECT_ROLES[p.role] ? ` · ${PROJECT_ROLES[p.role][lang]}` : ''}</p>
        <h2>{p.name}</h2>
        {p.summary ? <p className="lead" style={{ margin: 0 }}>{p.summary}</p> : null}
        <div className="pj-meta">
          <span><strong>{t.field}</strong>{projectField(p, lang) || '—'}</span>
          {p.stage ? <span><strong>{t.stage}</strong>{p.stage}</span> : null}
          {p.support ? <span><strong>{t.support}</strong>{p.support}</span> : null}
        </div>
        <div className="btn-row" style={{ marginTop: 8 }}>
          <a className="btn" href={p.url || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={p.url ? undefined : 'true'}>{t.projectDetail} ↗</a>
        </div>
      </div>
    </article>
  )
}
