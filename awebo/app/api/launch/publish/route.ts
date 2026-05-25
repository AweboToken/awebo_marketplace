import { NextResponse } from 'next/server';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import { markLaunchDraftPublished } from '@/lib/awebo/launch-draft-store';
import { publishLaunchBrand } from '@/lib/awebo/launch-publish';

type PublishBody = {
  ownerId?: string;
  values?: LaunchWizardValues;
  products?: Array<{ id: string; name: string; priceUsd: number; imageUrl?: string | null }>;
};

export async function POST(request: Request) {
  let body: PublishBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.values?.brandName?.trim()) {
    return NextResponse.json({ error: 'Brand name is required.' }, { status: 400 });
  }

  if (!body.products?.length) {
    return NextResponse.json({ error: 'At least one priced product is required.' }, { status: 400 });
  }

  const ownerId = body.ownerId?.trim() ?? '';
  if (ownerId && (ownerId.length < 8 || ownerId.length > 128)) {
    return NextResponse.json({ error: 'Invalid owner id.' }, { status: 400 });
  }

  const invalidPrice = body.products.find(
    (product) => !Number.isFinite(product.priceUsd) || product.priceUsd <= 0
  );

  if (invalidPrice) {
    return NextResponse.json(
      { error: `Set a valid price for "${invalidPrice.name}".` },
      { status: 400 }
    );
  }

  try {
    const result = await publishLaunchBrand({
      ownerId,
      values: body.values,
      products: body.products,
    });

    if (ownerId) {
      await markLaunchDraftPublished(ownerId);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to publish launch brand.',
      },
      { status: 500 }
    );
  }
}
