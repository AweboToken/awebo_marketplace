'use client';

import Link from 'next/link';
import { isPrivyConfigured } from '@/lib/privy-env';
import { DEFAULT_POST_LOGIN_PATH } from '@/lib/auth-redirect';
import LaunchBrandLoginPrivy from '@/components/LaunchBrandLoginPrivy';

/**
 * Opens the AWEBO login modal when Privy is configured; otherwise links to Brand Studio (`/launch`).
 */
export default function LaunchBrandLogin({
  children,
  className,
  redirectPath = DEFAULT_POST_LOGIN_PATH,
}: {
  children: React.ReactNode;
  className?: string;
  redirectPath?: string;
}) {
  if (!isPrivyConfigured) {
    return (
      <Link href="/launch" className={className}>
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
