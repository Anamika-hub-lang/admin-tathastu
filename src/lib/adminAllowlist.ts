/** Built-in admin emails (always allowed in UI even if env omits them). */
export const BUILTIN_ADMIN_EMAILS = [
  'admin@tathastu.demo',
  'aaniya1985@gmail.com',
  'drshivanigdcm8@gmail.com',
] as const;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
