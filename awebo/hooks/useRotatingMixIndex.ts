"use client";

import { useEffect, useState } from "react";

/**
 * Cycles 0..length-1 on an interval for discovery breadcrumb “mix” rotation.
 */
export function useRotatingMixIndex(length: number, intervalMs = 10000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return;

    setIndex((i) => i % length);

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [length, intervalMs]);

  return length <= 0 ? 0 : index % length;
}
