import type { LaunchWizardValues } from '@/lib/launch-wizard-types';

export type PublishedProduct = {
  id: string;
  name: string;
  priceUsd: number;
  evershopUuid?: string;
  evershopUrlKey?: string;
  sku: string;
};

export type PublishedCollection = {
  id: string;
  name: string;
  tokenSymbol: string;
  products: PublishedProduct[];
};

export type PublishedBrand = {
  id: string;
  slug: string;
  ownerId?: string;
  name: string;
  story: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  launchMode: LaunchWizardValues['launchMode'];
  chain: string;
  supply: string;
  publishedAt: string;
  collections: PublishedCollection[];
};
