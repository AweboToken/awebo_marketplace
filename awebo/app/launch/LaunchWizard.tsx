'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import Navigation from '@/components/Navigation';
import ScrollingRoomBackground from '@/components/landing/ScrollingRoomBackground';
import { useLaunchDraftAutosave } from '@/hooks/useLaunchDraftAutosave';
import {
  launchWizardBackgroundForStep,
  LAUNCH_WIZARD_PANEL_MAX_H,
} from '@/lib/launch-wizard-backgrounds';
import {
  LAUNCH_GLASS_CONTENT,
  LAUNCH_GLASS_PANEL,
} from '@/lib/launch-wizard-ui';
import {
  DEFAULT_LAUNCH_WIZARD_VALUES,
  type LaunchWizardValues,
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

const LAUNCH_STEP_TRANSITION = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

const launchStepMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function saveStateLabel(state: string): string | null {
  switch (state) {
    case 'loading':
      return 'Loading draft…';
    case 'saving':
      return 'Saving…';
    case 'saved':
      return 'Saved';
    case 'error':
      return 'Save failed';
    default:
      return null;
  }
}

export default function LaunchWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<LaunchWizardValues>(DEFAULT_LAUNCH_WIZARD_VALUES);
  const [productPrices, setProductPrices] = useState<Record<string, string>>({});

  const onHydrate = useCallback(
    (payload: {
      stepIndex: number;
      values: LaunchWizardValues;
      productPrices: Record<string, string>;
    }) => {
      setStepIndex(payload.stepIndex);
      setValues(payload.values);
      setProductPrices(payload.productPrices);
    },
    []
  );

  const { saveState, saveOnStepChange, ownerId } = useLaunchDraftAutosave({
    stepIndex,
    values,
    productPrices,
    onHydrate,
  });

  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const saveLabel = saveStateLabel(saveState);

  const onChange = useCallback((patch: LaunchWizardValuesPatch) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const goToStep = useCallback(
    (nextIndex: number) => {
      setStepIndex(nextIndex);
      saveOnStepChange(nextIndex);
    },
    [saveOnStepChange]
  );

  const goNext = () => {
    if (!isLast) goToStep(stepIndex + 1);
  };

  const goPrev = () => {
    if (!isFirst) goToStep(stepIndex - 1);
  };

  const stepProps = { values, onChange };

  const stepBackground = launchWizardBackgroundForStep(stepIndex);
  const panelClassName = `${LAUNCH_GLASS_PANEL} ${LAUNCH_WIZARD_PANEL_MAX_H} overflow-y-auto`;

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      <ScrollingRoomBackground
        imageSrc={stepBackground}
        blurClassName=""
        crossfadeOnChange
      />
      <Navigation variant="landing" landingTheme="overlay" />

      <div className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_minmax(280px,340px)] gap-6 lg:gap-8 xl:gap-10 lg:items-start">
          {/* Left — step navigation */}
          <aside className={`lg:sticky lg:top-28 lg:self-start order-1 p-4 sm:p-5 ${panelClassName}`}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                Step {stepIndex + 1} of {STEPS.length}
              </p>
              {saveLabel ? (
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${
                    saveState === 'error' ? 'text-red-300' : 'text-white/50'
                  }`}
                  aria-live="polite"
                >
                  {saveLabel}
                </span>
              ) : null}
            </div>
            <nav className="flex flex-col gap-1" aria-label="Launch wizard steps">
              {STEPS.map((step, i) => {
                const isActive = i === stepIndex;
                const isComplete = i < stepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(i)}
                    className={`text-left rounded-xl px-3 py-3 transition-colors border ${
                      isActive
                        ? 'border-air-force-blue/40 bg-air-force-blue/20 text-white'
                        : isComplete
                          ? 'border-transparent text-white/90 hover:bg-white/10'
                          : 'border-transparent text-white/65 hover:bg-white/10 hover:text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-air-force-blue text-white'
                            : isComplete
                              ? 'bg-air-force-blue/20 text-air-force-blue'
                              : 'bg-white/15 text-white/70'
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
            <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4 hidden lg:block">
              <p className="text-xs font-semibold uppercase text-white/60 mb-1">
                Current step
              </p>
              <p className="text-sm font-medium text-white">{currentStep.label}</p>
              <p className="text-xs text-white/70 mt-2 text-pretty leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </aside>

          {/* Center — form */}
          <main
            className={`order-2 min-w-0 lg:sticky lg:top-28 lg:self-start p-6 sm:p-8 ${panelClassName} ${LAUNCH_GLASS_CONTENT}`}
          >
            <div className="lg:hidden mb-6 pb-4 border-b border-white/15">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-violet-200/90">
                  Step {stepIndex + 1} of {STEPS.length}
                </p>
                {saveLabel ? (
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${
                      saveState === 'error' ? 'text-red-300' : 'text-white/50'
                    }`}
                    aria-live="polite"
                  >
                    {saveLabel}
                  </span>
                ) : null}
              </div>
              <p className="text-sm font-medium text-white mt-1">{currentStep.label}</p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep.id}
                initial={launchStepMotion.initial}
                animate={launchStepMotion.animate}
                exit={launchStepMotion.exit}
                transition={LAUNCH_STEP_TRANSITION}
                className="motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:!transition-none"
              >
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
                  <ReviewPublishStep
                    {...stepProps}
                    onPrev={goPrev}
                    ownerId={ownerId}
                    productPrices={productPrices}
                    onPricesChange={setProductPrices}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Right — live preview */}
          <aside
            className={`order-3 hidden lg:block lg:sticky lg:top-28 lg:self-start ${panelClassName}`}
          >
            <BrandLaunchPreview values={values} stepIndex={stepIndex} embedded />
          </aside>
        </div>

        {/* Mobile preview below form */}
        <div className="mt-6 lg:hidden">
          <div className={panelClassName}>
            <BrandLaunchPreview values={values} stepIndex={stepIndex} embedded />
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-auto shrink-0 border-t border-white/15 bg-black/25 py-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/70">
          <span>AWEBO BRAND STUDIO V.1.0</span>
          <div className="flex gap-6">
            <Link href="/hq/room-14" className="text-white/80 hover:text-white no-underline">
              Support
            </Link>
            <Link href="/terms" className="text-white/80 hover:text-white no-underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
