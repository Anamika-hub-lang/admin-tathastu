import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isConfigured } from '@/lib/env';

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;
let client: SupabaseClient | null = null;

export function setClerkTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter;
  client = null;
}

export function getSupabase(): SupabaseClient | null {
  if (!isConfigured) return null;
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      accessToken: async () => (await tokenGetter?.()) ?? null,
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function explainSupabaseAuthError(message: string) {
  if (/no suitable key|wrong key type|PGRST301|JWSError|JWT/i.test(message)) {
    return (
      'Live data ke liye Clerk + Supabase link karo: Clerk Dashboard → Integrations → Supabase ON, ' +
      'phir Supabase → Auth → Providers → Clerk domain add karo. App restart karke dubara sign in karo.'
    );
  }
  if (/Admin access required/i.test(message)) {
    return 'Admin session expire ho gayi — sign out karke dubara sign in karo.';
  }
  if (/Not authenticated|permission denied|42501/i.test(message)) {
    return 'Sign in complete karo, phir refresh karo.';
  }
  if (isMissingAdminSchema(message)) return ADMIN_SCHEMA_HINT;
  return message;
}

export const ADMIN_SCHEMA_HINT =
  'Admin database setup is missing. In Supabase → SQL Editor, run the file supabase/migrations/20261010140000_admin_portal.sql, then add your Clerk user id to admin_users.';

export function isMissingAdminSchema(message: string) {
  return /admin_is_me|admin_dashboard|admin_list_|admin_users|schema cache|PGRST202/i.test(message);
}

export function clerkUserIdFromJwt(jwt: string | null | undefined): string | null {
  if (!jwt) return null;
  try {
    const part = jwt.split('.')[1];
    if (!part) return null;
    const padded = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded + '='.repeat((4 - (padded.length % 4)) % 4);
    const payload = JSON.parse(atob(pad)) as { sub?: string };
    const sub = payload.sub?.trim();
    return sub || null;
  } catch {
    return null;
  }
}

async function tokenWithTimeout(ms = 4000) {
  if (!tokenGetter) return null;
  return Promise.race([
    tokenGetter(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export async function waitForClerkJwt(maxMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    const token = await tokenWithTimeout(4000);
    if (token) return token;
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}
