import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Explore — AWEBO',
  description: 'Discover culture-backed brands, tokens, and drops on AWEBO.',
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-seashell">
      <Navigation variant="landing" />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore</h1>
        <p className="text-gray-600 max-w-2xl mb-8">
          Discover culture-backed brands, token launches, and phygital drops. All prices in ETH.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4" />
              <h2 className="font-semibold text-gray-900">Collection {i}</h2>
              <p className="text-sm text-gray-500 mt-1">0.05 ETH</p>
              <Link
                href="/"
                className="inline-block mt-3 text-air-force-blue font-medium text-sm hover:underline"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer variant="landing" />
    </div>
  );
}
