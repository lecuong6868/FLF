import { Secret, TOTP } from 'otpauth'

export function generateTotpSecret(label = 'FLF Admin'): { secret: string; uri: string } {
  const totp = new TOTP({
    issuer: 'First Legal Force',
    label,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new Secret({ size: 20 }),
  })

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  }
}

export function verifyTotp(secretBase32: string, token: string, window = 1): boolean {
  const totp = new TOTP({
    issuer: 'First Legal Force',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secretBase32),
  })

  const delta = totp.validate({ token: token.replace(/\s/g, ''), window })
  return delta !== null
}
