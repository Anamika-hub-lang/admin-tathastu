import type { ReactNode } from 'react';
import Avatar from '@/components/Avatar';

type Props = {
  name: string;
  avatarUrl?: string | null;
  subtitle?: string;
  pill?: string;
  pillClass?: string;
  status?: ReactNode;
  trailing?: ReactNode;
};

export default function EnrollmentRow({
  name,
  avatarUrl,
  subtitle,
  pill,
  pillClass = 'pill-role',
  status,
  trailing,
}: Props) {
  return (
    <article className="enroll-card">
      <Avatar name={name} imageUrl={avatarUrl} size={52} />
      <div className="enroll-main">
        <div className="enroll-name">{name}</div>
        {subtitle ? <div className="enroll-sub">{subtitle}</div> : null}
      </div>
      {pill ? <span className={`pill ${pillClass}`}>{pill}</span> : null}
      {status ? <div className="enroll-status">{status}</div> : null}
      {trailing ? <div className="enroll-actions">{trailing}</div> : null}
    </article>
  );
}
