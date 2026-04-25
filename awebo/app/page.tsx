import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  LandingAboveFold,
  LandingPhygital,
  LandingHowItWorks,
  LandingEcosystem,
  LandingCtaBanner,
} from '@/components/landing';
import type { TopCreatorFromCMS } from '@/components/landing/LandingTopCreators';
import type { TrustedByPartnerFromCMS } from '@/components/landing/LandingTrustedBy';
import { client } from '@/sanity/lib/client';
import { isSanityConfigured } from '@/sanity/env';
import {
  homePageQuery,
  topCreatorsQuery,
  trustedByPartnersQuery,
  phygitalItemsQuery,
  howItWorksCardsQuery,
} from '@/sanity/lib/queries';

type HomePageData = {
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubtext?: string | null;
  heroSlides?: Array<{ _type?: string; asset?: { url?: string }; url?: string }> | null;
  howItWorksLabel?: string | null;
  howItWorksTitle?: string | null;
  howItWorksDescription?: string | null;
  howItWorksCtaText?: string | null;
  howItWorksCtaLink?: string | null;
  ecosystemTitle?: string | null;
  ecosystemDescription?: string | null;
  ecosystemProductTitle?: string | null;
  ecosystemProductDescription?: string | null;
  ecosystemProductPrice?: string | null;
  ecosystemProductImageUrl?: string | null;
  ctaBannerTitle?: string | null;
  ctaBannerDescription?: string | null;
  ctaBannerBackgroundImageUrl?: string | null;
  ctaBannerPrimaryText?: string | null;
  ctaBannerSecondaryText?: string | null;
  ctaBannerSecondaryLink?: string | null;
};

export const metadata = {
  title: 'AWEBO — Launch and trade tokens on L1X',
  description:
    'AWEBO is a launchpad for culture-backed brands: tokens, merchandise, and global logistics. Design once, launch globally.',
};

/** Revalidate so deployed landing stays in sync with Sanity (design + content) */
export const revalidate = 60;

export default async function LandingPage() {
  let homePage: unknown = null;
  let topCreators: unknown = null;
  let trustedByPartners: unknown = null;
  let phygitalItems: unknown = null;
  let howItWorksCards: unknown = null;

  if (isSanityConfigured && client) {
    try {
      [homePage, topCreators, trustedByPartners, phygitalItems, howItWorksCards] =
        await Promise.all([
          client.fetch(homePageQuery),
          client.fetch(topCreatorsQuery),
          client.fetch(trustedByPartnersQuery),
          client.fetch(phygitalItemsQuery),
          client.fetch(howItWorksCardsQuery),
        ]);
    } catch {
      // Sanity not configured or no data
    }
  }

  const home = homePage as HomePageData | null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation variant="landing" />

      <LandingAboveFold
        heroBadge={home?.heroBadge}
        heroHeadline={home?.heroHeadline}
        heroSubtext={home?.heroSubtext}
        heroSlides={home?.heroSlides ?? undefined}
        topCreators={(topCreators as TopCreatorFromCMS[] | null) ?? undefined}
        trustedByPartners={(trustedByPartners as TrustedByPartnerFromCMS[] | null) ?? undefined}
      />

      <main className="flex-1 w-full bg-seashell">
        <LandingPhygital items={phygitalItems as Parameters<typeof LandingPhygital>[0]['items']} />
        <LandingHowItWorks
          sectionLabel={home?.howItWorksLabel}
          title={home?.howItWorksTitle}
          description={home?.howItWorksDescription}
          ctaText={home?.howItWorksCtaText}
          ctaLink={home?.howItWorksCtaLink}
          cards={howItWorksCards as Parameters<typeof LandingHowItWorks>[0]['cards']}
        />
        <LandingEcosystem
          title={home?.ecosystemTitle}
          description={home?.ecosystemDescription}
          productTitle={home?.ecosystemProductTitle}
          productDescription={home?.ecosystemProductDescription}
          productPrice={home?.ecosystemProductPrice}
          productImageUrl={home?.ecosystemProductImageUrl}
        />
        <LandingCtaBanner
          title={home?.ctaBannerTitle}
          description={home?.ctaBannerDescription}
          backgroundImageUrl={home?.ctaBannerBackgroundImageUrl}
          primaryButtonText={home?.ctaBannerPrimaryText}
          secondaryButtonText={home?.ctaBannerSecondaryText}
          secondaryButtonLink={home?.ctaBannerSecondaryLink}
        />
      </main>

      <Footer variant="landing" />
    </div>
  );
}
