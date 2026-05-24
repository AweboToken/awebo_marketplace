'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  DEFAULT_LAUNCH_WIZARD_VALUES,
  type LaunchWizardValues,
} from '@/lib/launch-wizard-types';
import {
  fetchLaunchDraft,
  getOrCreateLaunchDraftOwnerId,
  saveLaunchDraft,
} from '@/lib/launch-draft-client';

type SaveState = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

type UseLaunchDraftAutosaveOptions = {
  stepIndex: number;
  values: LaunchWizardValues;
  productPrices: Record<string, string>;
  onHydrate: (payload: {
    stepIndex: number;
    values: LaunchWizardValues;
    productPrices: Record<string, string>;
  }) => void;
};

export function useLaunchDraftAutosave({
  stepIndex,
  values,
  productPrices,
  onHydrate,
}: UseLaunchDraftAutosaveOptions) {
  const { user, ready } = usePrivy();
  const ownerId = getOrCreateLaunchDraftOwnerId(user?.id);
  const [saveState, setSaveState] = useState<SaveState>('loading');
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const onHydrateRef = useRef(onHydrate);

  useEffect(() => {
    onHydrateRef.current = onHydrate;
  }, [onHydrate]);

  useEffect(() => {
    if (!ready || hydratedRef.current) return;

    let cancelled = false;

    const load = async () => {
      setSaveState('loading');
      const draft = await fetchLaunchDraft(ownerId);
      if (cancelled) return;

      if (draft) {
        onHydrateRef.current({
          stepIndex: draft.stepIndex,
          values: { ...DEFAULT_LAUNCH_WIZARD_VALUES, ...draft.values },
          productPrices: draft.productPrices ?? {},
        });
      }

      hydratedRef.current = true;
      setSaveState('idle');
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [ready, ownerId]);

  const persistNow = useCallback(
    async (overrideStepIndex?: number) => {
      if (!hydratedRef.current) return;

      setSaveState('saving');
      const ok = await saveLaunchDraft({
        ownerId,
        stepIndex: overrideStepIndex ?? stepIndex,
        values,
        productPrices,
      });
      setSaveState(ok ? 'saved' : 'error');
    },
    [ownerId, stepIndex, values, productPrices]
  );

  useEffect(() => {
    if (!hydratedRef.current) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      void persistNow();
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [stepIndex, values, productPrices, persistNow]);

  const saveOnStepChange = useCallback(
    (nextStepIndex: number) => {
      if (!hydratedRef.current) return;
      void persistNow(nextStepIndex);
    },
    [persistNow]
  );

  return { saveState, saveOnStepChange, ownerId };
}
