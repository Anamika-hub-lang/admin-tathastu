type Tone = 'pending' | 'approved' | 'rejected' | 'paid' | 'unpaid';

export default function Badge({ tone, text }: { tone: Tone; text: string }) {
  const cls =
    tone === 'approved' || tone === 'paid'
      ? 'badge-approved'
      : tone === 'rejected'
        ? 'badge-rejected'
        : 'badge-pending';
  return <span className={`badge ${cls}`}>{text}</span>;
}
