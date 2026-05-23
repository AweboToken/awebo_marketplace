'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  aweboGalleryCells,
  type AweboGalleryCell,
} from '@/lib/awebo-gallery-cells';

const GALLERY_IMAGE = '/awebo_front.webp';
const GALLERY_WIDTH = 1536;
const GALLERY_HEIGHT = 1024;

const CARD_WIDTH = 220;
const CARD_HEIGHT = 300;
const CURSOR_OFFSET = 18;

function clampCardPosition(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number
) {
  return {
    x: Math.min(
      Math.max(CURSOR_OFFSET, x + CURSOR_OFFSET),
      containerWidth - CARD_WIDTH - CURSOR_OFFSET
    ),
    y: Math.min(
      Math.max(CURSOR_OFFSET, y + CURSOR_OFFSET),
      containerHeight - CARD_HEIGHT - CURSOR_OFFSET
    ),
  };
}

function EcosystemProductCard({ product }: { product: AweboGalleryCell }) {
  return (
    <Link
      href={product.productHref}
      className="block w-[220px] overflow-hidden rounded-xl border border-white/15 bg-neutral-950/95 shadow-2xl backdrop-blur-md no-underline transition-colors hover:border-white/25"
    >
      <div className="relative aspect-square w-full bg-neutral-900">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="220px"
          className="object-contain object-center p-4"
        />
      </div>
      <div className="space-y-2 p-3">
        <p className="text-sm font-semibold leading-tight text-white">{product.title}</p>
        <p className="text-xs font-medium text-white/70">{product.price} USD</p>
        <span className="inline-flex w-full items-center justify-center rounded-lg bg-air-force-blue py-2 text-center text-xs font-semibold text-black">
          Buy now
        </span>
      </div>
    </Link>
  );
}

export default function EcosystemGallery() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number>(0);
  const cardPinnedRef = useRef(false);

  const [activeCell, setActiveCell] = useState<AweboGalleryCell | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  const updateCardPosition = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setCardPosition(
      clampCardPosition(x, y, rect.width, rect.height)
    );
  }, []);

  const showCard = useCallback(
    (product: AweboGalleryCell, clientX: number, clientY: number) => {
      window.clearTimeout(hideTimeoutRef.current);
      cardPinnedRef.current = false;
      setActiveCell(product);
      updateCardPosition(clientX, clientY);
    },
    [updateCardPosition]
  );

  const scheduleHideCard = useCallback(() => {
    window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      if (!cardPinnedRef.current) setActiveCell(null);
    }, 120);
  }, []);

  const cancelHideCard = useCallback(() => {
    window.clearTimeout(hideTimeoutRef.current);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <Image
        src={GALLERY_IMAGE}
        alt="AWEBO ecosystem gallery"
        width={GALLERY_WIDTH}
        height={GALLERY_HEIGHT}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
      <div className="absolute inset-0">
        {aweboGalleryCells.map((cell) => (
          <div
            key={cell.id}
            role="button"
            tabIndex={0}
            aria-label={cell.label}
            className="absolute cursor-pointer bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            style={{
              left: `${cell.x}%`,
              top: `${cell.y}%`,
              width: `${cell.w}%`,
              height: `${cell.h}%`,
            }}
            onMouseEnter={(e) => showCard(cell, e.clientX, e.clientY)}
            onMouseMove={(e) => {
              if (activeCell?.id === cell.id) updateCardPosition(e.clientX, e.clientY);
            }}
            onMouseLeave={scheduleHideCard}
            onClick={() => router.push(cell.productHref)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push(cell.productHref);
              }
            }}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showCard(
                cell,
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
              );
            }}
            onBlur={scheduleHideCard}
          />
        ))}
      </div>

      {activeCell ? (
        <div
          className="pointer-events-none absolute z-50"
          style={{
            left: cardPosition.x,
            top: cardPosition.y,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
          <div
            className="pointer-events-auto"
            onMouseEnter={() => {
              cardPinnedRef.current = true;
              cancelHideCard();
            }}
            onMouseLeave={() => {
              cardPinnedRef.current = false;
              scheduleHideCard();
            }}
          >
            <EcosystemProductCard product={activeCell} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
