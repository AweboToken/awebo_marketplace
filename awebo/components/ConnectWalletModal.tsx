'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';
import { navigateWithRoomLaunchTransition } from '@/lib/launch-preloader-nav';

const STORAGE_KEY = 'awebo-wallet-connected';

export function getWalletConnected(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function setWalletConnected(connected: boolean): void {
  if (typeof window === 'undefined') return;
  if (connected) localStorage.setItem(STORAGE_KEY, 'true');
  else localStorage.removeItem(STORAGE_KEY);
}

type ConnectWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Called after successful (mock) connect. If not provided, defaults to redirect to /launch. */
  onConnected?: () => void;
};

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onConnected,
}: ConnectWalletModalProps) {
  const router = useRouter();

  const handleConnect = useCallback(() => {
    setWalletConnected(true);
    onClose();
    if (onConnected) {
      onConnected();
    } else {
      navigateWithRoomLaunchTransition(router, LAUNCH_BRAND_PATH);
    }
  }, [onClose, onConnected, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-wallet-title"
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <h2 id="connect-wallet-title" className="text-xl font-bold text-gray-900 mb-1">
          Connect wallet
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Connect your wallet to link your profile and create referral links, or to launch your brand.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleConnect}
            className="w-full flex items-center justify-center gap-3 rounded-lg bg-gray-900 text-white font-semibold py-3 px-4 hover:bg-gray-800 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm">🦊</span>
            MetaMask
          </button>
          <button
            type="button"
            onClick={handleConnect}
            className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold py-3 px-4 hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm text-white">W</span>
            WalletConnect
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
