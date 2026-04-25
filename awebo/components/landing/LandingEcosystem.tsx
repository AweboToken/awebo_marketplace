'use client';

import { ShirtParallaxCard } from '@/components/ui/shirt-parallax-card';

const DEFAULT_SHIRT_IMAGE = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80';

export interface LandingEcosystemProps {
  title?: string | null;
  description?: string | null;
  productTitle?: string | null;
  productDescription?: string | null;
  productPrice?: string | null;
  productImageUrl?: string | null;
}

export default function LandingEcosystem({
  title,
  description,
  productTitle,
  productDescription,
  productPrice,
  productImageUrl,
}: LandingEcosystemProps = {}) {
  const sectionTitle = title ?? 'Sustainable streetwear, tokenized.';
  const sectionDescription = description ?? 'Launch limited drops and phygital merch — from design to delivery.';
  const shirtTitle = productTitle ?? 'Creator Drop Tee';
  const shirtDescription = productDescription ?? 'Soft organic cotton with a tailored fit. Limited run, verified on-chain.';
  const shirtPrice = productPrice ?? '$42.00';
  const shirtImage = productImageUrl ?? DEFAULT_SHIRT_IMAGE;

  return (
    <section
      id="ecosystem"
      className="w-full px-4 sm:px-6 lg:px-8 py-16"
      style={{
        background: 'linear-gradient(to bottom, var(--seashell) 0%, #ffffff 100%)',
      }}
      aria-label="Ecosystem & featured product"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {sectionTitle}
            </h2>
            <p className="mt-3 text-gray-600">
              {sectionDescription}
            </p>
          </div>

          <div>
            <ShirtParallaxCard
              title={shirtTitle}
              description={shirtDescription}
              price={shirtPrice}
              imageUrl={shirtImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
