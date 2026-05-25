import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import type { LaunchDraftRecord } from '@/lib/awebo/launch-draft-store';
import { createAdminClient } from '@/utils/supabase/admin';
import { ensureCreator } from '@/lib/awebo/supabase-catalog';

function sanitizeLaunchValuesForStorage(values: LaunchWizardValues): LaunchWizardValues {
  return {
    ...values,
    bannerUrl:
      values.bannerUrl && !values.bannerUrl.startsWith('blob:') ? values.bannerUrl : null,
    logoUrl: values.logoUrl && !values.logoUrl.startsWith('blob:') ? values.logoUrl : null,
  };
}

type LaunchDraftRow = {
  owner_id: string;
  step_index: number;
  values: LaunchWizardValues;
  product_prices: Record<string, string>;
  updated_at: string;
  status: 'draft' | 'published';
};

function mapDraftRow(row: LaunchDraftRow): LaunchDraftRecord {
  return {
    ownerId: row.owner_id,
    stepIndex: row.step_index,
    values: row.values,
    productPrices: row.product_prices ?? {},
    updatedAt: row.updated_at,
    status: row.status,
  };
}

function supabaseErrorMessage(error: { message: string; details?: string; hint?: string }) {
  return [error.message, error.details, error.hint].filter(Boolean).join(' — ');
}

export async function getLaunchDraftFromSupabase(
  ownerId: string
): Promise<LaunchDraftRecord | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('launch_drafts')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('status', 'draft')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load launch draft: ${supabaseErrorMessage(error)}`);
  }

  if (!data) return null;
  return mapDraftRow(data as LaunchDraftRow);
}

export async function upsertLaunchDraftToSupabase(
  draft: Omit<LaunchDraftRecord, 'updatedAt' | 'status'> & {
    status?: LaunchDraftRecord['status'];
  }
): Promise<LaunchDraftRecord> {
  const supabase = createAdminClient();
  await ensureCreator(draft.ownerId);

  const payload = {
    owner_id: draft.ownerId,
    step_index: draft.stepIndex,
    values: sanitizeLaunchValuesForStorage(draft.values),
    product_prices: draft.productPrices ?? {},
    status: draft.status ?? 'draft',
  };

  const { data, error } = await supabase
    .from('launch_drafts')
    .upsert(payload, { onConflict: 'owner_id' })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to save launch draft: ${supabaseErrorMessage(
        error ?? { message: 'No draft row returned' }
      )}`
    );
  }

  return mapDraftRow(data as LaunchDraftRow);
}

export async function markLaunchDraftPublishedInSupabase(ownerId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('launch_drafts')
    .update({ status: 'published' })
    .eq('owner_id', ownerId);

  if (error) {
    throw new Error(`Failed to mark draft published: ${supabaseErrorMessage(error)}`);
  }
}
