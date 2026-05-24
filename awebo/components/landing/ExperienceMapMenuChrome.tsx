'use client';

import Image from 'next/image';

const AWEBO_NAV_ICON = '/awebo_icon.png';

type ExperienceMapMenuChromeProps = {
  open: boolean;
  hoveredRoomName: string | null;
};

export default function ExperienceMapMenuChrome({
  open,
  hoveredRoomName,
}: ExperienceMapMenuChromeProps) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[95]"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex min-h-0 w-full items-center py-3 md:py-4 pl-4 sm:pl-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image
            src={AWEBO_NAV_ICON}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300/90">
              Phygital Collection Vault
            </p>
            <p className="truncate text-lg font-semibold tracking-tight text-white drop-shadow-md sm:text-xl">
              {hoveredRoomName ?? 'Awebo HQ map'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
