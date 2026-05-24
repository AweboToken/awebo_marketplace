'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import ScrollingRoomBackground from '@/components/landing/ScrollingRoomBackground';
import Navigation from '@/components/Navigation';
import RequirePrivyAuth from '@/components/auth/RequirePrivyAuth';
import {
  LiveProductCard,
  type LiveCatalogProduct,
} from '@/components/marketplace/LiveProductCard';
import type { CreatorDropsPayload } from '@/lib/awebo/creator-drops';
import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';

const PRINT_LAB_IMAGE = '/printroom.webp';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function MyDropsContent() {
  const { user, ready } = usePrivy();
  const ownerId = user?.id ?? '';
  const [payload, setPayload] = useState<CreatorDropsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !ownerId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/drops/my?ownerId=${encodeURIComponent(ownerId)}`,
          { cache: 'no-store' }
        );
        if (!response.ok) return;
        const data = (await response.json()) as CreatorDropsPayload;
        if (!cancelled) setPayload(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [ready, ownerId]);

  const allProducts: LiveCatalogProduct[] =
    payload?.brands.flatMap((brand) => brand.products) ?? [];

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 md:pt-24 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
            Creator dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-md sm:text-4xl">
            My Drops
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            Your published brands and products on AWEBO. Inventory and checkout run through
            our commerce backend — no separate admin login required.
          </p>
        </div>
        <Link
          href={LAUNCH_BRAND_PATH}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#6e5dcb] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#5e4db8]"
        >
          Launch new brand
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-white/75">Loading your drops…</p>
      ) : payload && payload.stats.brandCount > 0 ? (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Brands" value={payload.stats.brandCount} />
            <StatCard label="Products" value={payload.stats.productCount} />
            <StatCard label="Self-funded" value={payload.stats.selfFundedCount} />
            <StatCard label="Crowdfund" value={payload.stats.crowdfundCount} />
          </div>

          {payload.brands.map((brand) => (
            <section key={brand.slug} className="mb-10">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{brand.name}</h2>
                  <p className="text-xs text-white/60">
                    Published {new Date(brand.publishedAt).toLocaleDateString()} ·{' '}
                    {brand.launchMode === 'crowdfund' ? 'Crowdfund' : 'Self-funded'} ·{' '}
                    {brand.productCount} product{brand.productCount === 1 ? '' : 's'}
                  </p>
                </div>
                <Link
                  href={`/marketplace/brand/${brand.slug}`}
                  className="text-sm font-medium text-white/85 no-underline hover:text-white hover:underline"
                >
                  View brand page
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {brand.products.map((product) => (
                  <LiveProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <div className="rounded-2xl border border-white/15 bg-black/35 p-8 backdrop-blur-md">
          <p className="text-white/85">
            You haven&apos;t published any drops yet.{' '}
            <Link href={LAUNCH_BRAND_PATH} className="font-medium text-white underline-offset-4 hover:underline">
              Launch your first brand
            </Link>{' '}
            to list products on the marketplace and drops feed.
          </p>
        </div>
      )}

      {!loading && allProducts.length > 0 ? (
        <p className="mt-8 text-xs text-white/50">
          Order stats and fulfillment tracking will appear here as checkout integrations roll out.
        </p>
      ) : null}
    </main>
  );
}

export default function MyDropsPageClient() {
  return (
    <div className="relative min-h-screen font-sans text-gray-900">
      <ScrollingRoomBackground imageSrc={PRINT_LAB_IMAGE} blurClassName="blur-sm" />
      <Navigation variant="landing" landingTheme="overlay" />
      <RequirePrivyAuth
        redirectPath="/drops/my"
        title="Sign in to view your drops"
        description="My Drops shows the brands and products you've published through Launch Brand. Sign in with your AWEBO account — no EverShop credentials needed."
      >
        <MyDropsContent />
      </RequirePrivyAuth>
    </div>
  );
}
