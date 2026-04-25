'use client';

import { useState } from 'react';

/** Global UX rule from PDF: floating chat bottom-right (Intercom-style) when logged in — stub for now. */
export default function FloatingSupportStub() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="Support chat"
          className="w-[min(100vw-2rem,20rem)] rounded-xl border border-silver bg-white p-4 shadow-xl overscroll-contain"
        >
          <p className="text-sm text-gray-700">
            Connect support chat here (e.g. Intercom). This placeholder follows the marketplace global UX pattern.
          </p>
          <button
            type="button"
            className="mt-3 text-sm font-medium text-air-force-blue hover:underline"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full bg-air-force-blue text-white font-semibold text-sm shadow-lg hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-air-force-blue"
        aria-label={open ? 'Close support chat' : 'Open support chat'}
      >
        ?
      </button>
    </div>
  );
}
