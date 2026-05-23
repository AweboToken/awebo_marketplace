'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isBottomRightQuadrant } from '@/lib/viewport-zones';
import { CENTER_TABLE_IMAGE } from '@/lib/center-table';

const CENTER_TABLE_FADE_MS = 600;

export function preloadCenterTableImage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${CENTER_TABLE_IMAGE}`));
    img.src = CENTER_TABLE_IMAGE;
  });
}

export default function CenterTableScene() {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isBottomRightQuadrant(e.clientX, e.clientY)) return;
      router.push('/');
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [handlePointerDown]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <main
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] transition-opacity ease-in-out motion-reduce:transition-none"
      style={{
        opacity: revealed ? 1 : 0,
        transitionDuration: `${CENTER_TABLE_FADE_MS}ms`,
      }}
      aria-label="Center table"
    >
      <Image
        src={CENTER_TABLE_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </main>
  );
}
