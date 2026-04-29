# Mobile Performance Optimization Bugfix Design

## Overview

The portfolio website of Rhenmart Dela Cruz drops below 60fps on mobile devices due to the
simultaneous rendering of multiple GPU-intensive effects: a WebGL 3D hero scene
(`HeroScene3D.tsx`), CSS particle animations (`Effects.tsx`), ambient floating dots
(`AmbientLayer.tsx`), `filter: blur()` orb glows, `backdrop-filter` usage in `Navbar.tsx`,
and multiple concurrent infinite CSS animations (`animate-hud-flicker`, `animate-border-pulse`,
`animate-scan-sweep`, `animate-particle`, `animate-orb`, etc.). On top of this, the
`useScrollProgress` hook in `useDeviceAnimations.ts` runs a `useSpring` computation on every
scroll frame, adding main-thread pressure during the most latency-sensitive user interaction.

The fix strategy is **additive gating**: extend the existing `AnimationContext` tier system to
enforce mobile-specific caps on animation concurrency, eliminate DOM nodes for effects that
should not exist on mobile at all, and replace GPU-layer-promoting CSS properties with
compositor-safe equivalents. No desktop behavior is changed.

---

## Glossary

- **Bug_Condition (C)**: The condition that triggers the performance bug — the device is mobile
  (or iOS) AND the animation load exceeds the 16.67ms per-frame budget, causing visible frame
  drops below 60fps.
- **Property (P)**: The desired behavior when the bug condition holds — the portfolio renders at
  ≥60fps with no scroll jank, achieved by capping animation concurrency and eliminating
  GPU-expensive effects on mobile.
- **Preservation**: All desktop animation behavior, the contact form, PDF resume download,
  Portfolio modal, and `prefers-reduced-motion` handling that must remain completely unchanged.
- **isBugCondition**: Pseudocode function (see Bug Details) that identifies a `DeviceContext`
  where the bug manifests.
- **AnimationContext**: The React context in `src/app/context/AnimationContext.tsx` that
  computes per-device feature flags from `detectDeviceCapability()` and distributes them to all
  components via `useAnimationConfig()`.
- **computeAnimationConfig**: The pure function in `AnimationContext.tsx` that maps a
  `DeviceInput` to an `AnimationConfig`. This is the primary fix target.
- **DeviceInput**: The input type to `computeAnimationConfig` — contains `cores`, `isSafari`,
  `isIOS`, `isAndroid`, `isMobile`, `isTablet`, `prefersReducedMotion`.
- **AnimationConfig**: The output type of `computeAnimationConfig` — contains all feature flags
  consumed by components.
- **tier**: The three-level classification (`high` | `mid` | `low`) that drives most feature
  flags. Android mobile with ≥6 cores currently maps to `mid`, which still enables
  `enableInfiniteLoops` and `enableShimmer` — the root cause of bug condition 1.4.
- **enableInfiniteLoops**: Flag that gates infinite CSS animation classes across all sections.
  Currently `true` for `mid` tier, which includes Android mid-range phones.
- **enableShimmer**: Flag that gates shimmer sweep animations. Currently `true` for `mid` tier
  on non-iOS devices.
- **useScrollProgress**: Hook in `useDeviceAnimations.ts` that attaches a `useSpring` to
  `scrollYProgress`, running spring computation on every scroll frame regardless of device.
- **Particles**: Component in `Effects.tsx` that renders 20 `<span>` DOM nodes with
  `animate-particle` class. Currently rendered unconditionally in `Hero.tsx` — the
  `hidden md:block` CSS class hides them visually but does not prevent DOM creation or
  animation computation.
- **isMobileAnimationBudgetExceeded**: New derived flag to be added to `AnimationConfig` that
  signals components to apply mobile-specific animation caps.

---

## Bug Details

### Bug Condition

The bug manifests when a user visits the portfolio on a mobile device (Android phone or any iOS
device) and the `AnimationContext` configuration permits more animation load than the device's
GPU and CPU can sustain within a 16.67ms frame budget. The specific failure modes are:

1. **Android low-tier** (< 6 cores): `computeAnimationConfig` correctly assigns `tier = 'low'`,
   but `Hero.tsx` still calls `<Particles count={20} />` unconditionally — the `hidden md:block`
   CSS class hides the particles visually but the 20 DOM nodes are created and their
   `animate-particle` keyframe animations are computed by the browser's style engine.

