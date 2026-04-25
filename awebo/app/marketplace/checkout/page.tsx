import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export const metadata = {
  title: 'Checkout — Marketplace',
  description: 'Complete your AWEBO marketplace purchase.',
};

export default function CheckoutPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <Suspense fallback={<p className="text-sm text-gray-600">Loading checkout…</p>}>
        <CheckoutClient />
      </Suspense>
    </main>
  );
}
