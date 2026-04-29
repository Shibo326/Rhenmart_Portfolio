# Bugfix Requirements Document

## Introduction

The mobile version of Rhenmart Dela Cruz's portfolio website fails to maintain 60fps on Android and iOS devices. The combination of a WebGL 3D hero scene (`HeroScene3D.tsx`), Framer Motion / motion-react animations, CSS particle effects (`Effects.tsx`), ambient floating dots (`AmbientLayer.tsx`), `filter: blur()` orb glows, `backdrop-filter` usage, and multiple concurrent infinite CSS animations creates a GPU and CPU load that exceeds the rendering budget of mobile hardware. The result is visible frame drops, scroll jank, and sluggish interactions across the portfolio's sections — degrading the first impression for potential clients and employers visiting on mobile.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user visits the portfolio on an Android phone with fewer than 6 CPU cores THEN the system renders the Hero section with active CSS particle animations (`animate-particle`), orb glow divs, and concurrent Framer Motion entrance animations simultaneously, causing frame drops below 60fps.

1.2 WHEN a user visits the portfolio on any iOS device THEN the system applies `backdrop-filter: blur()` via the `enableBackdropBlur` flag — which the `AnimationContext` marks as enabled for non-Safari, non-iOS contexts — but WKWebView on iOS can still receive blur through component-level CSS classes not gated by the flag, causing GPU layer thrashing and jank.

1.3 WHEN a user scrolls through the Services, Skills, or Portfolio sections on a mobile device THEN the system triggers multiple Framer Motion `whileInView` entrance animations concurrently with active infinite CSS animations (`animate-hud-flicker`, `animate-border-pulse`, `animate-scan-sweep`, `retro-scanlines`), causing the main thread and compositor to be overloaded and dropping frames.

1.4 WHEN a user visits the portfolio on an Android phone with 6 or more CPU cores (mid tier) THEN the system still runs `enableInfiniteLoops: true` and `enableShimmer: true`, keeping multiple infinite CSS animations running simultaneously across all visible sections, causing sustained GPU load and frame drops during scroll.

1.5 WHEN the Hero section is visible on a mobile device THEN the system renders 20 CSS particle elements (`<Particles count={20} />`) via `Effects.tsx` — even though the component uses `hidden md:block`, the DOM nodes are still created and the animations are still computed — contributing unnecessary layout and paint work on mobile.

1.6 WHEN a user scrolls on a mobile device THEN the system runs `useScrollProgress` with a `useSpring` on `scrollYProgress`, adding a continuous motion value subscription and spring computation on every scroll frame, contributing to main-thread jank.

1.7 WHEN the About, Skills, or Contact sections enter the viewport on a mobile device THEN the system fires multiple staggered `motion` entrance animations with `whileInView` at the same time as ongoing infinite CSS animations, causing animation frame budget overruns.

---

### Expected Behavior (Correct)

2.1 WHEN a user visits the portfolio on an Android phone with fewer than 6 CPU cores (low tier) THEN the system SHALL disable all concurrent infinite CSS animations and reduce Framer Motion entrance animations to simple opacity fades with no stagger, keeping the frame budget within 16.67ms per frame.

2.2 WHEN a user visits the portfolio on any iOS device THEN the system SHALL ensure no `backdrop-filter: blur()` is applied anywhere in the component tree — including via hardcoded CSS classes — and SHALL replace all `filter: blur()` orb glows with `box-shadow` equivalents, preventing GPU layer promotion thrashing.

2.3 WHEN a user scrolls through any section on a mobile device THEN the system SHALL ensure that at most one category of animation runs at a time — either a scroll-triggered entrance animation OR an infinite CSS animation — by pausing infinite animations on elements that are off-screen and throttling concurrent entrance animation counts.

2.4 WHEN a user visits the portfolio on an Android phone with 6 or more CPU cores (mid tier) THEN the system SHALL limit `enableInfiniteLoops` to a maximum of 2 simultaneously active infinite animations and SHALL disable `enableShimmer`, reducing sustained GPU load to a level that maintains 60fps during scroll.

2.5 WHEN the Hero section is rendered on a mobile device THEN the system SHALL not create DOM nodes for the `<Particles>` component at all (not just hide them with CSS), eliminating the animation computation cost entirely on mobile.

2.6 WHEN a user scrolls on a mobile device THEN the system SHALL disable the `useScrollProgress` spring animation on mobile (returning a static value of 0 or omitting the scroll bar entirely), removing the per-frame spring computation from the scroll critical path.

2.7 WHEN the About, Skills, or Contact sections enter the viewport on a mobile device THEN the system SHALL stagger entrance animations with a minimum 150ms delay between each item and SHALL pause all infinite CSS animations on the entering section's siblings until the entrance animation completes, preventing frame budget overruns.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user visits the portfolio on a desktop browser (Chrome, Edge, or Firefox) with 4 or more CPU cores (high tier) THEN the system SHALL CONTINUE TO render the full WebGL 3D hero scene, all particle effects, cursor glow, magnetic button effects, parallax scrolling, and all infinite CSS animations at full fidelity.

3.2 WHEN a user visits the portfolio on macOS Safari with 4 or more CPU cores (mid tier) THEN the system SHALL CONTINUE TO render scroll-triggered entrance animations and the HUD aesthetic without `backdrop-filter` or 3D tilt, matching the existing mid-tier behavior.

3.3 WHEN a user has enabled `prefers-reduced-motion` in their OS settings THEN the system SHALL CONTINUE TO suppress all motion animations and render the portfolio in a static, accessible state, as currently implemented by the low-tier path in `AnimationContext`.

3.4 WHEN a user interacts with the contact form on any device THEN the system SHALL CONTINUE TO submit the form via EmailJS and display success/error toast notifications without any change in behavior.

3.5 WHEN a user clicks the `DL_CV.PDF` button on any device THEN the system SHALL CONTINUE TO generate and download the PDF resume via `generateResume()` without any change in behavior.

3.6 WHEN a user opens the Portfolio modal on a mobile device THEN the system SHALL CONTINUE TO render the modal via React Portal on `document.body`, lock body scroll, and close only via the X button, as currently implemented.

3.7 WHEN a user visits the portfolio on an Android tablet with 6 or more CPU cores (high tier) THEN the system SHALL CONTINUE TO render the full high-tier animation set as currently defined in `AnimationContext`, with no regression to mid or low tier.

3.8 WHEN the Navbar is scrolled past its threshold on any device THEN the system SHALL CONTINUE TO apply the `bg-[#050505]/95` scrolled state and `animate-hud-flicker` on desktop, while mobile SHALL CONTINUE TO show the scrolled state without the flicker animation, matching the existing device-gated behavior.

---

## Bug Condition Pseudocode

### Bug Condition Function

```pascal
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

### Property: Fix Checking

```pascal
// Property: Fix Checking — Mobile 60fps
FOR ALL X WHERE isBugCondition(X) DO
  result ← renderPortfolio'(X)
  ASSERT result.fps >= 60
    AND result.infiniteAnimationCount <= 1
    AND result.backdropFilterActive = false
    AND result.particleDOMNodesCreated = false
    AND result.scrollSpringActive = false
END FOR
```

### Property: Preservation Checking

```pascal
// Property: Preservation Checking — Desktop unaffected
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderPortfolio(X) = renderPortfolio'(X)
END FOR
```
