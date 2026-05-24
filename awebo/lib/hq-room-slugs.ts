import { aweboHQRooms, getAweboHQRoom, type AweboHQRoom } from '@/lib/experience-map';

/** HQ room page slug, e.g. `ROOM_01` → `room-01`. */
export function hqRoomSlug(roomId: string): string {
  return roomId.toLowerCase().replace('_', '-');
}

export function hqRoomPathSlug(room: Pick<AweboHQRoom, 'href'>): string | null {
  const match = room.href.match(/^\/hq\/(.+)$/);
  return match?.[1] ?? null;
}

/** Resolve an `/hq/[slug]` segment to a room definition. */
export function resolveHQRoomFromSlug(slug: string): AweboHQRoom | undefined {
  return aweboHQRooms.find((room) => room.href === `/hq/${slug}`);
}

/** @deprecated Use `resolveHQRoomFromSlug`. */
export function hqRoomIdFromSlug(slug: string): string | null {
  return resolveHQRoomFromSlug(slug)?.id ?? null;
}

export function getHQRoomPath(room: Pick<AweboHQRoom, 'id' | 'href'>): string {
  return room.href;
}

export const HQ_ROOM_SLUGS = aweboHQRooms
  .map((room) => hqRoomPathSlug(room))
  .filter((slug): slug is string => slug != null);

export { getAweboHQRoom };
