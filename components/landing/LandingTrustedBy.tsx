'use client';

import Image from 'next/image';

const DEFAULT_PARTNERS = [
  { id: '1', name: 'Partner 1', logoUrl: null },
  { id: '2', name: 'Partner 2', logoUrl: null },
  { id: '3', name: 'Partner 3', logoUrl: null },
  { id: '4', name: 'Partner 4', logoUrl: null },
  { id: '5', name: 'Partner 5', logoUrl: null },
  { id: '6', name: 'Partner 6', logoUrl: null },
];

export type TrustedByPartnerFromCMS = {
  _id: string;
  name?: string | null;
  logoUrl?: string | null;
};

export default function LandingTrustedBy({ partners }: { partners?: TrustedByPartnerFromCMS[] | null }) {
  const list = partners?.length ? partners : DEFAULT_PARTNERS.map((p) => ({ _id: p.id, name: p.name, logoUrl: p.logoUrl }));
  return (
    <section
      className="w-full border-y border-gray-200/80 py-10 md:py-14"
      aria-label="Trusted by"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-gray-500">
          Trusted by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {list.map(({ _id, name, logoUrl }) => (
            <div
              key={_id}
              className="flex h-14 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/80 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-100 md:h-16 md:w-36 overflow-hidden"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={name || 'Partner'} width={144} height={64} className="object-contain max-h-full max-w-full" />
              ) : (
                <span className="text-xs font-medium">{name || 'Partner'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
