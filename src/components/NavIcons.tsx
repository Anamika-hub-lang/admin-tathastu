type IconProps = { className?: string };

const cn = (className?: string) => `nav-icon-svg${className ? ` ${className}` : ''}`;

export function IconDashboard({ className }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function IconProviders({ className }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h8v3a4 4 0 0 1-8 0V4z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M18 8c1.2.8 2 2.2 2 4v2h-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconPatients({ className }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M5 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M12 11v3M10.5 13h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconPayments({ className }: IconProps) {
  return (
    <svg className={cn(className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="2.2" />
      <rect x="5" y="14" width="6" height="3" rx="1" fill="currentColor" />
      <circle cx="17" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
