/* eslint-disable @next/next/no-html-link-for-pages -- liên kết rời /admin sang web, cần tải lại trang đầy đủ */
import React from 'react'

/** Nút lớn trên trang /admin: mở web để sửa trực tiếp. */
export default function EditOnSite() {
  const btn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderRadius: 8, fontWeight: 700,
    fontSize: 16, textDecoration: 'none', background: '#2563eb', color: '#fff',
  }
  return (
    <div style={{ margin: '0 0 2rem', padding: '1.4rem 1.6rem', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
      <h2 style={{ margin: '0 0 .4rem', fontSize: 22 }}>✏️ Sửa trực tiếp trên trang web</h2>
      <p style={{ margin: '0 0 1rem', color: '#374151' }}>
        Cách dễ nhất: mở web, rê chuột vào phần muốn đổi rồi bấm <b>Sửa</b> — chữ, ảnh, màu sắc, bài viết, liên hệ, tài khoản đều ở đó.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="/vi" style={btn}>Mở web tiếng Việt →</a>
        <a href="/en" style={{ ...btn, background: '#fff', color: '#1d4ed8', border: '1px solid #93c5fd' }}>Mở web tiếng Anh →</a>
      </div>
    </div>
  )
}
