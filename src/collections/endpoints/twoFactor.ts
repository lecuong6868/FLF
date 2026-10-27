import type { Endpoint } from 'payload'

import { generateTotpSecret, verifyTotp } from '@/lib/auth/totp'

export const twoFactorSetupEndpoint: Endpoint = {
  path: '/me/2fa/setup',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { secret, uri } = generateTotpSecret(String(req.user.email || req.user.id))
    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: false,
      },
      overrideAccess: true,
    })

    return Response.json({
      ok: true,
      secret,
      otpauthUrl: uri,
      message: 'Quét QR/otpauth bằng Authenticator, rồi gọi /me/2fa/enable với mã TOTP.',
    })
  },
}

export const twoFactorEnableEndpoint: Endpoint = {
  path: '/me/2fa/enable',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json?.()) as { totp?: string } | null
    const totp = body?.totp
    const user = await req.payload.findByID({
      collection: 'users',
      id: req.user.id,
      overrideAccess: true,
    })

    if (!user.twoFactorSecret || !totp || !verifyTotp(String(user.twoFactorSecret), String(totp))) {
      return Response.json({ error: 'Mã TOTP không hợp lệ' }, { status: 400 })
    }

    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: { twoFactorEnabled: true },
      overrideAccess: true,
    })

    return Response.json({ ok: true, twoFactorEnabled: true })
  },
}
