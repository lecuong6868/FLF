import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { LegalPartners } from './collections/LegalPartners'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { PracticeAreas } from './collections/PracticeAreas'
import { Redirects } from './collections/Redirects'
import { SocialPosts } from './collections/SocialPosts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { CompanyInfo } from './globals/CompanyInfo'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — FLF CMS',
    },
  },
  localization: {
    locales: [
      { code: 'vi', label: 'Tiếng Việt' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  collections: [
    Users,
    Media,
    Posts,
    Categories,
    Tags,
    PracticeAreas,
    LegalPartners,
    ContactSubmissions,
    SocialPosts,
    Redirects,
  ],
  globals: [SiteSettings, CompanyInfo, Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production-min-32-chars!!',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
})
