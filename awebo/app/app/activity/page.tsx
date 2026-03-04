import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ActivityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest alerts</h1>
            <p className="text-gray-600">
              Tracking of tokens' volumes, gains, losses, creations and listings.
            </p>
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            0 alerts
          </button>
        </div>

        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No recent activity</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• New token creations (last 24h)</li>
            <li>• Token listings (last 24h)</li>
            <li>• High volume trading (&gt;1 ETH/24h)</li>
            <li>• Significant price changes (≥30%)</li>
            <li>• High transaction activity (&gt;100 tx/24h)</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
