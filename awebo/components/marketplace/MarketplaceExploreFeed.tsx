'use client';

import { useEffect, useRef, useState } from 'react';
import { MARKETPLACE_FILTERS } from '@/lib/marketplace-constants';
import type { MarketplaceCollectionCard } from '@/lib/marketplace-collection-cards';
import MarketplaceCollectionCardView from '@/components/marketplace/MarketplaceCollectionCard';
import CollectionTokenModal from '@/components/marketplace/CollectionTokenModal';

type FeedCollection = MarketplaceCollectionCard & { key: string };

function createFeedBatch(collections: MarketplaceCollectionCard[], batchIndex: number): FeedCollection[] {
  return collections.map((collection) => ({
    ...collection,
    key: `${collection.id}-batch-${batchIndex}`,
  }));
}

export default function MarketplaceExploreFeed() {
  const [activeFilter, setActiveFilter] = useState<string>('NEW');
  const [seedCollections, setSeedCollections] = useState<MarketplaceCollectionCard[]>([]);
  const [collections, setCollections] = useState<FeedCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<MarketplaceCollectionCard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/evershop/products', { cache: 'no-store' });
        const payload = (await response.json()) as {
          collections?: MarketplaceCollectionCard[];
        };

        if (cancelled) return;

        const next = payload.collections ?? [];
        setSeedCollections(next);
        setCollections(createFeedBatch(next, 0));
      } catch {
        if (!cancelled) {
          setSeedCollections([]);
          setCollections([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || seedCollections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setCollections((previous) => {
          const nextBatch = Math.floor(previous.length / seedCollections.length);
          return [...previous, ...createFeedBatch(seedCollections, nextBatch)];
        });
      },
      { rootMargin: '480px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [seedCollections]);

  const filteredCollections =
    activeFilter === 'Live'
      ? collections.filter((collection) => collection.launchMode === 'crowdfund' || collection.live)
      : collections;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <div className="mb-6 max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Token marketplace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Collection performance
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
            Each published collection deploys a brand token (mock charts for now). Click a card to
            inspect performance. Shop physical products on Drops.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {MARKETPLACE_FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-air-force-blue text-white'
                    : 'border border-white/25 bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="text-sm text-white/60">Loading collections…</p>
        ) : filteredCollections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
            <p className="text-white/80">No published collections yet.</p>
            <p className="mt-2 text-sm text-white/55">
              Launch a brand at <a href="/launch" className="text-white underline">/launch</a> to
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCollections.map((collection) => (
              <MarketplaceCollectionCardView
                key={collection.key}
                collection={collection}
                onSelect={setSelectedCollection}
              />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="h-px w-full" aria-hidden />
      </div>

      <CollectionTokenModal
        collection={selectedCollection}
        onClose={() => setSelectedCollection(null)}
      />
    </>
  );
}
