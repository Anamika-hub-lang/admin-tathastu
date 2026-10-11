import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { checkAdminAccess, setAdminSessionEmail } from '@/lib/adminApi';
import { userCanAccessAdmin } from '@/lib/adminSession';
import { isConfigured } from '@/lib/env';

export default function AdminGate({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user, isLoaded: userLoaded } = useUser();
  const clerkEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const allowlisted = userCanAccessAdmin(user);
  const [state, setState] = useState<'loading' | 'ok' | 'denied' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setState('loading');
      return;
    }
    if (!userLoaded) return;

    setAdminSessionEmail(clerkEmail);

    if (allowlisted) {
      setState('ok');
    }

    let cancelled = false;

    (async () => {
      const result = await checkAdminAccess(clerkEmail);
      if (cancelled) return;
      if (!result.ok) {
        if (allowlisted) {
          setState('ok');
          return;
        }
        setError(result.error);
        setState('error');
        return;
      }
      if (result.isAdmin || allowlisted) {
        setState('ok');
        return;
      }
      setState('denied');
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userLoaded, isSignedIn, clerkEmail, allowlisted]);

  if (!isConfigured) {
    return (
      <div className="center-page">
        <div className="center-box">
          <h1>Config missing</h1>
          <p className="muted">Add Supabase and Clerk keys to the project .env file.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="center-page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!userLoaded && !allowlisted) {
    return (
      <div className="center-page">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (allowlisted || state === 'ok') {
    return <>{children}</>;
  }

  if (state === 'loading') {
    return (
      <div className="center-page">
        <p className="muted">Checking admin access…</p>
      </div>
    );
  }

  if (state === 'denied' || state === 'error') {
    const signedInAs = clerkEmail ?? user?.emailAddresses?.[0]?.emailAddress ?? 'unknown';
    return (
      <div className="center-page">
        <div className="center-box access-denied-box">
          <h1>Admin access needed</h1>
          {state === 'error' ? <p className="error">{error}</p> : null}
          <p className="muted">
            Signed in as <strong>{signedInAs}</strong>. This email must match an approved admin
            account (e.g. <strong>drshivanigdcm8@gmail.com</strong>).
          </p>
          <p className="muted">
            First time? Use <Link to="/sign-up">Sign up</Link> with that same Gmail, then sign in
            again. For Google login, pick the allowlisted Google account.
          </p>
          <div className="access-denied-actions">
            <button type="button" className="btn" onClick={() => void signOut({ redirectUrl: '/sign-in' })}>
              Sign out &amp; try again
            </button>
            <Link to="/sign-in" className="btn btn-ghost">Back to sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
