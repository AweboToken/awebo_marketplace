'use client';

import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';

/**
 * Privy-backed login. Only mount when `NEXT_PUBLIC_PRIVY_APP_ID` is set (see `LaunchBrandLogin.tsx`).
 */
export default function LaunchBrandLoginPrivy({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {
      router.push('/app');
    },
    onError: (error) => {
      console.error('Login failed', error);
    },
  });

  const handleClick = () => {
    if (!ready) return;
    if (authenticated) {
      router.push('/app');
      return;
    }
    login();
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
