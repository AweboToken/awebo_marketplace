'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Wallet,
  Settings,
  User,
  Copy,
  Check,
  MapPin,
  Link as LinkIcon,
  Trash2,
  FolderHeart,
  Briefcase,
  ExternalLink,
  Plus,
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

// Mock Catalog Products so we can show favorites & wishlist product details
const CATALOG_PRODUCTS = [
  {
    id: 'p-new-1',
    name: 'Organic heavyweight tee',
    brandName: 'Studio Norte',
    price: '$48.00',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
    brandSlug: 'studio-norte',
  },
  {
    id: 'p-new-2',
    name: 'Wool wrap coat',
    brandName: 'Lumen Atelier',
    price: '$220.00',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
    brandSlug: 'lumen-atelier',
  },
  {
    id: 'p-new-3',
    name: 'Minimalist leather backpack',
    brandName: 'Objeto',
    price: '$180.00',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    brandSlug: 'objeto',
  },
  {
    id: 'p-meme-1',
    name: 'Pepe Viking Classic T-shirt',
    brandName: 'Pepe Collection',
    price: '$40.99',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&q=80',
    brandSlug: 'pepe-collection',
  },
  {
    id: 'p-meme-2',
    name: 'Pepe Embroidered Bucket Hat',
    brandName: 'Pepe Collection',
    price: '$18.25',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80',
    brandSlug: 'pepe-collection',
  },
  {
    id: 'p-meme-3',
    name: 'AWEBO Willow Ptarmigan Tee',
    brandName: 'Awebo Chileno',
    price: '$48.99',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
    brandSlug: 'awebo-chileno',
  },
];

