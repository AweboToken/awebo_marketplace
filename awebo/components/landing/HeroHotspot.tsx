'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export type HeroHotspotProps = {
  label: string;
  href?: string;
  onActivate?: () => void;
  /** Percentage position within the hero (0–100). */
  left?: number;
  top?: number;
  /** Fixed to viewport; distance from right edge in px. Vertically centered. */
  rightPx?: number;
  /** Fixed to viewport; horizontally centered, distance from bottom in px. */
  bottomPx?: number;
  className?: string;
};

function HotspotVisual() {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12">
      <span
        className="hero-hotspot-orb absolute inset-0 rounded-full"
        aria-hidden
      />
      <Plus
        className="relative z-10 h-5 w-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-110 sm:h-6 sm:w-6"
        strokeWidth={2.75}
        aria-hidden
      />
    </span>
  );
}

export default function HeroHotspot({
  href,
  onActivate,
  label,
  left,
  top,
  rightPx,
  bottomPx,
  className = '',
}: HeroHotspotProps) {
  const positionMode =
    rightPx != null ? 'right' : bottomPx != null ? 'bottom' : 'percent';
  const positionClass =
    positionMode === 'right'
      ? 'fixed'
      : positionMode === 'bottom'
        ? 'fixed -translate-x-1/2'
        : 'absolute -translate-x-1/2';
  const translateYClass = positionMode === 'bottom' ? '' : '-translate-y-1/2';
  const sharedClass = `hero-hotspot group z-[25] ${translateYClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${positionClass} ${className}`;
  const style =
    positionMode === 'right'
      ? { right: rightPx, top: '50%' as const }
      : positionMode === 'bottom'
        ? { left: '50%' as const, bottom: bottomPx }
        : { left: `${left}%`, top: `${top}%` };

  if (onActivate) {
    return (
      <button
        type="button"
        onClick={onActivate}
        aria-label={label}
        className={`${sharedClass} cursor-pointer border-0 bg-transparent p-0`}
        style={style}
      >
        <HotspotVisual />
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link href={href} aria-label={label} className={sharedClass} style={style}>
      <HotspotVisual />
    </Link>
  );
}
