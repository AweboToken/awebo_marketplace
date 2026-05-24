export function getEvershopBaseUrl(): string {
  return (process.env.EVERSHOP_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');
}

export function isEvershopAdminConfigured(): boolean {
  return Boolean(
    process.env.EVERSHOP_ADMIN_EMAIL && process.env.EVERSHOP_ADMIN_PASSWORD
  );
}

/** Public URL for EverShop admin when proxied through AWEBO. */
export function getEvershopAdminUrl(): string {
  return '/drops/admin';
}
