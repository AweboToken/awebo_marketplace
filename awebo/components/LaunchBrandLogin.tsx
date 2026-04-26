'use client';

import Link from 'next/link';
import { isPrivyConfigured } from '@/lib/privy-env';
import LaunchBrandLoginPrivy from '@/components/LaunchBrandLoginPrivy';

/**
 * Opens Privy login when configured; otherwise links to Brand Studio (`/launch`) so builds work without env.
 */
export default function LaunchBrandLogin({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!isPrivyConfigured) {
    return (
      <Link href="/launch" className={className}>
        {children}
      </Link>
    );
  }
  return <LaunchBrandLoginPrivy className={className}>{children}</LaunchBrandLoginPrivy>;
}
