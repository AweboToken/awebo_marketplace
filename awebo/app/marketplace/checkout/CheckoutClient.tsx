'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { getProductById } from '@/lib/marketplace-data';

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const STEPS = ['Delivery', 'Payment', 'Confirmation'] as const;

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const product = sku ? getProductById(sku) : undefined;
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const confirmOrder = useCallback(() => {
    const id = `AWB-${Date.now().toString(36).toUpperCase().slice(-10)}`;
    setOrderId(id);
    setStep(2);
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full">
      <ol className="flex items-center gap-2 mb-10 text-xs sm:text-sm font-medium text-gray-600" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 min-w-0">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 tabular-nums ${
                i === step ? 'border-air-force-blue bg-air-force-blue/10 text-air-force-blue' : i < step ? 'border-air-force-blue text-air-force-blue' : 'border-gray-200'
              }`}
              aria-current={i === step ? 'step' : undefined}
            >
              {i + 1}
            </span>
            <span className={`truncate ${i === step ? 'text-gray-900' : ''}`}>{label}</span>
            {i < STEPS.length - 1 && <span className="text-gray-300 hidden sm:inline" aria-hidden>/</span>}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="rounded-xl border border-silver bg-white p-6 space-y-4" aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="text-lg font-bold text-gray-900">
            Step 1 — Delivery
          </h2>
          <p className="text-sm text-gray-600">Full name, address, city, country, postal code, phone or email, shipping method.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="full-name" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Full name
              </label>
              <input id="full-name" name="fullName" autoComplete="name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Address
              </label>
              <input id="address" name="address" autoComplete="street-address" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="city" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                City
              </label>
              <input id="city" name="city" autoComplete="address-level2" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="country" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Country
              </label>
              <input id="country" name="country" autoComplete="country-name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="postal" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Postal code
              </label>
              <input id="postal" name="postal" autoComplete="postal-code" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Phone
              </label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-4 rounded-lg bg-air-force-blue px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
          >
            Continue to payment
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="rounded-xl border border-silver bg-white p-6 space-y-4" aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="text-lg font-bold text-gray-900">
            Step 2 — Payment
          </h2>
          <div className="flex gap-2" role="tablist" aria-label="Payment rails">
            <button type="button" className="rounded-lg bg-air-force-blue px-4 py-2 text-sm font-semibold text-gray-900">
              Web2
            </button>
            <button type="button" className="rounded-lg border border-silver px-4 py-2 text-sm font-semibold text-gray-800">
              Web3
            </button>
          </div>
          <p className="text-sm text-gray-600">Web2: card, PayPal. Web3: connect wallet, stablecoin, EVM-compatible network note.</p>
          {product && (
            <p className="text-sm text-gray-900">
              Order includes <span className="font-semibold">{product.name}</span> — {formatUsd(product.priceUsd)}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-gray-700 hover:underline">
              Back
            </button>
            <button
              type="button"
              onClick={confirmOrder}
              className="rounded-lg bg-air-force-blue px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Review and confirm
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-xl border border-silver bg-white p-6 space-y-4 text-center" aria-labelledby="confirm-heading">
          <h2 id="confirm-heading" className="text-lg font-bold text-gray-900">
            Step 3 — Confirmation
          </h2>
          <p className="text-sm text-gray-600">Order confirmed · Order ID · Tracking placeholder · Receipt email.</p>
          <p className="text-2xl font-mono font-semibold text-gray-900 break-all" aria-live="polite">
            {orderId ?? '—'}
          </p>
          <Link href="/marketplace" className="inline-block mt-4 text-air-force-blue font-semibold no-underline hover:underline">
            Back to marketplace
          </Link>
        </section>
      )}
    </div>
  );
}
