import Link from 'next/link';
import { resolveProductPageView } from '@/lib/marketplace-product-page';

type SearchParams = { add?: string };

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export const metadata = {
  title: 'Cart — Marketplace',
  description: 'Review your AWEBO marketplace cart.',
};

export default async function CartPage({ searchParams }: { searchParams: SearchParams }) {
  const addedId = searchParams.add;
  const product = addedId ? await resolveProductPageView(addedId) : undefined;
  const lines = product ? [{ ...product, qty: 1 }] : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Cart</h1>
      <p className="mb-8 text-sm text-gray-600">Preview cart — checkout is not live yet.</p>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-silver bg-white p-10 text-center">
          <p className="mb-4 text-gray-700">Your cart is empty.</p>
          <Link href="/marketplace" className="font-semibold text-air-force-blue no-underline hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <ul className="space-y-4 md:col-span-2" aria-label="Cart line items">
            {lines.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-xl border border-silver bg-white p-4">
                <div className={`h-24 w-20 shrink-0 rounded-lg bg-gradient-to-br ${item.imageTone}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/marketplace/product/${item.id}`}
                    className="line-clamp-2 font-semibold text-gray-900 no-underline hover:text-air-force-blue"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">{item.brandName} · Default / M</p>
                  <div className="mt-3 flex items-center gap-3">
                    <label htmlFor={`qty-${item.id}`} className="sr-only">
                      Quantity for {item.name}
                    </label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      defaultValue={item.qty}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm tabular-nums"
                    />
                    <span className="text-sm font-medium tabular-nums">{formatUsd(item.priceUsd)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="sticky top-24 h-fit rounded-xl border border-silver bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">Order summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium tabular-nums">{product ? formatUsd(product.priceUsd) : '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Shipping estimate</dt>
                <dd className="font-medium">TBD</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-2">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold tabular-nums">{product ? formatUsd(product.priceUsd) : '—'}</dd>
              </div>
            </dl>
            <Link
              href={product ? `/marketplace/checkout?sku=${product.id}` : '/marketplace/checkout'}
              className="mt-6 block w-full rounded-lg bg-air-force-blue py-3 text-center text-sm font-semibold text-gray-900 no-underline hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Checkout
            </Link>
            <Link
              href="/marketplace"
              className="mt-3 block text-center text-sm font-medium text-air-force-blue no-underline hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
