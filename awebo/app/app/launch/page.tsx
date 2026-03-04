'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function LaunchPage() {
  const [tokenName, setTokenName] = useState('');
  const [ticker, setTicker] = useState('');
  const [initialBuy, setInitialBuy] = useState('0');
  const [weeksLock, setWeeksLock] = useState('0');
  const [maxTx, setMaxTx] = useState('100');
  const [maxWallet, setMaxWallet] = useState('100');
  const [showOptional, setShowOptional] = useState(false);

  const walletAddress = '0xBe76...e5C8';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="mb-8">
          <div className="text-teal text-sm font-medium mb-2">
            Create. Approve. Launch. Grow.
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Launch your Token
          </h1>
          <p className="text-gray-400 max-w-2xl">
            In just four steps, your token can go live — fast, guided, and built directly on L1X. Follow the process and launch your project today.
          </p>
        </div>

        {/* Publish Process Card */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Publish process</h2>
            <span className="text-gray-400 text-sm">Current: Create token</span>
          </div>
          <div className="text-gray-300 text-sm mb-2">
            Connect wallet → Create token → Approve token → Approve WL1X → Open trade
          </div>
          <div className="text-gray-400 text-xs italic">
            Soon: one-click Launch will run all steps automatically.
          </div>
        </div>

        {/* Create & Launch Card */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Create & Launch</h2>
            <div className="bg-orange text-white px-4 py-2 rounded-lg text-sm font-medium">
              {walletAddress}
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Choose carefully. Name and ticker can't be changed after creation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Token Details */}
              <div>
                <h3 className="text-white font-semibold mb-4">Token details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      TOKEN NAME
                    </label>
                    <input
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="Name your token"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      TICKER
                    </label>
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value)}
                      placeholder="e.g. AWE"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal"
                    />
                  </div>
                  <button
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm"
                  >
                    <span>+</span>
                    <span>Add optional info</span>
                  </button>
                </div>
              </div>

              {/* Launch Settings */}
              <div>
                <h3 className="text-white font-semibold mb-4">Launch settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      INITIAL BUY (WL1X)
                    </label>
                    <input
                      type="number"
                      value={initialBuy}
                      onChange={(e) => setInitialBuy(e.target.value)}
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      WEEKS LOCK (0-18)
                    </label>
                    <input
                      type="number"
                      value={weeksLock}
                      onChange={(e) => setWeeksLock(e.target.value)}
                      min="0"
                      max="18"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      MAX TX % (0.1-100)
                    </label>
                    <input
                      type="number"
                      value={maxTx}
                      onChange={(e) => setMaxTx(e.target.value)}
                      min="0.1"
                      max="100"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase mb-2">
                      MAX WALLET % (0.1-100)
                    </label>
                    <input
                      type="number"
                      value={maxWallet}
                      onChange={(e) => setMaxWallet(e.target.value)}
                      min="0.1"
                      max="100"
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-orange hover:bg-orange-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Launch
                </button>
                <button className="flex-1 bg-teal hover:bg-teal-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Create Token
                </button>
              </div>
              <p className="text-gray-400 text-xs">
                You need a small amount of L1X for gas to publish the token.
              </p>
            </div>

            {/* Right Column - Preview */}
            <div>
              <h3 className="text-white font-semibold mb-4">Preview</h3>
              <div className="bg-black rounded-lg p-6 border border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{tokenName || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ticker:</span>
                  <span className="text-white">{ticker || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bonding:</span>
                  <span className="text-white">Public</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Launch fee:</span>
                  <span className="text-white">—</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Initial buy:</span>
                  <span className="text-white">{initialBuy} WL1X</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white">{initialBuy} WL1X</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
