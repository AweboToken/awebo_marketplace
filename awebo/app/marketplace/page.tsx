import MarketplaceExploreFeed from '@/components/marketplace/MarketplaceExploreFeed';

export const metadata = {
  title: 'Marketplace — AWEBO',
  description: 'Track collection token performance and discover brands on AWEBO.',
};

export default function MarketplaceHomePage() {
  return (
    <main className="min-h-full">
      <MarketplaceExploreFeed />
    </main>
  );
}
