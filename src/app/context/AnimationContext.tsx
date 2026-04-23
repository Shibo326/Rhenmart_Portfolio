import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectDeviceCapability } from '../utils/performance';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface DeviceInput {
  cores: number;
  isSafari: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  prefersReducedMotion: boolean;
}

export interface AnimationConfig {
  tier: 'high' | 'mid' | 'low';
  reduceMotion: boolean;
  isSafari: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
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
  // 3D scene flag — separate from tier so Hero can gate WebGL independently
  enable3DScene: boolean;
}

// ─── Default Config (low tier — safest fallback) ─────────────────────────────

export const defaultConfig: AnimationConfig = {
  tier: 'low',
  reduceMotion: false,
  isSafari: false,
  isIOS: false,
  isAndroid: false,
  isMobile: false,
  isTablet: false,
  enableAmbientLayer: false,
  ambientDotCount: 0,
  enableCursorGlow: false,
  enableMagnetic: false,
  enable3DTilt: false,
  enableParallax: false,
  enableBackdropBlur: false,
  enableInfiniteLoops: false,
  enableShimmer: false,
  enable3DScene: false,
};

// ─── Pure Computation ─────────────────────────────────────────────────────────

export function computeAnimationConfig(input: DeviceInput): AnimationConfig {
  const { cores, isSafari, isIOS, isAndroid, isMobile, isTablet, prefersReducedMotion } = input;

  // ── Tier classification ────────────────────────────────────────────────
  let tier: 'high' | 'mid' | 'low';

  if (prefersReducedMotion) {
    tier = 'low';
  } else if (isIOS) {
    // iOS: always low — WebKit compositor limits, no reliable WebGL
    tier = 'low';
  } else if (isAndroid && isMobile) {
    // Android phone: many mid-range chips report 8 cores but are slow
    tier = cores >= 6 ? 'mid' : 'low';
  } else if (isAndroid && (isTablet || !isMobile)) {
    // Android tablet / large-screen Android
    tier = cores >= 6 ? 'high' : 'mid';
  } else if (isSafari) {
    // macOS Safari: backdrop-filter and preserve-3d are expensive
    tier = cores >= 4 ? 'mid' : 'low';
  } else {
    // Windows / macOS Chrome / Edge / Firefox
    tier = cores >= 4 ? 'high' : 'mid';
  }

  // ── Derived flags ──────────────────────────────────────────────────────

  // Ambient dots: off on iOS, Safari, low-tier; reduced on mobile
  const enableAmbientLayer = tier !== 'low' && !isSafari && !isIOS;
  const ambientDotCount = !enableAmbientLayer ? 0 : isMobile ? 4 : isTablet ? 8 : 12;

  // backdrop-filter: off on iOS (causes blank screens in WKWebView) and Safari
  // (expensive, causes repaints). Fine on Chrome/Edge/Firefox on all platforms.
  const enableBackdropBlur = !isSafari && !isIOS;

  // 3D WebGL scene: only on high-tier desktop (not Safari, not mobile, not tablet)
  const enable3DScene = tier === 'high' && !isMobile && !isTablet && !isSafari && !isIOS;

  return {
    tier,
    reduceMotion: prefersReducedMotion,
    isSafari,
    isIOS,
    isAndroid,
    isMobile,
    isTablet,
    enableAmbientLayer,
    ambientDotCount,
    enableCursorGlow: tier === 'high' && !isMobile,
    enableMagnetic: tier === 'high' && !isMobile,
    enable3DTilt: tier === 'high' && !isMobile && !isSafari,
    enableParallax: tier === 'high' && !isMobile,
    enableBackdropBlur,
    enableInfiniteLoops: tier !== 'low',
    enableShimmer: tier !== 'low' && !isIOS,
    enable3DScene,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AnimationContext = createContext<AnimationConfig | null>(null);

// ─── Helper: snapshot current device state ───────────────────────────────────

function snapshotDevice(): DeviceInput {
  const detected = detectDeviceCapability();
  return {
    cores: detected.cores,
    isSafari: detected.isSafari,
    isIOS: detected.isIOS,
    isAndroid: detected.isAndroid ?? false,
    isMobile: detected.isMobile,
    isTablet: detected.isTablet ?? false,
    prefersReducedMotion: detected.prefersReducedMotion,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AnimationConfig>(() => {
    try {
      return computeAnimationConfig(snapshotDevice());
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    // Re-evaluate on prefers-reduced-motion change (e.g. user toggles OS setting)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setConfig(computeAnimationConfig(snapshotDevice()));
    };
    mq.addEventListener('change', handleMotionChange);

    // Re-evaluate on viewport resize — catches:
    // • Phone rotation (portrait ↔ landscape)
    // • Connecting/disconnecting an external monitor
    // • Browser window resize on desktop
    // Debounced to avoid thrashing during resize drag.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setConfig(computeAnimationConfig(snapshotDevice()));
      }, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      mq.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
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
