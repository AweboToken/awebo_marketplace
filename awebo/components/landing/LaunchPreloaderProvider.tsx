'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AweboPreloaderOverlay from '@/components/landing/AweboPreloaderOverlay';
import { consumeLaunchPreloaderNavigation } from '@/lib/launch-preloader-nav';
import { PRELOADER_FADE_MS, PRELOADER_MIN_MS } from '@/lib/awebo-preloader';

type OverlayState = {
  mounted: boolean;
  visible: boolean;
};

export default function LaunchPreloaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  useEffect(() => {
    if (!consumeLaunchPreloaderNavigation()) {
      setOverlay(null);
      return;
    }

    setOverlay({ mounted: true, visible: true });

    const hideTimer = window.setTimeout(() => {
      setOverlay({ mounted: true, visible: false });
    }, PRELOADER_MIN_MS);

    const unmountTimer = window.setTimeout(() => {
      setOverlay(null);
    }, PRELOADER_MIN_MS + PRELOADER_FADE_MS);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [pathname]);

  return (
    <>
      {children}
      {overlay?.mounted ? (
        <AweboPreloaderOverlay visible={overlay.visible} />
      ) : null}
    </>
  );
}
