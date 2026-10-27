/**
 * Ambient types for @payloadcms/next subpath exports.
 * Payload 3.92.0 publishes incomplete .d.ts for some entry points on npm.
 */
declare module '@payloadcms/next/views' {
  import type { Metadata } from 'next'
  import type { SanitizedConfig } from 'payload'
  import type { ReactNode } from 'react'

  export function generatePageMetadata(args: {
    config: Promise<SanitizedConfig> | SanitizedConfig | (() => Promise<SanitizedConfig>)
    params?: Promise<Record<string, string | string[]>>
    searchParams?: Promise<Record<string, string | string[]>>
  }): Promise<Metadata>

  export function RootPage(args: {
    config: Promise<SanitizedConfig> | SanitizedConfig | (() => Promise<SanitizedConfig>)
    params: Promise<{ segments?: string[] }>
    searchParams: Promise<Record<string, string | string[]>>
    importMap: Record<string, unknown>
  }): ReactNode

  export function NotFoundPage(args: {
    config: Promise<SanitizedConfig> | SanitizedConfig | (() => Promise<SanitizedConfig>)
    params: Promise<{ segments?: string[] }>
    searchParams: Promise<Record<string, string | string[]>>
    importMap: Record<string, unknown>
  }): ReactNode
}

declare module '@payloadcms/next/routes' {
  import type { SanitizedConfig } from 'payload'

  type RouteHandler = (
    request: Request,
    args: { params: Promise<{ slug?: string[] }> },
  ) => Promise<Response>

  export const REST_DELETE: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const REST_GET: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const REST_OPTIONS: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const REST_PATCH: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const REST_POST: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const REST_PUT: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const GRAPHQL_POST: (config: Promise<SanitizedConfig> | SanitizedConfig) => RouteHandler
  export const GRAPHQL_PLAYGROUND_GET: (
    config: Promise<SanitizedConfig> | SanitizedConfig,
  ) => RouteHandler
}

declare module '@payloadcms/next/layouts' {
  import type { SanitizedConfig } from 'payload'
  import type { ReactNode } from 'react'

  export function handleServerFunctions(args: Record<string, unknown>): Promise<unknown>

  export function RootLayout(args: {
    children: ReactNode
    config: Promise<SanitizedConfig> | SanitizedConfig | (() => Promise<SanitizedConfig>)
    importMap: Record<string, unknown>
    serverFunction?: unknown
  }): Promise<ReactNode> | ReactNode
}
