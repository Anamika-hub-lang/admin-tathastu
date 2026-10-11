import { SignUp } from '@clerk/clerk-react';
import { LoginIllustration } from '@/pages/SignInPage';

const clerkLook = {
  variables: {
    colorPrimary: '#6b5ae0',
    colorText: '#2d3748',
    colorBackground: '#ffffff',
    colorInputBackground: '#f4f7fe',
    borderRadius: '12px',
    fontFamily: "'Poppins', system-ui, sans-serif",
  },
  elements: {
    rootBox: { width: '100%' },
    card: { boxShadow: 'none', border: 'none', background: 'transparent', padding: 0 },
    formButtonPrimary: { border: '3px solid #111', boxShadow: 'none', fontWeight: 700 },
    formFieldInput: { border: '3px solid #111', boxShadow: 'none' },
  },
};

export default function SignUpPage() {
  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-hero" aria-hidden>
          <LoginIllustration />
          <p className="login-hero-kicker">Join the team</p>
          <p className="login-hero-lead">Create an account with an email your team has approved for admin access.</p>
        </aside>
        <div className="login-panel">
          <img src="/tathastu-logo.png" alt="Tathastu" className="login-logo" />
          <h1 className="login-title">Create account</h1>
          <p className="login-sub">Allowlisted emails only</p>
          <div className="login-clerk">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
              appearance={clerkLook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
