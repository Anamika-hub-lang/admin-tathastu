export const env = {
  supabaseUrl: import.meta.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  clerkPublishableKey: import.meta.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
};

export const isConfigured =
  Boolean(env.supabaseUrl && env.supabaseAnonKey && env.clerkPublishableKey.startsWith('pk_'));
