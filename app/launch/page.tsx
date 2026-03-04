'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LaunchFeed from './LaunchFeed';
import LaunchWizardModal from './LaunchWizardModal';
import ConnectWalletModal, { getWalletConnected } from '@/components/ConnectWalletModal';
import { initReferralFromUrl } from '@/lib/referral';

export default function LaunchPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  useEffect(() => {
    initReferralFromUrl();
  }, []);

  const handleOpenWizard = () => {
    if (getWalletConnected()) setWizardOpen(true);
    else setConnectOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar: logo + exit */}
      <header className="border-b border-gray-200 bg-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="w-8 h-8 flex items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm">A</span>
            <span className="text-air-force-blue font-semibold tracking-tight text-lg">AWEBO</span>
            <span className="text-gray-500 font-medium text-sm ml-1">CREATOR STUDIO</span>
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium uppercase no-underline"
          >
            Exit
          </Link>
        </div>
      </header>

      {/* Feed scrolls behind modal; modal is centered overlay */}
      <LaunchFeed onOpenWizard={handleOpenWizard} />

      <LaunchWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />

      <ConnectWalletModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConnected={() => setWizardOpen(true)}
      />
    </div>
  );
}
