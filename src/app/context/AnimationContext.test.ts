/**
 * Exploration property-based tests for AnimationConfig and AmbientLayer
 * These tests are written BEFORE the implementation exists.
 * They are EXPECTED TO FAIL until Task 2 (AnimationContext.tsx) is complete.
 *
 * Using fast-check for property-based testing.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// This import will fail until Task 2 creates the file — that is expected.
import { computeAnimationConfig } from './AnimationContext';

// ─── Arbitraries ────────────────────────────────────────────────────────────

const deviceInputArb = fc.record({
  cores: fc.integer({ min: 1, max: 32 }),
  memory: fc.integer({ min: 1, max: 64 }),
  isSafari: fc.boolean(),
  isIOS: fc.boolean(),
  isMobile: fc.boolean(),
  prefersReducedMotion: fc.boolean(),
});

// ─── Property 1: AmbientLayer dot count never exceeds tier limit ─────────────
/**
 * Validates: Requirements 1.3, 1.5
 *
 * For any {tier, isMobile, isSafari} configuration, the ambientDotCount must:
 * - === 0 when tier === 'low' || isSafari
 * - <= 6 when isMobile
 * - <= 12 otherwise
 */
describe('Property 1: AmbientLayer dot count never exceeds tier limit', () => {
  it('ambientDotCount respects tier and device limits', () => {
    fc.assert(
      fc.property(deviceInputArb, (input) => {
        const config = computeAnimationConfig(input);

        if (config.tier === 'low' || input.isSafari) {
          expect(config.ambientDotCount).toBe(0);
        } else if (input.isMobile) {
          expect(config.ambientDotCount).toBeLessThanOrEqual(6);
        } else {
          expect(config.ambientDotCount).toBeLessThanOrEqual(12);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 2: Low-tier and Safari configs always produce zero dots ─────────
/**
 * Validates: Requirements 1.5, 20.3
 *
 * For any AnimationConfig where tier === 'low' OR isSafari === true,
 * ambientDotCount must equal 0 and enableAmbientLayer must be false.
 */
describe('Property 2: Low-tier and Safari configs always produce zero dots', () => {
  it('low tier or Safari → ambientDotCount=0 and enableAmbientLayer=false', () => {
    fc.assert(
      fc.property(deviceInputArb, (input) => {
        const config = computeAnimationConfig(input);

        if (config.tier === 'low' || input.isSafari) {
          expect(config.ambientDotCount).toBe(0);
          expect(config.enableAmbientLayer).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 3: AnimationConfig always contains all required fields ──────────
/**
 * Validates: Requirements 11.3
 *
 * For any device capability input, computeAnimationConfig() must return an
 * object with all required fields with correct types.
 */
describe('Property 3: AnimationConfig always contains all required fields', () => {
  it('returns object with all required fields and correct types', () => {
    fc.assert(
      fc.property(deviceInputArb, (input) => {
        const config = computeAnimationConfig(input);

        // Required fields existence
        expect(config).toHaveProperty('tier');
        expect(config).toHaveProperty('reduceMotion');
        expect(config).toHaveProperty('isSafari');
        expect(config).toHaveProperty('isIOS');
        expect(config).toHaveProperty('isMobile');
        expect(config).toHaveProperty('enableAmbientLayer');
        expect(config).toHaveProperty('ambientDotCount');
        expect(config).toHaveProperty('enableCursorGlow');
        expect(config).toHaveProperty('enableMagnetic');
        expect(config).toHaveProperty('enable3DTilt');
        expect(config).toHaveProperty('enableParallax');
        expect(config).toHaveProperty('enableBackdropBlur');
        expect(config).toHaveProperty('enableInfiniteLoops');
        expect(config).toHaveProperty('enableShimmer');

        // Type checks
        expect(['high', 'mid', 'low']).toContain(config.tier);
        expect(typeof config.reduceMotion).toBe('boolean');
        expect(typeof config.isSafari).toBe('boolean');
        expect(typeof config.isIOS).toBe('boolean');
        expect(typeof config.isMobile).toBe('boolean');
        expect(typeof config.enableAmbientLayer).toBe('boolean');
        expect(typeof config.ambientDotCount).toBe('number');
        expect(typeof config.enableCursorGlow).toBe('boolean');
        expect(typeof config.enableMagnetic).toBe('boolean');
        expect(typeof config.enable3DTilt).toBe('boolean');
        expect(typeof config.enableParallax).toBe('boolean');
        expect(typeof config.enableBackdropBlur).toBe('boolean');
        expect(typeof config.enableInfiniteLoops).toBe('boolean');
        expect(typeof config.enableShimmer).toBe('boolean');
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4: Tier classification invariants ───────────────────────────────
/**
 * Validates: Requirements 11.4, 20.1, 20.2, 20.3
 *
 * For any device capability input, the computed tier must satisfy:
 * - prefersReducedMotion === true → tier === 'low'
 * - isIOS === true → tier !== 'high'
 * - cores < 4 → tier !== 'high'
 * - tier === 'high' → cores >= 4 && !isIOS && !prefersReducedMotion
 */
describe('Property 4: Tier classification invariants', () => {
  it('tier invariants hold for all device inputs', () => {
    fc.assert(
      fc.property(deviceInputArb, (input) => {
        const config = computeAnimationConfig(input);

        // prefersReducedMotion → low
        if (input.prefersReducedMotion) {
          expect(config.tier).toBe('low');
        }

        // isIOS → not high
        if (input.isIOS) {
          expect(config.tier).not.toBe('high');
        }

        // cores < 4 → not high
        if (input.cores < 4) {
          expect(config.tier).not.toBe('high');
        }

        // high → cores >= 4 && !isIOS && !prefersReducedMotion
        if (config.tier === 'high') {
          expect(input.cores).toBeGreaterThanOrEqual(4);
          expect(input.isIOS).toBe(false);
          expect(input.prefersReducedMotion).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 5: Feature flag monotonicity across tiers ──────────────────────
/**
 * Validates: Requirements 20.1, 20.2, 20.3
 *
 * For two configs A (higher tier) and B (lower tier), every boolean feature
 * flag that is true in B must also be true in A.
 * Higher tiers are a superset of lower tier capabilities.
 */
describe('Property 5: Feature flag monotonicity across tiers', () => {
  it('higher tier enables at least everything lower tier enables', () => {
    const tierOrder: Record<string, number> = { low: 0, mid: 1, high: 2 };

    // enableBackdropBlur is excluded: it is a platform flag (!isSafari && !isIOS),
    // not a tier capability — a Safari mid-tier device can have it false while a
    // non-Safari low-tier device has it true, which is correct per the spec.
    const booleanFlags: Array<keyof ReturnType<typeof computeAnimationConfig>> = [
      'enableAmbientLayer',
      'enableCursorGlow',
      'enableMagnetic',
      'enable3DTilt',
      'enableParallax',
      'enableInfiniteLoops',
      'enableShimmer',
    ];

    // Generate two device inputs and compare their configs
    fc.assert(
      fc.property(deviceInputArb, deviceInputArb, (inputA, inputB) => {
        const configA = computeAnimationConfig(inputA);
        const configB = computeAnimationConfig(inputB);

        const tierA = tierOrder[configA.tier];
        const tierB = tierOrder[configB.tier];

        // Only check when A is strictly higher tier than B
        if (tierA > tierB) {
          for (const flag of booleanFlags) {
            // If B has the flag enabled, A must also have it enabled
            if (configB[flag] === true) {
              expect(configA[flag]).toBe(true);
            }
          }
        }
      }),
      { numRuns: 200 }
    );
  });
});
