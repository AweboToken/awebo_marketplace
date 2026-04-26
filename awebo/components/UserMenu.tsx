'use client';

import Link from 'next/link';
import { isPrivyConfigured } from '@/lib/privy-env';
import UserMenuPrivy from '@/components/UserMenuPrivy';

/**
 * Account menu when Privy is configured; otherwise a simple link to Brand Studio.
 */
export default function UserMenu() {
  if (!isPrivyConfigured) {
    return (
      <Link
        href="/launch"
        className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 no-underline"
      >
        Log in
      </Link>
    );
  }
  return <UserMenuPrivy />;
}
