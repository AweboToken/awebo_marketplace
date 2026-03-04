import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Ecosystem — AWEBO',
  description: 'Partners, infrastructure, and the AWEBO ecosystem.',
};

export default function EcosystemPage() {
  return (
    <div className="min-h-screen flex flex-col bg-seashell">
      <Navigation variant="landing" />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ecosystem</h1>
        <p className="text-gray-600 max-w-2xl mb-8">
          Partners, infrastructure, and the culture-backed economy. Built on Ethereum; all values in ETH.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-2">Launchpad</h2>
            <p className="text-sm text-gray-600">Launch tokens and phygital drops in one flow.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-2">Merch & logistics</h2>
            <p className="text-sm text-gray-600">Global fulfillment for physical collectibles.</p>
          </div>
        </div>
      </main>
      <Footer variant="landing" />
    </div>
  );
}