2. **iOS (all devices)**: `computeAnimationConfig` correctly sets `enableBackdropBlur = false`
   for iOS, and `Hero.tsx` correctly skips `filter: blur()` orbs. However, `Navbar.tsx` applies
   `backdropFilter: "blur(16px)"` inline when `scrolled && enableBackdropBlur` — this is
   correctly gated. The remaining iOS issue is that `Particles` DOM nodes are still created
   (same as above), and `useScrollProgress` still runs a spring on every scroll frame.

3. **Android mid-tier** (≥ 6 cores): `computeAnimationConfig` assigns `tier = 'mid'`, which
   sets `enableInfiniteLoops: true` and `enableShimmer: true`. This means all infinite CSS
   animations (`animate-hud-flicker`, `animate-border-pulse`, `animate-divider`,
   `animate-pulse-red`, `animate-blink`, `animate-scan`, `animate-beam`, `animate-ripple`) run
   simultaneously across all visible sections during scroll, saturating the GPU compositor.

4. **All mobile**: `useScrollProgress` in `useDeviceAnimations.ts` creates a `useSpring` on
   `scrollYProgress` unconditionally. On mobile, this adds a continuous motion value
   subscription and spring computation to every scroll frame, competing with scroll event
   handling on the main thread.

5. **All mobile**: Multiple `whileInView` Framer Motion entrance animations fire concurrently
   as the user scrolls through sections, while infinite CSS animations continue running on
   already-visible sections, causing frame budget overruns.

**Formal Specification:**

```
FUNCTION isBugCondition(X)
  INPUT: X of type DeviceContext
  OUTPUT: boolean

  // Returns true when the device is mobile AND the animation load exceeds
  // the 60fps frame budget (16.67ms per frame)
  RETURN (X.isMobile = true OR X.isIOS = true)
    AND (
      X.infiniteAnimationCount > 1
      OR X.concurrentEntranceAnimations > 3
      OR X.backdropFilterActive = true
      OR X.particleDOMNodesCreated = true
      OR X.scrollSpringActive = true
    )
END FUNCTION
```

### Examples

- **Android low-tier, Hero section**: User on a 4-core Android phone loads the page. The Hero
  section renders 20 `<span>` nodes with `animate-particle` running. Expected: zero particle
  DOM nodes created. Actual: 20 nodes created and animated.

- **iOS Safari, scrolling**: User on iPhone scrolls through the page. `useScrollProgress`
  runs a `useSpring` on every scroll frame. Expected: static scroll bar value (or no scroll
  bar). Actual: spring computation runs on every scroll frame, competing with scroll handling.

- **Android mid-tier, scrolling through Services**: User on a 6-core Android phone scrolls
  into the Services section. `animate-hud-flicker`, `animate-border-pulse`, `animate-divider`,
  `animate-pulse-red`, and `animate-scan` all run simultaneously while Framer Motion
  `whileInView` entrance animations also fire. Expected: at most 1 infinite animation active
  at a time on mobile. Actual: 5+ infinite animations running concurrently.

- **iOS, Navbar scrolled**: User scrolls past 50px on iOS. `enableBackdropBlur` is `false`
  for iOS, so `backdropFilter` is not applied inline — this is already correctly handled.
  The remaining issue is the `animate-pulse-red` on the logo dot and `animate-blink` on
  scroll indicator, which are not gated by `enableInfiniteLoops` on iOS (iOS gets `tier = 'low'`
  which sets `enableInfiniteLoops: false`, but the `animate-blink` class is hardcoded in
  `Hero.tsx` without checking the flag).

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Desktop browsers (Chrome, Edge, Firefox, ≥4 cores) SHALL continue to render the full WebGL
  3D hero scene, all 20 CSS particles, cursor glow, magnetic button effects, parallax
  scrolling, and all infinite CSS animations at full fidelity.
- macOS Safari (≥4 cores) SHALL continue to render scroll-triggered entrance animations and
  the HUD aesthetic without `backdrop-filter` or 3D tilt, matching the existing mid-tier path.
- `prefers-reduced-motion` SHALL continue to suppress all motion and render the portfolio in
  a static, accessible state, as currently implemented by the low-tier path.
- The contact form SHALL continue to submit via EmailJS and display success/error toasts on
  all devices.
- The `DL_CV.PDF` button SHALL continue to generate and download the PDF resume via
  `generateResume()` on all devices.
- The Portfolio modal SHALL continue to render via React Portal, lock body scroll, and close
  only via the X button on all devices.
