import { useCallback, useEffect, useState } from 'react';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';
import EnrollmentRow from '@/components/EnrollmentRow';
import PageHeader from '@/components/PageHeader';
import type { ProfessionKind } from '@/lib/professions';
import { professionLabel } from '@/lib/professions';
import {
  fetchAdminProviders,
  setProviderVerification,
  type AdminProviderRow,
} from '@/lib/adminApi';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

const pillRotate = ['pill-warm', 'pill-sky', 'pill-mint', 'pill-lilac'];

export default function ProvidersPage() {
  const [filter, setFilter] = useState<Filter>('pending');
  const [rows, setRows] = useState<AdminProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await fetchAdminProviders({
      verification: filter === 'all' ? null : filter,
    });
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

  const act = async (row: AdminProviderRow, status: 'approved' | 'rejected' | 'pending') => {
    if (!window.confirm(`${status} — ${row.full_name ?? row.id}?`)) return;
    const result = await setProviderVerification(row.id, status);
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    void load();
  };

  return (
    <>
      <PageHeader
        title="Provider enrollments"
        subtitle="Verify doctors, nurses & assistants"
        onRefresh={load}
        loading={loading}
      />

      <div className="chips">
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map((f) => (
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
      {loading && rows.length === 0 ? <div className="loader-bar"><span /></div> : null}
      {!loading && rows.length === 0 ? (
        <EmptyState title="No providers here" body="Try another filter or refresh." />
      ) : null}

      <div className="enroll-list">
        {rows.map((row, i) => {
          const name = row.full_name ?? 'Unnamed';
          const prof = row.profession ? professionLabel[row.profession as ProfessionKind] : 'Provider';
          const tone =
            row.verification_status === 'approved'
              ? 'approved'
              : row.verification_status === 'rejected'
                ? 'rejected'
                : 'pending';
          const statusLabel =
            row.verification_status === 'approved'
              ? 'Verified'
              : row.verification_status === 'rejected'
                ? 'Rejected'
                : 'Pending review';

          return (
            <EnrollmentRow
              key={row.id}
              name={name}
              avatarUrl={row.avatar_url}
              subtitle={`${row.city ?? '—'} · ${row.phone ?? '—'}`}
              pill={prof}
              pillClass={pillRotate[i % pillRotate.length]}
              status={<Badge tone={tone} text={statusLabel} />}
              trailing={
                <div className="row-actions">
                  {row.verification_status !== 'approved' ? (
                    <button type="button" className="btn-sm btn-approve" onClick={() => void act(row, 'approved')}>
                      Approve
                    </button>
                  ) : null}
                  {row.verification_status !== 'rejected' ? (
                    <button type="button" className="btn-sm btn-reject" onClick={() => void act(row, 'rejected')}>
                      Reject
                    </button>
                  ) : null}
                </div>
              }
            />
          );
        })}
      </div>
    </>
  );
}
