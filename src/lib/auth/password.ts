const STRONG_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/

export function validateStrongPassword(password: string): { ok: true } | { ok: false; message: string } {
  if (!STRONG_PASSWORD.test(password)) {
    return {
      ok: false,
      message:
        'Mật khẩu phải ≥ 12 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
    }
  }
  return { ok: true }
}