- Android tablets (≥768px, ≥6 cores) SHALL continue to receive the `high` tier and render
  the full high-tier animation set.
- The Navbar scrolled state (`bg-[#050505]/95`, `animate-hud-flicker` on desktop) SHALL
  continue to work as currently implemented, with mobile already showing the scrolled state
  without the flicker animation.

**Scope:**
All inputs where `isBugCondition(X)` returns `false` — i.e., non-mobile devices, or mobile
devices where the animation load is already within budget — must be completely unaffected by
this fix. This includes:
- All desktop browser/OS combinations
- Android tablets classified as high-tier
- Any device with `prefers-reduced-motion` enabled (already handled by low-tier path)

**Note:** The actual expected correct behavior for mobile is defined in the Correctness
Properties section (Property 1). This section focuses on what must NOT change.

---

## Hypothesized Root Cause

Based on code analysis of `AnimationContext.tsx`, `Hero.tsx`, `Effects.tsx`, and
`useDeviceAnimations.ts`, the root causes are:

1. **`Particles` component is not conditionally rendered on mobile** (`Hero.tsx`, line ~80):
   `<Particles count={20} />` is called unconditionally. The `hidden md:block` wrapper inside
   `Effects.tsx` hides the container visually but does not prevent React from creating the 20
   `<span>` DOM nodes or the browser from computing their `animate-particle` keyframe
   animations. Fix: gate the `<Particles>` call itself behind `!isMobile` in `Hero.tsx`.

2. **`enableInfiniteLoops` is `true` for Android mid-tier** (`AnimationContext.tsx`,
   `computeAnimationConfig`): The flag is set to `tier !== 'low'`, which means Android phones
   with ≥6 cores (classified as `mid`) get all infinite CSS animations enabled. On mobile,
   even mid-tier hardware cannot sustain multiple concurrent infinite animations during scroll.
   Fix: change the flag to `tier === 'high'` for mobile contexts, or add a new
   `isMobileAnimationBudgetExceeded` flag that components can use to cap concurrency.

3. **`useScrollProgress` runs `useSpring` unconditionally** (`useDeviceAnimations.ts`):
   The hook does not check `isMobile` before creating the spring. On mobile, this adds a
   continuous motion value subscription to every scroll frame. Fix: return a static
   `MotionValue` (value `0`) on mobile, or skip the scroll progress bar entirely.

4. **`animate-blink` and other hardcoded animation classes are not gated by
   `enableInfiniteLoops`** (`Hero.tsx`): The scroll indicator `animate-blink` and the status
   badge `animate-ping` are applied via hardcoded className strings, bypassing the
   `AnimationContext` flag system. On low-tier mobile (iOS, Android < 6 cores), these still
   run. Fix: wrap these in conditional class application using `enableInfiniteLoops`.

5. **Concurrent `whileInView` entrance animations are not throttled on mobile**: Multiple
   sections use Framer Motion `whileInView` with staggered children. When the user scrolls
   quickly, several sections can enter the viewport simultaneously, firing many entrance
   animations at once. Fix: increase stagger delay on mobile and use `viewport={{ amount: 0.3 }}`
   to delay triggering until more of the section is visible.

---

## Correctness Properties

Property 1: Bug Condition - Mobile 60fps Frame Budget

_For any_ `DeviceContext` X where `isBugCondition(X)` returns true (mobile/iOS device with
animation load exceeding the 16.67ms frame budget), the fixed portfolio rendering function
`renderPortfolio'(X)` SHALL produce a result where:
- `result.fps >= 60`
- `result.infiniteAnimationCount <= 1`
- `result.backdropFilterActive = false`
- `result.particleDOMNodesCreated = false`
- `result.scrollSpringActive = false`

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation - Desktop and Non-Mobile Behavior Unchanged

_For any_ `DeviceContext` X where `isBugCondition(X)` returns false (desktop, Android tablet
high-tier, or any device already within animation budget), the fixed portfolio rendering
function `renderPortfolio'(X)` SHALL produce exactly the same result as the original
`renderPortfolio(X)`, preserving all animation flags, DOM structure, and visual fidelity for
non-mobile contexts.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### Changes Required

Assuming the root cause analysis above is correct, the following targeted changes are needed:

---

**File**: `src/app/context/AnimationContext.tsx`

**Function**: `computeAnimationConfig`

**Specific Changes**:

