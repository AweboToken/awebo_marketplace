/** Brand statuses visible on marketplace, drops, and ecosystem (all creators). */
export const PUBLIC_BRAND_STATUSES = ['published', 'fundraising', 'live'] as const;

export type PublicBrandStatus = (typeof PUBLIC_BRAND_STATUSES)[number];

export function isPublicBrandStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return (PUBLIC_BRAND_STATUSES as readonly string[]).includes(status);
}
