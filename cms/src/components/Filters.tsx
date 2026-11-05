'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type Opt = { value: string; label: string }

/**
 * Bộ lọc 2 hàng (vd: Vai trò × Lĩnh vực, Tình trạng × Lĩnh vực) + ô tìm (tùy chọn).
 * Ẩn/hiện các phần tử con có data-a / data-b / data-search. Nhớ lựa chọn trên URL (?a=…&b=…).
 */
export function Filters({ a, b, labelA, labelB, allA, allB, search, empty, children }: {
  a: Opt[]; b: Opt[]; labelA: string; labelB: string; allA: string; allB: string
  search?: string; empty: string; children: React.ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const [fa, setFa] = useState('all')
  const [fb, setFb] = useState('all')
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(-1)

  useEffect(() => {
    const u = new URLSearchParams(window.location.search)
    if (u.get('a')) setFa(u.get('a')!)
    if (u.get('b')) setFb(u.get('b')!)
  }, [])

  useEffect(() => {
    const items = Array.from(box.current?.querySelectorAll<HTMLElement>('[data-a]') || [])
    let n = 0
    const qq = q.trim().toLowerCase()
    for (const el of items) {
      const ok = (fa === 'all' || el.dataset.a === fa) && (fb === 'all' || el.dataset.b === fb) && (!qq || (el.dataset.search || el.textContent || '').toLowerCase().includes(qq))
      el.hidden = !ok
      if (ok) n++
    }
    setShown(n)
    const u = new URL(window.location.href)
    fa === 'all' ? u.searchParams.delete('a') : u.searchParams.set('a', fa)
    fb === 'all' ? u.searchParams.delete('b') : u.searchParams.set('b', fb)
    window.history.replaceState(null, '', u.toString())
  }, [fa, fb, q])

  const row = (label: string, all: string, opts: Opt[], cur: string, set: (v: string) => void) => (
    <div className="filter-row" role="group" aria-label={label}>
      <span className="filter-label">{label}</span>
      {[{ value: 'all', label: all }, ...opts].map((o) => (
        <button key={o.value} type="button" className="chip" aria-pressed={cur === o.value} onClick={() => set(o.value)}>{o.label}</button>
      ))}
    </div>
  )
  const usedA = useMemo(() => a, [a])
  return (
    <>
      <div className="filter-bar"><div className="wrap">
        {row(labelA, allA, usedA, fa, setFa)}
        {b.length ? row(labelB, allB, b, fb, setFb) : null}
        {search ? <input className="search-box" type="search" placeholder={search} aria-label={search} value={q} onChange={(e) => setQ(e.target.value)} /> : null}
      </div></div>
      <div ref={box}>
        {children}
        {shown === 0 ? <div className="wrap"><p className="empty" role="status">{empty}</p></div> : null}
      </div>
    </>
  )
}
