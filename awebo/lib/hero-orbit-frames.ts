export const ORBIT_FRAME_DIR = '/awebo_orbit_frames';
export const ORBIT_FRAME_COUNT = 145;
export const ORBIT_LEFT_FRAME = 99;
export const ORBIT_CENTER_FRAME = 57;
export const ORBIT_RIGHT_FRAME = 1;

/** Frames whose index is nearest to the orbit center (default: 57, 56, 58, 55). */
export const ORBIT_CENTER_HOTSPOT_FRAME_COUNT = 4;

export function getOrbitCenterHotspotFrames(
  center = ORBIT_CENTER_FRAME,
  count = ORBIT_CENTER_HOTSPOT_FRAME_COUNT
): number[] {
  return Array.from({ length: ORBIT_FRAME_COUNT }, (_, index) => index + 1)
    .sort(
      (a, b) =>
        Math.abs(a - center) - Math.abs(b - center) || a - b
    )
    .slice(0, count);
}

export function isOrbitCenterHotspotFrame(
  frame: number,
  center = ORBIT_CENTER_FRAME,
  count = ORBIT_CENTER_HOTSPOT_FRAME_COUNT
): boolean {
  return getOrbitCenterHotspotFrames(center, count).includes(Math.round(frame));
}
/** Vault exit easter egg: left edge → meeting room door transition. */
export const ORBIT_EXIT_START_FRAME = 99;
export const ORBIT_EXIT_END_FRAME = 145;

export function orbitFramePath(frame: number): string {
  const clamped = Math.max(1, Math.min(ORBIT_FRAME_COUNT, Math.round(frame)));
  return `${ORBIT_FRAME_DIR}/frame_${String(clamped).padStart(4, '0')}.webp`;
}

/** Map viewport X (0 = left, 1 = right) to orbit frame index. */
export function orbitTargetFrameFromX(normalizedX: number): number {
  const x = Math.max(0, Math.min(1, normalizedX));

  if (x <= 0.5) {
    const t = x / 0.5;
    return Math.round(ORBIT_LEFT_FRAME + (ORBIT_CENTER_FRAME - ORBIT_LEFT_FRAME) * t);
  }

  const t = (x - 0.5) / 0.5;
  return Math.round(ORBIT_CENTER_FRAME + (ORBIT_RIGHT_FRAME - ORBIT_CENTER_FRAME) * t);
}

export function preloadHeroOrbitFrames(
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const total = ORBIT_FRAME_COUNT;
  let loaded = 0;

  const loadOne = (frame: number) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded += 1;
        onProgress?.(loaded, total);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load ${orbitFramePath(frame)}`));
      img.src = orbitFramePath(frame);
    });

  return Promise.all(
    Array.from({ length: total }, (_, i) => loadOne(i + 1))
  );
}
