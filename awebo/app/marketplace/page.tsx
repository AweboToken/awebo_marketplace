import Link from 'next/link';
import ProductCard from '@/components/marketplace/ProductCard';
import {
  MARKETPLACE_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_BRANDS,
  TOPIC_RAILS,
} from '@/lib/marketplace-data';

export const metadata = {
  title: 'Marketplace — AWEBO',
  description: 'Discover brands, products, and drops on AWEBO.',
};

export default function MarketplaceHomePage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-balance font-rapid-response tracking-tight">
            Marketplace home
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl text-pretty">
            Discovery feed, category shortcuts, and curated rails. Wire this to search and personalization when backend is ready.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
          <span className="rounded-full border border-silver bg-white px-3 py-1 font-medium">New drops</span>
          <span className="hidden sm:inline text-gray-400">Day / night toggle (optional)</span>
        </div>
      </div>

      <section aria-labelledby="cat-shortcuts" className="mb-12">
        <h2 id="cat-shortcuts" className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Category tiles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MARKETPLACE_CATEGORIES.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/marketplace/category/${c.slug}`}
              className="rounded-xl border border-silver/80 bg-white px-4 py-5 text-sm font-semibold text-gray-900 hover:border-air-force-blue hover:bg-powder-petal/50 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue min-h-[4.5rem] flex items-center text-balance"
            >
              {c.label}
            </Link>
          ))}
        </div>
        <Link
          href="/marketplace/category/hombre"
          className="inline-block mt-4 text-sm font-medium text-air-force-blue no-underline hover:underline"
        >
          Mega category overlay → browse all categories
        </Link>
      </section>

      <section aria-labelledby="featured-brands" className="mb-12">
        <h2 id="featured-brands" className="text-lg font-bold text-gray-900 mb-4">
          Featured brands
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
          {MOCK_BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={`/marketplace/brand/${b.slug}`}
              className="snap-start shrink-0 w-64 rounded-xl border border-silver overflow-hidden bg-white no-underline hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              <div className={`h-24 bg-gradient-to-r ${b.bannerTone}`} aria-hidden />
              <div className="p-4">
                <p className="font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{b.tagline}</p>
                {b.fundraising && (
                  <span className="mt-2 inline-block text-xs font-semibold text-air-force-blue">Fundraising</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {TOPIC_RAILS.map((rail) => (
        <section key={rail.id} aria-labelledby={`rail-${rail.id}`} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 id={`rail-${rail.id}`} className="text-lg font-bold text-gray-900">
              {rail.title}
            </h2>
            <Link href="/marketplace/category/ropa-zapatos" className="text-sm font-medium text-air-force-blue no-underline hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_PRODUCTS.filter((_, i) => (rail.id === 'bestsellers' ? i % 2 === 0 : i % 2 === 1)).map((p) => (
              <ProductCard
                key={`${rail.id}-${p.id}`}
                id={p.id}
                name={p.name}
                brandSlug={p.brandSlug}
                brandName={p.brandName}
                priceUsd={p.priceUsd}
                imageTone={p.imageTone}
              />
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="infinite-feed" className="mb-8">
        <h2 id="infinite-feed" className="text-lg font-bold text-gray-900 mb-4">
          Mixed discovery feed
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Placeholder for infinite scroll (mixed brands/products). Below is a static grid representing the first page.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              brandSlug={p.brandSlug}
              brandName={p.brandName}
              priceUsd={p.priceUsd}
              imageTone={p.imageTone}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
