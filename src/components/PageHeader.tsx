type Props = {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
};

export default function PageHeader({ title, subtitle, onRefresh, loading }: Props) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </div>
      {onRefresh ? (
        <button type="button" className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      ) : null}
    </header>
  );
}
