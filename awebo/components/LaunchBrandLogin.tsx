'use client';

import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';

/**
 * Renders a button that opens the Privy login modal (Gmail, passkeys, or external wallet).
 * On successful login, redirects to AWEBO studio (/app).
 */
export default function LaunchBrandLogin({
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
