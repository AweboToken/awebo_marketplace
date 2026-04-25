import Link from 'next/link';
import { getProductById } from '@/lib/marketplace-data';

type SearchParams = { add?: string };

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export const metadata = {
  title: 'Cart — Marketplace',
  description: 'Review your AWEBO marketplace cart.',
};

export default function CartPage({ searchParams }: { searchParams: SearchParams }) {
  const addedId = searchParams.add;
  const line = addedId ? getProductById(addedId) : null;
  const lines = line ? [{ ...line, qty: 1 }] : [];

  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart</h1>
      <p className="text-sm text-gray-600 mb-8">Cart memory is time-limited (TBD). Connect persistence and auth next.</p>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-silver bg-white p-10 text-center">
          <p className="text-gray-700 mb-4">Your cart is empty.</p>
          <Link href="/marketplace" className="text-air-force-blue font-semibold no-underline hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <ul className="md:col-span-2 space-y-4" aria-label="Cart line items">
            {lines.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-xl border border-silver bg-white p-4">
                <div className={`h-24 w-20 shrink-0 rounded-lg bg-gradient-to-br ${item.imageTone}`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <Link href={`/marketplace/product/${item.id}`} className="font-semibold text-gray-900 no-underline hover:text-air-force-blue line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">{item.brandName} · Default / M</p>
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

          <aside className="rounded-xl border border-silver bg-white p-6 h-fit sticky top-24">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-4">Order summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium tabular-nums">{line ? formatUsd(line.priceUsd) : '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Shipping estimate</dt>
                <dd className="font-medium">TBD</dd>
              </div>
              <div className="flex justify-between gap-4 pt-2 border-t border-gray-100">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="font-semibold tabular-nums">{line ? formatUsd(line.priceUsd) : '—'}</dd>
              </div>
            </dl>
            <Link
              href={line ? `/marketplace/checkout?sku=${line.id}` : '/marketplace/checkout'}
              className="mt-6 block w-full text-center rounded-lg bg-air-force-blue py-3 text-sm font-semibold text-gray-900 no-underline hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Checkout
            </Link>
            <Link href="/marketplace" className="mt-3 block text-center text-sm font-medium text-air-force-blue no-underline hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
