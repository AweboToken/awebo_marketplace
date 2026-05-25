import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LiveProductCard } from '@/components/marketplace/LiveProductCard';
import { listDropsCollectionSections } from '@/lib/awebo/drops-catalog';

const MAX_PRODUCTS_PER_SECTION = 4;

export default async function LandingDropsSections() {
  const sections = await listDropsCollectionSections();

  if (sections.length === 0) return null;

  return (
    <section
      aria-label="Live drops by collection"
      className="relative w-full border-t border-white/10 bg-[#0a0a0a] py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Print Lab
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl text-balance">
            Live drops
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base text-pretty">
            Physical products from creator collections — browse by drop, then shop individual
            pieces.
          </p>
          <Link
            href="/drops"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-air-force-blue no-underline hover:underline"
          >
            View all drops
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </header>

        <div className="space-y-12 md:space-y-14">
          {sections.map((section) => {
            const visibleProducts = section.products.slice(0, MAX_PRODUCTS_PER_SECTION);

            return (
              <div key={section.id}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-air-force-blue">
                      ${section.tokenSymbol}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                      {section.collectionName}
                    </h3>
                    <p className="mt-1 text-sm text-white/60">
                      by{' '}
                      <Link
                        href={section.brandHref}
                        className="font-medium text-white/80 no-underline hover:text-white hover:underline"
                      >
                        {section.brandName}
                      </Link>
                    </p>
                  </div>
                  <Link
                    href="/drops"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 no-underline transition-colors hover:text-white"
                  >
                    View collection
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <LiveProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
