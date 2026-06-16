import { promises as fs } from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  pfpUrl: string | null;
  bannerUrl: string | null;
  favorites: string[];
  wishlist: string[];
  following: number;
  followers: number;
  itemsSold: number;
  positiveFeedback: number;
  since: string;
}

type ProfileFile = {
  profiles: Record<string, UserProfile>;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILES_PATH = path.join(DATA_DIR, 'awebo-profiles.json');

// Default initial profiles (e.g. for demonstration or fallback)
const DEFAULT_PROFILES: Record<string, UserProfile> = {
  'did:privy:cmpihr951004c0djuxu8r5wmg': {
    id: 'did:privy:cmpihr951004c0djuxu8r5wmg',
    username: 'the(g)oldboy',
    bio: 'Pepe #1 FAN since 2018. All type of great memes products in my stores.',
    location: 'Chile',
    website: 'Pepecofeeshop.net',
    pfpUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
    favorites: ['p-new-1', 'p-meme-2'],
    wishlist: ['p-meme-1', 'p-meme-3'],
    following: 280,
    followers: 500,
    itemsSold: 6846,
    positiveFeedback: 98,
    since: '01-2026',
  },
};

async function readProfiles(): Promise<ProfileFile> {
  try {
    const raw = await fs.readFile(PROFILES_PATH, 'utf8');
    const parsed = JSON.parse(raw) as ProfileFile;
    return { profiles: { ...DEFAULT_PROFILES, ...(parsed.profiles ?? {}) } };
  } catch {
    return { profiles: DEFAULT_PROFILES };
  }
}

async function writeProfiles(data: ProfileFile): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PROFILES_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function getUserProfile(id: string): Promise<UserProfile> {
  const file = await readProfiles();
  if (file.profiles[id]) {
    return file.profiles[id];
  }
  
  // Return a new default profile for this user if it doesn't exist
  const newProfile: UserProfile = {
    id,
    username: id.startsWith('0x') ? `${id.slice(0, 6)}...${id.slice(-4)}` : 'anon_creator',
    bio: 'A creator on AWEBO.',
    location: 'Global',
    website: '',
    pfpUrl: null,
    bannerUrl: null,
    favorites: [],
    wishlist: [],
    following: 0,
    followers: 0,
    itemsSold: 0,
    positiveFeedback: 100,
    since: new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '-'),
  };
  
  file.profiles[id] = newProfile;
  await writeProfiles(file);
  return newProfile;
}

export async function updateUserProfile(id: string, patch: Partial<UserProfile>): Promise<UserProfile> {
  const file = await readProfiles();
  const current = await getUserProfile(id);
  
  const updated = {
    ...current,
    ...patch,
    id, // Ensure ID cannot be overridden
  };
  
  file.profiles[id] = updated;
  await writeProfiles(file);
  return updated;
}
