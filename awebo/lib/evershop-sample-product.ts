/**
 * Sample EverShop seed product (see evershop `products.json`).
 * Proxied through Next.js at `/drops/*` → EVERSHOP_URL.
 */
export const EVERSHOP_SAMPLE_PRODUCT_URL_KEY = 'ceramic-coffee-cup-white';

export const EVERSHOP_SAMPLE_PRODUCT_NAME = 'Ceramic Coffee Cup - White';

/** EverShop storefront product URL (url_key rewrite). */
export const EVERSHOP_SAMPLE_PRODUCT_HREF = `/drops/${EVERSHOP_SAMPLE_PRODUCT_URL_KEY}`;
