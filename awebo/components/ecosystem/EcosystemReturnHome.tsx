'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isBottomRightQuadrant } from '@/lib/viewport-zones';

export default function EcosystemReturnHome() {
  const router = useRouter();

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!isBottomRightQuadrant(e.clientX, e.clientY)) return;
      router.push('/');
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [router]);

  return null;
}
