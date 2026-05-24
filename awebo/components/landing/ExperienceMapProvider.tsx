'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ExperienceMapOverlay, {
  preloadExperienceMapImage,
} from '@/components/landing/ExperienceMapOverlay';
import ExperienceMapMenuChrome from '@/components/landing/ExperienceMapMenuChrome';
import { ExperienceMapContext } from '@/components/landing/ExperienceMapContext';
import { getAweboHQRoom } from '@/lib/experience-map';

export function ExperienceMapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapOpen, setMapOpen] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [mapEscBlocked, setMapEscBlocked] = useState(false);

  useEffect(() => {
    void preloadExperienceMapImage().catch(() => undefined);
  }, []);

  const openMap = useCallback(() => {
    setMapOpen(true);
  }, []);

  const closeMap = useCallback(() => {
    setMapOpen(false);
    setHoveredRoomId(null);
  }, []);

  const toggleMap = useCallback(() => {
    setMapOpen((open) => {
      if (open) setHoveredRoomId(null);
      return !open;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mapEscBlocked) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      toggleMap();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mapEscBlocked, toggleMap]);

  const value = useMemo(
    () => ({
      mapOpen,
      openMap,
      closeMap,
      toggleMap,
      hoveredRoomId,
      setHoveredRoomId,
      setMapEscBlocked,
    }),
    [mapOpen, openMap, closeMap, toggleMap, hoveredRoomId]
  );

  const hoveredRoom = hoveredRoomId ? getAweboHQRoom(hoveredRoomId) : undefined;

  return (
    <ExperienceMapContext.Provider value={value}>
      {children}
      <ExperienceMapMenuChrome
        open={mapOpen}
        hoveredRoomName={hoveredRoom?.name ?? null}
      />
      <ExperienceMapOverlay open={mapOpen} onClose={closeMap} />
    </ExperienceMapContext.Provider>
  );
}
