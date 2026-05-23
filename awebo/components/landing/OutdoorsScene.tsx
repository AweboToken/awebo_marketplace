'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PRELOADER_BG,
  PRELOADER_FADE_MS,
  PRELOADER_LOGO,
  PRELOADER_MIN_MS,
} from '@/lib/awebo-preloader';
import { navigateToLandingHome } from '@/lib/auth-redirect';

const OUTDOORS_BG_WIDTH = 735;
const OUTDOORS_BG_HEIGHT = 1027;

type OutdoorsPhase = 'preloader' | 'scene';

export default function OutdoorsScene() {
  const router = useRouter();
  const [phase, setPhase] = useState<OutdoorsPhase>('preloader');
  const [preloaderMounted, setPreloaderMounted] = useState(true);
  const preloaderVisible = phase === 'preloader';

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setPhase('scene');
      window.setTimeout(() => setPreloaderMounted(false), PRELOADER_FADE_MS);
    }, PRELOADER_MIN_MS);

    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!preloaderMounted) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflow: style.overflow,
      width: style.width,
    };

    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      style.overflow = prev.overflow;
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [preloaderMounted]);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (preloaderMounted) return;

      const bottomBandPx = Math.max(120, window.innerHeight * 0.18);
      const atPageBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      const inBottomBand = e.clientY >= window.innerHeight - bottomBandPx;

      if (!atPageBottom || !inBottomBand) return;
      navigateToLandingHome(router);
    },
    [preloaderMounted, router]
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

      {preloaderMounted ? (
        <div
          className={`fixed inset-0 z-10 flex min-h-[100dvh] items-center justify-center transition-opacity ease-out ${
            preloaderVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${PRELOADER_FADE_MS}ms` }}
          aria-busy={preloaderVisible}
          aria-label="Loading"
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
      ) : null}
    </main>
  );
}
