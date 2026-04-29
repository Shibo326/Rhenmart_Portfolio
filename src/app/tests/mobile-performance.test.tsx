/**
 * Mobile Performance Optimization — Bug Condition & Preservation Tests
 *
 * Task 1: Bug condition exploration test (EXPECTED TO FAIL on unfixed code)
 * Task 2: Preservation property tests (EXPECTED TO PASS on unfixed code)
 *
 * Uses fast-check for property-based testing.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';

import { computeAnimationConfig, AnimationContext, defaultConfig } from '../context/AnimationContext';
import type { DeviceInput, AnimationConfig } from '../context/AnimationContext';
import { Hero } from '../components/Hero';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    motion: new Proxy({} as Record<string, React.FC>, {
      get: (_target, tag: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag as string, props, children),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useMotionValue: (initial: number) => ({ get: () => initial, set: vi.fn(), on: () => vi.fn() }),
    useSpring: (val: unknown) => val,
    useScroll: () => ({ scrollYProgress: { get: () => 0 }, scrollY: { get: () => 0 } }),
    useTransform: () => 0,
    useInView: () => true,
    animate: vi.fn(),
  };
});

vi.mock('../../Image/Rhenmart_Profile.jpeg', () => ({ default: 'profile.jpg' }));
vi.mock('../utils/generateResume', () => ({ generateResume: vi.fn() }));
vi.mock('../components/three/HeroScene3D', () => ({ HeroScene3D: () => null }));
vi.mock('../hooks/useDeviceAnimations', () => ({
  ease: { out: [0.16, 1, 0.3, 1] },
  springs: { bouncy: {}, snappy: {} },
  useMagneticRef: () => ({ current: null }),
  useCountUp: () => [{ current: null }, 0],
  useCanAnimate: () => false,
}));

// ─── Arbitraries ──────────────────────────────────────────────────────────────

/** Android mid-tier mobile: 6+ cores, isMobile: true — the concrete bug case */
const androidMidMobileArb = fc.record({
  cores: fc.integer({ min: 6, max: 32 }),
  isSafari: fc.constant(false),
  isIOS: fc.constant(false),
  isAndroid: fc.constant(true),
  isMobile: fc.constant(true),
  isTablet: fc.constant(false),
  prefersReducedMotion: fc.constant(false),
});

/** Any mobile input (Android or iOS) */
const anyMobileArb = fc.oneof(
  // Android mobile low-tier
  fc.record({
    cores: fc.integer({ min: 1, max: 5 }),
    isSafari: fc.constant(false),
    isIOS: fc.constant(false),
    isAndroid: fc.constant(true),
    isMobile: fc.constant(true),
    isTablet: fc.constant(false),
    prefersReducedMotion: fc.constant(false),
  }),
  // Android mobile mid-tier
  fc.record({
    cores: fc.integer({ min: 6, max: 32 }),
    isSafari: fc.constant(false),
    isIOS: fc.constant(false),
    isAndroid: fc.constant(true),
    isMobile: fc.constant(true),
    isTablet: fc.constant(false),
    prefersReducedMotion: fc.constant(false),
  }),
  // iOS (any)
  fc.record({
    cores: fc.integer({ min: 1, max: 32 }),
    isSafari: fc.constant(true),
    isIOS: fc.constant(true),
    isAndroid: fc.constant(false),
    isMobile: fc.constant(true),
    isTablet: fc.constant(false),
    prefersReducedMotion: fc.constant(false),
  }),
);

/** Desktop Chrome/Edge/Firefox — high tier */
const desktopHighArb = fc.record({
  cores: fc.integer({ min: 4, max: 32 }),
  isSafari: fc.constant(false),
  isIOS: fc.constant(false),
  isAndroid: fc.constant(false),
  isMobile: fc.constant(false),
  isTablet: fc.constant(false),
  prefersReducedMotion: fc.constant(false),
});

/** macOS Safari — mid tier */
const macSafariArb = fc.record({
  cores: fc.integer({ min: 4, max: 32 }),
  isSafari: fc.constant(true),
  isIOS: fc.constant(false),
  isAndroid: fc.constant(false),
  isMobile: fc.constant(false),
  isTablet: fc.constant(false),
  prefersReducedMotion: fc.constant(false),
});

