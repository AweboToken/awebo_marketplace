'use client';

import { createContext, useContext } from 'react';

export type ExperienceMapContextValue = {
  mapOpen: boolean;
  openMap: () => void;
  closeMap: () => void;
  toggleMap: () => void;
  hoveredRoomId: string | null;
  setHoveredRoomId: (roomId: string | null) => void;
  setMapEscBlocked: (blocked: boolean) => void;
};

export const ExperienceMapContext =
  createContext<ExperienceMapContextValue | null>(null);

export function useExperienceMap() {
  const context = useContext(ExperienceMapContext);
  if (!context) {
    throw new Error('useExperienceMap must be used within ExperienceMapProvider');
  }
  return context;
}
