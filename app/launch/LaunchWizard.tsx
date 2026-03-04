'use client';

import Link from 'next/link';
import { useState } from 'react';

const STEPS = [
  { id: 'profile', label: 'PROFILE', description: 'Tell the world who you are. This information will be public on your creator profile.' },
  { id: 'brand', label: 'BRAND', description: 'Define your brand identity and visual presence.' },
  { id: 'token', label: 'TOKEN', description: 'Define the engine of your brand economy. All prices in ETH.' },
  { id: 'merch', label: 'MERCH', description: 'Select base silhouettes and customize your phygital line.' },
  { id: 'review', label: 'REVIEW', description: 'Review and launch your brand.' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

export default function LaunchWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [draftSaved, setDraftSaved] = useState<string | null>('2m ago');

  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="w-8 h-8 flex items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm">A</span>
            <span className="text-air-force-blue font-semibold tracking-tight text-lg">AWEBO</span>
            <span className="text-gray-500 font-medium text-sm ml-1">CREATOR STUDIO</span>
          </Link>
          <div className="flex items-center gap-4">
            {draftSaved && (
              <span className="text-gray-500 text-sm">Draft saved {draftSaved}</span>
            )}
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium uppercase no-underline"
            >
              EXIT
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left sidebar - steps */}
        <aside className="w-56 border-r border-gray-200 py-8 px-6 shrink-0">
          <nav className="flex flex-col gap-1" aria-label="Launch steps">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(i)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === stepIndex
                    ? 'bg-air-force-blue/10 text-air-force-blue'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {step.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 p-3 rounded-lg bg-air-force-blue/5 border border-air-force-blue/20">
            <p className="text-xs font-medium uppercase text-gray-500 mb-1">Current step</p>
            <p className="text-sm text-gray-700">{currentStep.description}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8 px-8">
          {stepIndex === 0 && (
            <ProfileStep onNext={goNext} onCancel={() => window.location.href = '/'} />
          )}
          {stepIndex === 1 && (
            <BrandStep onNext={goNext} onPrev={goPrev} />
          )}
          {stepIndex === 2 && (
            <TokenStep onNext={goNext} onPrev={goPrev} />
          )}
          {stepIndex === 3 && (
            <MerchStep onNext={goNext} onPrev={goPrev} />
          )}
          {stepIndex === 4 && (
            <ReviewStep onPrev={goPrev} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-gray-500">
          <span>AWEBO CREATOR ONBOARDING V.1.0</span>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-500 hover:text-gray-700 no-underline">SUPPORT CENTER</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 no-underline">TERMS OF SERVICE</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProfileStep({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }) {
  const [bio, setBio] = useState('');
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Creator Profile</h1>
      <p className="text-gray-600 mb-8">Set up your identity in the AWEBO ecosystem. You can edit these details later.</p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Profile Banner</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center gap-2 text-gray-500">
            <span className="text-2xl">📷</span>
            <span>Upload 1500×500px banner</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Avatar</label>
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl">
            👤
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Brand Name</label>
          <input type="text" placeholder="Enter your brand name" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Tagline</label>
          <input type="text" placeholder="A short, catchy phrase about your brand" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Creator Bio</label>
          <textarea placeholder="Tell your story, your vision, and what your community can expect..." value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 resize-none" />
          <p className="text-xs text-gray-500 mt-1">{bio.length} / 280 CHARACTERS</p>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Social Connections</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="url" placeholder="Twitter Profile" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400" />
            <input type="url" placeholder="Instagram Profile" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 max-w-2xl">
        <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium">
          CANCEL SETUP
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-3 flex items-center gap-2 hover:bg-air-force-blue/90">
          Continue <span>→</span>
        </button>
      </div>
    </>
  );
}

function BrandStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Identity</h1>
      <p className="text-gray-600 mb-8">Define your brand visual identity.</p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-gray-500">Upload logo</div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase text-gray-500 mb-2">Primary color</label>
          <input type="color" className="h-10 w-24 border border-gray-300 rounded cursor-pointer" defaultValue="#6FA7C5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 max-w-2xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-3">Continue</button>
      </div>
    </>
  );
}

function TokenStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [supply, setSupply] = useState('10000000');
  const [creatorAlloc, setCreatorAlloc] = useState(60);
  const [treasuryAlloc, setTreasuryAlloc] = useState(40);
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Token Configuration</h1>
      <p className="text-gray-600 mb-8">Define the engine of your brand economy. Select your network and token structure. All prices in ETH.</p>

      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-700 mb-3">Select network</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Ethereum', 'Base', 'Solana', 'Polygon'].map((name, i) => (
              <div
                key={name}
                className={`p-4 rounded-xl border-2 text-center ${
                  name === 'Base' ? 'border-air-force-blue bg-air-force-blue/5' : 'border-gray-200 bg-gray-50 opacity-75'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-700 mb-3">Token purpose</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Community Token', desc: 'Designed for growth and social signaling.', active: true },
              { name: 'Access Token', desc: 'Utility-focused for physical products and gated experiences.', active: false },
              { name: 'Utility Token', desc: 'Transactional for loyalty and in-app services.', active: false },
              { name: 'Governance Token', desc: 'Vote on designs and collection directions.', active: false },
            ].map((t) => (
              <div key={t.name} className={`p-4 rounded-xl border-2 ${t.active ? 'border-air-force-blue bg-air-force-blue/5' : 'border-gray-200'}`}>
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-700 mb-3">Total supply</h2>
          <div className="flex flex-wrap items-center gap-4">
            <input type="text" value={supply} onChange={(e) => setSupply(e.target.value)} className="w-40 border border-gray-300 rounded-lg px-4 py-3 text-gray-900" />
            <span className="text-gray-600">BRND</span>
            <div className="px-4 py-2 rounded-lg bg-gray-100 text-sm">
              <span className="text-gray-500">Estimated gas </span>
              <span className="font-medium text-gray-900">0.0042 ETH</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Creator allocation</span>
                <span className="font-medium">{creatorAlloc}%</span>
              </div>
              <input type="range" min="0" max="100" value={creatorAlloc} onChange={(e) => { setCreatorAlloc(Number(e.target.value)); setTreasuryAlloc(100 - Number(e.target.value)); }} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Treasury (Ecosystem Fund)</span>
                <span className="font-medium">{treasuryAlloc}%</span>
              </div>
              <input type="range" min="0" max="100" value={treasuryAlloc} readOnly className="w-full opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 max-w-2xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-3">Continue</button>
      </div>
    </>
  );
}

function MerchStep({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Merch Setup</h1>
      <p className="text-gray-600 mb-8">Select base silhouettes and customize your phygital line. Base cost in ETH.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="space-y-6 flex-1 max-w-xl">
          <div>
            <h2 className="text-sm font-semibold uppercase text-gray-700 mb-3">Select apparel</h2>
            <div className="space-y-3">
              {[
                { id: 'hoodie' as const, name: 'Oversized Hoodie', desc: 'Premium 450GSM Organic Cotton' },
                { id: 'tee' as const, name: 'Boxy Tee', desc: 'Heavyweight 220GSM Jersey' },
                { id: 'cap' as const, name: 'Distressed Cap', desc: '6-Panel Cotton Twill' },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setApparel(a.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left ${
                    apparel === a.id ? 'border-air-force-blue bg-air-force-blue/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{a.name}</p>
                    <p className="text-sm text-gray-600">{a.desc}</p>
                  </div>
                  {apparel === a.id && <span className="ml-auto text-air-force-blue">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase text-gray-700 mb-3">Kickstarter minimum (USDT)</h2>
            <p className="text-sm text-gray-600 mb-2">Minimum amount in USDT that must be raised before printing starts.</p>
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
                className={`flex-1 rounded-lg border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-air-force-blue focus:border-transparent ${
                  kickstarterError ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-label="Kickstarter minimum in USDT"
                aria-invalid={!!kickstarterError}
                aria-describedby={kickstarterError ? 'kickstarter-min-error' : undefined}
              />
              <span className="text-gray-500 font-medium shrink-0">USDT</span>
            </div>
            {kickstarterError && (
              <p id="kickstarter-min-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {kickstarterError}
              </p>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <p><span className="text-gray-500">Base cost:</span> <span className="font-medium">0.012 ETH / unit</span></p>
            <p><span className="text-gray-500">Production time:</span> <span className="font-medium">14 Days</span></p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">SAVE DRAFT</button>
          </div>
        </div>
        <div className="flex-1 max-w-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">LIVE PREVIEW</h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 aspect-square max-h-80 flex items-center justify-center">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center text-gray-500">
              DRAG & DROP LOGO
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="button" className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium">FRONT VIEW</button>
            <button type="button" className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium">BACK VIEW</button>
            <button type="button" className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium">DETAIL</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 max-w-2xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
        <button type="button" onClick={handleNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-3">Continue</button>
      </div>
    </>
  );
}

function ReviewStep({ onPrev }: { onPrev: () => void }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Review & Launch</h1>
      <p className="text-gray-600 mb-8">Review your creator profile, token, and merch. All values in ETH.</p>

      <div className="max-w-2xl space-y-6 rounded-xl border border-gray-200 p-6">
        <section>
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Profile & Brand</h2>
          <p className="text-gray-700">Creator profile and brand identity configured.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Token</h2>
          <p className="text-gray-700">Base network · Community Token · 10,000,000 BRND · 60% / 40% allocation.</p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Merch</h2>
          <p className="text-gray-700">Oversized Hoodie · 0.012 ETH/unit.</p>
        </section>
      </div>

      <div className="flex items-center justify-between mt-12 max-w-2xl">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium">← Back</button>
        <button type="button" className="rounded-lg bg-air-force-blue text-white font-semibold px-8 py-3">Launch Brand</button>
      </div>
    </>
  );
}
