// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED ANIMATION SYSTEM — Optimized for both Mobile & Desktop
// ═══════════════════════════════════════════════════════════════════════════

// ─── Device Detection ───────────────────────────────────────────────────────
export const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
export const prefersReducedMotion = typeof window !== "undefined" 
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
  : false;

// ─── Easing Curves ──────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
};

// ─── Spring Configurations ──────────────────────────────────────────────────
export const springs = {
  bouncy: { type: "spring" as const, stiffness: 280, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 380, damping: 28 },
  smooth: { type: "spring" as const, stiffness: 100, damping: 20 },
  gentle: { type: "spring" as const, stiffness: 140, damping: 22 },
  wobbly: { type: "spring" as const, stiffness: 180, damping: 12 },
};

// ─── Fade Animations ────────────────────────────────────────────────────────
export const fadeInUp = {
  initial: { opacity: 0, y: isMobile ? 20 : 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: isMobile ? 0.4 : 0.5, ease: ease.out }
};

export const fadeInDown = {
  initial: { opacity: 0, y: isMobile ? -20 : -40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: isMobile ? 0.4 : 0.5, ease: ease.out }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: isMobile ? -20 : -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: isMobile ? 0.4 : 0.5, ease: ease.out }
};

export const fadeInRight = {
  initial: { opacity: 0, x: isMobile ? 20 : 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: isMobile ? 0.4 : 0.5, ease: ease.out }
};

// ─── Scale Animations ───────────────────────────────────────────────────────
export const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: isMobile ? { duration: 0.4, ease: ease.out } : springs.snappy
};

export const scaleInBounce = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: springs.bouncy
};

// ─── Rotation Animations ────────────────────────────────────────────────────
export const rotateIn = {
  initial: { opacity: 0, rotate: -10, scale: 0.9 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.6, ease: ease.out }
};

// ─── Blur Animations ────────────────────────────────────────────────────────
export const blurIn = {
  initial: { opacity: 0, filter: "blur(10px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: ease.out }
};

// ─── Slide Animations ───────────────────────────────────────────────────────
export const slideInFromBottom = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
  transition: { duration: 0.5, ease: ease.out }
};

export const slideInFromTop = {
  initial: { y: "-100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-100%", opacity: 0 },
  transition: { duration: 0.5, ease: ease.out }
};

// ─── Stagger Containers ─────────────────────────────────────────────────────
export const staggerContainer = {
  animate: { 
    transition: { 
      staggerChildren: isMobile ? 0.05 : 0.08, 
      delayChildren: isMobile ? 0.05 : 0.1 
    } 
  }
};

export const staggerFast = {
  animate: { 
    transition: { 
      staggerChildren: 0.03, 
      delayChildren: 0 
    } 
  }
};

// ─── Hover Animations (Desktop Only) ────────────────────────────────────────
export const hoverLift = isMobile ? {} : {
  whileHover: { y: -8, scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

export const hoverScale = isMobile ? {} : {
  whileHover: { scale: 1.05, transition: springs.snappy },
  whileTap: { scale: 0.95 }
};

export const hoverGlow = isMobile ? {} : {
  whileHover: { 
    boxShadow: "0 0 30px rgba(255,0,0,0.4)",
    transition: { duration: 0.3 }
  }
};

// ─── Scroll-Based Animations ────────────────────────────────────────────────
export const parallaxConfig = {
  slow: isMobile ? 0 : 0.3,
  medium: isMobile ? 0 : 0.5,
  fast: isMobile ? 0 : 0.8,
};

// ─── Micro-Interactions ─────────────────────────────────────────────────────
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const floatAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shimmerAnimation = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }
};

// ─── Performance Optimizations ──────────────────────────────────────────────
export const gpuAcceleration = {
  transform: "translateZ(0)",
  willChange: "transform",
};

export const optimizedTransform = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden" as const,
  WebkitFontSmoothing: "antialiased" as const,
};
