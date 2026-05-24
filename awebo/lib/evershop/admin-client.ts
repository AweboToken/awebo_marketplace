import { getEvershopBaseUrl, isEvershopAdminConfigured } from '@/lib/evershop/config';

type AdminTokenResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
  error?: { message?: string };
};

export type EvershopCreateProductInput = {
  name: string;
  url_key: string;
  sku: string;
  price: number;
  qty: number;
  status?: 0 | 1;
  manage_stock?: boolean;
  stock_availability?: boolean;
  visibility?: 0 | 1;
  group_id?: number;
  short_description?: string;
  images?: string[];
};

export type EvershopProductRecord = {
  uuid?: string;
  product_id?: number;
  name?: string;
  url_key?: string;
  sku?: string;
  price?: number;
  qty?: number;
  status?: number;
};

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchAdminAccessToken(): Promise<string> {
  if (!isEvershopAdminConfigured()) {
    throw new Error('EverShop admin credentials are not configured.');
  }

  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const response = await fetch(`${getEvershopBaseUrl()}/api/user/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email: process.env.EVERSHOP_ADMIN_EMAIL,
      password: process.env.EVERSHOP_ADMIN_PASSWORD,
    }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as AdminTokenResponse | null;

  if (!response.ok || !payload?.data?.accessToken) {
    throw new Error(
      payload?.error?.message ?? 'Failed to authenticate with EverShop admin API.'
    );
  }

  cachedAccessToken = payload.data.accessToken;
  tokenExpiresAt = Date.now() + 12 * 60 * 1000;
  return cachedAccessToken;
}

export async function createEvershopProduct(
  input: EvershopCreateProductInput
): Promise<EvershopProductRecord> {
  const token = await fetchAdminAccessToken();

  const response = await fetch(`${getEvershopBaseUrl()}/api/products`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: input.name,
      url_key: input.url_key,
      sku: input.sku,
      price: input.price,
      qty: input.qty,
      status: input.status ?? 1,
      manage_stock: input.manage_stock ?? true,
      stock_availability: input.stock_availability ?? true,
      visibility: input.visibility ?? 1,
      group_id: input.group_id ?? 1,
      short_description: input.short_description,
      images: input.images,
    }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as {
    data?: EvershopProductRecord;
    error?: { message?: string };
  } | null;

  if (!response.ok || !payload?.data) {
    throw new Error(payload?.error?.message ?? 'EverShop product creation failed.');
  }

  return payload.data;
}
