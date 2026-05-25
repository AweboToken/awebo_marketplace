import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

/** Use Supabase on server when configured; never fall back to JSON on Vercel. */
export function resolveAweboStorageBackend(): 'supabase' | 'file' {
  if (isSupabaseAdminConfigured()) {
    return 'supabase';
  }

  if (process.env.VERCEL) {
    throw new Error(
      'Supabase admin is not configured. Add SUPABASE_SERVICE_ROLE_KEY to your deployment environment (Vercel → Settings → Environment Variables).'
    );
  }

  return 'file';
}

export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      'Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
