import type { GlobalConfig } from 'payload'

import { admins } from '../access/roles'

/** Màu sắc & kiểu chữ của toàn web. Để trống = dùng màu mặc định của thiết kế. */
export const THEME_COLORS = [
  { name: 'navy', label: 'Màu chính (xanh navy)', def: '#003050' },
  { name: 'navyDeep', label: 'Nền tối (banner, chân trang)', def: '#001524' },
  { name: 'red', label: 'Màu nhấn (nút, liên kết)', def: '#a02020' },
  { name: 'ink', label: 'Màu chữ', def: '#102130' },
  { name: 'muted', label: 'Màu chữ phụ', def: '#617484' },
  { name: 'paper', label: 'Màu nền nhạt', def: '#f3f6f8' },
] as const

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Màu sắc & kiểu chữ',
  access: { read: () => true, update: admins },
  fields: [
    ...THEME_COLORS.map((c) => ({
      name: c.name,
      type: 'text' as const,
      label: c.label,
      admin: { description: `Mã màu, ví dụ ${c.def}. Để trống = mặc định.` },
    })),
    {
      name: 'headingFont',
      type: 'select',
      label: 'Kiểu chữ tiêu đề',
      defaultValue: 'serif',
      options: [
        { label: 'Có chân (sang trọng)', value: 'serif' },
        { label: 'Không chân (hiện đại)', value: 'sans' },
      ],
    },
    {
      name: 'radius',
      type: 'select',
      label: 'Bo góc nút & thẻ',
      defaultValue: 'small',
      options: [
        { label: 'Vuông', value: 'none' },
        { label: 'Bo nhẹ', value: 'small' },
        { label: 'Bo tròn', value: 'large' },
      ],
    },
  ],
}
