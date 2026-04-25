'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  STEPS,
  BrandSetupStep,
  CatalogProductsStep,
  BrandContractStep,
  ReviewPublishStep,
} from './launch-steps';

type LaunchWizardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LaunchWizardModal({ isOpen, onClose }: LaunchWizardModalProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-wizard-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
              <span className="w-8 h-8 flex items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm">A</span>
              <span className="text-air-force-blue font-semibold text-lg">AWEBO</span>
            </Link>
            <span className="text-gray-400 shrink-0">·</span>
            <h1 id="launch-wizard-title" className="text-sm font-medium text-gray-700 truncate">
              Step {stepIndex + 1} of {STEPS.length}: {currentStep.label}
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue shrink-0"
            aria-label="Close"
          >
            <span className="text-xl leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>

        <div className="px-6 pt-2 shrink-0">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= stepIndex ? 'bg-air-force-blue' : 'bg-gray-200'
                }`}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto shrink min-h-0 overscroll-contain">
          {stepIndex === 0 && (
            <BrandSetupStep
              onNext={goNext}
              onCancel={() => {
                onClose();
                window.location.href = '/';
              }}
            />
          )}
          {stepIndex === 1 && <CatalogProductsStep onNext={goNext} onPrev={goPrev} />}
          {stepIndex === 2 && <BrandContractStep onNext={goNext} onPrev={goPrev} />}
          {stepIndex === 3 && <ReviewPublishStep onPrev={goPrev} />}
        </div>
      </div>
    </div>
  );
}
