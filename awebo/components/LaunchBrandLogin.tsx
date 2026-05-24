'use client';

import Link from 'next/link';
import { isPrivyConfigured } from '@/lib/privy-env';
import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';
import { markLaunchPreloaderIfRoomToLaunch } from '@/lib/launch-preloader-nav';
import LaunchBrandLoginPrivy from '@/components/LaunchBrandLoginPrivy';

/**
 * Opens the AWEBO login modal when Privy is configured; otherwise links to Brand Studio (`/launch`).
 */
export default function LaunchBrandLogin({
  children,
  className,
  redirectPath = LAUNCH_BRAND_PATH,
}: {
  children: React.ReactNode;
  className?: string;
  redirectPath?: string;
}) {
  if (!isPrivyConfigured) {
    return (
      <Link
        href={redirectPath}
        onClick={() => markLaunchPreloaderIfRoomToLaunch(undefined, redirectPath)}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <LaunchBrandLoginPrivy className={className} redirectPath={redirectPath}>
      {children}
    </LaunchBrandLoginPrivy>
  );
}
