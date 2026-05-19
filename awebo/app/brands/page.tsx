import { DiscoveryListingPageLayout } from '@/components/marketplace/DiscoveryListingPageLayout';

export const metadata = {
  title: 'Brands — AWEBO',
  description: 'Discover brands on AWEBO.',
};

export default function BrandsListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DiscoveryListingPageLayout
      title="Brands"
      searchParams={searchParams}
      description="Listing shell for discovery links from home. Wire to search and CMS when ready."
      emptyMessage="No filters — full directory (placeholder)."
    />
  );
}
