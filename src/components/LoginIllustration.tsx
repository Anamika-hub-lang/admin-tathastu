/** Simple admin login graphic — no photo (dashboard uses hero-medical.png). */
export default function LoginIllustration() {
  return (
    <svg className="login-illustration" viewBox="0 0 320 240" fill="none" aria-hidden>
      <rect x="24" y="32" width="272" height="176" rx="16" fill="#fff" stroke="#111" strokeWidth="3" />
      <rect x="44" y="56" width="120" height="88" rx="10" fill="#EBE9FF" stroke="#111" strokeWidth="2.5" />
      <rect x="56" y="72" width="72" height="8" rx="2" fill="#6B5AE0" />
      <rect x="56" y="88" width="96" height="6" rx="2" fill="#111" fillOpacity="0.12" />
      <rect x="56" y="118" width="52" height="14" rx="7" fill="#48BB78" stroke="#111" strokeWidth="2" />
      <circle cx="220" cy="100" r="40" fill="#FBA524" stroke="#111" strokeWidth="3" />
      <path
        d="M220 88c-8 0-14 6-14 13 0 10 14 18 14 18s14-8 14-18c0-7-6-13-14-13z"
        fill="#E53E3E"
        stroke="#111"
        strokeWidth="2"
      />
      <rect x="168" y="148" width="88" height="44" rx="10" fill="#F4F7FE" stroke="#111" strokeWidth="2.5" />
      <path d="M188 168h48M212 156v24" stroke="#5E53FF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
