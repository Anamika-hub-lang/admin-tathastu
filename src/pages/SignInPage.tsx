import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import LoginIllustration from '@/components/LoginIllustration';

const clerkLook = {
  variables: {
    colorPrimary: '#6b5ae0',
    colorText: '#2d3748',
    colorTextSecondary: '#718096',
    colorBackground: '#ffffff',
    colorInputBackground: '#f4f7fe',
    borderRadius: '12px',
    fontFamily: "'Poppins', system-ui, sans-serif",
  },
  elements: {
    rootBox: { width: '100%' },
    cardBox: { width: '100%', boxShadow: 'none' },
    card: { width: '100%', boxShadow: 'none', border: 'none', background: 'transparent', padding: 0 },
    socialButtonsBlockButton: { border: '3px solid #111', boxShadow: 'none', fontWeight: 600 },
    formButtonPrimary: { border: '3px solid #111', boxShadow: 'none', fontWeight: 700 },
    formFieldInput: { border: '3px solid #111', boxShadow: 'none' },
    footerActionLink: { fontWeight: 600, color: '#5e53ff' },
  },
};

export default function SignInPage() {
  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-hero" aria-hidden>
          <LoginIllustration />
          <p className="login-hero-kicker">Care operations</p>
          <p className="login-hero-lead">
            Manage provider verification, patient enrollments, and payments from one secure panel.
          </p>
          <ul className="login-hero-list">
            <li>Live Supabase data</li>
            <li>Allowlisted admin access</li>
            <li>Verify nurses &amp; doctors</li>
          </ul>
        </aside>
        <div className="login-panel">
          <img src="/tathastu-logo.png" alt="Tathastu" className="login-logo" />
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">
            Sign in with your approved admin email. New admin?{' '}
            <Link to="/sign-up">Create account</Link> first (same Gmail as allowlist).
          </p>
          <div className="login-clerk">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/dashboard"
              appearance={clerkLook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
