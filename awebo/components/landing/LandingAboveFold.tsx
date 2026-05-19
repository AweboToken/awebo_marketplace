'use client';

import LandingHero from './LandingHero';

export interface LandingAboveFoldProps {
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
}

/** Landing page: full-viewport hero only (preloader → video → still + copy). */
export default function LandingAboveFold({
  heroBadge,
  heroHeadline,
  heroSubtext,
}: LandingAboveFoldProps = {}) {
  return (
    <LandingHero badge={heroBadge} headline={heroHeadline} subtext={heroSubtext} />
  );
}
