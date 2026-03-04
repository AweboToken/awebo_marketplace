'use client';

import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('awebo-welcome-seen');
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('awebo-welcome-seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6 shadow-xl border border-gray-200">
        <h2 className="text-accent text-2xl font-bold text-center">
          Welcome to Awebo.wtf
        </h2>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            On this platform you can buy and sell tokens on the bonding curve, and you can also launch your own token on the L1X chain.
          </p>
          <p>
            By using Awebo.wtf you agree to our{' '}
            <a href="/terms" className="text-accent hover:opacity-80 hover:underline">
              Terms & Conditions
            </a>{' '}
            (available in the footer) and confirm that you are over 18 years old.
          </p>
        </div>
        <button
          onClick={handleClose}
          className="w-full bg-accent hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
