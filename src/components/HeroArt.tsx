type Props = { className?: string };

/** Dashboard hero — care team on screen. */
export default function HeroArt({ className = 'hero-medical-img' }: Props) {
  return (
    <img
      className={className}
      src="/dashboard-hero.png"
      alt=""
      width={360}
      height={260}
      loading="lazy"
    />
  );
}
