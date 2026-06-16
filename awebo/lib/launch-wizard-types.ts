import { resolveProductImageUrl } from '@/lib/launch-catalog-images';

export type LaunchMode = 'self' | 'crowdfund';

export type LaunchWizardProduct = {
  /** Catalog base id (e.g. mock product id from marketplace data). */
  id: string;
  name: string;
  baseProductId: string;
  categorySlug: string;
  imageUrl?: string;
  imageTone?: string;
  status: 'Draft' | 'Pricing' | 'Ready';
};

export type LaunchWizardValues = {
  brandName: string;
  bannerUrl: string | null;
  logoUrl: string | null;
  symbol: string;
  story: string;
  twitter: string;
  instagram: string;
  launchMode: LaunchMode;
  chain: string;
  supply: string;
  ownerPct: number;
  maxWalletPct: number;
  whitelist: boolean;
  /** Marketplace mega-category currently browsed in step 2. */
  categorySlug: string | null;
  /** Collection being built for this brand launch. */
  collectionName: string;
  collectionDescription: string;
  /** Products the creator selected for this collection. */
  products: LaunchWizardProduct[];
  /** Smart contract address after signature deployment. */
  contractAddress: string | null;
};

export const DEFAULT_LAUNCH_WIZARD_VALUES: LaunchWizardValues = {
  brandName: '',
  bannerUrl: null,
  logoUrl: null,
  symbol: '',
  story: '',
  twitter: '',
  instagram: '',
  launchMode: 'self',
  chain: 'Base',
  supply: '100',
  ownerPct: 80,
  maxWalletPct: 5,
  whitelist: false,
  categorySlug: null,
  collectionName: '',
  collectionDescription: '',
  products: [],
  contractAddress: null,
};

export type LaunchWizardValuesPatch = Partial<LaunchWizardValues>;

/** Merge saved drafts with current defaults (handles older draft shapes). */
export function normalizeLaunchWizardValues(
  values: Partial<LaunchWizardValues>
): LaunchWizardValues {
  return {
    ...DEFAULT_LAUNCH_WIZARD_VALUES,
    ...values,
    collectionName: values.collectionName ?? '',
    collectionDescription: values.collectionDescription ?? '',
    categorySlug: values.categorySlug ?? null,
    products: (values.products ?? []).map((product) => {
      const baseProductId = product.baseProductId ?? product.id;
      return {
        ...product,
        baseProductId,
        categorySlug: product.categorySlug ?? values.categorySlug ?? '',
        imageUrl:
          resolveProductImageUrl(product.imageUrl, baseProductId) ?? undefined,
      };
    }),
  };
}
