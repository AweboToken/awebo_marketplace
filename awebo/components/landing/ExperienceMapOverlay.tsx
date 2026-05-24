'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  aweboHQRooms,
  EXPERIENCE_MAP_HEIGHT,
  EXPERIENCE_MAP_IMAGE,
  EXPERIENCE_MAP_WIDTH,
  type AweboHQRoom,
} from '@/lib/experience-map';
import { getHQRoomPath } from '@/lib/hq-room-slugs';
import { navigateWithRoomLaunchTransition } from '@/lib/launch-preloader-nav';
import { useExperienceMap } from '@/components/landing/ExperienceMapContext';

const MAP_FADE_MS = 400;

export type ExperienceMapOverlayProps = {
  open: boolean;
  onClose: () => void;
  onCellActivate?: (room: AweboHQRoom) => void;
};

export function preloadExperienceMapImage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () =>
      reject(new Error(`Failed to load ${EXPERIENCE_MAP_IMAGE}`));
    img.src = EXPERIENCE_MAP_IMAGE;
  });
}

export default function ExperienceMapOverlay({
  open,
  onClose,
  onCellActivate,
}: ExperienceMapOverlayProps) {
  const router = useRouter();
  const { hoveredRoomId, setHoveredRoomId } = useExperienceMap();
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setRevealed(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setRevealed(false);
    if (!open) setHoveredRoomId(null);
    const timer = window.setTimeout(() => setMounted(false), MAP_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [open, setHoveredRoomId]);

  useEffect(() => {
    if (!mounted) return;

    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [mounted]);

  const handleCellClick = useCallback(
    (room: AweboHQRoom) => {
      onClose();
      onCellActivate?.(room);
      navigateWithRoomLaunchTransition(router, getHQRoomPath(room));
    },
    [onCellActivate, onClose, router]
  );

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 pt-20 sm:p-8 sm:pt-24 transition-opacity ease-in-out motion-reduce:transition-none"
      style={{
        opacity: revealed ? 1 : 0,
        transitionDuration: `${MAP_FADE_MS}ms`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Experience map"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#050505]/82 backdrop-blur-md" />

      <div
        className="relative z-10 w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 hidden text-right text-[11px] uppercase tracking-wide text-white/45 sm:block">
          Press Esc to close
        </p>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <Image
            src={EXPERIENCE_MAP_IMAGE}
            alt="AWEBO vault experience map"
            width={EXPERIENCE_MAP_WIDTH}
            height={EXPERIENCE_MAP_HEIGHT}
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="block h-auto w-full select-none"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-0">
            {aweboHQRooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => handleCellClick(room)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId(null)}
                onFocus={() => setHoveredRoomId(room.id)}
                onBlur={() => setHoveredRoomId(null)}
                aria-label={room.name}
                className="group pointer-events-auto absolute border border-transparent bg-violet-400/0 transition-colors duration-150 hover:bg-violet-400/15 hover:border-violet-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-0 focus-visible:border-violet-300/80 focus-visible:bg-violet-400/20"
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                  width: `${room.width}%`,
                  height: `${room.height}%`,
                }}
              >
                <span className="sr-only">{room.name}</span>
                <span
                  className={`pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-150 ${
                    hoveredRoomId === room.id
                      ? 'bg-violet-300/90 shadow-[0_0_8px_rgba(196,181,253,0.8)]'
                      : 'bg-violet-300/0 group-hover:bg-violet-300/70'
                  }`}
                  style={{
                    left: `${((room.center.x - room.x) / room.width) * 100}%`,
                    top: `${((room.center.y - room.y) / room.height) * 100}%`,
                  }}
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-white/45 sm:hidden">
          Tap a room to enter
        </p>

        <p className="mt-1 text-center text-xs text-white/35 sm:hidden">
          Tap outside or press Esc to close
        </p>
      </div>
    </div>
  );
}
