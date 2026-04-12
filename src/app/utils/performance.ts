// ═══════════════════════════════════════════════════════════════════════════
// DEEP PERFORMANCE DETECTION — macOS / iOS / Safari aware
// ═══════════════════════════════════════════════════════════════════════════

// ─── Browser / OS Detection ─────────────────────────────────────────────────
export const detectBrowser = () => {
  if (typeof window === "undefined") return { isSafari: false, isIOS: false, isMacOS: false, isFirefox: false };
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isMacOS = /Macintosh/.test(ua) && !isIOS;
  const isFirefox = /Firefox/.test(ua);
  return { isSafari, isIOS, isMacOS, isFirefox };
};

export const detectDeviceCapability = () => {
  if (typeof window === "undefined") {
    return { tier: "low" as const, isMobile: false, isLowEnd: false, prefersReducedMotion: false, isSafari: false, isIOS: false, isMacOS: false };
  }

  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { isSafari, isIOS, isMacOS } = detectBrowser();

  // Safari/WebKit has expensive compositing — treat it more conservatively
  const isSafariLike = isSafari || isIOS;

  let tier: "low" | "medium" | "high" = "medium";

  if (prefersReducedMotion) {
    tier = "low";
  } else if (isIOS) {
    // iOS: always low regardless of device power
    tier = "low";
  } else if (isMobile) {
    // Mobile Chrome: high-end (≥6 cores) → medium, otherwise low
    if (cores >= 6) tier = "medium";
    else tier = "low";
  } else if (isSafari) {
    // Desktop Safari: always mid (never high)
    if (cores >= 4) tier = "medium";
    else tier = "low";
  } else {
    // Desktop Chrome/Edge/Firefox
    if (cores >= 8 || (cores >= 4 && !isSafari)) tier = "high";
    else if (cores >= 4) tier = "medium";
    else tier = "low";
  }

  return {
    tier,
    isMobile,
    isLowEnd: tier === "low",
    prefersReducedMotion,
    isSafari: isSafariLike,
    isIOS,
    isMacOS,
    cores,
    memory,
  };
};

export const shouldReduceAnimations = () => {
  const { tier } = detectDeviceCapability();
  return tier === "low";
};

// ─── Animation Config ────────────────────────────────────────────────────────
export const getAnimationConfig = () => {
  const { tier, isSafari, isIOS } = detectDeviceCapability();
  const safariLike = isSafari || isIOS;

  const configs = {
    low: {
      particleCount: 0,
      blurEffects: false,
      parallax: false,
      complexAnimations: false,
      fps: 30,
      transitionDuration: 0.3,
      staggerDelay: 0.05,
      enableGlow: false,
      enableShadows: false,
      canvasBackground: false,
      backdropBlur: false,
      infiniteAnimations: false,
    },
    medium: {
      particleCount: safariLike ? 0 : 20,       // No canvas on Safari
      blurEffects: !safariLike,                  // No blur on Safari
      parallax: false,
      complexAnimations: true,
      fps: 60,
      transitionDuration: 0.5,
      staggerDelay: 0.08,
      enableGlow: !safariLike,
      enableShadows: true,
      canvasBackground: false,
      backdropBlur: !safariLike,
      infiniteAnimations: !safariLike,
    },
    high: {
      particleCount: safariLike ? 15 : 40,
      blurEffects: !safariLike,
      parallax: !safariLike,
      complexAnimations: true,
      fps: 60,
      transitionDuration: 0.7,
      staggerDelay: 0.1,
      enableGlow: !safariLike,
      enableShadows: true,
      canvasBackground: !safariLike,
      backdropBlur: !safariLike,
      infiniteAnimations: true,
    },
  };

  return configs[tier];
};

// ─── GPU-safe props ──────────────────────────────────────────────────────────
export const gpuProps = {
  willChange: "transform, opacity" as const,
  transform: "translateZ(0)" as const,
};

// ─── Adaptive variants ───────────────────────────────────────────────────────
export const adaptiveVariants = {
  fadeIn: (reduce: boolean) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
  slideUp: (reduce: boolean) => ({
    initial: { opacity: 0, y: reduce ? 10 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
  scale: (reduce: boolean) => ({
    initial: { opacity: 0, scale: reduce ? 1 : 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: reduce ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Throttle ────────────────────────────────────────────────────────────────
export const throttle = <T extends (...args: unknown[]) => void>(func: T, delay: number): T => {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) { lastCall = now; func(...args); }
  }) as T;
};

// ─── FPS Monitor ─────────────────────────────────────────────────────────────
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private callback?: (fps: number) => void;
  private raf?: number;

  start(callback: (fps: number) => void) {
    this.callback = callback;
    this.measure();
  }

  private measure = () => {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frames.push(1000 / delta);
    if (this.frames.length > 60) this.frames.shift();
    const avgFps = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    this.callback?.(avgFps);
    this.raf = requestAnimationFrame(this.measure);
  };

  stop() {
    this.callback = undefined;
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}
