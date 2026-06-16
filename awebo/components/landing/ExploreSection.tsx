'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock products/cards data for standard filters
const MOCK_PRODUCTS = {
  NEW: [
    {
      id: 'p-new-1',
      name: 'Organic heavyweight tee',
      brandName: 'Studio Norte',
      price: '$48.00',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80',
      mcap: '$240K',
      badge: 'New',
    },
    {
      id: 'p-new-2',
      name: 'Wool wrap coat',
      brandName: 'Lumen Atelier',
      price: '$220.00',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
      mcap: '$580K',
      badge: 'New',
    },
    {
      id: 'p-new-3',
      name: 'Minimalist leather backpack',
      brandName: 'Objeto',
      price: '$180.00',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
      mcap: '$120K',
      badge: 'New',
    },
    {
      id: 'p-new-4',
      name: 'Utility track pants',
      brandName: 'Studio Norte',
      price: '$95.00',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&q=80',
      mcap: '$240K',
      badge: 'New',
    },
  ],
  Memes: [
    {
      id: 'p-meme-1',
      name: 'Pepe Viking Classic T-shirt',
      brandName: 'Pepe Collection',
      price: '$40.99',
      image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&q=80',
      mcap: '$890K',
      badge: 'Meme',
    },
    {
      id: 'p-meme-2',
      name: 'Pepe Embroidered Bucket Hat',
      brandName: 'Pepe Collection',
      price: '$18.25',
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=500&q=80',
      mcap: '$890K',
      badge: 'Meme',
    },
    {
      id: 'p-meme-3',
      name: 'AWEBO Willow Ptarmigan Tee',
      brandName: 'Awebo Chileno',
      price: '$48.99',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80',
      mcap: '$450K',
      badge: 'Meme',
    },
    {
      id: 'p-meme-4',
      name: 'Broken Heart Socks',
      brandName: 'Pepe Collection',
      price: '$12.00',
      image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80',
      mcap: '$890K',
      badge: 'Meme',
    },
  ],
  Trendy: [
    {
      id: 'p-trend-1',
      name: 'Distressed denim jacket',
      brandName: 'Mar Factory',
      price: '$120.00',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
      mcap: '$310K',
      badge: 'Trendy',
    },
    {
      id: 'p-trend-2',
      name: 'Leather weekender duffle bag',
      brandName: 'Studio Norte',
      price: '$198.00',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
      mcap: '$240K',
      badge: 'Trendy',
    },
    {
      id: 'p-trend-3',
      name: 'Silver chain bracelet',
      brandName: 'Lumen Atelier',
      price: '$75.00',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
      mcap: '$580K',
      badge: 'Trendy',
    },
    {
      id: 'p-trend-4',
      name: 'Minimal canvas sneakers',
      brandName: 'Lumen Atelier',
      price: '$142.00',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
      mcap: '$580K',
      badge: 'Trendy',
    },
  ],
};

// Mock Token Data for Market Cap Table
const MOCK_TOKENS = [
  {
    name: 'kickflip',
    ticker: 'KICK',
    address: '0x778F_7667DE',
    fullAddress: '0x778F1234567890abcdef1234567890abcdef7667DE',
    status: 'Public',
    change24h: 12.4,
    mcap: '$240.50K',
    ath: '$0.00',
    age: '2d',
    txns: '142',
    vol24h: '$12.30K',
    traders: '85',
    sparkline: 'M0,15 Q15,5 30,22 T60,8 T90,2 Q105,10 120,5',
  },
  {
    name: 'Tigre Turbinas',
    ticker: 'TITU',
    address: '0x53f0_93d3BF',
    fullAddress: '0x53f01234567890abcdef1234567890abcdef93d3BF',
    status: 'Public',
    change24h: -4.2,
    mcap: '$180.20K',
    ath: '$0.00',
    age: '12d',
    txns: '98',
    vol24h: '$8.40K',
    traders: '45',
    sparkline: 'M0,8 Q15,22 30,12 T60,25 T90,20 Q105,10 120,18',
  },
  {
    name: 'AWEBO CHILENO',
    ticker: 'AWEC',
    address: '0x8aBf_16DF96',
    fullAddress: '0x8aBf1234567890abcdef1234567890abcdef16DF96',
    status: 'Public',
    change24h: 28.9,
    mcap: '$450.00K',
    ath: '$0.00',
    age: '1d',
    txns: '512',
    vol24h: '$45.20K',
    traders: '312',
    sparkline: 'M0,22 Q15,18 30,10 T60,15 T90,8 Q105,2 120,0',
  },
  {
    name: 'MINd Eco',
    ticker: 'ECO',
    address: '0x53A7_eb696E',
    fullAddress: '0x53A71234567890abcdef1234567890abcdefeb696E',
    status: 'Private',
    change24h: 1.8,
    mcap: '$28.60K',
    fullMcap: '$28.60K',
    ath: '$0.00',
    age: '5d',
    txns: '12',
    vol24h: '$0.00',
    traders: '4',
    sparkline: 'M0,15 Q15,14 30,12 T60,13 T90,15 Q105,10 120,8',
  },
  {
    name: 'grande chile',
    ticker: 'GCL',
    address: '0x1A18_d1f571',
    fullAddress: '0x1A181234567890abcdef1234567890abcdefd1f571',
    status: 'Public',
    change24h: -15.4,
    mcap: '$4.28K',
    ath: '$0.00',
    age: '14d',
    txns: '45',
    vol24h: '$1.20K',
    traders: '18',
    sparkline: 'M0,5 Q15,12 30,18 T60,24 T90,20 Q105,25 120,28',
  },
  {
    name: 'Ultimate Pepe',
    ticker: 'UPEPE',
    address: '0x9c3d_8D234A',
    fullAddress: '0x9c3d1234567890abcdef1234567890abcdef8D234A',
    status: 'Public',
    change24h: 85.6,
    mcap: '$890.30K',
    ath: '$0.00',
    age: '3h',
    txns: '1240',
    vol24h: '$120.40K',
    traders: '840',
    sparkline: 'M0,28 Q15,20 30,10 T60,12 T90,4 Q105,2 120,0',
  },
];

