import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkTokenGetter } from '@/lib/supabase';

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export default function ClerkSupabaseBridge({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setClerkTokenGetter(null);
      return;
    }

    setClerkTokenGetter(async () => {
      try {
        const templated = await withTimeout(getToken({ template: 'supabase' }), 2500, null);
        if (templated) return templated;
      } catch {
        /* template missing in Clerk — use default session token */
      }
      try {
        return await withTimeout(getToken(), 5000, null);
      } catch {
        return null;
      }
    });

    return () => setClerkTokenGetter(null);
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}
