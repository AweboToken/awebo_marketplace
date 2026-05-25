'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { MarketplaceCollectionCard } from '@/lib/marketplace-collection-cards';
import {
  formatCompactUsd,
  mockChartSeries,
} from '@/lib/marketplace-collection-cards';

type CollectionTokenModalProps = {
  collection: MarketplaceCollectionCard | null;
  onClose: () => void;
};

export default function CollectionTokenModal({
  collection,
  onClose,
}: CollectionTokenModalProps) {
  if (!collection) return null;

  const positive = collection.change24hPct >= 0;
  const series = mockChartSeries(collection.id, 32);
  const width = 560;
  const height = 180;
  const step = width / Math.max(series.length - 1, 1);
  const points = series
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-token-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#10131c] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-36 bg-gradient-to-r from-violet-900/60 to-air-force-blue/40">
          {collection.bannerUrl ? (
            <Image
              src={collection.bannerUrl}
              alt=""
              fill
              unoptimized
              className="object-cover opacity-90"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-black/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-black/60"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-[#10131c] bg-black/50">
              {collection.logoUrl ? (
                <Image
                  src={collection.logoUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-200">
                  {collection.tokenSymbol.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Collection token
              </p>
              <h2 id="collection-token-title" className="truncate text-2xl font-bold text-white">
                {collection.collectionName}
              </h2>
              <p className="truncate text-sm text-white/70">
                {collection.brandName} · ${collection.tokenSymbol} · {collection.chain}
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Price" value={`$${collection.priceUsd.toFixed(4)}`} />
            <Metric
              label="24h"
              value={`${positive ? '+' : ''}${collection.change24hPct.toFixed(2)}%`}
              accent={positive ? 'text-emerald-300' : 'text-red-300'}
            />
            <Metric label="Market cap" value={formatCompactUsd(collection.marketCapUsd)} />
            <Metric label="Volume 24h" value={formatCompactUsd(collection.volume24hUsd)} />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Token performance</p>
              <span className="text-xs text-white/50">Mock chart · on-chain feed pending</span>
            </div>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-44 w-full"
              role="img"
              aria-label="Mock token performance chart"
            >
              <defs>
                <linearGradient id="tokenArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={positive ? '#34d399' : '#f87171'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#tokenArea)"
                stroke="none"
                points={`0,${height} ${points} ${width},${height}`}
              />
              <polyline
                fill="none"
                stroke={positive ? '#34d399' : '#f87171'}
                strokeWidth="3"
                points={points}
              />
            </svg>
          </div>

          <p className="mt-4 text-sm text-white/65 line-clamp-3">
            {collection.story || 'Collection narrative appears here.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={collection.href}
              className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-5 py-2.5 text-sm font-semibold text-gray-900 no-underline hover:bg-air-force-blue/90"
            >
              View brand
            </Link>
            <Link
              href="/drops"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-white/10"
            >
              Shop products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = 'text-white',
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">{label}</p>
      <p className={`mt-1 text-sm font-semibold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}
