import { DEMO_ADMIN_EMAIL } from '@/lib/demoAdmin';

type ClerkUserLike = {
  emailAddresses?: { emailAddress: string }[];
  primaryEmailAddress?: { emailAddress: string } | null;
} | null;

const extraAllowlist = (import.meta.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s: string) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAllowlistedAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  if (e === DEMO_ADMIN_EMAIL.toLowerCase()) return true;
  return extraAllowlist.includes(e);
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
