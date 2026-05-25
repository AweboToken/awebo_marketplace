export type LaunchMode = 'self' | 'crowdfund';

export type LaunchWizardProduct = {
  id: string;
  name: string;
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
  /** Marketplace mega-category selected in step 2 (catalog bases). */
  categorySlug: string | null;
  products: LaunchWizardProduct[];
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
  products: [
    { id: 'hoodie', name: 'Oversized hoodie', status: 'Draft' },
    { id: 'tee', name: 'Boxy tee', status: 'Pricing' },
  ],
};

export type LaunchWizardValuesPatch = Partial<LaunchWizardValues>;
