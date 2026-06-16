import { NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/lib/awebo/profile-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    const profile = await getUserProfile(id);
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Failed to get profile', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing profile ID in body' }, { status: 400 });
    }

    const updated = await updateUserProfile(id, patch);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Failed to update profile', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
