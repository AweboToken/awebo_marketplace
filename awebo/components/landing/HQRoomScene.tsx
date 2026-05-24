'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isBottomRightQuadrant } from '@/lib/viewport-zones';
import { navigateToLandingHome } from '@/lib/auth-redirect';
import type { AweboHQRoom } from '@/lib/experience-map';
import Navigation from '@/components/Navigation';
import MeetingRoomContactCard from '@/components/landing/MeetingRoomContactCard';
import FoundersOfficeAboutPanel from '@/components/landing/FoundersOfficeAboutPanel';

const HQ_ROOM_FADE_MS = 600;

type HQRoomSceneProps = {
  room: AweboHQRoom;
};

export default function HQRoomScene({ room }: HQRoomSceneProps) {
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
      navigateToLandingHome(router);
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
        transitionDuration: `${HQ_ROOM_FADE_MS}ms`,
      }}
      aria-label={room.name}
    >
      <Navigation variant="landing" landingTheme="overlay" />

      <div className="absolute inset-0 z-0">
        {room.imageSrc ? (
          <Image
            src={room.imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        ) : null}
      </div>

      {room.id === 'ROOM_03' ? <MeetingRoomContactCard /> : null}
      {room.id === 'ROOM_14' ? <FoundersOfficeAboutPanel /> : null}
    </main>
  );
}
