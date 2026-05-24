'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TILE_REPEAT_COUNT = 8;
export const SCROLLING_ROOM_CROSSFADE_MS = 900;

type ScrollingRoomBackgroundProps = {
  imageSrc: string;
  blurClassName?: string;
  crossfadeOnChange?: boolean;
};

type RoomTileColumnProps = {
  imageSrc: string;
  blurClassName: string;
  loopOffset: number;
  tileSize: number;
  opacity: number;
  priority?: boolean;
};

function RoomTileColumn({
  imageSrc,
  blurClassName,
  loopOffset,
  tileSize,
  opacity,
  priority = false,
}: RoomTileColumnProps) {
  return (
    <div
      className="absolute inset-0 transition-opacity ease-in-out motion-reduce:transition-none"
      style={{
        opacity,
        transitionDuration: `${SCROLLING_ROOM_CROSSFADE_MS}ms`,
      }}
    >
      <div
        className={`absolute inset-x-0 ${blurClassName}`}
        style={{
          height: tileSize * TILE_REPEAT_COUNT,
          transform: `translate3d(0, -${loopOffset}px, 0)`,
        }}
      >
        {Array.from({ length: TILE_REPEAT_COUNT }).map((_, index) => (
          <div
            key={`${imageSrc}-${index}`}
            className="relative w-full"
            style={{ height: tileSize }}
          >
            <Image
              src={imageSrc}
              alt=""
              fill
              priority={priority && index === 0}
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScrollingRoomBackground({
  imageSrc,
  blurClassName = 'blur-md',
  crossfadeOnChange = false,
}: ScrollingRoomBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [tileHeight, setTileHeight] = useState(0);
  const activeSrcRef = useRef(imageSrc);
  const transitionIdRef = useRef(0);
  const [baseSrc, setBaseSrc] = useState(imageSrc);
  const [overlaySrc, setOverlaySrc] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const measure = () => setTileHeight(window.innerHeight);
    measure();
    window.addEventListener('resize', measure);

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!crossfadeOnChange) return;

    if (imageSrc === activeSrcRef.current) {
      setOverlaySrc((current) => {
        if (current !== null) {
          setBaseSrc(imageSrc);
          setRevealed(false);
        }
        return null;
      });
      return;
    }

    const transitionId = ++transitionIdRef.current;
    setOverlaySrc(imageSrc);
    setRevealed(false);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (transitionIdRef.current === transitionId) setRevealed(true);
      });
    });

    const timer = window.setTimeout(() => {
      if (transitionIdRef.current !== transitionId) return;
      activeSrcRef.current = imageSrc;
      setBaseSrc(imageSrc);
      setOverlaySrc(null);
      setRevealed(false);
    }, SCROLLING_ROOM_CROSSFADE_MS);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [crossfadeOnChange, imageSrc]);

  const loopOffset = tileHeight > 0 ? scrollY % tileHeight : 0;
  const tileSize = tileHeight || 800;
  const baseOpacity = overlaySrc ? (revealed ? 0 : 1) : 1;
  const overlayOpacity = overlaySrc ? (revealed ? 1 : 0) : 0;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]"
      aria-hidden
    >
      <RoomTileColumn
        imageSrc={baseSrc}
        blurClassName={blurClassName}
        loopOffset={loopOffset}
        tileSize={tileSize}
        opacity={baseOpacity}
        priority
      />
      {overlaySrc ? (
        <RoomTileColumn
          imageSrc={overlaySrc}
          blurClassName={blurClassName}
          loopOffset={loopOffset}
          tileSize={tileSize}
          opacity={overlayOpacity}
        />
      ) : null}
    </div>
  );
}
