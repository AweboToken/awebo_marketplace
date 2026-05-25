/** Base catalog for Launch Brand product selection (category browse). */

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

export type LaunchCatalogProduct = {
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

/** @deprecated Use LaunchCatalogProduct */
export type MockProduct = LaunchCatalogProduct;

export const LAUNCH_CATALOG_PRODUCTS: LaunchCatalogProduct[] = [
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

export function getCategoryBySlug(slug: string): MarketplaceCategory | undefined {
  return MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsForCategory(slug: string): LaunchCatalogProduct[] {
  return LAUNCH_CATALOG_PRODUCTS.filter((p) => p.categorySlug === slug);
}
