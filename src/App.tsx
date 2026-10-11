import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import ClerkSupabaseBridge from '@/components/ClerkSupabaseBridge';
import AdminGate from '@/pages/AdminGate';
import DashboardPage from '@/pages/DashboardPage';
import ProvidersPage from '@/pages/ProvidersPage';
import PatientsPage from '@/pages/PatientsPage';
import PaymentsPage from '@/pages/PaymentsPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import HomeEntry from '@/pages/HomeEntry';

export default function App() {
  return (
    <ClerkSupabaseBridge>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeEntry />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <AdminGate>
                <AdminLayout />
              </AdminGate>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="providers" element={<ProvidersPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkSupabaseBridge>
  );
}
