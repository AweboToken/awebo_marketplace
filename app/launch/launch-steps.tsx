'use client';

import { useState } from 'react';

export const STEPS = [
  { id: 'profile', label: 'PROFILE', description: 'Tell the world who you are.' },
  { id: 'brand', label: 'BRAND', description: 'Define your brand identity and visual presence.' },
  { id: 'token', label: 'TOKEN', description: 'Define the engine of your brand economy. All prices in ETH.' },
  { id: 'merch', label: 'MERCH', description: 'Select base silhouettes and customize your phygital line.' },
  { id: 'review', label: 'REVIEW', description: 'Review and launch your brand.' },
] as const;

export function ProfileStep({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) {
  const [bio, setBio] = useState('');
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Create Creator Profile</h2>
      <p className="text-gray-600 mb-6 text-sm">Set up your identity in the AWEBO ecosystem.</p>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Brand Name</label>
          <input type="text" placeholder="Enter your brand name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Tagline</label>
          <input type="text" placeholder="A short phrase about your brand" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Creator Bio</label>
          <textarea placeholder="Tell your story..." value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 resize-none text-sm" />
          <p className="text-xs text-gray-500 mt-1">{bio.length} / 280</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium text-sm">Cancel</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">Continue</button>
      </div>
    </>
  );
}

export function BrandStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Brand Identity</h2>
      <p className="text-gray-600 mb-6 text-sm">Define your brand visual identity.</p>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-24 flex items-center justify-center text-gray-500 text-sm">Upload logo</div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Primary color</label>
          <input type="color" className="h-10 w-24 border border-gray-300 rounded cursor-pointer" defaultValue="#6FA7C5" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">← Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">Continue</button>
      </div>
    </>
  );
}

export function TokenStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [supply, setSupply] = useState('10000000');
  const [creatorAlloc, setCreatorAlloc] = useState(60);
  const treasuryAlloc = 100 - creatorAlloc;
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Token Configuration</h2>
      <p className="text-gray-600 mb-6 text-sm">Define your brand economy. All prices in ETH.</p>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-1">Total supply</label>
          <div className="flex items-center gap-2">
            <input type="text" value={supply} onChange={(e) => setSupply(e.target.value)} className="w-32 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm" />
            <span className="text-gray-600 text-sm">BRND</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Creator allocation</span>
            <span className="font-medium">{creatorAlloc}%</span>
          </div>
          <input type="range" min="0" max="100" value={creatorAlloc} onChange={(e) => setCreatorAlloc(Number(e.target.value))} className="w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">← Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">Continue</button>
      </div>
    </>
  );
}

export function MerchStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [apparel, setApparel] = useState<'hoodie' | 'tee' | 'cap'>('hoodie');
  const [kickstarterMinUsdt, setKickstarterMinUsdt] = useState('');
  const [kickstarterError, setKickstarterError] = useState('');
  const numMin = kickstarterMinUsdt.trim() === '' ? NaN : Number(kickstarterMinUsdt);
  const isValidMin = !Number.isNaN(numMin) && numMin > 0;
  const handleNext = () => {
    if (!isValidMin) {
      setKickstarterError(kickstarterMinUsdt.trim() === '' ? 'Required' : 'Enter a valid amount greater than 0');
      return;
    }
    setKickstarterError('');
    onNext();
  };
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Merch Setup</h2>
      <p className="text-gray-600 mb-6 text-sm">Select base silhouettes for your phygital line.</p>
      <div className="space-y-4 max-w-xl">
        <div className="space-y-3">
          {[
            { id: 'hoodie' as const, name: 'Oversized Hoodie', desc: '450GSM Organic Cotton' },
            { id: 'tee' as const, name: 'Boxy Tee', desc: '220GSM Jersey' },
            { id: 'cap' as const, name: 'Distressed Cap', desc: '6-Panel Cotton Twill' },
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setApparel(a.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm ${
                apparel === a.id ? 'border-air-force-blue bg-air-force-blue/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{a.name}</p>
                <p className="text-gray-600 text-xs">{a.desc}</p>
              </div>
              {apparel === a.id && <span className="ml-auto text-air-force-blue">✓</span>}
            </button>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Kickstarter minimum (USDT)</h3>
          <p className="text-xs text-gray-600 mb-2">Minimum amount in USDT that must be raised before printing starts.</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              placeholder="e.g. 5000"
              value={kickstarterMinUsdt}
              onChange={(e) => {
                setKickstarterMinUsdt(e.target.value);
                setKickstarterError('');
              }}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-air-force-blue focus:border-transparent ${
                kickstarterError ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="Kickstarter minimum in USDT"
              aria-invalid={!!kickstarterError}
              aria-describedby={kickstarterError ? 'kickstarter-min-error-modal' : undefined}
            />
            <span className="text-gray-500 text-sm font-medium shrink-0">USDT</span>
          </div>
          {kickstarterError && (
            <p id="kickstarter-min-error-modal" className="mt-1 text-xs text-red-600" role="alert">
              {kickstarterError}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">← Back</button>
        <button type="button" onClick={handleNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">Continue</button>
      </div>
    </>
  );
}

export function ReviewStep({ onPrev }: { onPrev: () => void }) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Launch</h2>
      <p className="text-gray-600 mb-6 text-sm">Review and launch your brand. All values in ETH.</p>
      <div className="max-w-xl space-y-4 rounded-xl border border-gray-200 p-4 text-sm">
        <section>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Profile & Brand</h3>
          <p className="text-gray-700">Creator profile and brand identity configured.</p>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Token</h3>
          <p className="text-gray-700">Base · Community Token · 10M BRND · 60% / 40%.</p>
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Merch</h3>
          <p className="text-gray-700">Oversized Hoodie · 0.012 ETH/unit.</p>
        </section>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">← Back</button>
        <button type="button" className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-2.5 text-sm">Launch Brand</button>
      </div>
    </>
  );
}
