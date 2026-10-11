import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import Avatar from '@/components/Avatar';
import SidebarArt from '@/components/SidebarArt';
import {
  IconDashboard,
  IconPatients,
  IconPayments,
  IconProviders,
} from '@/components/NavIcons';

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard, end: true },
  { to: '/dashboard/providers', label: 'Providers', Icon: IconProviders },
  { to: '/dashboard/patients', label: 'Patients', Icon: IconPatients },
  { to: '/dashboard/payments', label: 'Payments', Icon: IconPayments },
];

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/providers': 'Providers',
  '/dashboard/patients': 'Patients',
  '/dashboard/payments': 'Payments',
};

export default function AdminLayout() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const name = user?.firstName || user?.fullName?.split(' ')[0] || 'Admin';
  const display = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Administrator';
  const pageTitle = titles[pathname] ?? 'Dashboard';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/tathastu-logo.png" alt="Tathastu" className="brand-logo" />
        </div>
        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon" aria-hidden>
                <l.Icon />
              </span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-promo" aria-hidden>
          <SidebarArt />
        </div>
      </aside>

      <div className="main-column">
        <header className="top-bar">
          <h1 className="top-bar-heading">{pageTitle}</h1>
          <div className="top-bar-right">
            <div className="top-bar-user">
              <div className="top-bar-user-text">
                <span className="top-bar-user-name">{display}</span>
                <span className="top-bar-user-role">Administrator</span>
              </div>
              <Avatar name={display} imageUrl={user?.imageUrl} size={40} />
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </header>
        <main className="main">
          <Outlet context={{ firstName: name }} />
        </main>
      </div>
    </div>
  );
}
