import { cmsPage } from '@/components/CmsPage'

export const dynamic = 'force-dynamic'
const p = cmsPage('trang-chu', '/', { vi: 'First Legal Force (FLF)', en: 'First Legal Force (FLF)' })
export const generateMetadata = p.generateMetadata
export default p.Page
