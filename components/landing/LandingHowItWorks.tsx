'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowUpRight, User, Coins, Layers, Rocket } from 'lucide-react';

interface ProcessCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
}) => (
  <div
    className={cn(
      'group relative w-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-air-force-blue/60 hover:shadow-lg',
      className
    )}
  >
    {/* Decorative line - visible on larger screens */}
    <div className="absolute -left-[1px] top-1/2 hidden h-1/2 w-px -translate-y-1/2 bg-gray-200 transition-colors group-hover:bg-air-force-blue/60 md:block" />
    <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gray-200 transition-colors group-hover:bg-air-force-blue/60 md:hidden" />

    {/* Icon container */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-air-force-blue shadow-sm transition-colors duration-300 group-hover:bg-air-force-blue group-hover:text-white">
      <Icon className="h-6 w-6" />
    </div>

    <div className="flex flex-col">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const PROCESS_ITEMS: ProcessCardProps[] = [
  {
    icon: User,
    title: 'Profile & brand',
    description:
      'Set up your creator profile and brand identity in AWEBO Creator Studio. Add banner, avatar, tagline, and social links.',
  },
  {
    icon: Coins,
    title: 'Token',
    description:
      'Configure your brand token: choose network, token purpose, total supply, and allocation. All pricing in ETH.',
  },
  {
    icon: Layers,
    title: 'NFT & merch',
    description:
      'Build your digital collectibles and link phygital merch. Set mint price in ETH, upload artwork, and enable token-gated access for holders.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description:
      'Review and deploy. AWEBO handles smart contract deployment, drop mechanics, and global fulfillment for physical orders.',
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-white py-16 md:py-24"
      aria-label="How it works"
    >
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-3 md:gap-8 lg:gap-16 max-w-6xl">
        {/* Left content */}
        <div className="flex flex-col items-start justify-center text-center md:col-span-1 md:text-left">
          <span className="mb-2 text-sm font-medium uppercase tracking-widest text-air-force-blue">
            How it works
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Launch token, NFT & merch in one flow
          </h2>
          <p className="mb-6 text-base text-gray-600">
            From creator profile to live drop: configure your token economics, build your NFT collection, add phygital merch, and launch. All in ETH.
          </p>
          <Link
            href="/launch"
            className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-air-force-blue/90"
          >
            Start with AWEBO
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Right content - grid of process cards */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:col-span-2">
          {PROCESS_ITEMS.map((item, index) => (
            <ProcessCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
