type Props = { className?: string };

/** Medical team illustration (transparent PNG). */
export default function HeroArt({ className = 'hero-medical-img' }: Props) {
  return (
    <img
      className={className}
      src="/hero-medical.png"
      alt=""
      width={320}
      height={240}
      loading="lazy"
    />
  );
}
