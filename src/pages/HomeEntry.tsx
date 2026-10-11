import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

/** Root URL: send guests to login, signed-in users to dashboard. */
export default function HomeEntry() {
  const { isLoaded, isSignedIn } = useAuth();

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

  return <Navigate to="/dashboard" replace />;
}
