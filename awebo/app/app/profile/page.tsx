'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DashboardCard from '@/components/DashboardCard';

type Tab = 'balances' | 'gains' | 'coins' | 'referrals' | 'settings';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('balances');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'balances', label: 'Balances' },
    { id: 'gains', label: 'Gains' },
    { id: 'coins', label: 'Coins' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Dashboard Card */}
          <div className="lg:col-span-1">
            <DashboardCard />
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal text-white'
                      : 'bg-gray-900 text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              {activeTab === 'balances' && <BalancesTab />}
              {activeTab === 'gains' && <GainsTab />}
              {activeTab === 'coins' && <CoinsTab />}
              {activeTab === 'referrals' && <ReferralsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BalancesTab() {
  const [filter, setFilter] = useState<'all' | 'claimable'>('all');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Holdings</h2>
      <div className="bg-black rounded-lg p-4 border border-gray-700">
        <div className="flex justify-end mb-4">
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-teal text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('claimable')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'claimable'
                  ? 'bg-teal text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Claimable
            </button>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">
            No tokens yet — launch your first one from the Launch page.
          </p>
        </div>
      </div>
    </div>
  );
}

function GainsTab() {
  const metrics = [
    { label: 'Volume share', value: '0.2%' },
    { label: 'Owner gains', value: '0 WL1X' },
    { label: 'Referral gains', value: '0 WL1X' },
    { label: 'Referral rate', value: '2%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Gains</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-black border border-gray-700 rounded-lg p-4"
          >
            <div className="text-gray-400 text-xs mb-2">{metric.label}</div>
            <div className="text-white font-semibold text-lg">{metric.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-brown hover:bg-brown-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
          Claim all
        </button>
        <p className="text-gray-400 text-sm">
          Claims owner/referral rewards when available.
        </p>
      </div>
    </div>
  );
}

function CoinsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Created coins</h2>
      <input
        type="text"
        placeholder="Search by address..."
        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal"
      />
      <div className="text-center py-8">
        <p className="text-gray-400 mb-2">No created coins found on this device.</p>
        <p className="text-gray-500 text-sm">
          Full cross-device history requires a backend indexer.{' '}
          <a href="#" className="text-teal hover:underline">
            Learn why
          </a>
        </p>
      </div>
    </div>
  );
}

function ReferralsTab() {
  const [referrerAddress, setReferrerAddress] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Referrals</h2>
      
      <div className="bg-black border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Referrer</span>
          <span className="text-white">None</span>
        </div>
      </div>

      <div className="bg-black border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex space-x-3">
          <input
            type="text"
            value={referrerAddress}
            onChange={(e) => {
              setReferrerAddress(e.target.value);
              setError(e.target.value ? 'Invalid address' : '');
            }}
            placeholder="Enter referrer wallet address"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal"
          />
          <button className="bg-teal hover:bg-teal-dark text-white font-medium px-6 py-2 rounded-lg transition-colors">
            Set referrer
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>

      <div className="bg-black border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Referrals</span>
          <span className="text-white font-semibold">0</span>
        </div>
        <p className="text-gray-500 text-sm">No referral data yet.</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Settings</h2>
      <div className="bg-gray-900 border-2 border-white rounded-lg p-6 space-y-4">
        <p className="text-gray-300 text-sm">
          Profile settings are stored locally on this device (no backend profile storage configured).
        </p>
        <button className="bg-teal hover:bg-teal-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
          Copy public profile link
        </button>
      </div>
    </div>
  );
}
