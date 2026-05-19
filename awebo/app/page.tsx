import {
  LandingAboveFold,
  LandingFloorSection,
  LandingSnowSection,
} from '@/components/landing';
import { client } from '@/sanity/lib/client';
import { isSanityConfigured } from '@/sanity/env';
import { homePageQuery } from '@/sanity/lib/queries';

type HomePageData = {
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
};

export const metadata = {
  title: 'AWEBO — Launch and trade tokens on L1X',
  description:
    'AWEBO is a launchpad for culture-backed brands: tokens, merchandise, and global logistics. Design once, launch globally.',
};

export const revalidate = 60;

export default async function LandingPage() {
  let homePage: unknown = null;

  if (isSanityConfigured && client) {
    try {
      homePage = await client.fetch(homePageQuery);
    } catch {
      // Sanity not configured or no data
    }
  }

  const home = homePage as HomePageData | null;

  return (
    <>
      <LandingAboveFold
        heroBadge={home?.heroBadge}
        heroHeadline={home?.heroHeadline}
        heroSubtext={home?.heroSubtext}
      />
      <LandingFloorSection />
      <LandingSnowSection />
    </>
  );
}