export default function ExploreSection() {
  const [activeFilter, setActiveFilter] = useState<'NEW' | 'Memes' | 'Trendy' | 'Market Cap'>('NEW');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <section className="relative w-full border-t border-white/10 bg-[#070708] py-16 text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row with Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
              <span>/</span>
              <span className="text-zinc-300">Explore</span>
            </nav>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-white">
              Explore brand new
            </h2>
          </div>

          {/* Filters List */}
          <div className="flex flex-wrap gap-2 md:self-end">
            {(['NEW', 'Memes', 'Trendy', 'Market Cap'] as const).map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'bg-[#1e2eb8] text-white shadow-lg shadow-blue-900/35 ring-1 ring-blue-500/20'
                      : 'border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display Area with AnimatePresence */}
        <div className="relative min-h-[300px] w-full">
          <AnimatePresence mode="wait">
            {activeFilter !== 'Market Cap' ? (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {MOCK_PRODUCTS[activeFilter].map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 p-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700/80"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        {product.badge}
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-zinc-300 font-mono">
                        MCap {product.mcap}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs text-zinc-500 font-semibold">{product.brandName}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-bold font-mono text-zinc-100">{product.price}</span>
                        <Link
                          href={`/marketplace`}
                          className="rounded-lg bg-zinc-800/80 hover:bg-indigo-600 p-1.5 transition-colors"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="market-cap-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 shadow-lg">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">24H VOLUME</p>
                    <p className="mt-2 text-2xl font-bold font-mono text-orange-500">$0.00</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 shadow-lg">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">24H TX</p>
                    <p className="mt-2 text-2xl font-bold font-mono text-orange-500">0</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 shadow-lg">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">TOKENS CREATED</p>
                    <p className="mt-2 text-2xl font-bold font-mono text-orange-500">12</p>
                  </div>
                </div>

                {/* Table Title */}
                <h3 className="text-xl font-bold text-white mb-4">All Tokens</h3>

                {/* Tokens Table Container */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-md">
                  <table className="w-full border-collapse text-left text-sm text-zinc-300">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <th className="px-4 py-3">COIN</th>
                        <th className="px-4 py-3">GRAPH</th>
                        <th className="px-4 py-3 text-right">MCAP</th>
                        <th className="px-4 py-3 text-right">ATH</th>
                        <th className="px-4 py-3 text-center">AGE</th>
                        <th className="px-4 py-3 text-center">TXNS</th>
                        <th className="px-4 py-3 text-right">24H VOL</th>
                        <th className="px-4 py-3 text-center">TRADERS</th>
                        <th className="px-4 py-3 text-right">24H %</th>
                        <th className="px-4 py-3 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-medium">
                      {MOCK_TOKENS.map((token, idx) => {
                        const positive = token.change24h >= 0;
                        const isCopied = copiedId === token.name;
                        return (
                          <tr key={token.name} className="hover:bg-zinc-900/25 transition-colors">
                            {/* Coin Name & Address */}
                            <td className="px-4 py-4.5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                                  {token.ticker.slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white truncate text-xs sm:text-sm">{token.name}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold">({token.ticker})</span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[10px] font-mono text-zinc-500">{token.address}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(token.fullAddress, token.name)}
                                      className="text-zinc-600 hover:text-white transition-colors"
                                      aria-label="Copy Address"
                                    >
                                      {isCopied ? (
                                        <Check className="h-3 w-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Mini Sparkline Graph */}
                            <td className="px-4 py-4.5">
                              <svg className="h-6 w-24 overflow-visible" aria-hidden>
                                <path
                                  d={token.sparkline}
                                  fill="none"
                                  stroke={positive ? '#34d399' : '#f87171'}
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </td>

                            {/* Mcap */}
                            <td className="px-4 py-4.5 text-right font-mono text-xs sm:text-sm text-white">{token.mcap}</td>
                            
                            {/* ATH */}
                            <td className="px-4 py-4.5 text-right font-mono text-xs text-zinc-400">{token.ath}</td>
                            
                            {/* Age */}
                            <td className="px-4 py-4.5 text-center text-xs text-zinc-400">{token.age}</td>
                            
                            {/* Txns */}
                            <td className="px-4 py-4.5 text-center font-mono text-xs text-zinc-300">{token.txns}</td>
                            
                            {/* 24h Vol */}
                            <td className="px-4 py-4.5 text-right font-mono text-xs text-zinc-300">{token.vol24h}</td>
                            
                            {/* Traders */}
                            <td className="px-4 py-4.5 text-center font-mono text-xs text-zinc-300">{token.traders}</td>

                            {/* 24h change */}
                            <td className="px-4 py-4.5 text-right">
                              <span className={`inline-flex items-center font-mono text-xs sm:text-sm ${
                                positive ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {positive ? '+' : ''}
                                {token.change24h}%
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4.5 text-center">
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                token.status === 'Public'
                                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                              }`}>
                                {token.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
