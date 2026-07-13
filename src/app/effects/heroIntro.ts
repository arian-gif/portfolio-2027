// ════════════════════════════════════════════════════════════════════════════
//  heroIntro — timing + motion props for the cinematic page-load sequence.
//  ~2.1s total, page interactive throughout (no overlay, no scroll lock).
//  Under prefers-reduced-motion every element renders in place instantly.
// ════════════════════════════════════════════════════════════════════════════

// When each hero element starts, in seconds after load.
export const INTRO = {
  status: 0.15,
  title: 0.3,
  tagline: 0.55,
  intro: 0.7,
  ctas: 0.9,
  saturn: 0.5,
  rocket: 1.4,
  chevron: 1.7,
} as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Standard "materialize" entrance: fade + rise + unblur. */
export function fadeUp(delay: number, reduced: boolean) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, y: 14, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { delay, duration: 0.5, ease: EASE_OUT },
  };
}

/** The h1 name: left-to-right clip-path wipe + unblur. Starts early so the
 *  likely-LCP element is visible fast. */
export function titleWipe(reduced: boolean) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, clipPath: "inset(0 100% 0 0)", filter: "blur(8px)" },
    animate: { opacity: 1, clipPath: "inset(0 0% 0 0)", filter: "blur(0px)" },
    transition: { delay: INTRO.title, duration: 0.7, ease: EASE_OUT },
  };
}

/** CTA buttons pop in slightly scaled. */
export function ctaPop(delay: number, reduced: boolean) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay, duration: 0.45, ease: EASE_OUT },
  };
}

/** Saturn scales up out of the void while the GLB streams in. */
export function saturnEntrance(reduced: boolean) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, scale: 0.4, rotate: -8 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { delay: INTRO.saturn, duration: 1.4, ease: EASE_OUT },
  };
}
