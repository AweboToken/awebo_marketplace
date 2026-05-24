/** Room backgrounds for each Launch Brand wizard step. */
export const LAUNCH_WIZARD_STEP_BACKGROUNDS = [
  '/creatorsroom.webp', // Brand setup — Creators Lab
  '/printroom.webp', // Catalog & products — Print Lab
  '/blockchainlab.webp', // Brand contract — Blockchain Lab
  '/shippingroom.webp', // Review & publish — Shipping & Logistics
] as const;

/** Max height for wizard glass panels (below overlay nav). */
export const LAUNCH_WIZARD_PANEL_MAX_H =
  'max-h-[calc(100dvh-7.25rem)] lg:max-h-[calc(100dvh-7.25rem)]';

export function launchWizardBackgroundForStep(stepIndex: number): string {
  return (
    LAUNCH_WIZARD_STEP_BACKGROUNDS[stepIndex] ??
    LAUNCH_WIZARD_STEP_BACKGROUNDS[0]
  );
}
