import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import { getBrandBySlug, getProductsForBrand } from '@/lib/marketplace-data';

type Props = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const b = getBrandBySlug(params.slug);
  return {
    title: b ? `${b.name} — Brand` : 'Brand — Marketplace',
    description: b?.tagline ?? 'Brand storefront on AWEBO.',
  };
}

const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'collections', label: 'Collections' },
  { id: 'activity', label: 'Activity' },
  { id: 'about', label: 'About' },
] as const;

export default function BrandStorefrontPage({ params, searchParams }: Props) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) notFound();
  const products = getProductsForBrand(params.slug);
  const tabRaw = typeof searchParams.tab === 'string' ? searchParams.tab : 'products';
  const tab = tabs.some((t) => t.id === tabRaw) ? tabRaw : 'products';

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
      <div className={`relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8 h-48 sm:h-56 md:h-64 bg-gradient-to-r ${brand.bannerTone}`} aria-hidden />
      <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end gap-6">
        <div
          className="h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-white shadow-md flex items-center justify-center text-2xl font-bold text-air-force-blue"
          aria-hidden
        >
          {brand.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 pb-2">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">{brand.name}</h1>
          <p className="mt-2 text-gray-600 max-w-2xl text-pretty">{brand.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-500">Verified links row</span>
            {brand.fundraising && (
              <Link
                href={`/marketplace/brand/${brand.slug}/fundraising`}
                className="inline-flex rounded-full bg-air-force-blue/15 px-3 py-1 text-xs font-semibold text-air-force-blue no-underline hover:bg-air-force-blue/25"
              >
                Support fundraising
              </Link>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-silver bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-seashell focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Favorite brand (login)
            </button>
            <button
              type="button"
              className="rounded-lg border border-silver bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-seashell focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Share
            </button>
            <button
              type="button"
              className="rounded-lg border border-silver bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-seashell focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Contact brand (login)
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-10 flex gap-2 border-b border-silver overflow-x-auto"
        role="tablist"
        aria-label="Brand sections"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <Link
              key={t.id}
              href={`/marketplace/brand/${brand.slug}?tab=${t.id}`}
              role="tab"
              aria-selected={active}
              className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 -mb-px no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue rounded-t-md ${
                active ? 'border-air-force-blue text-air-force-blue' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
        {brand.fundraising && (
          <Link
            href={`/marketplace/brand/${brand.slug}/fundraising`}
            className="shrink-0 px-4 py-3 text-sm font-semibold text-gray-600 border-b-2 border-transparent -mb-px no-underline hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue rounded-t-md"
          >
            Fundraising
          </Link>
        )}
      </div>

      <div className="mt-8" role="tabpanel">
        {tab === 'products' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Products</h2>
              <label htmlFor="brand-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="brand-sort"
                name="sort"
                className="rounded-lg border border-silver bg-white px-3 py-2 text-sm"
                defaultValue="trending"
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price low to high</option>
              </select>
            </div>
            {products.length === 0 ? (
              <p className="text-gray-600">No products yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
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
            )}
          </div>
        )}
        {tab === 'collections' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Spring drop', 'Archive', 'Objects'].map((name) => (
              <div key={name} className="rounded-xl border border-silver bg-white overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-400" aria-hidden />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-xs text-gray-600 mt-1">Short description · product count</p>
                  <button
                    type="button"
                    className="mt-3 text-sm font-medium text-air-force-blue hover:underline"
                  >
                    View collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'activity' && (
          <ul className="space-y-4 max-w-2xl">
            <li className="rounded-xl border border-silver bg-white p-4 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Milestone</span> — Campaign update placeholder.
            </li>
            <li className="rounded-xl border border-silver bg-white p-4 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Behind the scenes</span> — Optional posts rail.
            </li>
          </ul>
        )}
        {tab === 'about' && (
          <div className="max-w-2xl space-y-4 text-gray-700">
            <p>Full brand story, policies (shipping and returns), and contact links live here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
