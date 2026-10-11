/** Only show photos the user actually saved (Supabase / Clerk), not generated placeholders. */
export function resolveProfilePhotoUrl(raw?: string | null): string | null {
  const url = raw?.trim();
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return null;
}
