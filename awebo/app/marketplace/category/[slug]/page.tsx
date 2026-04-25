import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import { getCategoryBySlug, getProductsForCategory } from '@/lib/marketplace-data';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const cat = getCategoryBySlug(params.slug);
  return {
    title: cat ? `${cat.label} — Marketplace` : 'Category — Marketplace',
    description: cat ? `Browse ${cat.label} on AWEBO.` : 'Category on AWEBO.',
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();
  const products = getProductsForCategory(params.slug);

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/marketplace" className="text-air-force-blue font-medium no-underline hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-gray-400">
            /
          </li>
          <li className="text-gray-900 font-medium">{cat.label}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0 space-y-6" aria-labelledby="filters-heading">
          <h2 id="filters-heading" className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Filters
          </h2>
          <div className="rounded-xl border border-silver bg-white p-4 space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-900 mb-2">Price range</p>
              <div className="flex gap-2 items-center">
                <label className="sr-only" htmlFor="price-min">
                  Minimum price
                </label>
                <input
                  id="price-min"
                  type="number"
                  placeholder="Min…"
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  aria-label="Minimum price in USD"
                />
                <span className="text-gray-400">–</span>
                <label className="sr-only" htmlFor="price-max">
                  Maximum price
                </label>
                <input
                  id="price-max"
                  type="number"
                  placeholder="Max…"
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  aria-label="Maximum price in USD"
                />
              </div>
            </div>
            <fieldset>
              <legend className="font-medium text-gray-900 mb-2">Shipping speed</legend>
              <label className="flex items-center gap-2 py-1">
                <input type="checkbox" name="fast" className="rounded border-gray-300" />
                <span>Fast delivery</span>
              </label>
            </fieldset>
            <fieldset>
              <legend className="font-medium text-gray-900 mb-2">Highlights</legend>
              <label className="flex items-center gap-2 py-1">
                <input type="checkbox" name="new" className="rounded border-gray-300" />
                <span>New</span>
              </label>
              <label className="flex items-center gap-2 py-1">
                <input type="checkbox" name="trending" className="rounded border-gray-300" />
                <span>Trending</span>
              </label>
            </fieldset>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 text-balance">{cat.label}</h1>
            <p className="mt-2 text-gray-600 text-pretty max-w-2xl">
              Category intro, sort controls, and product grid. Connect filters to URL query params when wiring data.
            </p>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <label htmlFor="sort-cat" className="text-sm text-gray-600">
              Sort
            </label>
            <select
              id="sort-cat"
              name="sort"
              className="rounded-lg border border-silver bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-air-force-blue"
              defaultValue="trending"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-600 rounded-xl border border-dashed border-silver bg-white p-8 text-center">
              No mock products in this category yet. Add entries in <code className="text-xs bg-gray-100 px-1 rounded">lib/marketplace-data.ts</code>.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </main>
  );
}
