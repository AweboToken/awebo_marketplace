'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ChevronDown, LogOut } from 'lucide-react';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

/**
 * Top-right for AWEBO studio: when authenticated shows wallet/username + disconnect;
 * when not authenticated shows a button that opens Privy login.
 */
export default function UserMenu() {
  const { ready, authenticated, user, logout } = usePrivy();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!ready) return null;
  if (!authenticated) {
    return (
      <LaunchBrandLogin className="rounded-lg bg-air-force-blue px-4 py-2 text-sm font-semibold text-white hover:bg-air-force-blue/90 transition-colors">
        Log in
      </LaunchBrandLogin>
    );
  }
  if (!user) return null;

  // Prefer username (if set on profile); fallback to email, then shortened wallet
  const u = user as { email?: { address?: string }; wallet?: { address?: string }; linkedAccounts?: Array<{ type: string; address?: string }>; username?: string };
  const email = u.email?.address ?? u.linkedAccounts?.find((a) => a.type === 'email')?.address;
  const wallet = u.wallet?.address ?? u.linkedAccounts?.find((a) => a.type === 'wallet')?.address;
  const displayName =
    u.username ??
    email ??
    (wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Account');

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        <span className="max-w-[140px] truncate">{displayName}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-lg"
          role="menu"
        >
          <div className="border-b border-gray-700 px-3 py-2">
            <p className="truncate text-xs text-gray-400">Signed in</p>
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            role="menuitem"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
