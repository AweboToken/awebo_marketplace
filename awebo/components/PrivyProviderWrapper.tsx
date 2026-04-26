'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { isPrivyConfigured, privyAppId } from '@/lib/privy-env';

/**
 * When `NEXT_PUBLIC_PRIVY_APP_ID` is missing (e.g. Vercel preview without env),
 * skip Privy entirely so static generation does not throw. Use `UserMenu` /
 * `LaunchBrandLogin` fallbacks for UX without auth.
 */
export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isPrivyConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy login is disabled.');
    }
    return <>{children}</>;
  }

  return (
    <Privy
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#6C8FAE',
        },
        embeddedWallets: {
          ethereum: { createOnLogin: 'off' },
        },
      }}
    >
      {children}
    </Privy>
  );
}
