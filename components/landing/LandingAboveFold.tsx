'use client';

import { BackgroundSnippets } from '@/components/ui/background-snippets';
import LandingHero, { type HeroSlide } from './LandingHero';
import LandingTopCreators, { type TopCreatorFromCMS } from './LandingTopCreators';
import LandingTrustedBy, { type TrustedByPartnerFromCMS } from './LandingTrustedBy';

export interface LandingAboveFoldProps {
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  heroSlides?: Array<HeroSlide> | null;
  topCreators?: TopCreatorFromCMS[] | null;
  trustedByPartners?: TrustedByPartnerFromCMS[] | null;
}

/**
 * Hero through Trusted by: grid + purple radial gradient background.
 */
export default function LandingAboveFold({
  heroBadge,
  heroHeadline,
  heroSubtext,
  heroSlides,
  topCreators,
  trustedByPartners,
}: LandingAboveFoldProps = {}) {
  return (
    <div className="relative w-full">
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundSnippets />
      </div>
      <div className="relative z-10">
        <LandingHero badge={heroBadge} headline={heroHeadline} subtext={heroSubtext} slides={heroSlides} />
        <LandingTopCreators creators={topCreators} />
        <LandingTrustedBy partners={trustedByPartners} />
      </div>
    </div>
  );
}
