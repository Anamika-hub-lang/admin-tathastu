import { BUILTIN_ADMIN_EMAILS, normalizeEmail } from '@/lib/adminAllowlist';
import { DEMO_ADMIN_EMAIL } from '@/lib/demoAdmin';

type ClerkUserLike = {
  emailAddresses?: { emailAddress: string }[];
  primaryEmailAddress?: { emailAddress: string } | null;
} | null;

const envAllowlist = (import.meta.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s: string) => normalizeEmail(s))
  .filter(Boolean);

const allowlistSet = new Set<string>([
  normalizeEmail(DEMO_ADMIN_EMAIL),
  ...BUILTIN_ADMIN_EMAILS.map(normalizeEmail),
  ...envAllowlist,
]);

export function isAllowlistedAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return allowlistSet.has(normalizeEmail(email));
}

export function userCanAccessAdmin(user: ClerkUserLike | undefined) {
  const emails = user?.emailAddresses?.map((x) => x.emailAddress) ?? [];
  if (user?.primaryEmailAddress?.emailAddress) {
    emails.push(user.primaryEmailAddress.emailAddress);
  }
  return emails.some((e) => isAllowlistedAdminEmail(e));
}

/** @deprecated use userCanAccessAdmin */
export function userIsDemoAdmin(user: ClerkUserLike | undefined) {
  return userCanAccessAdmin(user);
}
