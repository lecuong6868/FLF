/* eslint-disable @next/next/no-html-link-for-pages -- liên kết rời /admin sang web, cần tải lại trang đầy đủ */
import React from 'react'

/** Liên kết trong menu trái của /admin. */
export default function EditOnSiteNav() {
  return (
    <a href="/vi" style={{ display: 'block', margin: '1rem 0', padding: '10px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
      ✏️ Sửa trực tiếp trên web
    </a>
  )
}
