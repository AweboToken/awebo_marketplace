'use client';

import ScrollingRoomBackground from '@/components/landing/ScrollingRoomBackground';

const NFT_GALLERY_IMAGE = '/NFT_gallery.webp';

export default function MarketplaceRoomBackground() {
  return (
    <ScrollingRoomBackground imageSrc={NFT_GALLERY_IMAGE} blurClassName="blur-sm" />
  );
}
