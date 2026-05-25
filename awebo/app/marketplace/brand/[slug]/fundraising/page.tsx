import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import { resolveBrandPageView } from '@/lib/marketplace-brand-page';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const brand = await resolveBrandPageView(params.slug);
  return {
    title: brand ? `Support ${brand.name} — Fundraising` : 'Fundraising — Marketplace',
    description: brand ? `Back ${brand.name} on AWEBO.` : 'Fundraising campaign.',
  };
}

export default async function FundraisingPage({ params }: Props) {
  const brand = await resolveBrandPageView(params.slug);
  if (!brand || !brand.fundraising) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
      <Link
        href={`/marketplace/brand/${brand.slug}`}
        className="mb-8 inline-block text-sm font-medium text-air-force-blue no-underline hover:underline"
      >
        ← Back to brand
      </Link>

      <header className="mb-8 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white shadow">
          {brand.logoUrl ? (
            <Image src={brand.logoUrl} alt="" fill unoptimized className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-air-force-blue to-steel-blue" aria-hidden />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Fundraising</p>
          <h1 className="text-2xl font-bold text-gray-900 text-balance md:text-3xl">
            Support {brand.name}
          </h1>
        </div>
      </header>

      <section className="mb-10 rounded-2xl border border-silver bg-white p-6" aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="mb-4 text-sm font-semibold uppercase text-gray-500">
          Progress
        </h2>
        <div
          className="h-3 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={brand.raisedPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Funding progress"
        >
          <div
            className="h-full rounded-full bg-air-force-blue"
            style={{ width: `${brand.raisedPct}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-700 tabular-nums">
          {brand.raisedPct}% of goal · raised vs goal and shares sold vs supply appear here.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Plain-language explanation of mechanics, whitelist if any, and holder earnings.
        </p>
      </section>

      <section className="mb-10" aria-labelledby="supporters-heading">
        <h2 id="supporters-heading" className="mb-3 text-lg font-bold text-gray-900">
          Supporters
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Masked wallet list with amount or shares and optional timestamps.
        </p>
        <ul className="divide-y divide-gray-100 rounded-xl border border-silver bg-white text-sm">
          <li className="flex justify-between gap-4 px-4 py-3">
            <span className="font-mono text-xs text-gray-500">0x7a…c4f2</span>
            <span className="tabular-nums text-gray-900">$120</span>
          </li>
          <li className="flex justify-between gap-4 px-4 py-3">
            <span className="font-mono text-xs text-gray-500">0x91…01ab</span>
            <span className="tabular-nums text-gray-900">$45</span>
          </li>
        </ul>
      </section>

      <section className="mb-10" aria-labelledby="funded-products-heading">
        <h2 id="funded-products-heading" className="mb-4 text-lg font-bold text-gray-900">
          Products being funded
        </h2>
        <div className="grid grid-cols-2 gap-3">
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
      </section>

      <section
        className="rounded-2xl border border-silver bg-powder-petal/30 p-6"
        aria-labelledby="support-module-heading"
      >
        <h2 id="support-module-heading" className="mb-4 text-lg font-bold text-gray-900">
          Buy shares / Support
        </h2>
        <div className="mb-4 flex gap-2" role="tablist" aria-label="Payment mode">
          <button
            type="button"
            className="rounded-lg bg-air-force-blue px-4 py-2 text-sm font-semibold text-gray-900"
          >
            Web2
          </button>
          <button
            type="button"
            className="rounded-lg border border-silver bg-white px-4 py-2 text-sm font-semibold text-gray-800"
          >
            Web3
          </button>
        </div>
        <label htmlFor="support-amount" className="mb-2 block text-xs font-semibold uppercase text-gray-500">
          Amount
        </label>
        <input
          id="support-amount"
          name="amount"
          type="number"
          min={1}
          placeholder="e.g. 50…"
          className="mb-4 w-full rounded-lg border border-silver bg-white px-3 py-2.5 text-sm"
        />
        <label className="mb-4 flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" name="terms" className="mt-1 rounded border-gray-300" />
          <span>
            I agree to the{' '}
            <Link href="/hq/room-14" className="font-medium text-air-force-blue no-underline hover:underline">
              terms and conditions
            </Link>
            .
          </span>
        </label>
        <button
          type="button"
          className="w-full rounded-lg bg-air-force-blue py-3 text-sm font-semibold text-gray-900 hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2"
        >
          Support
        </button>
      </section>
    </main>
  );
}
