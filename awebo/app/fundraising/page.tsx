import { DiscoveryListingPageLayout } from '@/components/marketplace/DiscoveryListingPageLayout';

export const metadata = {
  title: 'Fundraising — AWEBO',
  description: 'Support brands raising on AWEBO.',
};

export default function FundraisingListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DiscoveryListingPageLayout
      title="Fundraising"
      searchParams={searchParams}
      description="Listing shell for discovery links from home. Wire live campaigns when ready."
      emptyMessage="No filters — all campaigns (placeholder)."
    />
  );
}
