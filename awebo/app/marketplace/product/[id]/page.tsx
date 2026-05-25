import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resolveProductPageView } from '@/lib/marketplace-product-page';

type Props = { params: { id: string } };

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export async function generateMetadata({ params }: Props) {
  const product = await resolveProductPageView(params.id);
  if (!product) {
    return { title: 'Product — Marketplace', description: 'Product on AWEBO.' };
  }

  return {
    title: `${product.name} — Marketplace`,
    description: `${product.name} by ${product.brandName}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await resolveProductPageView(params.id);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 text-white sm:px-6 lg:px-8 md:py-10">
      <ProductBreadcrumb brandSlug={product.brandSlug} brandName={product.brandName} productName={product.name} />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          <div
            className={`relative mx-auto aspect-square max-h-[32rem] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${product.imageTone} lg:mx-0`}
            role="img"
            aria-label={`${product.name} preview`}
          >
            {product.bannerUrl ? (
              <Image
                src={product.bannerUrl}
                alt=""
                fill
                unoptimized
                className="object-cover opacity-40"
              />
            ) : null}
            {product.imageUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <div className="relative h-48 w-48 overflow-hidden rounded-3xl border border-white/20 bg-black/30 shadow-2xl sm:h-56 sm:w-56">
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/70">
                {product.name.slice(0, 1)}
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            {product.collectionName ?? 'Creator drop'}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white text-balance">{product.name}</h1>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
            {formatUsd(product.priceUsd)}
          </p>
          {product.tokenSymbol ? (
            <p className="mt-2 text-sm text-white/70">Collection token: ${product.tokenSymbol}</p>
          ) : null}
          <p className="mt-4 text-sm text-white/75">
            <span className="text-white/55">Brand:</span>{' '}
            <Link
              href={`/marketplace/brand/${product.brandSlug}`}
              className="font-medium text-white no-underline hover:underline"
            >
              {product.brandName}
            </Link>
          </p>

          {product.story ? (
            <p className="mt-6 text-sm leading-relaxed text-white/70 line-clamp-4">{product.story}</p>
          ) : null}

          <p className="mt-6 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/75">
            Checkout is in preview mode on AWEBO. EverShop fulfillment will connect when commerce is
            deployed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-6 py-3 text-sm font-semibold text-gray-900"
            >
              Add to cart (preview)
            </button>
            <Link
              href={`/marketplace/brand/${product.brandSlug}`}
              className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white no-underline hover:bg-white/10"
            >
              View brand
            </Link>
          </div>

          {product.brandFundraising ? (
            <p className="mt-6 text-sm text-white/75">
              This brand is fundraising —{' '}
              <Link
                href={`/marketplace/brand/${product.brandSlug}/fundraising`}
                className="font-medium text-white no-underline hover:underline"
              >
                view the campaign
              </Link>
              .
            </p>
          ) : null}

          <section className="mt-12 border-t border-white/15 pt-10" aria-labelledby="details-heading">
            <h2 id="details-heading" className="mb-4 text-lg font-bold text-white">
              Product details
            </h2>
            <dl className="space-y-2 text-sm text-white/70">
              <div className="flex gap-2">
                <dt className="text-white/50">SKU</dt>
                <dd>{product.sku ?? product.id}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-white/50">Listing</dt>
                <dd>{product.published ? 'Published creator catalog' : 'Demo catalog'}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProductBreadcrumb({
  brandSlug,
  brandName,
  productName,
}: {
  brandSlug: string;
  brandName: string;
  productName: string;
}) {
  return (
    <nav className="mb-6 text-sm text-white/70" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/marketplace" className="font-medium text-white no-underline hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-white/40">
          /
        </li>
        <li>
          <Link
            href={`/marketplace/brand/${brandSlug}`}
            className="font-medium text-white no-underline hover:underline"
          >
            {brandName}
          </Link>
        </li>
        <li aria-hidden className="text-white/40">
          /
        </li>
        <li className="max-w-[12rem] truncate font-medium text-white sm:max-w-xs">{productName}</li>
      </ol>
    </nav>
  );
}
