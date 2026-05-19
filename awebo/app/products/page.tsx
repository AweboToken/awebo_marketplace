import { DiscoveryListingPageLayout } from '@/components/marketplace/DiscoveryListingPageLayout';

export const metadata = {
  title: 'Products — AWEBO',
  description: 'Shop products on AWEBO.',
};

export default function ProductsListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DiscoveryListingPageLayout
      title="Products"
      searchParams={searchParams}
      description="Listing shell for discovery links from home. Wire to catalog and search when ready."
      emptyMessage="No filters — full catalog (placeholder)."
    />
  );
}
