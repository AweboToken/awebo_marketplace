import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getBrandBySlug } from '@/lib/marketplace-data';

type Props = { params: { id: string } };

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function generateMetadata({ params }: Props) {
  const p = getProductById(params.id);
  return {
    title: p ? `${p.name} — Marketplace` : 'Product — Marketplace',
    description: p ? `${p.name} by ${p.brandName}` : 'Product on AWEBO.',
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductById(params.id);
  if (!product) notFound();
  const brand = getBrandBySlug(product.brandSlug);

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
          <li>
            <Link
              href={`/marketplace/category/${product.categorySlug}`}
              className="text-air-force-blue font-medium no-underline hover:underline capitalize"
            >
              {product.categorySlug.replace(/-/g, ' ')}
            </Link>
          </li>
          <li aria-hidden className="text-gray-400">
            /
          </li>
          <li className="text-gray-900 font-medium truncate max-w-[12rem] sm:max-w-xs">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div className="space-y-3">
          <div
            className={`aspect-square max-h-[32rem] mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br ${product.imageTone} border border-silver/60`}
            role="img"
            aria-label={`${product.name} preview placeholder`}
          />
          <p className="text-xs text-gray-500 text-center lg:text-left">Image gallery with zoom replaces this placeholder.</p>
        </div>

        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-gray-900 text-balance">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold text-gray-900 tabular-nums">{formatUsd(product.priceUsd)}</p>
          <p className="mt-4 text-sm text-gray-600">
            <span className="text-gray-500">Brand:</span>{' '}
            <Link href={`/marketplace/brand/${product.brandSlug}`} className="text-air-force-blue font-medium no-underline hover:underline">
              {product.brandName}
            </Link>
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="variant-color" className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Color
              </label>
              <select
                id="variant-color"
                name="color"
                className="w-full max-w-xs rounded-lg border border-silver bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-air-force-blue"
                defaultValue="default"
              >
                <option value="default">Default</option>
                <option value="alt">Alternate</option>
              </select>
            </div>
            <div>
              <label htmlFor="variant-size" className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Size
              </label>
              <select
                id="variant-size"
                name="size"
                className="w-full max-w-xs rounded-lg border border-silver bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-air-force-blue"
                defaultValue="m"
              >
                <option value="xs">XS</option>
                <option value="s">S</option>
                <option value="m">M</option>
                <option value="l">L</option>
                <option value="xl">XL</option>
              </select>
            </div>
            <div>
              <label htmlFor="qty" className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                Quantity
              </label>
              <input
                id="qty"
                name="quantity"
                type="number"
                min={1}
                defaultValue={1}
                className="w-24 rounded-lg border border-silver bg-white px-3 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-air-force-blue"
              />
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Shipping estimate and returns snippet appear here. Verified purchase required for verified review badge.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/marketplace/cart?add=${product.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-6 py-3 text-sm font-semibold text-gray-900 no-underline hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2"
            >
              Add to cart
            </Link>
            <Link
              href={`/marketplace/checkout?sku=${product.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 no-underline hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2"
            >
              Buy now
            </Link>
            <Link
              href={`/marketplace/brand/${product.brandSlug}`}
              className="inline-flex items-center justify-center rounded-lg border border-silver px-6 py-3 text-sm font-semibold text-gray-800 no-underline hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2"
            >
              View brand
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Contact brand opens a login modal when not authenticated (rule from spec).
          </p>

          <section className="mt-12 border-t border-silver pt-10" aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-lg font-bold text-gray-900 mb-4">
              Product details
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
              <p>Description, size guide, material and care, and full shipping and returns copy belong in this section.</p>
              {brand?.fundraising && (
                <p>
                  This brand is fundraising —{' '}
                  <Link href={`/marketplace/brand/${brand.slug}/fundraising`} className="text-air-force-blue font-medium no-underline hover:underline">
                    view the campaign
                  </Link>
                  .
                </p>
              )}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="text-lg font-bold text-gray-900 mb-2">
              Reviews
            </h2>
            <p className="text-sm text-gray-600">Average rating and list UI. Writing a review requires login; verified purchase unlocks the badge.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
