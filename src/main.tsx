import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { env, isConfigured } from '@/lib/env';
import App from '@/App';
import '@/index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

createRoot(root).render(
  <StrictMode>
    <ClerkProvider publishableKey={isConfigured ? env.clerkPublishableKey : 'pk_test_missing'}>
      <App />
    </ClerkProvider>
  </StrictMode>,
);
