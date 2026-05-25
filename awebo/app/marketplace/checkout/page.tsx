import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
import { resolveProductPageView } from '@/lib/marketplace-product-page';

export const metadata = {
  title: 'Checkout — Marketplace',
  description: 'Complete your AWEBO marketplace purchase.',
};

type Props = { searchParams: { sku?: string } };

export default async function CheckoutPage({ searchParams }: Props) {
  const product = searchParams.sku ? await resolveProductPageView(searchParams.sku) : undefined;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>
      <Suspense fallback={<p className="text-sm text-gray-600">Loading checkout…</p>}>
        <CheckoutClient product={product} />
      </Suspense>
    </main>
  );
}
