'use client';

import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { MarketplaceCollectionCard } from '@/lib/marketplace-collection-cards';
import { formatCompactUsd, mockChartSeries } from '@/lib/marketplace-collection-cards';

type MarketplaceCollectionCardProps = {
  collection: MarketplaceCollectionCard;
  onSelect: (collection: MarketplaceCollectionCard) => void;
};

export default function MarketplaceCollectionCardView({
  collection,
  onSelect,
}: MarketplaceCollectionCardProps) {
  const positive = collection.change24hPct >= 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(collection)}
      className="group overflow-hidden rounded-2xl border border-white/15 bg-black/30 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:border-white/25"
    >
      <div className="relative h-28 bg-gradient-to-r from-violet-900/50 to-air-force-blue/40">
        {collection.bannerUrl ? (
          <Image
            src={collection.bannerUrl}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {collection.live ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Live
          </span>
        ) : null}
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
          ${collection.tokenSymbol}
        </span>
      </div>

      <div className="relative px-4 pb-4 pt-0">
        <div className="-mt-8 mb-3 flex items-end gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-black/40 bg-black/50 shadow-lg">
            {collection.logoUrl ? (
              <Image
                src={collection.logoUrl}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-violet-200">
                {collection.tokenSymbol.slice(0, 2)}
              </div>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="truncate text-sm font-semibold text-white">{collection.brandName}</p>
            <p className="truncate text-xs text-white/65">{collection.collectionName}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold tabular-nums text-white">
              ${collection.priceUsd.toFixed(4)}
            </p>
            <p
              className={`mt-0.5 inline-flex items-center gap-1 text-xs font-semibold ${
                positive ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {positive ? (
                <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" aria-hidden />
              )}
              {positive ? '+' : ''}
              {collection.change24hPct.toFixed(2)}% 24h
            </p>
          </div>
          <div className="text-right text-[11px] text-white/55">
            <p>Mcap {formatCompactUsd(collection.marketCapUsd)}</p>
            <p>{collection.productCount} products</p>
          </div>
        </div>

        <MiniSparkline collectionId={collection.id} positive={positive} />
      </div>
    </button>
  );
}

function MiniSparkline({
  collectionId,
  positive,
}: {
  collectionId: string;
  positive: boolean;
}) {
  const series = mockChartSeries(collectionId, 12);
  return (
    <div
      className="mt-4 flex h-10 items-end gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5"
      aria-hidden
    >
      {series.map((value, index) => (
        <div
          key={`${collectionId}-${index}`}
          className={`flex-1 rounded-sm ${positive ? 'bg-emerald-400/70' : 'bg-red-400/70'}`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}
