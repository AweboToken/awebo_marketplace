'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!appId && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy login will not work.');
}

/**
 * Enable in Privy Dashboard: Email, Google (Gmail), Passkey, and Wallet
 * so users can log in with Gmail, passkeys, or connect an external wallet.
 */
export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Privy
      appId={appId ?? ''}
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
