import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WelcomeModal from '@/components/WelcomeModal';
import Hero from '@/components/Hero';
import HorizontalGrid from '@/components/HorizontalGrid';
import ContentGrid from '@/components/ContentGrid';
import Banner from '@/components/Banner';
import FeaturedContent from '@/components/FeaturedContent';
import CallToAction from '@/components/CallToAction';
import { client } from '@/sanity/lib/client';
import { isSanityConfigured } from '@/sanity/env';
import { appPageQuery } from '@/sanity/lib/queries';

export default async function AppHome() {
  let appPage: {
    projects?: Array<{ _id: string; title?: string; slug?: string; imageUrl?: string }> | null;
    heroImageUrl?: string | null;
    bannerImageUrl?: string | null;
    bannerHeight?: string | null;
    featuredTitle?: string | null;
    featuredDescription?: string | null;
    featuredImageUrl?: string | null;
    featuredCtaText?: string | null;
    featuredCtaLink?: string | null;
    ctaTitle?: string | null;
    ctaButtonText?: string | null;
    ctaLink?: string | null;
  } | null = null;
  if (isSanityConfigured) {
    try {
      appPage = await client.fetch(appPageQuery);
    } catch {
      // No CMS data or Sanity not configured
    }
  }

  const projects = appPage?.projects ?? null;
  const heroImageUrl = appPage?.heroImageUrl ?? null;
  const bannerHeight = appPage?.bannerHeight ?? 'h-40';
  const bannerImageUrl = appPage?.bannerImageUrl ?? null;
  const featured = {
    title: appPage?.featuredTitle ?? null,
    description: appPage?.featuredDescription ?? null,
    imageUrl: appPage?.featuredImageUrl ?? null,
    ctaText: appPage?.featuredCtaText ?? null,
    ctaLink: appPage?.featuredCtaLink ?? null,
  };
  const cta = {
    title: appPage?.ctaTitle ?? null,
    buttonText: appPage?.ctaButtonText ?? null,
    link: appPage?.ctaLink ?? null,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Hero imageUrl={heroImageUrl} />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <HorizontalGrid items={7} projects={projects} />

        <ContentGrid items={7} rows={2} projects={projects} />

        <Banner height={bannerHeight} imageUrl={bannerImageUrl} />

        <ContentGrid items={6} rows={2} projects={projects} offset={14} />

        <FeaturedContent
          title={featured.title}
          description={featured.description}
          imageUrl={featured.imageUrl}
          ctaText={featured.ctaText}
          ctaLink={featured.ctaLink}
        />

        <CallToAction title={cta.title} buttonText={cta.buttonText} link={cta.link} />
      </main>

      <Footer />
      <WelcomeModal />
    </div>
  );
}
