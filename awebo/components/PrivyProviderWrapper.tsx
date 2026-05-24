'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import { AuthModalProvider } from '@/components/auth/AuthModalContext';
import { ExperienceMapProvider } from '@/components/landing/ExperienceMapProvider';
import LaunchPreloaderProvider from '@/components/landing/LaunchPreloaderProvider';
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
    return (
      <LaunchPreloaderProvider>
        <ExperienceMapProvider>{children}</ExperienceMapProvider>
      </LaunchPreloaderProvider>
    );
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
      <AuthModalProvider>
        <LaunchPreloaderProvider>
          <ExperienceMapProvider>{children}</ExperienceMapProvider>
        </LaunchPreloaderProvider>
      </AuthModalProvider>
    </Privy>
  );
}
