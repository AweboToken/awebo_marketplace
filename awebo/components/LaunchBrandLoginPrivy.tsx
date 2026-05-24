'use client';

import PrivyAuthButton from '@/components/auth/PrivyAuthButton';
import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';

/**
 * Opens the custom AWEBO login modal when Privy is configured.
 */
export default function LaunchBrandLoginPrivy({
  children,
  className,
  redirectPath = LAUNCH_BRAND_PATH,
}: {
  children: React.ReactNode;
  className?: string;
  redirectPath?: string;
}) {
  return (
    <PrivyAuthButton className={className} redirectPath={redirectPath} replace>
      {children}
    </PrivyAuthButton>
  );
}
