import { getEvershopBaseUrl } from '@/lib/evershop/config';

export type EvershopListedProduct = {
  productId: number;
  name: string;
  sku: string;
  urlKey: string;
  priceUsd: number;
  priceText: string;
  imageUrl: string | null;
};

const PRODUCTS_QUERY = `
  query AweboListedProducts {
    products {
      items {
        productId
        name
        sku
        urlKey
        price {
          regular {
            value
            text
          }
        }
        image {
          url
        }
      }
    }
  }
`;

export async function listEvershopProducts(): Promise<EvershopListedProduct[]> {
  const response = await fetch(`${getEvershopBaseUrl()}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`EverShop GraphQL request failed (${response.status}).`);
  }

  const payload = (await response.json()) as {
    data?: {
      products?: {
        items?: Array<{
          productId: number;
          name: string;
          sku: string;
          urlKey: string;
          price?: { regular?: { value?: number; text?: string } };
          image?: { url?: string | null };
        }>;
      };
    };
    errors?: Array<{ message?: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? 'EverShop GraphQL error.');
  }

  const items = payload.data?.products?.items ?? [];

  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    sku: item.sku,
    urlKey: item.urlKey,
    priceUsd: item.price?.regular?.value ?? 0,
    priceText: item.price?.regular?.text ?? '',
    imageUrl: item.image?.url ?? null,
  }));
}
