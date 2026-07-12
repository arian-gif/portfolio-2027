// ════════════════════════════════════════════════════════════════════════════
//  useMotionPrefs — single source of truth for gating every visual effect.
// ────────────────────────────────────────────────────────────────────────────
//  • reducedMotion: mirrors the OS "prefers-reduced-motion: reduce" setting.
//  • tier: "lite" on touch/small/low-memory devices → fewer particles, no
//    heavy extras. "full" on desktops. Consumers pick their own budget.
//  Implemented as a module-level store (one set of media-query listeners
//  shared app-wide) exposed through useSyncExternalStore.
// ════════════════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from "react";

export type MotionPrefs = {
  reducedMotion: boolean;
  tier: "full" | "lite";
};

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const COARSE_MQ = "(pointer: coarse)";
const NARROW_MQ = "(max-width: 767px)";

function computePrefs(): MotionPrefs {
  if (typeof window === "undefined") return { reducedMotion: false, tier: "full" };
  const reducedMotion = matchMedia(REDUCED_MQ).matches;
  // navigator.deviceMemory is Chrome-only; treat "unknown" as plenty (8 GB).
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
  const lite = matchMedia(COARSE_MQ).matches || matchMedia(NARROW_MQ).matches || memory <= 4;
  return { reducedMotion, tier: lite ? "lite" : "full" };
}

let snapshot: MotionPrefs = computePrefs();
const listeners = new Set<() => void>();

function refresh() {
  const next = computePrefs();
  if (next.reducedMotion !== snapshot.reducedMotion || next.tier !== snapshot.tier) {
    snapshot = next;
    listeners.forEach((l) => l());
  }
}

if (typeof window !== "undefined") {
  for (const q of [REDUCED_MQ, COARSE_MQ, NARROW_MQ]) {
    matchMedia(q).addEventListener("change", refresh);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function useMotionPrefs(): MotionPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function usePrefersReducedMotion(): boolean {
  return useMotionPrefs().reducedMotion;
}

// Non-hook accessor for imperative code (canvas loops, module init).
export function getMotionPrefs(): MotionPrefs {
  return snapshot;
}
