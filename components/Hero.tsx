import Image from 'next/image';

interface HeroProps {
  imageUrl?: string | null;
  alt?: string;
}

const DEFAULT_LOGO = '/RapidResponse/img/awebo_logo.jpg';

export default function Hero({ imageUrl, alt = 'Awebo Logo' }: HeroProps) {
  const src = imageUrl || DEFAULT_LOGO;
  return (
    <div className="w-full rounded-[20px] bg-[#EBEBEB] flex items-center justify-center py-12 md:py-16 lg:py-20">
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="w-auto h-auto max-w-full rounded-[1000px]"
          priority
        />
      </div>
    </div>
  );
}
