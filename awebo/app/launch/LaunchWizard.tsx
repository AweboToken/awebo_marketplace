'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import Navigation from '@/components/Navigation';
import {
  DEFAULT_LAUNCH_WIZARD_VALUES,
  type LaunchWizardValuesPatch,
} from '@/lib/launch-wizard-types';
import BrandLaunchPreview from './BrandLaunchPreview';
import {
  STEPS,
  BrandSetupStep,
  CatalogProductsStep,
  BrandContractStep,
  ReviewPublishStep,
} from './launch-steps';

export default function LaunchWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState(DEFAULT_LAUNCH_WIZARD_VALUES);

  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const onChange = useCallback((patch: LaunchWizardValuesPatch) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const goNext = () => {
    if (!isLast) setStepIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  const stepProps = { values, onChange };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <Navigation variant="landing" landingTheme="surface" />

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_minmax(280px,340px)] gap-6 lg:gap-8 xl:gap-10">
          {/* Left — step navigation */}
          <aside className="lg:sticky lg:top-24 lg:self-start order-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <nav className="flex flex-col gap-1" aria-label="Launch wizard steps">
              {STEPS.map((step, i) => {
                const isActive = i === stepIndex;
                const isComplete = i < stepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setStepIndex(i)}
                    className={`text-left rounded-xl px-3 py-3 transition-colors border ${
                      isActive
                        ? 'border-air-force-blue/30 bg-air-force-blue/10 text-air-force-blue'
                        : isComplete
                          ? 'border-transparent text-gray-800 hover:bg-white'
                          : 'border-transparent text-gray-500 hover:bg-white hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-air-force-blue text-white'
                            : isComplete
                              ? 'bg-air-force-blue/20 text-air-force-blue'
                              : 'bg-gray-200 text-gray-600'
                        }`}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold leading-tight">
                        {step.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-6 rounded-xl border border-air-force-blue/20 bg-air-force-blue/5 p-4 hidden lg:block">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                Current step
              </p>
              <p className="text-sm font-medium text-gray-900">{currentStep.label}</p>
              <p className="text-xs text-gray-600 mt-2 text-pretty leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </aside>

          {/* Center — form */}
          <main className="order-2 min-w-0">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
              <div className="lg:hidden mb-6 pb-4 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase text-air-force-blue">
                  Step {stepIndex + 1} of {STEPS.length}
                </p>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {currentStep.label}
                </p>
              </div>

              {stepIndex === 0 && (
                <BrandSetupStep
                  {...stepProps}
                  onNext={goNext}
                  onCancel={() => {
                    window.location.href = '/';
                  }}
                />
              )}
              {stepIndex === 1 && (
                <CatalogProductsStep {...stepProps} onNext={goNext} onPrev={goPrev} />
              )}
              {stepIndex === 2 && (
                <BrandContractStep {...stepProps} onNext={goNext} onPrev={goPrev} />
              )}
              {stepIndex === 3 && (
                <ReviewPublishStep {...stepProps} onPrev={goPrev} />
              )}
            </div>
          </main>

          {/* Right — live preview */}
          <aside className="order-3 lg:order-3 hidden lg:block">
            <BrandLaunchPreview values={values} stepIndex={stepIndex} />
          </aside>
        </div>

        {/* Mobile preview below form */}
        <div className="mt-6 lg:hidden">
          <BrandLaunchPreview values={values} stepIndex={stepIndex} />
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-4 mt-auto shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <span>AWEBO BRAND STUDIO V.1.0</span>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-500 hover:text-gray-700 no-underline">
              Support
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 no-underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
