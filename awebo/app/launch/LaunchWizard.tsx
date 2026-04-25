'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  STEPS,
  BrandSetupStep,
  CatalogProductsStep,
  BrandContractStep,
  ReviewPublishStep,
} from './launch-steps';

export default function LaunchWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const draftSaved = '2m ago';

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
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="w-8 h-8 flex items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm">A</span>
            <span className="text-air-force-blue font-semibold tracking-tight text-lg">AWEBO</span>
            <span className="text-gray-500 font-medium text-sm ml-1">BRAND STUDIO</span>
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
        <aside className="w-56 border-r border-gray-200 py-8 px-6 shrink-0 hidden sm:block">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-3">Step {stepIndex + 1} of {STEPS.length}</p>
          <nav className="flex flex-col gap-1" aria-label="Brand studio steps">
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

        <main className="flex-1 min-w-0 py-8 px-4 sm:px-8">
          <div className="sm:hidden mb-6">
            <p className="text-xs font-semibold uppercase text-gray-400">Step {stepIndex + 1} of {STEPS.length}</p>
            <p className="text-sm font-medium text-gray-800">{currentStep.label}</p>
          </div>
          {stepIndex === 0 && (
            <BrandSetupStep onNext={goNext} onCancel={() => { window.location.href = '/'; }} />
          )}
          {stepIndex === 1 && <CatalogProductsStep onNext={goNext} onPrev={goPrev} />}
          {stepIndex === 2 && <BrandContractStep onNext={goNext} onPrev={goPrev} />}
          {stepIndex === 3 && <ReviewPublishStep onPrev={goPrev} />}
        </main>
      </div>

      <footer className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-gray-500">
          <span>AWEBO BRAND STUDIO V.1.0</span>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-500 hover:text-gray-700 no-underline">SUPPORT CENTER</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 no-underline">TERMS OF SERVICE</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
