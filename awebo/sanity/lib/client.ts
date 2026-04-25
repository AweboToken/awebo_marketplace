import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

const trimmedProjectId = projectId?.trim() ?? '';

/** Null when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset — avoids createClient throwing during `next build` on Vercel. */
export const client: SanityClient | null =
  trimmedProjectId !== ''
    ? createClient({
        projectId: trimmedProjectId,
        dataset,
        apiVersion,
        useCdn: process.env.NODE_ENV === 'production',
      })
    : null;
