import { notFound } from 'next/navigation';
import HQRoomScene from '@/components/landing/HQRoomScene';
import {
  HQ_ROOM_SLUGS,
  resolveHQRoomFromSlug,
} from '@/lib/hq-room-slugs';

type HQRoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export function generateStaticParams() {
  return HQ_ROOM_SLUGS.map((roomId) => ({ roomId }));
}

export async function generateMetadata({ params }: HQRoomPageProps) {
  const { roomId } = await params;
  const room = resolveHQRoomFromSlug(roomId);

  return {
    title: room ? `${room.name} — AWEBO HQ` : 'AWEBO HQ',
    robots: { index: false, follow: false },
  };
}

export default async function HQRoomPage({ params }: HQRoomPageProps) {
  const { roomId } = await params;
  const room = resolveHQRoomFromSlug(roomId);

  if (!room) {
    notFound();
  }

  return <HQRoomScene room={room} />;
}
