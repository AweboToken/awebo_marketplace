/** Default mockup images for launch catalog base products (Unsplash, allowed in next.config). */

const CATALOG_IMAGE_BY_ID: Record<string, string> = {
  'p-1': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  'p-2': 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
  'p-3': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
  'p-4': 'https://images.unsplash.com/photo-1515488042361-ee00ebbf0a2e?w=800&q=80',
  'p-5': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'p-6': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
  hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  tee: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
};

export function getLaunchCatalogImageUrl(productId: string): string | null {
  return CATALOG_IMAGE_BY_ID[productId] ?? null;
}

export function resolveProductImageUrl(
  imageUrl: string | null | undefined,
  baseProductId?: string | null
): string | null {
  if (imageUrl?.trim()) return imageUrl.trim();
  if (baseProductId) return getLaunchCatalogImageUrl(baseProductId);
  return null;
}
