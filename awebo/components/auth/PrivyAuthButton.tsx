'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { isPrivyConfigured } from '@/lib/privy-env';
import { navigateWithRoomLaunchTransition } from '@/lib/launch-preloader-nav';

type PrivyAuthButtonProps = {
  children: React.ReactNode;
  className?: string;
  redirectPath: string;
  /** When Privy is not configured, navigate directly without auth. */
  allowUnauthenticated?: boolean;
  replace?: boolean;
};

/**
 * Navigates to redirectPath when authenticated; opens the AWEBO login modal otherwise.
 */
export default function PrivyAuthButton({
  children,
  className,
  redirectPath,
  allowUnauthenticated = false,
  replace = false,
}: PrivyAuthButtonProps) {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { openAuthModal } = useAuthModal();

  const handleClick = () => {
    if (!isPrivyConfigured) {
      if (allowUnauthenticated) {
        navigateWithRoomLaunchTransition(router, redirectPath, { replace });
      }
      return;
    }
    if (!ready) return;
    if (authenticated) {
      navigateWithRoomLaunchTransition(router, redirectPath, { replace });
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
