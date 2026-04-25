import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/marketplace/ProductCard';
import { getBrandBySlug, getProductsForBrand } from '@/lib/marketplace-data';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const b = getBrandBySlug(params.slug);
  return {
    title: b ? `Support ${b.name} — Fundraising` : 'Fundraising — Marketplace',
    description: b ? `Back ${b.name} on AWEBO.` : 'Fundraising campaign.',
  };
}

export default function FundraisingPage({ params }: Props) {
  const brand = getBrandBySlug(params.slug);
  if (!brand || !brand.fundraising) notFound();
  const products = getProductsForBrand(brand.slug);

  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href={`/marketplace/brand/${brand.slug}`} className="text-sm font-medium text-air-force-blue no-underline hover:underline mb-8 inline-block">
        ← Back to brand
      </Link>

      <header className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-air-force-blue to-steel-blue border border-white shadow shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Fundraising</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">Support {brand.name}</h1>
        </div>
      </header>

      <section className="rounded-2xl border border-silver bg-white p-6 mb-10" aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="text-sm font-semibold uppercase text-gray-500 mb-4">
          Progress
        </h2>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={brand.raisedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Funding progress">
          <div className="h-full bg-air-force-blue rounded-full" style={{ width: `${brand.raisedPct}%` }} />
        </div>
        <p className="mt-3 text-sm text-gray-700 tabular-nums">
          {brand.raisedPct}% of goal · raised vs goal and shares sold vs supply appear here.
        </p>
        <p className="mt-4 text-sm text-gray-600">Plain-language explanation of mechanics, whitelist if any, and holder earnings.</p>
      </section>

      <section className="mb-10" aria-labelledby="supporters-heading">
        <h2 id="supporters-heading" className="text-lg font-bold text-gray-900 mb-3">
          Supporters
        </h2>
        <p className="text-sm text-gray-600 mb-4">Masked wallet list with amount or shares and optional timestamps.</p>
        <ul className="rounded-xl border border-silver divide-y divide-gray-100 bg-white text-sm">
          <li className="px-4 py-3 flex justify-between gap-4">
            <span className="text-gray-500 font-mono text-xs">0x7a…c4f2</span>
            <span className="text-gray-900 tabular-nums">$120</span>
          </li>
          <li className="px-4 py-3 flex justify-between gap-4">
            <span className="text-gray-500 font-mono text-xs">0x91…01ab</span>
            <span className="text-gray-900 tabular-nums">$45</span>
          </li>
        </ul>
      </section>

      <section className="mb-10" aria-labelledby="funded-products-heading">
        <h2 id="funded-products-heading" className="text-lg font-bold text-gray-900 mb-4">
          Products being funded
        </h2>
        <div className="grid grid-cols-2 gap-3">
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
      </section>

      <section className="rounded-2xl border border-silver bg-powder-petal/30 p-6" aria-labelledby="support-module-heading">
        <h2 id="support-module-heading" className="text-lg font-bold text-gray-900 mb-4">
          Buy shares / Support
        </h2>
        <div className="flex gap-2 mb-4" role="tablist" aria-label="Payment mode">
          <button type="button" className="rounded-lg bg-air-force-blue text-gray-900 px-4 py-2 text-sm font-semibold">
            Web2
          </button>
          <button type="button" className="rounded-lg border border-silver bg-white px-4 py-2 text-sm font-semibold text-gray-800">
            Web3
          </button>
        </div>
        <label htmlFor="support-amount" className="block text-xs font-semibold uppercase text-gray-500 mb-2">
          Amount
        </label>
        <input
          id="support-amount"
          name="amount"
          type="number"
          min={1}
          placeholder="e.g. 50…"
          className="w-full rounded-lg border border-silver bg-white px-3 py-2.5 text-sm mb-4"
        />
        <label className="flex items-start gap-2 text-sm text-gray-700 mb-4">
          <input type="checkbox" name="terms" className="mt-1 rounded border-gray-300" />
          <span>
            I agree to the{' '}
            <Link href="/about" className="text-air-force-blue font-medium no-underline hover:underline">
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
