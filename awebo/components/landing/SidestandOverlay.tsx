'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { isBottomRightQuadrant } from '@/lib/viewport-zones';

export const SIDESTAND_IMAGE = '/side_stand2.webp';

const SIDESTAND_FADE_MS = 600;

type SidestandOverlayProps = {
  active: boolean;
  onClose: () => void;
};

export function preloadSidestandImage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${SIDESTAND_IMAGE}`));
    img.src = SIDESTAND_IMAGE;
  });
}

export default function SidestandOverlay({
  active,
  onClose,
}: SidestandOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (active) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setRevealed(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setRevealed(false);
    const timer = window.setTimeout(() => setMounted(false), SIDESTAND_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!active || !isBottomRightQuadrant(e.clientX, e.clientY)) return;
      onClose();
    },
    [active, onClose]
  );

  useEffect(() => {
    if (!active) return;
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [active, handlePointerDown]);

  useEffect(() => {
    if (!mounted) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = '';
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#0a0a0a] transition-opacity ease-in-out motion-reduce:transition-none"
      style={{
        opacity: revealed ? 1 : 0,
        transitionDuration: `${SIDESTAND_FADE_MS}ms`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Sidestand display"
    >
      <Image
        src={SIDESTAND_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
