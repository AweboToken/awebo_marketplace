'use client';

import { useEffect, useRef, useState } from 'react';
import ScrollingRoomBackground from '@/components/landing/ScrollingRoomBackground';
import Navigation from '@/components/Navigation';
import PrivyAuthButton from '@/components/auth/PrivyAuthButton';
import {
  LiveProductCard,
  type LiveCatalogProduct,
} from '@/components/marketplace/LiveProductCard';

const PRINT_LAB_IMAGE = '/printroom.webp';

function createBatch(products: LiveCatalogProduct[], batchIndex: number) {
  return products.map((product, index) => ({
    ...product,
    id: `${product.id}-batch-${batchIndex}-${index}`,
  }));
}

export default function DropsPageClient() {
  const [sourceProducts, setSourceProducts] = useState<LiveCatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState<LiveCatalogProduct[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch('/api/evershop/products', { cache: 'no-store' });
        const payload = (await response.json()) as { products?: LiveCatalogProduct[] };
        const products = payload.products ?? [];
        if (!cancelled) {
          setSourceProducts(products);
          setDisplayProducts(createBatch(products, 0));
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
    if (!sourceProducts.length) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setDisplayProducts((previous) => {
          const nextBatch = Math.floor(previous.length / sourceProducts.length);
          return [...previous, ...createBatch(sourceProducts, nextBatch)];
        });
      },
      { rootMargin: '480px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sourceProducts]);

  return (
    <div className="relative min-h-screen font-sans text-gray-900">
      <ScrollingRoomBackground imageSrc={PRINT_LAB_IMAGE} blurClassName="blur-sm" />
      <Navigation variant="landing" landingTheme="overlay" />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 md:pt-24 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
              Print Lab
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl">
              Drops
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              Physical products and token-backed collections published by creators through
              Launch Brand.
            </p>
          </div>
          <PrivyAuthButton
            redirectPath="/drops/my"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            My Drops
          </PrivyAuthButton>
        </div>

        {loading ? (
          <p className="text-sm text-white/75">Loading drops…</p>
        ) : displayProducts.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <LiveProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/15 bg-black/35 p-8 backdrop-blur-md">
            <p className="text-white/85">
              No drops yet. Publish a brand from{' '}
              <a href="/launch" className="font-medium text-white underline-offset-4 hover:underline">
                Launch Brand
              </a>{' '}
              to list products here.
            </p>
          </div>
        )}

        <div ref={loadMoreRef} className="h-px w-full" aria-hidden />
      </main>
    </div>
  );
}
