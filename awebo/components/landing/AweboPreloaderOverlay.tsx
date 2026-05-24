'use client';

import Image from 'next/image';
import {
  PRELOADER_BG,
  PRELOADER_FADE_MS,
  PRELOADER_LOGO,
} from '@/lib/awebo-preloader';

type AweboPreloaderOverlayProps = {
  visible: boolean;
  className?: string;
};

export default function AweboPreloaderOverlay({
  visible,
  className = 'fixed inset-0 z-[110]',
}: AweboPreloaderOverlayProps) {
  return (
    <div
      className={`${className} flex min-h-[100dvh] items-center justify-center transition-opacity ease-out motion-reduce:transition-none`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${PRELOADER_FADE_MS}ms`,
      }}
      aria-busy={visible}
      aria-label="Loading"
      role="status"
    >
      <div className="absolute inset-0 overflow-hidden bg-[#e8eef5]">
        <Image
          src={PRELOADER_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center blur-[48px] brightness-[1.02] saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-white/25 backdrop-blur-sm" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <Image
          src={PRELOADER_LOGO}
          alt="AWEBO"
          width={320}
          height={320}
          priority
          className="h-auto w-[min(280px,72vw)] max-w-[320px] object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
}
