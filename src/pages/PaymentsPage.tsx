import { useCallback, useEffect, useState } from 'react';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import type { ProfessionKind } from '@/lib/professions';
import { professionLabel } from '@/lib/professions';
import { fetchAdminBookings, type AdminBookingRow } from '@/lib/adminApi';

type PayFilter = 'all' | 'paid' | 'unpaid';

function inr(amount: number | null) {
  if (amount == null) return '—';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PayFilter>('all');
  const [rows, setRows] = useState<AdminBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await fetchAdminBookings(filter === 'all' ? null : filter);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRows(result.rows);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <PageHeader
        title="Payments & bookings"
        subtitle="Who paid whom — live from Supabase"
        onRefresh={load}
        loading={loading}
      />

      <div className="chips">
        {(['all', 'paid', 'unpaid'] as PayFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`chip${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error ? <p className="error">{error}</p> : null}
      {!loading && rows.length === 0 ? (
        <EmptyState title="No bookings" body="Payments will show when patients book care." />
      ) : null}

      <div className="enroll-list">
        {rows.map((row) => {
          const paid = row.payment_status === 'paid';
          const prof =
            row.profession ? professionLabel[row.profession as ProfessionKind] : '';
          const providerName = row.professional_name ?? 'Unassigned';
          return (
            <article key={row.id} className="enroll-card enroll-card-pay">
              <div className="pay-avatars">
                <Avatar name={row.patient_name} imageUrl={row.patient_avatar_url} size={44} />
                <span className="pay-arrow">→</span>
                <Avatar name={providerName} imageUrl={row.professional_avatar_url} size={44} />
              </div>
              <div className="enroll-main">
                <div className="enroll-name">{inr(row.amount)}</div>
                <div className="enroll-sub">
                  {row.patient_name} → {providerName}
                  {prof ? ` · ${prof}` : ''}
                </div>
                <div className="meta">{row.service ?? '—'} · {row.status}</div>
              </div>
              <Badge tone={paid ? 'paid' : 'unpaid'} text={row.payment_status ?? 'unpaid'} />
              <span className="meta pay-date">
                {row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN') : '—'}
              </span>
            </article>
          );
        })}
      </div>
    </>
  );
}
