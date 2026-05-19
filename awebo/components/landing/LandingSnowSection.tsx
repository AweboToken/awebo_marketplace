import Image from 'next/image';

const SNOW_BACKGROUND = '/snowbg.jpg';

/**
 * Snow landscape — full viewport width; height follows image aspect ratio (tall on desktop).
 */
export default function LandingSnowSection() {
  return (
    <section
      aria-label="Snow landscape"
      className="relative w-full overflow-hidden bg-[#e8eef5]"
    >
      <div
        className="relative w-full aspect-[735/1027]"
        style={{ maxWidth: '100vw' }}
      >
        <Image
          src={SNOW_BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
