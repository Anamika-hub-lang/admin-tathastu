import { useEffect, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const name = user?.firstName || user?.fullName?.split(' ')[0] || 'Admin';
  const display = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Administrator';
  const pageTitle = titles[pathname] ?? 'Dashboard';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`app-shell${menuOpen ? ' sidebar-open' : ''}`}>
      <button
        type="button"
        className="menu-backdrop"
        aria-label="Close menu"
        onClick={closeMenu}
        tabIndex={menuOpen ? 0 : -1}
      />

      <aside className={`sidebar${menuOpen ? ' is-open' : ''}`}>
        <button type="button" className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
          ×
        </button>
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
              onClick={closeMenu}
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
          <div className="top-bar-left">
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
            </button>
            <h1 className="top-bar-heading">{pageTitle}</h1>
          </div>
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