export default function MyProfilePage() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'favorites' | 'wallet' | 'brands' | 'wishlist' | 'config'>('favorites');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userBrands, setUserBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(1.24); // Mock ETH balance

  // Config Form Fields
  const [usernameField, setUsernameField] = useState('');
  const [bioField, setBioField] = useState('');
  const [locationField, setLocationField] = useState('');
  const [websiteField, setWebsiteField] = useState('');
  const [pfpField, setPfpField] = useState('');
  const [bannerField, setBannerField] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const loadProfileAndBrands = async () => {
      try {
        // Fetch Profile
        const res = await fetch(`/api/profile?id=${encodeURIComponent(user.id)}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          // Hydrate Form fields
          setUsernameField(data.username || '');
          setBioField(data.bio || '');
          setLocationField(data.location || '');
          setWebsiteField(data.website || '');
          setPfpField(data.pfpUrl || '');
          setBannerField(data.bannerUrl || '');
        }

        // Fetch user brands
        const brandsRes = await fetch('/api/evershop/products');
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          const filtered = (brandsData.collections ?? []).filter((c: any) => c.ownerId === user.id);
          setUserBrands(filtered);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };

    void loadProfileAndBrands();
  }, [ready, authenticated, user]);

  const handleCopy = () => {
    const address = user?.wallet?.address;
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1500);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingConfig(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          username: usernameField,
          bio: bioField,
          location: locationField,
          website: websiteField,
          pfpUrl: pfpField || null,
          bannerUrl: bannerField || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const toggleWishlistItem = async (productId: string) => {
    if (!profile || !user) return;

    const exists = profile.wishlist.includes(productId);
    const newWishlist = exists
      ? profile.wishlist.filter((id) => id !== productId)
      : [...profile.wishlist, productId];

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          wishlist: newWishlist,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      setWalletBalance((prev) => prev + amount);
      setDepositAmount('');
      alert(`Mock deposit of ${amount} ETH completed!`);
    }
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700">
        <p className="text-sm">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const evmAddress = user?.wallet?.address ?? '0x0000000000000000000000000000000000000000';
  const displayPfp = profile.pfpUrl ?? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80';
  const displayBanner = profile.bannerUrl ?? 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80';

  // Filters catalog items matching favorites or wishlist
  const favoriteItems = CATALOG_PRODUCTS.filter((p) => profile.favorites.includes(p.id));
  const wishlistItems = CATALOG_PRODUCTS.filter((p) => profile.wishlist.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] font-sans text-gray-900">
      <Navigation variant="landing" landingTheme="surface" />

      <main className="flex-1 pb-16">
        {/* Cover Banner */}
        <div className="relative h-60 w-full overflow-hidden bg-zinc-200 sm:h-72">
          <img
            src={displayBanner}
            alt="Profile Banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Profile Header Box */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
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
                  <span className="text-gray-400">Joined {profile.since}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
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
                  <p className="text-sm font-bold text-gray-950 font-mono">{profile.followers}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Followers</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${user?.id}`)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Public Page
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout: Tabs Left, Content Right */}
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
            {/* Sidebar Tabs */}
            <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm flex flex-col gap-1">
              {[
                { id: 'favorites', label: 'Favorites', icon: Heart },
                { id: 'wallet', label: 'My Wallet', icon: Wallet },
                { id: 'brands', label: 'My Brands', icon: Briefcase },
                { id: 'wishlist', label: 'My Wishlist', icon: FolderHeart },
                { id: 'config', label: 'Account Config', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Dynamic Content Panel */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm min-h-[400px]">
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Favorite products and brands</h2>
                  <p className="text-xs text-gray-500 mb-6">Here are the products and designs you bookmarked in the marketplace.</p>

                  {favoriteItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                      <Heart className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm font-semibold">No favorites saved yet</p>
                      <p className="mt-1 text-xs text-gray-400">Bookmark items while exploring the marketplace.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {favoriteItems.map((product) => (
                        <div key={product.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <h4 className="mt-2 text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                          <p className="text-[10px] text-gray-500 font-semibold">{product.brandName}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{product.price}</span>
                            <button
                              type="button"
                              onClick={async () => {
                                const newFavs = profile.favorites.filter((id) => id !== product.id);
                                const res = await fetch('/api/profile', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: user?.id, favorites: newFavs }),
                                });
                                if (res.ok) setProfile(await res.json());
                              }}
                              className="text-red-500 hover:text-red-700 text-[10px] font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">My Privy Wallet</h2>
                  <p className="text-xs text-gray-500 mb-6">Manage mock transaction balances associated with your embedded Privy EVM account.</p>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-8">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">EVM Wallet Address</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="text-xs font-mono text-gray-800 break-all select-all">{evmAddress}</code>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-gray-500 hover:text-indigo-600"
                        aria-label="Copy Address"
                      >
                        {copiedAddress ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">ETH Balance</p>
                        <p className="mt-1 text-xl font-bold font-mono text-indigo-600">{walletBalance.toFixed(2)} ETH</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 border border-gray-200 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Network</p>
                        <p className="mt-1 text-xl font-bold text-zinc-700">L1X / Base Testnet</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-3">Simulate Mock Deposit</h3>
                  <form onSubmit={handleDeposit} className="flex gap-2 max-w-sm">
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      placeholder="0.5..."
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[#6e5dcb] px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5e4db8]"
                    >
                      Deposit Funds
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'brands' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">My Creator Brands</h2>
                  <p className="text-xs text-gray-500 mb-6">Collections and tokens you successfully launched on AWEBO.</p>

                  {userBrands.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                      <Briefcase className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm font-semibold">No brands launched yet</p>
                      <p className="mt-1 text-xs text-gray-400">Head over to the Brand Studio to sign and deploy your first contract.</p>
                      <button
                        type="button"
                        onClick={() => router.push('/launch')}
                        className="mt-4 rounded-lg bg-[#6e5dcb] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#5e4db8]"
                      >
                        Launch Brand Studio
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {userBrands.map((brand) => (
                        <div key={brand.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
                          <div className="relative h-20 bg-indigo-900/10">
                            {brand.bannerUrl && <img src={brand.bannerUrl} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900">{brand.brandName}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{brand.collectionName} (${brand.tokenSymbol})</p>
                              {brand.chain && <span className="inline-block rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold uppercase px-1.5 py-0.5 mt-2">{brand.chain}</span>}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-gray-800">MCAP {brand.marketCapUsd ? `$${(brand.marketCapUsd / 1000).toFixed(0)}K` : '$0K'}</span>
                              <Link
                                href={`/marketplace/brand/${brand.brandSlug}`}
                                className="text-xs font-bold text-indigo-600 no-underline hover:underline flex items-center gap-1"
                              >
                                View storefront
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">My Wishlist Config</h2>
                  <p className="text-xs text-gray-500 mb-6">Specify which items are displayed publicly on your public user page as giftable items.</p>

                  <h3 className="text-sm font-bold text-gray-900 mb-3">Add Products to Wishlist</h3>
                  <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-3">
                    {CATALOG_PRODUCTS.map((product) => {
                      const isAdded = profile.wishlist.includes(product.id);
                      return (
                        <button
                          type="button"
                          key={product.id}
                          onClick={() => toggleWishlistItem(product.id)}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            isAdded
                              ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-200'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="aspect-[4/5] rounded bg-gray-100 overflow-hidden relative mb-2">
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                            {isAdded && (
                              <span className="absolute right-1 top-1 rounded bg-indigo-600 text-white font-bold text-[8px] uppercase px-1.5 py-0.5">
                                Wishlisted
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[9px] text-gray-500 font-semibold">{product.brandName}</p>
                        </button>
                      );
                    })}
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-3">Current Public Wishlist</h3>
                  {wishlistItems.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No products added. Click products above to build your public wishlist.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="h-10 w-10 rounded object-cover" />
                            <div>
                              <p className="text-xs font-bold text-gray-950">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-semibold">{item.brandName}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleWishlistItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'config' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Account Configuration</h2>
                  <p className="text-xs text-gray-500 mb-6">Customize your display identity, bio details, cover banners, and PFPs.</p>

                  <form onSubmit={handleConfigSubmit} className="space-y-4 max-w-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="username" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                          Username
                        </label>
                        <input
                          id="username"
                          type="text"
                          required
                          value={usernameField}
                          onChange={(e) => setUsernameField(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={locationField}
                          onChange={(e) => setLocationField(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                        Biography / Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={bioField}
                        onChange={(e) => setBioField(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                        Website link
                      </label>
                      <input
                        id="website"
                        type="text"
                        placeholder="mybrand.com"
                        value={websiteField}
                        onChange={(e) => setWebsiteField(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pfp" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                          PFP Image URL
                        </label>
                        <input
                          id="pfp"
                          type="url"
                          placeholder="https://..."
                          value={pfpField}
                          onChange={(e) => setPfpField(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="banner" className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                          Banner Cover URL
                        </label>
                        <input
                          id="banner"
                          type="url"
                          placeholder="https://..."
                          value={bannerField}
                          onChange={(e) => setBannerField(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingConfig}
                      className="rounded-lg bg-[#6e5dcb] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5e4db8] disabled:opacity-60"
                    >
                      {savingConfig ? 'Saving...' : 'Save Configuration'}
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer variant="landing" />
    </div>
  );
}