/** Android tablet high-tier */
const androidTabletHighArb = fc.record({
  cores: fc.integer({ min: 6, max: 32 }),
  isSafari: fc.constant(false),
  isIOS: fc.constant(false),
  isAndroid: fc.constant(true),
  isMobile: fc.constant(false),
  isTablet: fc.constant(true),
  prefersReducedMotion: fc.constant(false),
});

/** prefers-reduced-motion */
const reducedMotionArb = fc.record({
  cores: fc.integer({ min: 1, max: 32 }),
  isSafari: fc.boolean(),
  isIOS: fc.boolean(),
  isAndroid: fc.boolean(),
  isMobile: fc.boolean(),
  isTablet: fc.boolean(),
  prefersReducedMotion: fc.constant(true),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderHeroWithConfig(config: Partial<AnimationConfig>) {
  const merged: AnimationConfig = { ...defaultConfig, ...config };
  return render(
    <AnimationContext.Provider value={merged}>
      <Hero />
    </AnimationContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TASK 1: BUG CONDITION EXPLORATION TESTS
// These tests MUST FAIL on unfixed code — failure confirms the bug exists.
// ══════════════════════════════════════════════════════════════════════════════

describe('Task 1 — Bug Condition: Mobile animation budget exceeded', () => {

  it('BUG: Android mid-tier mobile should have enableInfiniteLoops = false (currently true)', () => {
    fc.assert(
      fc.property(androidMidMobileArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        // BUG: On unfixed code, mid-tier Android mobile returns enableInfiniteLoops: true
        // Expected: false (mobile should never run infinite loops)
        expect(config.enableInfiniteLoops).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('BUG: Android mid-tier mobile should have enableShimmer = false (currently true)', () => {
    fc.assert(
      fc.property(androidMidMobileArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        // BUG: On unfixed code, mid-tier Android mobile returns enableShimmer: true
        // Expected: false (mobile should never run shimmer)
        expect(config.enableShimmer).toBe(false);
      }),
      { numRuns: 50 }
    );
  });

  it('BUG: All mobile inputs should have isMobileAnimationBudgetExceeded = true (field missing)', () => {
    fc.assert(
      fc.property(anyMobileArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        // BUG: On unfixed code, this field does not exist on AnimationConfig
        // Expected: true for all mobile/iOS inputs
        expect((config as AnimationConfig & { isMobileAnimationBudgetExceeded?: boolean }).isMobileAnimationBudgetExceeded).toBe(true);
      }),
      { numRuns: 50 }
    );
  });

  it('BUG: Hero should render zero animate-particle elements on mobile (currently renders 20)', () => {
    const { container, unmount } = renderHeroWithConfig({
      tier: 'mid',
      isMobile: true,
      isAndroid: true,
      isSafari: false,
      isIOS: false,
      enableInfiniteLoops: true,
      enableShimmer: true,
    });

    // BUG: On unfixed code, <Particles count={20} /> is rendered unconditionally
    // The component uses hidden md:block so nodes ARE created in DOM
    // Expected: 0 particle nodes on mobile
    const particleNodes = container.querySelectorAll('.animate-particle');
    expect(particleNodes.length).toBe(0);

    unmount();
  });

  it('BUG: iOS should have enableInfiniteLoops = false (currently false — already correct for iOS low tier)', () => {
    // iOS is already low tier so enableInfiniteLoops is false — this is correct
    // The real bug is Android mid-tier mobile (6+ cores) which gets mid tier
    const iosInput: DeviceInput = {
      cores: 8,
      isSafari: true,
      isIOS: true,
      isAndroid: false,
      isMobile: true,
      isTablet: false,
      prefersReducedMotion: false,
    };
    const config = computeAnimationConfig(iosInput);
    // iOS is low tier — this should already be false
    expect(config.enableInfiniteLoops).toBe(false);
    expect(config.tier).toBe('low');
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// TASK 2: PRESERVATION PROPERTY TESTS
// These tests MUST PASS on unfixed code — they confirm baseline behavior.
// ══════════════════════════════════════════════════════════════════════════════

describe('Task 2 — Preservation: Desktop and non-mobile behavior unchanged', () => {

  it('PRESERVE: Desktop Chrome/Edge/Firefox (high tier) has enableInfiniteLoops = true', () => {
    fc.assert(
      fc.property(desktopHighArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        expect(config.tier).toBe('high');
        expect(config.enableInfiniteLoops).toBe(true);
        expect(config.enableShimmer).toBe(true);
        expect(config.enable3DScene).toBe(true);
        expect(config.enableCursorGlow).toBe(true);
        expect(config.enableMagnetic).toBe(true);
        expect(config.enable3DTilt).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('PRESERVE: macOS Safari (mid tier) has enableInfiniteLoops = true and enableBackdropBlur = false', () => {
    fc.assert(
      fc.property(macSafariArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        expect(config.tier).toBe('mid');
        expect(config.enableInfiniteLoops).toBe(true);
        expect(config.enableBackdropBlur).toBe(false);
        expect(config.enable3DScene).toBe(false);
        expect(config.enableCursorGlow).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('PRESERVE: Android tablet high-tier has tier = high and all high-tier flags enabled', () => {
    fc.assert(
      fc.property(androidTabletHighArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        expect(config.tier).toBe('high');
        expect(config.enableInfiniteLoops).toBe(true);
        expect(config.enableShimmer).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('PRESERVE: prefers-reduced-motion always produces tier = low with all animations disabled', () => {
    fc.assert(
      fc.property(reducedMotionArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        expect(config.tier).toBe('low');
        expect(config.enableInfiniteLoops).toBe(false);
        expect(config.enableShimmer).toBe(false);
        expect(config.enableCursorGlow).toBe(false);
        expect(config.enableMagnetic).toBe(false);
        expect(config.enable3DTilt).toBe(false);
        expect(config.enableParallax).toBe(false);
        expect(config.enableAmbientLayer).toBe(false);
        expect(config.ambientDotCount).toBe(0);
        expect(config.enable3DScene).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('PRESERVE: Desktop Hero renders 20 animate-particle elements', () => {
    const { container, unmount } = renderHeroWithConfig({
      tier: 'high',
      isMobile: false,
      isAndroid: false,
      isSafari: false,
      isIOS: false,
      enable3DScene: false, // skip WebGL in test
      enableInfiniteLoops: true,
      enableShimmer: true,
    });

    // On desktop, <Particles count={20} /> renders 20 nodes with animate-particle
    const particleNodes = container.querySelectorAll('.animate-particle');
    expect(particleNodes.length).toBe(20);

    unmount();
  });

  it('PRESERVE: Desktop tier invariants — high tier requires cores >= 4, not iOS, not reduced motion', () => {
    fc.assert(
      fc.property(desktopHighArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        if (config.tier === 'high') {
          expect(input.cores).toBeGreaterThanOrEqual(4);
          expect(input.isIOS).toBe(false);
          expect(input.prefersReducedMotion).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('PRESERVE: AnimationConfig always has all required fields regardless of input', () => {
    const allInputsArb = fc.record({
      cores: fc.integer({ min: 1, max: 32 }),
      isSafari: fc.boolean(),
      isIOS: fc.boolean(),
      isAndroid: fc.boolean(),
      isMobile: fc.boolean(),
      isTablet: fc.boolean(),
      prefersReducedMotion: fc.boolean(),
    });

    fc.assert(
      fc.property(allInputsArb, (input: DeviceInput) => {
        const config = computeAnimationConfig(input);
        expect(config).toHaveProperty('tier');
        expect(config).toHaveProperty('enableInfiniteLoops');
        expect(config).toHaveProperty('enableShimmer');
        expect(config).toHaveProperty('isMobile');
        expect(config).toHaveProperty('isIOS');
        expect(config).toHaveProperty('isSafari');
        expect(['high', 'mid', 'low']).toContain(config.tier);
        expect(typeof config.enableInfiniteLoops).toBe('boolean');
        expect(typeof config.enableShimmer).toBe('boolean');
      }),
      { numRuns: 200 }
    );
  });

});
