import type { LaunchWizardValues } from '@/lib/launch-wizard-types';

const OWNER_KEY = 'awebo-launch-draft-owner-id';

export type LaunchDraftPayload = {
  ownerId: string;
  stepIndex: number;
  values: LaunchWizardValues;
  productPrices: Record<string, string>;
  updatedAt?: string;
};

export function getOrCreateLaunchDraftOwnerId(privyUserId?: string | null): string {
  if (privyUserId) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(OWNER_KEY, privyUserId);
    }
    return privyUserId;
  }

  if (typeof window === 'undefined') return 'anonymous';

  const existing = localStorage.getItem(OWNER_KEY);
  if (existing) return existing;

  const generated = `guest-${crypto.randomUUID()}`;
  localStorage.setItem(OWNER_KEY, generated);
  return generated;
}

export async function fetchLaunchDraft(ownerId: string): Promise<LaunchDraftPayload | null> {
  const response = await fetch(
    `/api/launch/draft?ownerId=${encodeURIComponent(ownerId)}`,
    { cache: 'no-store' }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as { draft?: LaunchDraftPayload | null };
  return payload.draft ?? null;
}

export async function saveLaunchDraft(payload: LaunchDraftPayload): Promise<boolean> {
  const response = await fetch('/api/launch/draft', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.ok;
}
