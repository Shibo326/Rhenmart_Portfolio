// Lightweight animation presets — use these instead of inline objects

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 280, damping: 24 }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

// Easing presets
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
};

// Spring presets
export const springs = {
  bouncy: { type: "spring" as const, stiffness: 280, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 380, damping: 28 },
  smooth: { type: "spring" as const, stiffness: 100, damping: 20 },
};
