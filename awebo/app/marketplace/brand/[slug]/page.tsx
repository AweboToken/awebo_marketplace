import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import { resolveBrandPageView } from '@/lib/marketplace-brand-page';

type Props = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const brand = await resolveBrandPageView(params.slug);
  return {
    title: brand ? `${brand.name} — Brand` : 'Brand — Marketplace',
    description: brand?.tagline ?? 'Brand storefront on AWEBO.',
  };
}

const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'collections', label: 'Collections' },
  { id: 'activity', label: 'Activity' },
  { id: 'about', label: 'About' },
] as const;

export default async function BrandStorefrontPage({ params, searchParams }: Props) {
  const brand = await resolveBrandPageView(params.slug);
  if (!brand) notFound();

  const tabRaw = typeof searchParams.tab === 'string' ? searchParams.tab : 'products';
  const tab = tabs.some((t) => t.id === tabRaw) ? tabRaw : 'products';

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="relative -mx-4 mb-8 h-48 sm:-mx-6 sm:h-56 md:h-64 lg:-mx-8">
        {brand.bannerUrl ? (
          <Image
            src={brand.bannerUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
            priority
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-r ${brand.bannerTone}`} aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="relative -mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
          {brand.logoUrl ? (
            <Image src={brand.logoUrl} alt="" fill unoptimized className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-air-force-blue">
              {brand.name.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 text-balance">{brand.name}</h1>
            {brand.published ? (
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Published
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-2xl text-pretty text-gray-600">{brand.tagline}</p>
          <p className="mt-1 text-xs text-gray-500">
            {brand.chain} · {brand.collections.length} collection
            {brand.collections.length === 1 ? '' : 's'} · {brand.products.length} product
            {brand.products.length === 1 ? '' : 's'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
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
        className="mt-10 flex gap-2 overflow-x-auto border-b border-silver"
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
              className={`-mb-px shrink-0 rounded-t-md border-b-2 px-4 py-3 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue ${
                active
                  ? 'border-air-force-blue text-air-force-blue'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
        {brand.fundraising && (
          <Link
            href={`/marketplace/brand/${brand.slug}/fundraising`}
            className="-mb-px shrink-0 rounded-t-md border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-gray-600 no-underline hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
          >
            Fundraising
          </Link>
        )}
      </div>

      <div className="mt-8" role="tabpanel">
        {tab === 'products' && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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
            {brand.products.length === 0 ? (
              <p className="text-gray-600">No products yet. Publish from Launch Brand to add SKUs.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {brand.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brandSlug={product.brandSlug}
                    brandName={product.brandName}
                    priceUsd={product.priceUsd}
                    imageTone={product.imageTone}
                    imageUrl={product.imageUrl}
                    href={product.href}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'collections' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.collections.map((collection) => (
              <div
                key={collection.id}
                className="overflow-hidden rounded-xl border border-silver bg-white"
              >
                <div className="relative aspect-video bg-gradient-to-br from-violet-200 to-air-force-blue/40">
                  {brand.bannerUrl ? (
                    <Image
                      src={brand.bannerUrl}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover opacity-80"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                      ${collection.tokenSymbol}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {collection.productCount} product{collection.productCount === 1 ? '' : 's'}
                  </p>
                  <Link
                    href={`/marketplace?collection=${encodeURIComponent(collection.id)}`}
                    className="mt-3 inline-block text-sm font-medium text-air-force-blue no-underline hover:underline"
                  >
                    View token performance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'activity' && (
          <ul className="max-w-2xl space-y-4">
            <li className="rounded-xl border border-silver bg-white p-4 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">Published</span> — Brand is live on
              AWEBO.
            </li>
            {brand.collections.map((collection) => (
              <li
                key={collection.id}
                className="rounded-xl border border-silver bg-white p-4 text-sm text-gray-700"
              >
                <span className="font-semibold text-gray-900">{collection.name}</span> — Token $
                {collection.tokenSymbol} · {collection.productCount} products listed.
              </li>
            ))}
          </ul>
        )}
        {tab === 'about' && (
          <div className="max-w-2xl space-y-4 text-gray-700">
            <p>{brand.story || 'Full brand story, policies, and contact links live here.'}</p>
            <p className="text-sm text-gray-500">
              Physical products are fulfilled through EverShop. Manage inventory at{' '}
              <Link href="/drops/admin" className="text-air-force-blue no-underline hover:underline">
                Drops admin
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
