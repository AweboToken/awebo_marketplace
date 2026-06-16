'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Coins, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useAuthModal } from '@/components/auth/AuthModalContext';

interface Campaign {
  id: string;
  brandName: string;
  ticker: string;
  story: string;
  banner: string;
  logo: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  supply: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    brandName: 'Pepe World',
    ticker: 'PEPE',
    story: 'Pioneering meme culture with premium streetwear. Design, logistics, and supply splits controlled directly by coin holders.',
    banner: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    raised: 78200,
    goal: 100000,
    backers: 342,
    daysLeft: 5,
    supply: '10,000,000',
  },
  {
    id: 'camp-2',
    brandName: 'Studio Norte',
    ticker: 'NORT',
    story: 'High-performance urban technical outerwear made from recycled plastics. Token holders vote on colorways and designs.',
    banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    raised: 24500,
    goal: 50000,
    backers: 128,
    daysLeft: 14,
    supply: '5,000,000',
  },
  {
    id: 'camp-3',
    brandName: 'Lumen Atelier',
    ticker: 'LUM',
    story: 'Minimalist designer furniture and high-quality ceramics. The first tokenized furniture collective with revenue share.',
    banner: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80',
    raised: 12500,
    goal: 80000,
    backers: 64,
    daysLeft: 22,
    supply: '8,000,000',
  },
];

export default function CrowdfundingSection() {
  const { authenticated } = usePrivy();
  const { openAuthModal } = useAuthModal();
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeSupport, setActiveSupport] = useState<Campaign | null>(null);
  const [supportAmount, setSupportAmount] = useState('');
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleSupportClick = (campaign: Campaign) => {
    if (!authenticated) {
      openAuthModal({ redirectPath: '/' });
      return;
    }
    setActiveSupport(campaign);
    setSupportSuccess(false);
    setSupportAmount('');
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(supportAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !activeSupport) return;

    setIsSupporting(true);
    // Simulate smart contract payment and signing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === activeSupport.id
          ? {
              ...c,
              raised: c.raised + amountNum,
              backers: c.backers + 1,
            }
          : c
      )
    );
    setIsSupporting(false);
    setSupportSuccess(true);
    setTimeout(() => {
      setActiveSupport(null);
      setSupportSuccess(false);
    }, 2000);
  };

  return (
    <section className="relative w-full border-t border-white/10 bg-[#070708] py-16 text-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="mb-10 max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Community Launches
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Crowdfunding brand launches
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 max-w-2xl">
            Support creators raising capital to launch digital tokens, street merch, and global logistics. Get exclusive early drops, governance tokens, and community shares.
          </p>
        </div>

        {/* Grid of Campaign Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
            return (
              <div
                key={campaign.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700"
              >
                {/* Banner image and status */}
                <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={campaign.banner}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#6e5dcb] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Crowdfund Active
                  </span>
                  <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white font-mono uppercase tracking-wider">
                    ${campaign.ticker}
                  </span>
                </div>

                {/* Details Section */}
                <div className="relative px-5 pb-5 pt-0 flex-1 flex flex-col">
                  {/* Creator Logo and Details */}
                  <div className="-mt-8 mb-4 flex items-end gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-4 border-zinc-900 bg-zinc-900 shadow-md">
                      <img src={campaign.logo} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 pb-1">
                      <p className="truncate text-base font-bold text-white">{campaign.brandName}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Studio Launch</p>
                    </div>
                  </div>

                  {/* Narrative story */}
                  <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3 mb-6">
                    {campaign.story}
                  </p>

                  <div className="mt-auto space-y-4">
                    {/* Progress details */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-zinc-400">Total Raised</span>
                        <span className="font-mono text-white">
                          ${campaign.raised.toLocaleString()} <span className="text-zinc-500">/ ${campaign.goal.toLocaleString()}</span>
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg shadow-indigo-500/50"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
                        <span>{progress}% funded</span>
                        <span className="text-[#8b9cff]">{100 - progress}% remaining</span>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 text-center">
                      <div>
                        <div className="flex justify-center text-zinc-500 mb-0.5">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs font-bold font-mono text-white">{campaign.backers}</p>
                        <p className="text-[9px] text-zinc-500 font-semibold uppercase">Backers</p>
                      </div>
                      <div>
                        <div className="flex justify-center text-zinc-500 mb-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs font-bold font-mono text-white">{campaign.daysLeft}</p>
                        <p className="text-[9px] text-zinc-500 font-semibold uppercase">Days Left</p>
                      </div>
                      <div>
                        <div className="flex justify-center text-zinc-500 mb-0.5">
                          <Coins className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-xs font-bold font-mono text-white">{campaign.supply}</p>
                        <p className="text-[9px] text-zinc-500 font-semibold uppercase">Supply</p>
                      </div>
                    </div>

                    {/* Support Button */}
                    <button
                      type="button"
                      onClick={() => handleSupportClick(campaign)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6e5dcb] py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#5e4db8]"
                    >
                      Back Brand Campaign
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* backing / supporting modal */}
        <AnimatePresence>
          {activeSupport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
              >
                {supportSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Backing Confirmed!</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                      Successfully contributed mock funds and signed transaction via Privy EVM wallet.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Back {activeSupport.brandName}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Deploy mock payment to support this culture-backed launch. You will receive ${activeSupport.ticker} governance shares upon launch.
                    </p>

                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="amount" className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">
                          Support Amount (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-500 text-sm">$</span>
                          <input
                            id="amount"
                            type="number"
                            required
                            min="1"
                            placeholder="100..."
                            value={supportAmount}
                            onChange={(e) => setSupportAmount(e.target.value)}
                            className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-8 pr-4 text-sm font-mono text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveSupport(null)}
                          className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSupporting}
                          className="rounded-xl bg-[#6e5dcb] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5e4db8] disabled:opacity-60"
                        >
                          {isSupporting ? 'Signing transaction...' : 'Confirm Backing'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
