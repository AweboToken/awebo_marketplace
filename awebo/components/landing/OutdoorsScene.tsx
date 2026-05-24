'use client';

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PRELOADER_BG } from '@/lib/awebo-preloader';
import { navigateToLandingHome } from '@/lib/auth-redirect';

const OUTDOORS_BG_WIDTH = 735;
const OUTDOORS_BG_HEIGHT = 1027;

export default function OutdoorsScene() {
  const router = useRouter();

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      const bottomBandPx = Math.max(120, window.innerHeight * 0.18);
      const atPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      const inBottomBand = e.clientY >= window.innerHeight - bottomBandPx;

      if (!atPageBottom || !inBottomBand) return;
      navigateToLandingHome(router);
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [handlePointerDown]);

  return (
    <main className="relative w-full bg-[#e8eef5]" aria-label="Outdoors">
      <Image
        src={PRELOADER_BG}
        alt=""
        width={OUTDOORS_BG_WIDTH}
        height={OUTDOORS_BG_HEIGHT}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
    </main>
  );
}
