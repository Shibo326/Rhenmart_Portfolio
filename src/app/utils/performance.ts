// Advanced performance detection system
export const detectDeviceCapability = () => {
  if (typeof window === "undefined") {
    return { tier: "low", isMobile: false, isLowEnd: false, prefersReducedMotion: false };
  }
  
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  // Performance tier detection
  let tier: "low" | "medium" | "high" = "medium";
  
  if (prefersReducedMotion) {
    tier = "low";
  } else if (isMobile) {
    // Mobile tier detection
    if (cores >= 8 && memory >= 6) {
      tier = "high"; // High-end mobile (iPhone 13+, flagship Android)
    } else if (cores >= 4 && memory >= 4) {
      tier = "medium"; // Mid-range mobile
    } else {
      tier = "low"; // Budget mobile
    }
  } else {
    // Desktop tier detection
    if (cores >= 8 && memory >= 8) {
      tier = "high"; // High-end desktop
    } else if (cores >= 4 && memory >= 4) {
      tier = "medium"; // Mid-range desktop
    } else {
      tier = "low"; // Low-end desktop
    }
  }
  
  return { 
    tier, 
    isMobile, 
    isLowEnd: tier === "low", 
    prefersReducedMotion,
    cores,
    memory
  };
};

export const shouldReduceAnimations = () => {
  const { tier } = detectDeviceCapability();
  return tier === "low";
};

// Animation configuration based on device tier
export const getAnimationConfig = () => {
  const { tier } = detectDeviceCapability();
  
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
    },
    medium: {
      particleCount: 20,
      blurEffects: true,
      parallax: false,
      complexAnimations: true,
      fps: 60,
      transitionDuration: 0.5,
      staggerDelay: 0.08,
      enableGlow: true,
      enableShadows: true,
      canvasBackground: false,
    },
    high: {
      particleCount: 40,
      blurEffects: true,
      parallax: true,
      complexAnimations: true,
      fps: 60,
      transitionDuration: 0.7,
      staggerDelay: 0.1,
      enableGlow: true,
      enableShadows: true,
      canvasBackground: true,
    }
  };
  
  return configs[tier];
};

// GPU-optimized animation properties
export const gpuProps = {
  willChange: "transform, opacity" as const,
  transform: "translateZ(0)" as const,
};

// Performance-aware animation variants
export const adaptiveVariants = {
  fadeIn: (reduce: boolean) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] }
  }),
  
  slideUp: (reduce: boolean) => ({
    initial: { opacity: 0, y: reduce ? 10 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }
  }),
  
  scale: (reduce: boolean) => ({
    initial: { opacity: 0, scale: reduce ? 1 : 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: reduce ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] }
  }),
};

// Throttle for scroll events
export const throttle = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
};

// FPS monitor for adaptive performance
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private callback?: (fps: number) => void;
  
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
    
    requestAnimationFrame(this.measure);
  };
  
  stop() {
    this.callback = undefined;
  }
}

