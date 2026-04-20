import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectDeviceCapability } from '../utils/performance';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface DeviceInput {
  cores: number;
  isSafari: boolean;
  isIOS: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

export interface AnimationConfig {
  tier: 'high' | 'mid' | 'low';
  reduceMotion: boolean;
  isSafari: boolean;
  isIOS: boolean;
  isMobile: boolean;
  // Derived feature flags
  enableAmbientLayer: boolean;
  ambientDotCount: number;
  enableCursorGlow: boolean;
  enableMagnetic: boolean;
  enable3DTilt: boolean;
  enableParallax: boolean;
  enableBackdropBlur: boolean;
  enableInfiniteLoops: boolean;
  enableShimmer: boolean;
}

// ─── Default Config (low tier — safest fallback) ─────────────────────────────

export const defaultConfig: AnimationConfig = {
  tier: 'low',
  reduceMotion: false,
  isSafari: false,
  isIOS: false,
  isMobile: false,
  enableAmbientLayer: false,
  ambientDotCount: 0,
  enableCursorGlow: false,
  enableMagnetic: false,
  enable3DTilt: false,
  enableParallax: false,
  enableBackdropBlur: false,
  enableInfiniteLoops: false,
  enableShimmer: false,
};

// ─── Pure Computation ─────────────────────────────────────────────────────────

export function computeAnimationConfig(input: DeviceInput): AnimationConfig {
  const { cores, isSafari, isIOS, isMobile, prefersReducedMotion } = input;

  // Tier classification
  let tier: 'high' | 'mid' | 'low';

  if (prefersReducedMotion || isIOS || cores < 4) {
    tier = 'low';
  } else if (isSafari || (isMobile && cores >= 4)) {
    tier = 'mid';
  } else {
    // Desktop Chrome/Edge/Firefox, ≥4 cores, not Safari, not iOS
    tier = 'high';
  }

  // Derived feature flags
  const enableAmbientLayer = tier !== 'low' && !isSafari;
  const ambientDotCount = tier === 'low' || isSafari ? 0 : isMobile ? 6 : 12;

  return {
    tier,
    reduceMotion: prefersReducedMotion,
    isSafari,
    isIOS,
    isMobile,
    enableAmbientLayer,
    ambientDotCount,
    enableCursorGlow: tier === 'high',
    enableMagnetic: tier === 'high',
    enable3DTilt: tier === 'high',
    enableParallax: tier === 'high',
    enableBackdropBlur: !isSafari && !isIOS,
    enableInfiniteLoops: tier !== 'low',
    enableShimmer: tier !== 'low',
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AnimationContext = createContext<AnimationConfig | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AnimationConfig>(() => {
    try {
      const detected = detectDeviceCapability();
      const prefersReducedMotion = detected.prefersReducedMotion;
      return computeAnimationConfig({
        cores: (detected as { cores?: number }).cores ?? 2,
        isSafari: detected.isSafari,
        isIOS: detected.isIOS,
        isMobile: detected.isMobile,
        prefersReducedMotion,
      });
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setConfig((prev) => {
        const updated = computeAnimationConfig({
          cores: (detectDeviceCapability() as { cores?: number }).cores ?? 2,
          isSafari: prev.isSafari,
          isIOS: prev.isIOS,
          isMobile: prev.isMobile,
          prefersReducedMotion: e.matches,
        });
        return updated;
      });
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <AnimationContext.Provider value={config}>
      {children}
    </AnimationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnimationConfig(): AnimationConfig {
  const ctx = useContext(AnimationContext);
  if (ctx === null) {
    throw new Error('useAnimationConfig must be used within an AnimationProvider');
  }
  return ctx;
}
