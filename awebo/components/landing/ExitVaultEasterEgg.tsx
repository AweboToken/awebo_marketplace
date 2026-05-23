'use client';

import { useCallback, useEffect, useState } from 'react';

/** Show “Exit” when pointer is within this many px of the left viewport edge. */
const LEFT_EDGE_PX = 56;

type ExitVaultEasterEggProps = {
  active: boolean;
  onExitClick: () => void;
};

export default function ExitVaultEasterEgg({
  active,
  onExitClick,
}: ExitVaultEasterEggProps) {
  const [leftEdgeHover, setLeftEdgeHover] = useState(false);
  const [overButton, setOverButton] = useState(false);
  const visible = leftEdgeHover || overButton;

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!active) return;
      setLeftEdgeHover(e.clientX <= LEFT_EDGE_PX);
    },
    [active]
  );

  const onPointerLeave = useCallback(() => {
    setLeftEdgeHover(false);
  }, []);

  useEffect(() => {
    if (!active) {
      setLeftEdgeHover(false);
      setOverButton(false);
      return;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [active, onPointerMove, onPointerLeave]);

  if (!active) return null;

  return (
    <button
      type="button"
      onClick={onExitClick}
      onPointerEnter={() => setOverButton(true)}
      onPointerLeave={() => setOverButton(false)}
      className={`fixed bottom-4 left-4 z-[60] cursor-pointer border-0 bg-transparent p-0 text-[10px] font-semibold uppercase tracking-wide text-white transition-opacity duration-200 ease-out hover:text-white/80 sm:bottom-5 sm:left-5 sm:text-[11px] ${
        visible
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      Exit
    </button>
  );
}
