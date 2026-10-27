import type { GlobalConfig } from 'payload'

import { admins, anyone } from '@/access/roles'

export const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  label: { vi: 'Thông tin công ty', en: 'Company info' },
  access: {
    read: anyone,
    update: admins,
  },
  fields: [
    {
      name: 'legalName',
      type: 'text',
      required: true,
      label: { vi: 'Tên pháp nhân', en: 'Legal name' },
      defaultValue: 'CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM',
    },
    {
      name: 'tradeName',
      type: 'text',
      label: { vi: 'Tên thương mại', en: 'Trade name' },
      defaultValue: 'First Legal Force (FLF)',
    },
    {
      name: 'internationalName',
      type: 'text',
      label: { vi: 'Tên quốc tế', en: 'International name' },
      defaultValue: 'VIETNAM LAW UNION SOLUTION JOINT STOCK COMPANY',
    },
    {
      name: 'taxId',
      type: 'text',
      label: { vi: 'Mã số thuế', en: 'Tax ID' },
      defaultValue: '0314193708',
      admin: {
        description: 'Đối chiếu cổng đăng ký doanh nghiệp / masothue (đã xác minh).',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: { vi: 'Địa chỉ trụ sở (đã xác minh)', en: 'Registered address (verified)' },
      defaultValue: '01 Trần Khánh Dư, Phường Tân Định, Thành phố Hồ Chí Minh, Việt Nam',
      admin: {
        description:
          'Theo cổng thông tin mã số thuế (masothue / dữ liệu đăng ký DN). Chỉnh trong dashboard nếu có cập nhật chính thức.',
      },
    },
    {
      name: 'displayAddress',
      type: 'textarea',
      label: { vi: 'Địa chỉ hiển thị (nếu khác trụ sở)', en: 'Display address (if different)' },
      admin: {
        description:
          'Địa chỉ trên website cũ (33 Trần Quý Khoách…) chưa khớp cổng ĐKD — để trống hoặc điền sau khi xác minh.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: { vi: 'Điện thoại', en: 'Phone' },
      defaultValue: '+84 96 444 7153',
      admin: {
        description: 'Số trên website/public. Số ĐKD ghi nhận thêm: 028 3868 1188.',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      defaultValue: 'ruby.huynh@flf.vn',
    },
    {
      name: 'representative',
      type: 'text',
      label: { vi: 'Người đại diện pháp luật', en: 'Legal representative' },
      defaultValue: 'Lê Chí Cường',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      defaultValue: 'https://www.facebook.com/firstlegalforce',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      defaultValue: 'https://www.linkedin.com/company/firstlegalforce/home/',
    },
    {
      name: 'verificationNotes',
      type: 'textarea',
      label: { vi: 'Ghi chú xác minh', en: 'Verification notes' },
      admin: {
        description: 'Nội bộ — nguồn đối chiếu, chỗ chưa khớp.',
      },
    },
  ],
}
