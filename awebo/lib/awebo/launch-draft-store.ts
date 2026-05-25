import { promises as fs } from 'fs';
import path from 'path';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import { resolveAweboStorageBackend } from '@/utils/supabase/admin';
import {
  getLaunchDraftFromSupabase,
  markLaunchDraftPublishedInSupabase,
  upsertLaunchDraftToSupabase,
} from '@/lib/awebo/supabase-launch-drafts';

export type LaunchDraftRecord = {
  ownerId: string;
  stepIndex: number;
  values: LaunchWizardValues;
  productPrices: Record<string, string>;
  updatedAt: string;
  status: 'draft' | 'published';
};

type LaunchDraftFile = {
  drafts: LaunchDraftRecord[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DRAFTS_PATH = path.join(DATA_DIR, 'launch-drafts.json');

async function readDraftsFile(): Promise<LaunchDraftFile> {
  try {
    const raw = await fs.readFile(DRAFTS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as LaunchDraftFile;
    return { drafts: parsed.drafts ?? [] };
  } catch {
    return { drafts: [] };
  }
}

async function writeDraftsFile(file: LaunchDraftFile): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DRAFTS_PATH, JSON.stringify(file, null, 2), 'utf8');
}

/** Blob preview URLs cannot be restored after reload. */
export function sanitizeLaunchValuesForStorage(
  values: LaunchWizardValues
): LaunchWizardValues {
  return {
    ...values,
    bannerUrl:
      values.bannerUrl && !values.bannerUrl.startsWith('blob:')
        ? values.bannerUrl
        : null,
    logoUrl:
      values.logoUrl && !values.logoUrl.startsWith('blob:')
        ? values.logoUrl
        : null,
  };
}

export async function getLaunchDraft(
  ownerId: string
): Promise<LaunchDraftRecord | null> {
  if (resolveAweboStorageBackend() === 'supabase') {
    return getLaunchDraftFromSupabase(ownerId);
  }

  const file = await readDraftsFile();
  return (
    file.drafts.find((draft) => draft.ownerId === ownerId && draft.status === 'draft') ??
    null
  );
}

export async function upsertLaunchDraft(
  draft: Omit<LaunchDraftRecord, 'updatedAt' | 'status'> & {
    status?: LaunchDraftRecord['status'];
  }
): Promise<LaunchDraftRecord> {
  if (resolveAweboStorageBackend() === 'supabase') {
    return upsertLaunchDraftToSupabase(draft);
  }

  const file = await readDraftsFile();
  const next: LaunchDraftRecord = {
    ownerId: draft.ownerId,
    stepIndex: draft.stepIndex,
    values: sanitizeLaunchValuesForStorage(draft.values),
    productPrices: draft.productPrices,
    updatedAt: new Date().toISOString(),
    status: draft.status ?? 'draft',
  };

  const withoutOwner = file.drafts.filter((entry) => entry.ownerId !== draft.ownerId);
  file.drafts = [next, ...withoutOwner];
  await writeDraftsFile(file);
  return next;
}

export async function markLaunchDraftPublished(ownerId: string): Promise<void> {
  if (resolveAweboStorageBackend() === 'supabase') {
    return markLaunchDraftPublishedInSupabase(ownerId);
  }

  const file = await readDraftsFile();
  file.drafts = file.drafts.map((entry) =>
    entry.ownerId === ownerId ? { ...entry, status: 'published' as const } : entry
  );
  await writeDraftsFile(file);
}