1. **Cap `enableInfiniteLoops` on mobile**: Change the flag from `tier !== 'low'` to
   `tier !== 'low' && !isMobile`. Android mid-tier phones (≥6 cores, `tier = 'mid'`) will now
   have `enableInfiniteLoops: false`, matching the behavior of low-tier Android and iOS.
   Desktop mid-tier (macOS Safari, Windows/Chrome < 4 cores) is unaffected because `isMobile`
   is `false` for those devices.

   ```ts
   // Before
   enableInfiniteLoops: tier !== 'low',
   // After
   enableInfiniteLoops: tier !== 'low' && !isMobile,
   ```

2. **Cap `enableShimmer` on mobile**: Change from `tier !== 'low' && !isIOS` to
   `tier !== 'low' && !isIOS && !isMobile`. Shimmer sweep animations add GPU layer promotions
   on mobile.

   ```ts
   // Before
   enableShimmer: tier !== 'low' && !isIOS,
   // After
   enableShimmer: tier !== 'low' && !isIOS && !isMobile,
   ```

3. **Add `isMobileAnimationBudgetExceeded` flag** to `AnimationConfig` interface and
   `computeAnimationConfig` return value. This flag is `true` when `isMobile || isIOS`. It
   gives components a single, semantically clear signal to apply mobile-specific caps without
   re-deriving device state.

   ```ts
   // In AnimationConfig interface
   isMobileAnimationBudgetExceeded: boolean;

   // In computeAnimationConfig return
   isMobileAnimationBudgetExceeded: isMobile || isIOS,
   ```

4. **Update `defaultConfig`** to include `isMobileAnimationBudgetExceeded: false` (safe
   fallback for SSR/test environments).

---

**File**: `src/app/components/Hero.tsx`

**Specific Changes**:

5. **Gate `<Particles>` behind `!isMobile`**: Replace the unconditional `<Particles count={20} />`
   call with a conditional render. This eliminates the 20 DOM nodes and their animation
   computation entirely on mobile.

   ```tsx
   // Before
   <Particles count={20} />

   // After
   {!isMobile && <Particles count={20} />}
   ```

6. **Gate `animate-blink` on scroll indicator behind `enableInfiniteLoops`**: The
   `[ SCROLL_DOWN ]` text uses `animate-blink` unconditionally. On mobile with
   `enableInfiniteLoops: false`, this should be a static element.

   ```tsx
   // Before
   className="font-mono text-[10px] tracking-widest text-[rgba(255,255,255,0.55)] animate-blink"

   // After
   className={`font-mono text-[10px] tracking-widest text-[rgba(255,255,255,0.55)] ${enableInfiniteLoops ? 'animate-blink' : ''}`}
   ```

7. **Gate `animate-ping` on status badge behind `enableInfiniteLoops`**: The red ping dot in
   the status badge uses `animate-ping` unconditionally.

   ```tsx
   // Before
   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-60" />

   // After
   {enableInfiniteLoops && (
     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-60" />
   )}
   ```

---

**File**: `src/app/hooks/useDeviceAnimations.ts`

**Function**: `useScrollProgress`

**Specific Changes**:

8. **Disable spring on mobile in `useScrollProgress`**: Check `isMobile` before creating the
   spring. On mobile, return a static `MotionValue` with value `0` to eliminate the per-frame
   spring computation from the scroll critical path.

   ```ts
   export function useScrollProgress() {
     const isMobile = useIsMobile();
     const { scrollYProgress } = useScroll();
     const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
     // On mobile, return a static value — no spring computation on scroll frames
     const staticValue = useMotionValue(0);
     return isMobile ? staticValue : scaleX;
   }
   ```

---

**File**: `src/styles/index.css`

**Specific Changes**:

9. **Verify mobile CSS media query completeness**: The existing `@media (max-width: 767px)`
   block already disables `animate-orb`, `animate-rotate-slow`, `animate-rotate-slower`,
   `animate-float`, `animate-shimmer`, `animate-glitch-hard`, `animate-hud-flicker`, and
   `animate-flicker`. Confirm that `animate-particle`, `animate-scan`, `animate-beam`,
   `animate-border-pulse`, and `animate-pulse-red` are also suppressed on mobile, or add them
   to the block. CSS-level suppression acts as a safety net even if component-level gating
   is missed.

   ```css
   @media (max-width: 767px) {
     /* Add to existing list: */
     .animate-particle,
     .animate-scan,
     .animate-beam,
     .animate-border-pulse,
     .animate-pulse-red,
     .animate-blink,
     .animate-ping,
     .animate-ripple,
     .animate-divider {
       animation: none !important;
     }
   }
   ```

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that
demonstrate the bug on unfixed code to confirm the root cause analysis; then verify the fix
works correctly and preserves all existing desktop behavior.

