import { NextResponse } from 'next/server';
import { getCreatorDropsByOwnerId } from '@/lib/awebo/creator-drops';

export const dynamic = 'force-dynamic';

function isValidOwnerId(ownerId: string): boolean {
  return ownerId.length >= 8 && ownerId.length <= 128;
}

export async function GET(request: Request) {
  const ownerId = new URL(request.url).searchParams.get('ownerId')?.trim() ?? '';

  if (!isValidOwnerId(ownerId)) {
    return NextResponse.json({ error: 'Invalid owner id.' }, { status: 400 });
  }

  const payload = await getCreatorDropsByOwnerId(ownerId);
  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
