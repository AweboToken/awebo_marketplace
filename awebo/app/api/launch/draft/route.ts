import { NextResponse } from 'next/server';
import {
  getLaunchDraft,
  upsertLaunchDraft,
  type LaunchDraftRecord,
} from '@/lib/awebo/launch-draft-store';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';

type DraftBody = {
  ownerId?: string;
  stepIndex?: number;
  values?: LaunchWizardValues;
  productPrices?: Record<string, string>;
};

function isValidOwnerId(ownerId: string): boolean {
  return ownerId.length >= 8 && ownerId.length <= 128;
}

export async function GET(request: Request) {
  const ownerId = new URL(request.url).searchParams.get('ownerId')?.trim() ?? '';

  if (!isValidOwnerId(ownerId)) {
    return NextResponse.json({ error: 'Invalid owner id.' }, { status: 400 });
  }

  const draft = await getLaunchDraft(ownerId);
  return NextResponse.json({ draft });
}

export async function PUT(request: Request) {
  let body: DraftBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const ownerId = body.ownerId?.trim() ?? '';
  if (!isValidOwnerId(ownerId)) {
    return NextResponse.json({ error: 'Invalid owner id.' }, { status: 400 });
  }

  if (!body.values || typeof body.stepIndex !== 'number') {
    return NextResponse.json(
      { error: 'stepIndex and values are required.' },
      { status: 400 }
    );
  }

  if (body.stepIndex < 0 || body.stepIndex > 3) {
    return NextResponse.json({ error: 'Invalid step index.' }, { status: 400 });
  }

  try {
    const draft = await upsertLaunchDraft({
      ownerId,
      stepIndex: body.stepIndex,
      values: body.values,
      productPrices: body.productPrices ?? {},
    });

    return NextResponse.json({ draft } satisfies { draft: LaunchDraftRecord });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to save launch draft.',
      },
      { status: 500 }
    );
  }
}
