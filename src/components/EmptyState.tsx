export default function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden>◇</div>
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
    </div>
  );
}
