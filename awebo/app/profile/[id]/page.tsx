'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Share2,
  Gift,
  MapPin,
  Link as LinkIcon,
  Check,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface ProfileData {
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

// Mock Catalog Products
const CATALOG_PRODUCTS = [
  {
    id: 'p-new-1',
    name: 'Organic heavyweight tee',
    brandName: 'Studio Norte',
    price: '$48.00',
    priceVal: 48.00,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    brandSlug: 'studio-norte',
  },
  {
    id: 'p-new-2',
    name: 'Wool wrap coat',
    brandName: 'Lumen Atelier',
    price: '$220.00',
    priceVal: 220.00,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    brandSlug: 'lumen-atelier',
  },
  {
    id: 'p-new-3',
    name: 'Minimalist leather backpack',
    brandName: 'Objeto',
    price: '$180.00',
    priceVal: 180.00,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    brandSlug: 'objeto',
  },
  {
    id: 'p-meme-1',
    name: 'Pepe Viking Classic T-shirt',
    brandName: 'Pepe Collection',
    price: '$40.99',
    priceVal: 40.99,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&q=80',
    brandSlug: 'pepe-collection',
  },
  {
    id: 'p-meme-2',
    name: 'Pepe Embroidered Bucket Hat',
    brandName: 'Pepe Collection',
    price: '$18.25',
    priceVal: 18.25,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80',
    brandSlug: 'pepe-collection',
  },
  {
    id: 'p-meme-3',
    name: 'AWEBO Willow Ptarmigan Tee',
    brandName: 'Awebo Chileno',
    price: '$48.99',
    priceVal: 48.99,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
    brandSlug: 'awebo-chileno',
  },
];

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any | null>(null);
  const [giftingStep, setGiftingStep] = useState<'details' | 'signing' | 'success'>('details');

  useEffect(() => {
    if (!params.id) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/profile?id=${encodeURIComponent(params.id)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFollowersCount(data.followers || 0);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [params.id, router]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const triggerGiftPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setGiftingStep('signing');
    // Simulate transaction submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGiftingStep('success');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700">
        <p className="text-sm">Loading Public Storefront...</p>
      </div>
    );
  }

  if (!profile) return null;

  const displayPfp = profile.pfpUrl ?? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80';
  const displayBanner = profile.bannerUrl ?? 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80';
  
  // Filter wishlist items
  const wishlistItems = CATALOG_PRODUCTS.filter((p) => profile.wishlist.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-sans text-gray-900">
      <Navigation variant="landing" landingTheme="surface" />

      <main className="flex-1 pb-16">
        {/* Cover Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-zinc-200 sm:h-72">
          <img
            src={displayBanner}
            alt="Profile Cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Profile Header Box */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            {/* Avatar & Profile Details */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                <img
                  src={displayPfp}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 pb-1">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {profile.username}
                </h1>
                <p className="text-sm font-medium text-gray-500">@{profile.username.toLowerCase().replace(/\s+/g, '')}</p>
                
                {/* Meta details */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-indigo-600 no-underline hover:underline"
                    >
                      <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
                      {profile.website}
                    </a>
                  )}
                  <span className="text-gray-400">Since {profile.since}</span>
                </div>
              </div>
            </div>

            {/* Actions / Follows & Stats */}
            <div className="flex flex-col gap-3 self-stretch md:self-end">
              <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                <div>
                  <p className="text-sm font-bold text-gray-950 font-mono">{profile.itemsSold}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Items Sold</p>
                </div>
                <div className="border-l border-gray-200 h-8 self-center" />
                <div>
                  <p className="text-sm font-bold text-gray-950 font-mono">{profile.positiveFeedback}%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Feedback</p>
                </div>
                <div className="border-l border-gray-200 h-8 self-center" />
                <div>
                  <p className="text-sm font-bold text-gray-950 font-mono">{followersCount}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Followers</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border ${
                    isFollowing
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'bg-indigo-600 text-white border-indigo-600 hover:bg-[#5e4db8]'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                  aria-label="Share profile"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* User narrative bio block */}
          <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Biography</h3>
            <p className="text-sm leading-relaxed text-gray-700 italic">
              &ldquo;{profile.bio}&rdquo;
            </p>
          </div>

          {/* Wishlist Section with Gift Now */}
          <h2 className="text-xl font-bold tracking-tight text-gray-950 mb-1 flex items-center gap-2">
            <Heart className="h-5 w-5 text-indigo-600 fill-indigo-600" />
            Wishlist catalog
          </h2>
          <p className="text-xs text-gray-500 mb-6">Choose a product from their wishlist to purchase and gift it to them directly.</p>

          {wishlistItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 max-w-xl">
              <Gift className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm font-semibold">Wishlist is empty</p>
              <p className="mt-1 text-xs text-gray-400">This user has not listed any public wishlist items yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <img src={product.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 font-semibold">{product.brandName}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold font-mono text-gray-950">{product.price}</span>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGift(product);
                        setGiftingStep('details');
                      }}
                      className="rounded-lg bg-[#6e5dcb] hover:bg-[#5e4db8] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1"
                    >
                      <Gift className="h-3.5 w-3.5" />
                      Gift Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Gift Payment Modal */}
      {selectedGift && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            {giftingStep === 'details' && (
              <>
                <h3 className="text-lg font-bold text-gray-950 mb-1">
                  Gift this item
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Purchase this product for {profile.username}. The physical merchandise will be dispatched to their profile delivery address.
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 mb-6">
                  <img src={selectedGift.image} alt="" className="h-16 w-16 rounded-lg object-cover shadow" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{selectedGift.name}</p>
                    <p className="text-[10px] text-gray-500 font-semibold">{selectedGift.brandName}</p>
                    <p className="mt-1 text-xs font-bold font-mono text-indigo-600">{selectedGift.price}</p>
                  </div>
                </div>

                <form onSubmit={triggerGiftPayment} className="space-y-4">
                  <div>
                    <label htmlFor="token" className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                      Select Payment Token
                    </label>
                    <select
                      id="token"
                      className="h-10 w-full rounded-lg border border-gray-300 px-3 text-xs outline-none focus:border-indigo-500 bg-white"
                    >
                      <option>ETH (L1X / Base Network)</option>
                      <option>AWEBO (Awebo Reward Coin)</option>
                      <option>USDC (Base Mainnet)</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGift(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#6e5dcb] hover:bg-[#5e4db8] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      Sign & Pay
                    </button>
                  </div>
                </form>
              </>
            )}

            {giftingStep === 'signing' && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <h3 className="text-base font-bold text-gray-950">Confirming Payment...</h3>
                <p className="mt-1.5 text-xs text-gray-500">
                  Awaiting wallet signature approval to transfer {(selectedGift.priceVal / 3000).toFixed(4)} ETH to checkout protocol.
                </p>
              </div>
            )}

            {giftingStep === 'success' && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 border border-emerald-500 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Gift Sent Successfully!</h3>
                <p className="mt-2 text-xs text-gray-500">
                  Signed and paid! {profile.username} will be notified immediately. We are processing the phygital streetwear dispatch.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedGift(null)}
                  className="mt-6 rounded-lg bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer variant="landing" />
    </div>
  );
}
