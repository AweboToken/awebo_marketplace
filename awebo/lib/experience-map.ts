/** Experience map artwork (1536×1024). */
export const EXPERIENCE_MAP_IMAGE = '/map.webp';
export const EXPERIENCE_MAP_WIDTH = 1536;
export const EXPERIENCE_MAP_HEIGHT = 1024;

export type RoomDoor = {
  side: 'top' | 'bottom' | 'left' | 'right';
  to: string;
};

export type RoomWindow = {
  side: 'top' | 'bottom' | 'left' | 'right';
  exteriorView?: boolean;
};

export type RoomExteriorDoor = {
  side: 'top' | 'bottom' | 'left' | 'right';
};

export type AweboHQRoom = {
  id: string;
  name: string;
  /** Normalized top-left corner (0–100). */
  x: number;
  y: number;
  /** Normalized footprint (0–100). */
  width: number;
  height: number;
  /** Ideal camera orbit or hotspot anchor (0–100). */
  center: { x: number; y: number };
  /** Destination when selected on the HQ map. */
  href: string;
  /** Room scene artwork; omit for a blank page. */
  imageSrc?: string | null;
  doors?: RoomDoor[];
  window?: RoomWindow;
  exteriorDoor?: RoomExteriorDoor;
};

/**
 * Normalized percentage coordinates on `map.webp`.
 * x/y = top-left corner, width/height = room footprint, center = hotspot anchor.
 */
export const aweboHQRooms: AweboHQRoom[] = [
  {
    id: 'ROOM_01',
    name: 'Vault Room',
    x: 31.2,
    y: 3.8,
    width: 29.2,
    height: 34.8,
    center: { x: 45.8, y: 21.2 },
    href: '/',
    doors: [
      { side: 'bottom', to: 'HALLWAY_MAIN' },
      { side: 'left', to: 'ROOM_02' },
      { side: 'right', to: 'ROOM_04' },
    ],
  },
  {
    id: 'ROOM_02',
    name: 'Lounge',
    x: 16.2,
    y: 4.1,
    width: 14.2,
    height: 17.9,
    center: { x: 23.3, y: 12.9 },
    href: '/hq/room-02',
    imageSrc: '/lounge_room.jpg',
    window: {
      side: 'top',
      exteriorView: true,
    },
    exteriorDoor: {
      side: 'left',
    },
  },
  {
    id: 'ROOM_03',
    name: 'Meeting Room',
    x: 16.2,
    y: 23.5,
    width: 14.1,
    height: 13.5,
    center: { x: 23.1, y: 30.0 },
    href: '/hq/room-03',
    imageSrc: '/meetingroom.webp',
  },
  {
    id: 'ROOM_04',
    name: 'Crypto War Room',
    x: 65.2,
    y: 5.1,
    width: 16.4,
    height: 25.4,
    center: { x: 73.2, y: 17.3 },
    href: '/hq/room-04',
  },
  {
    id: 'ROOM_05',
    name: 'NFT Gallery',
    x: 81.3,
    y: 5.1,
    width: 12.0,
    height: 25.7,
    center: { x: 87.3, y: 17.6 },
    href: '/hq/nft-gallery',
    imageSrc: '/NFT_gallery.webp',
  },
  {
    id: 'ROOM_06',
    name: 'Trading Room',
    x: 16.1,
    y: 39.2,
    width: 14.5,
    height: 17.4,
    center: { x: 23.2, y: 47.8 },
    href: '/hq/room-06',
    imageSrc: '/traderoom.webp',
  },
  {
    id: 'ROOM_07',
    name: 'Creators Lab',
    x: 31.1,
    y: 39.3,
    width: 16.8,
    height: 17.1,
    center: { x: 39.5, y: 47.8 },
    href: '/hq/room-07',
    imageSrc: '/creatorsroom.webp',
  },
  {
    id: 'ROOM_08',
    name: 'Prototyping Lab',
    x: 48.4,
    y: 37.6,
    width: 16.2,
    height: 17.2,
    center: { x: 56.5, y: 46.2 },
    href: '/hq/room-08',
    imageSrc: '/centertable_bg.webp',
  },
  {
    id: 'ROOM_09',
    name: 'Photo Studio',
    x: 65.1,
    y: 37.5,
    width: 16.5,
    height: 17.3,
    center: { x: 73.4, y: 46.1 },
    href: '/hq/room-09',
    imageSrc: '/photoshootroom.webp',
  },
  {
    id: 'ROOM_10',
    name: 'Packaging Lab',
    x: 82.1,
    y: 37.5,
    width: 15.2,
    height: 17.2,
    center: { x: 89.5, y: 46.1 },
    href: '/hq/room-10',
  },
  {
    id: 'ROOM_11',
    name: 'Blockchain Lab',
    x: 10.5,
    y: 60.3,
    width: 17.1,
    height: 25.0,
    center: { x: 19.1, y: 72.8 },
    href: '/hq/room-11',
    imageSrc: '/blockchainlab.webp',
  },
  {
    id: 'ROOM_12',
    name: 'Print Lab',
    x: 27.6,
    y: 60.3,
    width: 17.1,
    height: 25.0,
    center: { x: 36.2, y: 72.8 },
    href: '/hq/room-12',
    imageSrc: '/printroom.webp',
  },
  {
    id: 'ROOM_13',
    name: 'Shipping & Logistics',
    x: 44.7,
    y: 60.3,
    width: 17.1,
    height: 25.0,
    center: { x: 53.3, y: 72.8 },
    href: '/hq/room-13',
    imageSrc: '/shippingroom.webp',
  },
  {
    id: 'ROOM_14',
    name: 'Founders Office',
    x: 61.8,
    y: 60.3,
    width: 17.1,
    height: 25.0,
    center: { x: 70.4, y: 72.8 },
    href: '/hq/room-14',
    imageSrc: '/foundersoffice.webp',
  },
  {
    id: 'ROOM_15',
    name: 'Rooftop Deck',
    x: 78.9,
    y: 60.3,
    width: 17.1,
    height: 25.0,
    center: { x: 87.4, y: 72.8 },
    href: '/hq/room-15',
    imageSrc: '/rooftopview.webp',
  },
];

export function getAweboHQRoom(id: string): AweboHQRoom | undefined {
  return aweboHQRooms.find((room) => room.id === id);
}

/** @deprecated Use `aweboHQRooms` */
export type ExperienceMapCell = AweboHQRoom;

/** @deprecated Use `aweboHQRooms` */
export const EXPERIENCE_MAP_CELLS = aweboHQRooms;
