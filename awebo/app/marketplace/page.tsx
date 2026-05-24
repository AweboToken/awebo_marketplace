import MarketplaceExploreFeed from '@/components/marketplace/MarketplaceExploreFeed';

export const metadata = {
  title: 'Marketplace — AWEBO',
  description: 'Discover brands, products, and drops on AWEBO.',
};

export default function MarketplaceHomePage() {
  return (
    <main className="min-h-full">
      <MarketplaceExploreFeed />
    </main>
  );
}