The primary test targets are the pure functions `computeAnimationConfig` (in
`AnimationContext.tsx`) and `useScrollProgress` (in `useDeviceAnimations.ts`), since these
are the decision points that determine what animation load each device receives. Unit and
property-based tests against these functions provide strong guarantees without requiring a
real mobile device or browser.

---

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix.
Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write unit tests that call `computeAnimationConfig` with mobile `DeviceInput`
values and assert that the returned `AnimationConfig` violates the expected mobile caps. Run
these tests on the UNFIXED code to observe failures and confirm the root cause.

**Test Cases**:

1. **Android mid-tier infinite loops test**: Call `computeAnimationConfig` with
   `{ isMobile: true, isAndroid: true, cores: 6, isIOS: false, isSafari: false, isTablet: false, prefersReducedMotion: false }`.
   Assert `result.enableInfiniteLoops === false`. Will FAIL on unfixed code (returns `true`).

2. **Android mid-tier shimmer test**: Same input as above. Assert
   `result.enableShimmer === false`. Will FAIL on unfixed code (returns `true`).

3. **iOS scroll spring test**: Render `useScrollProgress` in a test environment with
   `window.innerWidth = 375`. Assert the returned value is a static `MotionValue` (not a
   spring). Will FAIL on unfixed code (returns a spring-backed value).

4. **Particles DOM node test**: Render `<Hero />` with `isMobile = true` in the
   `AnimationContext`. Assert that no elements with `animate-particle` class exist in the
   rendered output. Will FAIL on unfixed code (20 nodes are created).

5. **iOS low-tier infinite loops test**: Call `computeAnimationConfig` with
   `{ isIOS: true, isMobile: true, cores: 6, isSafari: true, isAndroid: false, isTablet: false, prefersReducedMotion: false }`.
   Assert `result.enableInfiniteLoops === false`. Should PASS on unfixed code (iOS always gets
   `tier = 'low'`). This is a baseline confirmation test.

**Expected Counterexamples**:
- `computeAnimationConfig` returns `enableInfiniteLoops: true` for Android mid-tier mobile
  inputs — confirms root cause 2.
- `computeAnimationConfig` returns `enableShimmer: true` for Android mid-tier mobile inputs
  — confirms root cause 2.
- `<Particles>` DOM nodes are present in Hero render output when `isMobile = true` — confirms
  root cause 1.

---

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces
the expected behavior.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition(X) DO
  result := renderPortfolio'(X)
  ASSERT result.fps >= 60
    AND result.infiniteAnimationCount <= 1
    AND result.backdropFilterActive = false
    AND result.particleDOMNodesCreated = false
    AND result.scrollSpringActive = false
END FOR
```

**Concrete assertions on `computeAnimationConfig'` (fixed version):**
```
FOR ALL X WHERE (X.isMobile = true OR X.isIOS = true) DO
  config := computeAnimationConfig'(X)
  ASSERT config.enableInfiniteLoops = false
  ASSERT config.enableShimmer = false
  ASSERT config.enable3DScene = false
  ASSERT config.isMobileAnimationBudgetExceeded = true
END FOR
```

---

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function
produces the same result as the original function.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT computeAnimationConfig(X) = computeAnimationConfig'(X)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the full input domain (all combinations of
  `cores`, `isSafari`, `isIOS`, `isAndroid`, `isMobile`, `isTablet`, `prefersReducedMotion`).
- It catches edge cases that manual unit tests might miss (e.g., `isTablet: true, isMobile: false`
  on Android, or `isSafari: true, isIOS: false` for macOS Safari).
- It provides strong guarantees that no desktop configuration is accidentally downgraded.

**Test Plan**: Observe the output of `computeAnimationConfig` on non-mobile inputs on UNFIXED
code to establish the baseline, then write property-based tests that assert the fixed version
produces identical output for all non-mobile inputs.

**Test Cases**:

1. **Desktop Chrome/Edge/Firefox preservation**: For all `X` where `X.isMobile = false AND
   X.isTablet = false AND X.isSafari = false AND X.isIOS = false`, assert
   `computeAnimationConfig(X) = computeAnimationConfig'(X)`.

