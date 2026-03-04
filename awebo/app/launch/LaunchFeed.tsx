'use client';

import { useState, useCallback, useEffect } from 'react';
import ConnectWalletModal from '@/components/ConnectWalletModal';
import { getWalletConnected } from '@/components/ConnectWalletModal';
import { buildReferralLink } from '@/lib/referral';

/** Mock launch item for the infinite feed */
type LaunchItem = {
  id: string;
  name: string;
  ticker: string;
  image?: string;
  priceUsd: string;
  change24h: number;
};

const MOCK_LAUNCHES: LaunchItem[] = [
  { id: '1', name: 'Genesis Cyber', ticker: 'GCS', priceUsd: '0.024', change24h: 12.4 },
  { id: '2', name: 'Street Protocol', ticker: 'STRT', priceUsd: '0.018', change24h: -3.2 },
  { id: '3', name: 'Awebo Hood', ticker: 'AHOD', priceUsd: '0.031', change24h: 8.1 },
  { id: '4', name: 'Phygital Labs', ticker: 'PHY', priceUsd: '0.015', change24h: 22.0 },
  { id: '5', name: 'Culture Coin', ticker: 'CULT', priceUsd: '0.042', change24h: -1.5 },
];

function CandleChartPlaceholder() {
  return (
    <div className="h-16 w-full rounded-lg bg-gray-100 flex items-end justify-around gap-0.5 px-1 py-2">
      {[40, 55, 48, 62, 58, 70, 65].map((h, i) => (
        <div
          key={i}
          className="flex-1 min-w-[2px] bg-air-force-blue/70 rounded-sm"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

type LaunchCardProps = {
  item: LaunchItem;
  onBuy: (id: string) => void;
  onRefer: (id: string) => void;
};

function LaunchCard({ item, onBuy, onRefer }: LaunchCardProps) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">
        {item.ticker.slice(0, 2)}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <span className="text-xs font-mono font-medium text-air-force-blue bg-air-force-blue/10 px-2 py-0.5 rounded">
            {item.ticker}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          {item.priceUsd} USD
          <span className={item.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
            {' '}{item.change24h >= 0 ? '+' : ''}{item.change24h}%
          </span>
        </div>
        <CandleChartPlaceholder />
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => onBuy(item.id)}
            className="flex-1 rounded-lg bg-air-force-blue text-white font-semibold py-2.5 text-sm hover:bg-air-force-blue/90"
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onRefer(item.id)}
            className="flex-1 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold py-2.5 text-sm hover:bg-gray-50"
          >
            Refer
          </button>
        </div>
      </div>
    </article>
  );
}

type LaunchFeedProps = {
  onOpenWizard: () => void;
};

export default function LaunchFeed({ onOpenWizard }: LaunchFeedProps) {
  const [items, setItems] = useState<LaunchItem[]>(MOCK_LAUNCHES);
  const [connectOpen, setConnectOpen] = useState(false);
  const [referralCopied, setReferralCopied] = useState<string | null>(null);

  const loadMore = useCallback(() => {
    setItems((prev) => {
      const next = [...prev];
      MOCK_LAUNCHES.forEach((m, i) => {
        next.push({ ...m, id: `${prev.length + i + 1}` });
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (e?.isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    const sentinel = document.getElementById('feed-sentinel');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleBuy = (id: string) => {
    if (!getWalletConnected()) setConnectOpen(true);
    else {
      // TODO: open buy flow
    }
  };

  const handleRefer = (id: string) => {
    if (!getWalletConnected()) {
      setConnectOpen(true);
      return;
    }
    const wallet = '0xBe76...e5C8'; // mock; replace with real wallet from context
    const link = buildReferralLink(wallet, `/launch?launch=${id}`);
    navigator.clipboard.writeText(link).then(() => {
      setReferralCopied(id);
      setTimeout(() => setReferralCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Minimal header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Merch Launches</h1>
          <button
            type="button"
            onClick={onOpenWizard}
            className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm hover:bg-air-force-blue/90"
          >
            Launch your token
          </button>
        </div>
      </header>

      {/* Infinite feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <LaunchCard
              key={item.id}
              item={item}
              onBuy={handleBuy}
              onRefer={handleRefer}
            />
          ))}
        </div>
        <div id="feed-sentinel" className="h-8" aria-hidden />
      </div>

      {referralCopied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg z-50">
          Referral link copied
        </div>
      )}

      <ConnectWalletModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
      />
    </div>
  );
}
