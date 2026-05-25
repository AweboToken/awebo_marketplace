'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import type { ProductPageView } from '@/lib/marketplace-product-page';

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const STEPS = ['Delivery', 'Payment', 'Confirmation'] as const;

export default function CheckoutClient({ product }: { product?: ProductPageView }) {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const confirmOrder = useCallback(() => {
    const id = `AWB-${Date.now().toString(36).toUpperCase().slice(-10)}`;
    setOrderId(id);
    setStep(2);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <ol
        className="mb-10 flex items-center gap-2 text-xs font-medium text-gray-600 sm:text-sm"
        aria-label="Checkout progress"
      >
        {STEPS.map((label, i) => (
          <li key={label} className="flex min-w-0 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 tabular-nums ${
                i === step
                  ? 'border-air-force-blue bg-air-force-blue/10 text-air-force-blue'
                  : i < step
                    ? 'border-air-force-blue text-air-force-blue'
                    : 'border-gray-200'
              }`}
              aria-current={i === step ? 'step' : undefined}
            >
              {i + 1}
            </span>
            <span className={`truncate ${i === step ? 'text-gray-900' : ''}`}>{label}</span>
            {i < STEPS.length - 1 && (
              <span className="hidden text-gray-300 sm:inline" aria-hidden>
                /
              </span>
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-4 rounded-xl border border-silver bg-white p-6" aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="text-lg font-bold text-gray-900">
            Step 1 — Delivery
          </h2>
          <p className="text-sm text-gray-600">Preview checkout — orders are not processed yet.</p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-4 rounded-lg bg-air-force-blue px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-air-force-blue/90"
          >
            Continue to payment
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4 rounded-xl border border-silver bg-white p-6" aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="text-lg font-bold text-gray-900">
            Step 2 — Payment
          </h2>
          {product ? (
            <p className="text-sm text-gray-900">
              Order includes <span className="font-semibold">{product.name}</span> —{' '}
              {formatUsd(product.priceUsd)}
            </p>
          ) : (
            <p className="text-sm text-gray-600">No product selected.</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-gray-700 hover:underline">
              Back
            </button>
            <button
              type="button"
              onClick={confirmOrder}
              className="rounded-lg bg-air-force-blue px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-air-force-blue/90"
            >
              Review and confirm
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4 rounded-xl border border-silver bg-white p-6 text-center" aria-labelledby="confirm-heading">
          <h2 id="confirm-heading" className="text-lg font-bold text-gray-900">
            Step 3 — Confirmation
          </h2>
          <p className="text-sm text-gray-600">Preview order confirmed.</p>
          <p className="break-all font-mono text-2xl font-semibold text-gray-900" aria-live="polite">
            {orderId ?? '—'}
          </p>
          <Link href="/marketplace" className="mt-4 inline-block font-semibold text-air-force-blue no-underline hover:underline">
            Back to marketplace
          </Link>
        </section>
      )}
    </div>
  );
}
