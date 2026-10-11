import type { ProfessionKind } from '@/lib/professions';
import { professionLabel } from '@/lib/professions';
import { isAllowlistedAdminEmail } from '@/lib/adminSession';
import {
  ADMIN_SCHEMA_HINT,
  clerkUserIdFromJwt,
  explainSupabaseAuthError,
  getSupabase,
  isMissingAdminSchema,
  waitForClerkJwt,
} from '@/lib/supabase';

const LIST_LIMIT = 500;

export type AdminDashboardStats = {
  patients: number;
  providers_total: number;
  providers_pending: number;
  providers_by_profession: Record<string, number>;
  bookings_total: number;
  payments_paid_count: number;
  payments_paid_amount: number;
  payments_unpaid_count: number;
};

export type AdminProviderRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  profession: ProfessionKind | null;
  city: string | null;
  license_no: string | null;
  qualification: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at?: string | null;
  avatar_url?: string | null;
};

export type AdminPatientRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  home_label: string | null;
  created_at?: string | null;
  avatar_url?: string | null;
};

export type AdminBookingRow = {
  id: string;
  status: string;
  service: string | null;
  amount: number | null;
  payment_status: string | null;
  created_at: string | null;
  patient_id: string;
  patient_name: string;
  patient_avatar_url?: string | null;
  professional_id: string | null;
  professional_name: string | null;
  professional_avatar_url?: string | null;
  profession: string | null;
};

async function requireClient() {
  const supabase = getSupabase();
  if (!supabase) return { ok: false as const, error: 'Supabase env missing in .env' };
  const jwt = await waitForClerkJwt();
  if (!jwt) return { ok: false as const, error: 'Sign in again so Supabase can load live data.' };
  return { ok: true as const, supabase, jwt };
}

/** Register allowlisted admin + refresh JWT session before reads. */
export async function ensureLiveAdminSession(clerkEmail?: string | null) {
  const ready = await requireClient();
  if (!ready.ok) return ready;
  await ready.supabase.rpc('promote_allowlisted_admin', {
    p_email: clerkEmail?.trim() || null,
  });
  return { ok: true as const };
}

async function isAdminUser(supabase: NonNullable<ReturnType<typeof getSupabase>>, jwt: string) {
  const { data, error } = await supabase.rpc('admin_is_me', {});
  if (!error) return { ok: true as const, isAdmin: Boolean(data) };

  if (!isMissingAdminSchema(error.message)) {
    return { ok: false as const, error: explainSupabaseAuthError(error.message) };
  }

  const uid = clerkUserIdFromJwt(jwt);
  if (!uid) return { ok: false as const, error: 'Could not read your user id from Clerk session.' };

  const row = await supabase.from('admin_users').select('user_id').eq('user_id', uid).maybeSingle();
  if (row.error) {
    if (isMissingAdminSchema(row.error.message)) {
      return { ok: false as const, error: ADMIN_SCHEMA_HINT };
    }
    return { ok: false as const, error: explainSupabaseAuthError(row.error.message) };
  }
  return { ok: true as const, isAdmin: Boolean(row.data) };
}

function withRpcTimeout<T>(promise: PromiseLike<T>, ms = 15000): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out. Check network and .env keys.')), ms),
    ),
  ]);
}

export async function checkAdminAccess(clerkEmail?: string | null) {
  const allowlisted = isAllowlistedAdminEmail(clerkEmail);

  try {
    const ready = await requireClient();
    if (!ready.ok) {
      return allowlisted ? { ok: true as const, isAdmin: true } : ready;
    }

    const promote = await withRpcTimeout(
      ready.supabase.rpc('promote_allowlisted_admin', {
        p_email: clerkEmail?.trim() || null,
      }),
    );
    if (!promote.error && promote.data === true) {
      return { ok: true as const, isAdmin: true };
    }

    const admin = await isAdminUser(ready.supabase, ready.jwt);
    if (admin.ok && admin.isAdmin) return admin;
    if (allowlisted) return { ok: true as const, isAdmin: true };
    if (!admin.ok) return admin;
    return admin;
  } catch (e) {
    if (allowlisted) return { ok: true as const, isAdmin: true };
    const msg = e instanceof Error ? e.message : 'Admin check failed';
    return { ok: false as const, error: explainSupabaseAuthError(msg) };
  }
}

async function withLiveAdmin<T>(
  clerkEmail: string | null | undefined,
  run: (supabase: NonNullable<ReturnType<typeof getSupabase>>) => Promise<T>,
): Promise<T | { ok: false; error: string }> {
  const ready = await requireClient();
  if (!ready.ok) return ready;
  await ready.supabase.rpc('promote_allowlisted_admin', {
    p_email: clerkEmail?.trim() || null,
  });
  return run(ready.supabase);
}

let sessionEmail: string | null = null;
export function setAdminSessionEmail(email: string | null) {
  sessionEmail = email;
}

export async function fetchAdminDashboard() {
  return withLiveAdmin(sessionEmail, async (supabase) => {
    const { data, error } = await withRpcTimeout(supabase.rpc('admin_dashboard_stats'));
    if (error) return { ok: false as const, error: explainSupabaseAuthError(error.message) };
    return { ok: true as const, stats: data as AdminDashboardStats };
  });
}

export async function fetchAdminProviders(filter?: {
  verification?: 'pending' | 'approved' | 'rejected' | null;
  profession?: ProfessionKind | null;
}) {
  return withLiveAdmin(sessionEmail, async (supabase) => {
    const { data, error } = await withRpcTimeout(
      supabase.rpc('admin_list_providers', {
        p_verification: filter?.verification ?? null,
        p_profession: filter?.profession ?? null,
        p_limit: LIST_LIMIT,
        p_offset: 0,
      }),
    );
    if (error) return { ok: false as const, error: explainSupabaseAuthError(error.message) };
    return { ok: true as const, rows: (data ?? []) as AdminProviderRow[] };
  });
}

export async function fetchAdminPatients() {
  return withLiveAdmin(sessionEmail, async (supabase) => {
    const { data, error } = await withRpcTimeout(
      supabase.rpc('admin_list_patients', { p_limit: LIST_LIMIT, p_offset: 0 }),
    );
    if (error) return { ok: false as const, error: explainSupabaseAuthError(error.message) };
    return { ok: true as const, rows: (data ?? []) as AdminPatientRow[] };
  });
}

export async function fetchAdminBookings(payment?: 'paid' | 'unpaid' | null) {
  return withLiveAdmin(sessionEmail, async (supabase) => {
    const { data, error } = await withRpcTimeout(
      supabase.rpc('admin_list_bookings', {
        p_payment: payment ?? null,
        p_limit: LIST_LIMIT,
        p_offset: 0,
      }),
    );
    if (error) return { ok: false as const, error: explainSupabaseAuthError(error.message) };
    return { ok: true as const, rows: (data ?? []) as AdminBookingRow[] };
  });
}

export async function setProviderVerification(
  profileId: string,
  status: 'pending' | 'approved' | 'rejected',
) {
  return withLiveAdmin(sessionEmail, async (supabase) => {
    const { error } = await withRpcTimeout(
      supabase.rpc('admin_set_provider_verification', {
        p_profile_id: profileId,
        p_status: status,
      }),
    );
    if (error) return { ok: false as const, error: explainSupabaseAuthError(error.message) };
    return { ok: true as const };
  });
}

export function professionDisplay(profession: string) {
  const label = professionLabel[profession as ProfessionKind];
  return label ?? profession;
}
