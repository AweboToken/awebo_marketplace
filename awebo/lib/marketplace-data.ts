/** Mock catalog data aligned with marketplace user-flow PDF (ES copy + structure). */

export type MarketplaceCategory = {
  slug: string;
  label: string;
  shortLabel?: string;
};

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { slug: 'hombre', label: 'Hombre', shortLabel: 'Men' },
  { slug: 'mujer', label: 'Mujer', shortLabel: 'Women' },
  { slug: 'ninos', label: 'Niños y bebés', shortLabel: 'Kids' },
  { slug: 'ropa-zapatos', label: 'Ropa y zapatos' },
  { slug: 'bolsos', label: 'Bolsos y monederos' },
  { slug: 'hogar', label: 'Hogar y decoración', shortLabel: 'Home' },
  { slug: 'papeleria', label: 'Papelería y fiestas' },
  { slug: 'juguetes', label: 'Juguetes y juegos' },
  { slug: 'accesorios', label: 'Accesorios' },
  { slug: 'mascotas', label: 'Artículos para mascotas' },
  { slug: 'bano-belleza', label: 'Baño y belleza' },
];

export const TOPIC_RAILS = [
  { id: 'bestsellers', title: 'Bestsellers' },
  { id: 'new-arrivals', title: 'New arrivals' },
  { id: 'seasonal', title: 'Seasonal picks' },
  { id: 'trending', title: 'Trending now' },
] as const;

export type MockProduct = {
  id: string;
  name: string;
  brandSlug: string;
  brandName: string;
  priceUsd: number;
  categorySlug: string;
  imageTone: string;
  isNew?: boolean;
  isTrending?: boolean;
};

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'p-1',
    name: 'Organic heavyweight tee',
    brandSlug: 'studio-norte',
    brandName: 'Studio Norte',
    priceUsd: 48,
    categorySlug: 'hombre',
    imageTone: 'from-slate-700 to-slate-900',
    isTrending: true,
  },
  {
    id: 'p-2',
    name: 'Wool wrap coat',
    brandSlug: 'lumen-atelier',
    brandName: 'Lumen Atelier',
    priceUsd: 220,
    categorySlug: 'mujer',
    imageTone: 'from-stone-500 to-stone-800',
    isNew: true,
  },
  {
    id: 'p-3',
    name: 'Ceramic desk set',
    brandSlug: 'objeto',
    brandName: 'Objeto',
    priceUsd: 64,
    categorySlug: 'hogar',
    imageTone: 'from-amber-600 to-amber-900',
  },
  {
    id: 'p-4',
    name: 'Kids play bundle',
    brandSlug: 'mar-factory',
    brandName: 'Mar Factory',
    priceUsd: 36,
    categorySlug: 'ninos',
    imageTone: 'from-sky-500 to-indigo-700',
    isNew: true,
  },
  {
    id: 'p-5',
    name: 'Leather weekender',
    brandSlug: 'studio-norte',
    brandName: 'Studio Norte',
    priceUsd: 198,
    categorySlug: 'bolsos',
    imageTone: 'from-neutral-600 to-neutral-900',
    isTrending: true,
  },
  {
    id: 'p-6',
    name: 'Minimal sneakers',
    brandSlug: 'lumen-atelier',
    brandName: 'Lumen Atelier',
    priceUsd: 142,
    categorySlug: 'ropa-zapatos',
    imageTone: 'from-zinc-500 to-zinc-800',
  },
];

export type MockBrand = {
  slug: string;
  name: string;
  tagline: string;
  fundraising: boolean;
  raisedPct: number;
  bannerTone: string;
};

export const MOCK_BRANDS: MockBrand[] = [
  {
    slug: 'studio-norte',
    name: 'Studio Norte',
    tagline: 'Slow goods from the Pacific edge.',
    fundraising: false,
    raisedPct: 0,
    bannerTone: 'from-air-force-blue to-steel-blue',
  },
  {
    slug: 'lumen-atelier',
    name: 'Lumen Atelier',
    tagline: 'Tailored silhouettes, luminous palettes.',
    fundraising: true,
    raisedPct: 62,
    bannerTone: 'from-powder-petal to-silver',
  },
  {
    slug: 'objeto',
    name: 'Objeto',
    tagline: 'Objects for daily ritual.',
    fundraising: false,
    raisedPct: 0,
    bannerTone: 'from-stone-400 to-stone-700',
  },
  {
    slug: 'mar-factory',
    name: 'Mar Factory',
    tagline: 'Playful forms, serious craft.',
    fundraising: false,
    raisedPct: 0,
    bannerTone: 'from-sky-400 to-indigo-600',
  },
];

export function getCategoryBySlug(slug: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsForCategory(slug: string): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getProductById(id: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getBrandBySlug(slug: string): MockBrand | undefined {
  return MOCK_BRANDS.find((b) => b.slug === slug);
}

export function getProductsForBrand(brandSlug: string): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.brandSlug === brandSlug);
}
