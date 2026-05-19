'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const HOME_BG = '/awebo_last_frame.webp';
const ECO_BG = '/awebo_front.webp';
const CROSSFADE_MS = 1400;

type CrossfadeDirection = 'to-ecosystem' | 'to-home';

function isSiteCrossfadeRoute(path: string) {
  return path === '/' || path === '/ecosystem';
}

export default function RouteBackgroundCrossfade() {
  const pathname = usePathname() ?? '';
  const prevPathRef = useRef(pathname);
  const [overlay, setOverlay] = useState<CrossfadeDirection | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prev = prevPathRef.current;
    const next = pathname;

    if (
      isSiteCrossfadeRoute(prev) &&
      isSiteCrossfadeRoute(next) &&
      prev !== next
    ) {
      setRevealed(false);
      setOverlay(next === '/ecosystem' ? 'to-ecosystem' : 'to-home');
      const timer = window.setTimeout(() => setOverlay(null), CROSSFADE_MS);
      prevPathRef.current = next;
      return () => window.clearTimeout(timer);
    }

    prevPathRef.current = next;
  }, [pathname]);

  useEffect(() => {
    if (!overlay) {
      setRevealed(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [overlay]);

  if (!overlay) return null;

  const toEcosystem = overlay === 'to-ecosystem';
  const homeOpacity = toEcosystem ? (revealed ? 0 : 1) : revealed ? 1 : 0;
  const ecoOpacity = toEcosystem ? (revealed ? 1 : 0) : revealed ? 0 : 1;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] motion-reduce:transition-none"
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none"
        style={{
          opacity: homeOpacity,
          transitionDuration: `${CROSSFADE_MS}ms`,
        }}
      >
        <Image
          src={HOME_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none"
        style={{
          opacity: ecoOpacity,
          transitionDuration: `${CROSSFADE_MS}ms`,
        }}
      >
        <Image
          src={ECO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
