import { useState } from 'react';
import { resolveProfilePhotoUrl } from '@/lib/avatarUrl';

type Props = {
  name: string;
  imageUrl?: string | null;
  size?: number;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts[0][0].toUpperCase();
}

export default function Avatar({ name, imageUrl, size = 48 }: Props) {
  const label = name.trim() || 'User';
  const raw = resolveProfilePhotoUrl(imageUrl);
  const [broken, setBroken] = useState(false);
  const showPhoto = Boolean(raw) && !broken;

  if (showPhoto) {
    return (
      <img
        className="avatar"
        src={raw!}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span
      className="avatar avatar-letter"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.44) }}
      aria-hidden
    >
      {initials(label)}
    </span>
  );
}

export { initials };
