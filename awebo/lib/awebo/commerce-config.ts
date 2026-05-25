import { isEvershopAdminConfigured } from '@/lib/evershop/config';

/** When false (default), all product links stay on AWEBO mock storefront pages. */
export function isEvershopCheckoutEnabled(): boolean {
  return process.env.AWEBO_EVERSHOP_CHECKOUT === 'true';
}

/** Whether publish/API should attempt EverShop SKU creation. */
export function isEvershopSyncEnabled(): boolean {
  return isEvershopCheckoutEnabled() && isEvershopAdminConfigured();
}
