import Image from 'next/image';

const FLOOR_BACKGROUND = '/floor2.webp';

/** Full-viewport section below the hero — floor still background. */
export default function LandingFloorSection() {
  return (
    <section
      aria-label="Floor"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]"
    >
      <Image
        src={FLOOR_BACKGROUND}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  );
}