2. **macOS Safari preservation**: For all `X` where `X.isSafari = true AND X.isIOS = false AND
   X.isMobile = false`, assert `computeAnimationConfig(X) = computeAnimationConfig'(X)`.

3. **Android tablet high-tier preservation**: For all `X` where `X.isAndroid = true AND
   X.isTablet = true AND X.cores >= 6`, assert
   `computeAnimationConfig(X) = computeAnimationConfig'(X)`.

4. **`prefers-reduced-motion` preservation**: For all `X` where
   `X.prefersReducedMotion = true`, assert `computeAnimationConfig(X) = computeAnimationConfig'(X)`
   (both should return `tier = 'low'` with all flags disabled).

---

### Unit Tests

- Test `computeAnimationConfig` with Android low-tier input (`isMobile: true, cores: 4`) —
  assert `enableInfiniteLoops: false`, `enableShimmer: false`, `enable3DScene: false`,
  `isMobileAnimationBudgetExceeded: true`.
- Test `computeAnimationConfig` with Android mid-tier input (`isMobile: true, cores: 6`) —
  assert `enableInfiniteLoops: false`, `enableShimmer: false`, `tier: 'mid'` (tier unchanged),
  `isMobileAnimationBudgetExceeded: true`.
- Test `computeAnimationConfig` with iOS input — assert `enableInfiniteLoops: false`,
  `enableBackdropBlur: false`, `isMobileAnimationBudgetExceeded: true`.
- Test `computeAnimationConfig` with desktop Chrome input (`isMobile: false, cores: 8`) —
  assert `enableInfiniteLoops: true`, `enableShimmer: true`, `enable3DScene: true`,
  `isMobileAnimationBudgetExceeded: false`.
- Test `computeAnimationConfig` with macOS Safari input — assert `enableInfiniteLoops: true`
  (Safari mid-tier desktop should keep infinite loops), `isMobileAnimationBudgetExceeded: false`.
- Test `useScrollProgress` on mobile viewport — assert returned value is a static `MotionValue`.
- Test `<Hero />` render with `isMobile: true` — assert no `animate-particle` elements in DOM.
- Test `<Hero />` render with `isMobile: false` — assert 20 `animate-particle` elements in DOM.

### Property-Based Tests

- **Property 1 (Fix Checking)**: For all `DeviceInput` where `isMobile = true OR isIOS = true`,
  `computeAnimationConfig'` SHALL return `enableInfiniteLoops = false` AND
  `enableShimmer = false` AND `isMobileAnimationBudgetExceeded = true`. Generate random
  combinations of `cores` (1–16), `isAndroid` (true/false), `isSafari` (true/false) while
  holding `isMobile = true`.

- **Property 2 (Preservation)**: For all `DeviceInput` where `isMobile = false AND isTablet = false
  AND isIOS = false`, `computeAnimationConfig'` SHALL return the same value as
  `computeAnimationConfig`. Generate random combinations of `cores` (1–16), `isSafari`
  (true/false), `isAndroid` (true/false), `prefersReducedMotion` (true/false).

- **Property 3 (Tier Stability)**: For all `DeviceInput`, the `tier` field of
  `computeAnimationConfig'` SHALL equal the `tier` field of `computeAnimationConfig`. The fix
  must not change tier classification — only the derived flags.

- **Property 4 (Monotonicity)**: For any `DeviceInput` X, if `computeAnimationConfig(X)`
  returns `enableInfiniteLoops = false`, then `computeAnimationConfig'(X)` SHALL also return
  `enableInfiniteLoops = false`. The fix only disables animations, never enables them for
  inputs that were already disabled.

### Integration Tests

- Full page render on simulated mobile viewport (375px width) — assert no WebGL canvas in DOM,
  no `animate-particle` elements, `backdrop-filter` not applied to Navbar.
- Scroll simulation on mobile viewport — assert `useScrollProgress` does not create a spring
  subscription (verify by checking that scroll events do not trigger motion value updates).
- Navbar scroll state on mobile — assert `bg-[#050505]/95` class is applied after scrolling
  50px, and `backdropFilter` style is not set.
- Contact form submission on mobile — assert EmailJS is called and toast notification appears
  (regression test for requirement 3.4).
- PDF download on mobile — assert `generateResume()` is called when DL_CV.PDF is clicked
  (regression test for requirement 3.5).
- Portfolio modal on mobile — assert modal opens, body scroll is locked, and modal closes only
  via X button (regression test for requirement 3.6).
