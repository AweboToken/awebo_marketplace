'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Background image for the CTA card (dark, brand vibe)
const CTA_BG_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function LandingCtaBanner() {
  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-label="Call to action"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl border border-gray-800 bg-card text-card-foreground shadow-xl'
        )}
      >
        {/* Background Image */}
        <img
          src={CTA_BG_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Dithered overlay (Bayer-style, no hover) – same look as hero */}
        <div className="absolute inset-0 pointer-events-none cta-dither-overlay" aria-hidden />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center gap-8 p-8 text-center md:p-12 lg:p-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="flex flex-col items-center text-center text-white max-w-2xl">
            <motion.h2
              className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
              variants={itemVariants}
            >
              Ready to Tokenize Your Brand?
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-neutral-200"
              variants={itemVariants}
            >
              Join the next generation of culture-defining creators on AWEBO.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Link
              href="/launch"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 font-semibold text-black hover:bg-neutral-200 transition-colors shrink-0"
            >
              Launch Brand
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/ecosystem"
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white px-6 font-semibold text-white hover:bg-white/10 transition-colors shrink-0"
            >
              View Ecosystem
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
