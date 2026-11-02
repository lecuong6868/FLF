import type { GlobalConfig } from 'payload'

import { admins } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Thông tin công ty',
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'companyLegalName',
      type: 'text',
      label: 'Tên pháp nhân',
      defaultValue: 'CÔNG TY CỔ PHẦN GIẢI PHÁP LIÊN MINH LUẬT VIỆT NAM',
    },
    {
      name: 'companyTradeName',
      type: 'text',
      label: 'Tên thương mại',
      defaultValue: 'First Legal Force (FLF)',
    },
    {
      name: 'taxCode',
      type: 'text',
      label: 'Mã số thuế',
      defaultValue: '0314193708',
    },
    {
      name: 'registeredAddress',
      type: 'textarea',
      label: 'Địa chỉ đăng ký (MST)',
      defaultValue: '01 Trần Khánh Dư, Phường Tân Định, TP. Hồ Chí Minh',
      admin: {
        description: 'Theo cổng MST. Địa chỉ hiển thị công khai chờ khách xác nhận.',
      },
    },
    {
      name: 'publicAddress',
      type: 'textarea',
      label: 'Địa chỉ hiển thị công khai',
      admin: {
        description: 'Để trống cho đến khi khách xác nhận.',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Điện thoại',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email liên hệ',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook',
      defaultValue: 'https://www.facebook.com/firstlegalforce',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn',
      defaultValue: 'https://www.linkedin.com/company/firstlegalforce/home/',
    },
    {
      name: 'seoDefault',
      type: 'group',
      label: 'SEO mặc định',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title mặc định',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description mặc định',
          localized: true,
        },
      ],
    },
  ],
}
