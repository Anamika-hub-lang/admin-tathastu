import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import HeroArt from '@/components/HeroArt';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import EnrollmentRow from '@/components/EnrollmentRow';
import {
  fetchAdminDashboard,
  fetchAdminProviders,
  type AdminDashboardStats,
  type AdminProviderRow,
} from '@/lib/adminApi';
import type { ProfessionKind } from '@/lib/professions';
import { professionLabel } from '@/lib/professions';

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || 'there';
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentProviders, setRecentProviders] = useState<AdminProviderRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [dash, prov] = await Promise.all([
      fetchAdminDashboard(),
      fetchAdminProviders({ verification: null }),
    ]);
    setLoading(false);
    if (!dash.ok) {
      setError(dash.error);
      return;
    }
    setStats(dash.stats);
    if (prov.ok) setRecentProviders(prov.rows.slice(0, 5));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byProf = stats?.providers_by_profession ?? {};
  const pending = stats?.providers_pending ?? 0;

  return (
    <>
      <section className="hero-banner">
        <div className="hero-banner-text">
          <h2>Hello {firstName}!</h2>
          <p>
            {stats
              ? `You have ${pending} provider${pending === 1 ? '' : 's'} waiting for verification and ${stats.patients} registered patient${stats.patients === 1 ? '' : 's'}.`
              : 'Loading your care platform overview…'}
          </p>
          <Link to="/dashboard/providers" className="btn btn-warm">
            Review providers
          </Link>
        </div>
        <div className="hero-banner-art" aria-hidden>
          <HeroArt />
        </div>
      </section>

      <PageHeader
        title="Overview"
        subtitle="Registrations, verifications & payments"
        onRefresh={load}
        loading={loading}
      />

      {loading && !stats ? <div className="loader-bar"><span /></div> : null}
      {error ? <p className="error">{error}</p> : null}

      {stats ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Patients</div>
              <div className="stat-value">{stats.patients}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Care providers</div>
              <div className="stat-value">{stats.providers_total}</div>
              <div className="stat-hint">{stats.providers_pending} pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Bookings</div>
              <div className="stat-value">{stats.bookings_total}</div>
            </div>
            <div className="stat-card stat-card-hero">
              <div className="stat-label">Revenue (paid)</div>
              <div className="stat-value">{inr(stats.payments_paid_amount)}</div>
              <div className="stat-hint">
                {stats.payments_paid_count} paid · {stats.payments_unpaid_count} unpaid
              </div>
            </div>
          </div>

          <div className="dash-split">
            <div className="panel panel-grow">
              <h2>Recent provider enrollments</h2>
              {recentProviders.length === 0 ? (
                <p className="muted">No providers yet</p>
              ) : (
                <div className="enroll-list enroll-list-compact">
                  {recentProviders.map((row, i) => {
                    const name = row.full_name ?? 'Unnamed';
                    const prof = row.profession
                      ? professionLabel[row.profession as ProfessionKind]
                      : 'Provider';
                    const tone =
                      row.verification_status === 'approved' ? 'approved' : 'pending';
                    return (
                      <EnrollmentRow
                        key={row.id}
                        name={name}
                        avatarUrl={row.avatar_url}
                        subtitle={row.city ?? '—'}
                        pill={prof}
                        pillClass={i % 2 === 0 ? 'pill-warm' : 'pill-lilac'}
                        status={<Badge tone={tone} text={row.verification_status} />}
                      />
                    );
                  })}
                </div>
              )}
              <Link to="/dashboard/providers" className="link-more">View all providers →</Link>
            </div>
            <div className="panel">
              <h2>By profession</h2>
              {Object.keys(byProf).length === 0 ? (
                <p className="muted">No data</p>
              ) : (
                <div className="prof-chips prof-chips-col">
                  {Object.entries(byProf).map(([prof, count]) => (
                    <div key={prof} className="prof-chip">
                      <span>{professionLabel[prof as ProfessionKind] ?? prof}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
