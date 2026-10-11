import { useCallback, useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import EnrollmentRow from '@/components/EnrollmentRow';
import PageHeader from '@/components/PageHeader';
import { fetchAdminPatients, type AdminPatientRow } from '@/lib/adminApi';

export default function PatientsPage() {
  const [rows, setRows] = useState<AdminPatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await fetchAdminPatients();
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRows(result.rows);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <PageHeader
        title="Patient enrollments"
        subtitle="Everyone registered on Tathastu"
        onRefresh={load}
        loading={loading}
      />

      {error ? <p className="error">{error}</p> : null}
      {!loading && rows.length === 0 ? (
        <EmptyState title="No patients yet" body="New sign-ups will appear here." />
      ) : null}

      <div className="enroll-list">
        {rows.map((row, i) => {
          const name = row.full_name ?? 'Unnamed';
          const joined = row.created_at
            ? new Date(row.created_at).toLocaleDateString('en-IN')
            : '—';
          return (
            <EnrollmentRow
              key={row.id}
              name={name}
              avatarUrl={row.avatar_url}
              subtitle={`${row.phone ?? '—'} · ${row.home_label ?? 'No home set'}`}
              pill="Patient"
              pillClass={i % 2 === 0 ? 'pill-sky' : 'pill-mint'}
              status={<span className="meta">Joined {joined}</span>}
            />
          );
        })}
      </div>
    </>
  );
}
