'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { isPrivyConfigured } from '@/lib/privy-env';

type RequirePrivyAuthProps = {
  children: React.ReactNode;
  redirectPath: string;
  title: string;
  description: string;
};

/**
 * Blocks children until the user signs in with Privy (custom AWEBO modal).
 */
export default function RequirePrivyAuth({
  children,
  redirectPath,
  title,
  description,
}: RequirePrivyAuthProps) {
  const { ready, authenticated } = usePrivy();
  const { openAuthModal } = useAuthModal();

  if (!isPrivyConfigured) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-sm text-white/70">Checking session…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">{description}</p>
        <button
          type="button"
          onClick={() => openAuthModal({ redirectPath })}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#6e5dcb] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5e4db8]"
        >
          Sign in to continue
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
