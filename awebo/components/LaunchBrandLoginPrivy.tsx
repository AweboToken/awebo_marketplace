'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';
import { navigateWithRoomLaunchTransition } from '@/lib/launch-preloader-nav';

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
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { openAuthModal } = useAuthModal();

  const handleClick = () => {
    if (!ready) return;
    if (authenticated) {
      navigateWithRoomLaunchTransition(router, redirectPath, { replace: true });
      return;
    }
    openAuthModal({ redirectPath });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
