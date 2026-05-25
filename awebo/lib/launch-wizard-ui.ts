/** Glass panels — backdrop blur on cards only, not the room background. */
export const LAUNCH_GLASS_PANEL =
  'rounded-2xl border border-white/15 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md';

/** Typography + controls inside glass wizard cards. */
export const LAUNCH_GLASS_CONTENT = [
  '[&_h2]:text-white',
  '[&_h3]:text-white',
  '[&_p]:text-white/75',
  '[&_label]:text-white/65',
  '[&_th]:text-white/60',
  '[&_td]:text-white/90',
  '[&_li]:text-white/85',
  '[&_a:not([class])]:text-white [&_a:not([class])]:underline-offset-4 [&_a:not([class])]:hover:underline',
  '[&_input:not([type=checkbox])]:border-white/20',
  '[&_input:not([type=checkbox])]:bg-white/10',
  '[&_input:not([type=checkbox])]:text-white',
  '[&_input:not([type=checkbox])]:placeholder:text-white/45',
  '[&_textarea]:border-white/20',
  '[&_textarea]:bg-white/10',
  '[&_textarea]:text-white',
  '[&_textarea]:placeholder:text-white/45',
  '[&_select]:border-white/20',
  '[&_select]:bg-white/10',
  '[&_select]:text-white',
  '[&_.border-gray-200]:border-white/15',
  '[&_.border-gray-100]:border-white/10',
  '[&_.border-gray-300]:border-white/20',
  '[&_.bg-gray-50]:bg-white/5',
  '[&_.bg-white]:bg-white/10',
  '[&_.text-gray-900]:text-white',
  '[&_.text-gray-800]:text-white/90',
  '[&_.text-gray-700]:text-white/85',
  '[&_.text-gray-600]:text-white/70',
  '[&_.text-gray-500]:text-white/60',
  '[&_.text-gray-400]:text-white/50',
].join(' ');

export const LAUNCH_GLASS_BUTTON_SECONDARY =
  'rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15';

export const LAUNCH_GLASS_BUTTON_PRIMARY =
  'rounded-lg bg-[#6e5dcb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5e4db8]';

/** Scoped to center wizard form — modals stay outside this wrapper. */
export const LAUNCH_FORM_ROOT = [
  'text-white',
  '[&_h2]:text-white',
  '[&_h3]:text-white',
  '[&_p]:text-white/75',
  '[&_label]:text-white/65',
  '[&_legend]:text-white/90',
  '[&_span]:text-inherit',
  '[&_th]:text-white/60',
  '[&_td]:text-white/90',
  '[&_li]:text-white/85',
  '[&_input:not([type=checkbox]):not([type=radio])]:border-white/20',
  '[&_input:not([type=checkbox]):not([type=radio])]:bg-white/10',
  '[&_input:not([type=checkbox]):not([type=radio])]:text-white',
  '[&_input:not([type=checkbox]):not([type=radio])]:placeholder:text-white/45',
  '[&_textarea]:border-white/20',
  '[&_textarea]:bg-white/10',
  '[&_textarea]:text-white',
  '[&_textarea]:placeholder:text-white/45',
  '[&_select]:border-white/20',
  '[&_select]:bg-white/10',
  '[&_select]:text-white',
].join(' ');

export const LF = {
  heading: 'text-xl font-bold text-white mb-2',
  lead: 'text-white/75 mb-6 text-sm text-pretty',
  label: 'block text-xs font-medium uppercase text-white/60 mb-1',
  labelBlock: 'block text-xs font-medium uppercase text-white/60 mb-2',
  input:
    'w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45',
  inputSm:
    'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/45',
  textarea:
    'w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/45 resize-none',
  uploadZone:
    'flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/25 text-sm text-white/60 hover:border-air-force-blue/50 hover:bg-white/5',
  uploadZoneSm:
    'flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/25 text-sm text-white/60 hover:border-air-force-blue/50 hover:bg-white/5',
  muted: 'text-xs text-white/60',
  btnGhost: 'text-sm font-medium text-white/70 hover:text-white',
  panel: 'rounded-xl border border-white/15 bg-white/5 p-4',
  panelTitle: 'text-xs font-semibold uppercase text-white/60 mb-2',
  tableWrap: 'overflow-hidden rounded-xl border border-white/15',
  tableHead:
    'border-b border-white/15 bg-white/5 text-left text-xs uppercase text-white/60',
  tableRowBorder: 'border-b border-white/10',
  chip: 'rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 transition-colors hover:bg-white/15 hover:text-white',
  chipActive:
    'rounded-full border border-air-force-blue/50 bg-air-force-blue/25 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_0_1px_rgba(108,143,174,0.35)]',
  statusDraft: 'rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-200',
  statusPricing: 'rounded-full bg-sky-500/20 px-2 py-0.5 text-xs font-medium text-sky-200',
  statusReady: 'rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-200',
  radioCard:
    'flex cursor-pointer gap-3 rounded-xl border-2 border-white/15 p-4 has-[:checked]:border-air-force-blue/50 has-[:checked]:bg-air-force-blue/10',
  chainBtnActive:
    'rounded-lg border-2 border-air-force-blue bg-air-force-blue/10 py-2 text-xs font-medium text-white',
  chainBtn: 'rounded-lg border-2 border-white/15 py-2 text-xs font-medium text-white/70',
  readOnlyInput:
    'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/85',
} as const;
