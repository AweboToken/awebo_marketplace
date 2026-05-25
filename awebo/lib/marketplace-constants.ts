export const MARKETPLACE_FILTERS = [
  'NEW',
  'Memes',
  'Live',
  'Market Cap',
  'Last Sale',
  'Trendy',
] as const;

export type MarketplaceFilter = (typeof MARKETPLACE_FILTERS)[number];
