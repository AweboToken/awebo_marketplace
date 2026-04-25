import Link from 'next/link';

export const metadata = {
  title: 'Favorites — Marketplace',
  description: 'Saved products and brands on AWEBO.',
};

export default function FavoritesPage() {
  return (
    <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorites</h1>
      <p className="text-sm text-gray-600 mb-8">Login required to save favorites. Modal copy: “Log in to save favorites.”</p>
      <div className="flex gap-2 border-b border-silver mb-6" role="tablist">
        <button type="button" className="px-4 py-3 text-sm font-semibold border-b-2 border-air-force-blue text-air-force-blue">
          Products
        </button>
        <button type="button" className="px-4 py-3 text-sm font-semibold text-gray-600 border-b-2 border-transparent">
          Brands
        </button>
      </div>
      <p className="text-gray-700 mb-6">Empty state until auth and API are connected.</p>
      <Link href="/marketplace" className="text-air-force-blue font-semibold no-underline hover:underline">
        Browse marketplace
      </Link>
    </main>
  );
}
