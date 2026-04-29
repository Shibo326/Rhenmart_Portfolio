# Requirements Document

## Introduction

This is a comprehensive v2 overhaul of the animation system for Rhenmart Dela Cruz's personal portfolio website. Building on the v1 foundation, this revision addresses critical UX problems discovered through a first-time-visitor audit, removes all remaining GPU-heavy canvas rendering, introduces a unified animation context, adds cross-platform optimization rules, and gives each section a distinct cinematic personality. The goal is a portfolio that feels premium, smooth, and trustworthy on every device — from a high-end desktop to a mid-range Android phone.

## Glossary

- **Animation_System**: The collection of Framer Motion components, hooks, and utilities that drive all motion on the portfolio site.
- **AnimationProvider**: A new React context component that wraps the entire app and computes device tier, reduced motion preference, and platform flags once at startup.
- **AmbientLayer**: The CSS-only replacement for all canvas-based background animations — a small set of floating dots driven purely by `@keyframes`.
- **ParticleField**: The existing canvas-based animated particle network component (`ParticleField.tsx`) — targeted for full removal.
- **StellarBackground**: The existing Framer Motion twinkling-star background component (`StellarBackground.tsx`) — targeted for full removal from all usage sites.
- **LiveBackground**: The canvas-based node-connection background rendered in `Home.tsx` — targeted for full removal.
- **ParticleCanvas**: The canvas element inside `LoadingScreen.tsx` driven by a `requestAnimationFrame` loop — targeted for full removal.
- **Interaction_Animation**: Motion triggered directly by user input — hover, tap, focus, drag.
- **Transition_Animation**: Motion that plays when a section enters or exits the viewport, or when the page first loads.
- **Micro_Animation**: Small, purposeful motion on UI elements (buttons, badges, icons, form fields, skill rings, stat cards) that communicates state or adds delight.
- **Nav_Animation**: Motion specific to the Navbar — entry, active-link indicator, scroll-state change, and mobile menu open/close.
- **Scroll_Animation**: Viewport-driven motion tied to scroll position or scroll progress.
- **Reduced_Motion_Mode**: The animation state applied when `prefers-reduced-motion: reduce` is detected — all decorative motion is disabled; only opacity transitions are permitted.
- **Device_Tier**: A classification (high / mid / low) computed once by `AnimationProvider` and consumed via `useAnimationConfig()`.
- **MagneticButton**: A CTA button that translates toward the cursor when the cursor enters a proximity zone of 80px.
- **Toast**: A transient notification that appears at the top-right of the viewport, auto-dismisses after 4 seconds, and does not replace the form.

---

## Requirements

### Requirement 1: Particle Background Reduction

**User Story:** As a site visitor, I want the background to feel atmospheric without taxing my GPU, so that the page stays smooth and responsive while I browse.

#### Acceptance Criteria

1. THE Animation_System SHALL remove the canvas-based ParticleField component from all page layouts.
2. THE Animation_System SHALL replace the full StellarBackground component usage with the AmbientLayer as the sole background particle presence.
3. THE AmbientLayer SHALL render no more than 12 floating dot elements on desktop and no more than 6 on mobile.
4. THE AmbientLayer SHALL animate exclusively using CSS `opacity` and `transform: translateY` — no canvas, no `requestAnimationFrame` loop, no connection-line drawing.
5. WHEN Device_Tier is "low" or the browser is Safari, THE AmbientLayer SHALL render 0 elements.
6. THE AmbientLayer SHALL use only `#FF0000` and `rgba(255,255,255,0.4)` as dot colors to preserve the stellar brand aesthetic.

---

### Requirement 2: Hero Section Transition Animation

**User Story:** As a site visitor, I want the Hero section to greet me with a cinematic, orchestrated entrance, so that I immediately feel the quality and craft of the designer's work.

#### Acceptance Criteria

1. WHEN the Hero section mounts, THE Animation_System SHALL play a sequenced entrance: ambient particles fade in first (0–300 ms), then the name letters animate in (300–900 ms), then the subtitle and badge (900–1100 ms), then the social icons and CTA buttons (1100–1400 ms), then the stats row (1400–1600 ms).
2. THE Animation_System SHALL animate each letter of "Rhenmart" with a staggered `y: 60 → 0` and `rotateX: -90deg → 0deg` entrance using the `ease.out` curve.
3. WHEN the user scrolls the Hero section out of view, THE Animation_System SHALL apply a parallax exit: text content translates upward at 0.4× scroll speed and fades to opacity 0 by the time the section is 70% scrolled past.
4. THE Animation_System SHALL animate the profile image container with a `scale: 0.85 → 1` and `x: 40px → 0` entrance, spring-based (`stiffness: 120, damping: 20`).
5. WHEN the profile image is hovered on desktop, THE Animation_System SHALL apply a `scale: 1.03` lift with a simultaneous red glow intensification (`boxShadow` from `rgba(255,0,0,0.15)` to `rgba(255,0,0,0.35)`), transitioning over 400 ms.
6. THE Animation_System SHALL animate the scan-line effect on the profile image on desktop non-Safari only, using a single `translateY` loop with no GPU-composited filter changes mid-animation.

---

### Requirement 3: Section Entrance Transition Animations

**User Story:** As a site visitor, I want each section to reveal itself with a distinct, polished entrance as I scroll, so that the page feels alive and intentional rather than static.

#### Acceptance Criteria

1. WHEN a section (Services, About, Skills, Portfolio, Contact) enters the viewport, THE Animation_System SHALL trigger a `whileInView` entrance animation with `once: true` and a `-80px` viewport margin.
2. THE Animation_System SHALL animate section headings with a `y: 40 → 0` and `opacity: 0 → 1` transition using `ease.out` over 600 ms.
3. THE Animation_System SHALL animate section content cards/items with a staggered entrance: each child delays by 80 ms from the previous, animating `y: 30 → 0` and `opacity: 0 → 1`.
4. WHEN a Services card enters the viewport, THE Animation_System SHALL additionally animate a `scale: 0.92 → 1` with a spring transition (`stiffness: 200, damping: 24`).
5. WHEN a Skills ring enters the viewport, THE Animation_System SHALL animate the ring's stroke from `pathLength: 0` to its target fill percentage over 1200 ms using `ease.inOut`.
6. WHEN a Portfolio card enters the viewport, THE Animation_System SHALL animate it with a `y: 50 → 0`, `opacity: 0 → 1`, and `rotateX: 8deg → 0deg` entrance, giving a card-flip-forward feel.
7. IF a section entrance animation has already played (`once: true`), THEN THE Animation_System SHALL NOT replay it on subsequent scroll passes.

---

### Requirement 4: Interaction Animations — Buttons and CTAs

**User Story:** As a site visitor, I want buttons and CTAs to respond to my interactions with satisfying, premium-feeling motion, so that every click and hover feels intentional and high-quality.

#### Acceptance Criteria

1. WHEN a primary CTA button (e.g., "Hire Me", "Send Message") is hovered on desktop, THE Animation_System SHALL apply `scale: 1.06`, a red glow (`boxShadow: 0 0 40px rgba(255,0,0,0.55)`), and a shimmer sweep across the button surface, all within 300 ms.
2. WHEN a primary CTA button is tapped or clicked, THE Animation_System SHALL apply `scale: 0.96` with a spring snap-back (`stiffness: 400, damping: 20`).
3. WHEN a secondary/outline button is hovered on desktop, THE Animation_System SHALL animate the border color from `rgba(255,255,255,0.2)` to `#FF0000` and the text color to `#FF0000` over 250 ms.
4. WHEN the "Download CV" button is clicked, THE Animation_System SHALL play a brief `y: 0 → 4px → 0` bounce on the download icon over 300 ms before triggering the download action.
5. THE Animation_System SHALL apply a `whileTap` scale reduction of `0.94–0.97` to all interactive elements (buttons, nav links, social icons, portfolio cards) to provide tactile feedback.
6. WHEN a social icon is hovered on desktop, THE Animation_System SHALL animate `scale: 1.15`, `y: -6px`, and apply the icon's brand color as `backgroundColor` and `boxShadow`, transitioning over 200 ms using `springs.snappy`.

---

### Requirement 5: Interaction Animations — Cards and Portfolio Items

**User Story:** As a site visitor, I want portfolio and service cards to respond to hover with rich, 3D-aware motion, so that the gallery feels premium and interactive.

#### Acceptance Criteria

1. WHEN a Services card is hovered on desktop, THE Animation_System SHALL apply a 3D tilt effect: `rotateX` and `rotateY` up to ±8 degrees based on cursor position within the card, with `perspective: 1000px` and `transformStyle: preserve-3d`.
2. WHEN a Services card is hovered on desktop, THE Animation_System SHALL simultaneously animate a radial spotlight gradient that follows the cursor position within the card, using a CSS custom property updated via `onMouseMove`.
3. WHEN a Portfolio card is hovered on desktop, THE Animation_System SHALL apply `scale: 1.03`, `y: -8px`, and intensify the card's border glow from `rgba(255,0,0,0.1)` to `rgba(255,0,0,0.4)` over 300 ms.
4. WHEN a Portfolio card hover ends, THE Animation_System SHALL return all card properties to their resting state using a spring transition (`stiffness: 200, damping: 28`) with no abrupt snapping.
5. WHEN a Skills tool badge is hovered on desktop, THE Animation_System SHALL apply `scale: 1.1`, `y: -4px`, and a subtle `boxShadow` glow in the tool's brand color over 200 ms.
6. THE Animation_System SHALL disable all 3D tilt and cursor-tracking effects on mobile and low-tier devices.

---

### Requirement 6: Micro-Animations — Form and Contact

**User Story:** As a site visitor filling out the contact form, I want the form fields and submission flow to feel polished and responsive, so that I trust the form and feel confident submitting it.

#### Acceptance Criteria

1. WHEN a contact form input or textarea receives focus, THE Animation_System SHALL animate the field's border color from `rgba(255,255,255,0.1)` to `#FF0000` and add a subtle `boxShadow: 0 0 0 3px rgba(255,0,0,0.15)` over 200 ms.
2. WHEN a contact form input or textarea loses focus with a non-empty value, THE Animation_System SHALL retain a `border-color: rgba(255,0,0,0.4)` to indicate a filled state.
3. WHEN the contact form "Send Message" button is in a loading/submitting state, THE Animation_System SHALL replace the button label with a spinner animation and apply a `opacity: 0.7` to the button, preventing re-submission.
4. WHEN the contact form submission succeeds, THE Animation_System SHALL display a Toast notification at the top-right of the viewport instead of replacing the form, and the form SHALL remain visible and usable.
5. IF the contact form submission fails, THEN THE Animation_System SHALL play an error shake: `x: [0, -8, 8, -6, 6, 0]` over 400 ms on the submit button, then restore the button to its default state.
6. WHEN a contact info card is hovered on desktop, THE Animation_System SHALL animate `y: -6px` and intensify the card's left-border accent glow over 250 ms.

---

### Requirement 7: Navbar Animations

**User Story:** As a site visitor, I want the navbar to feel polished and spatially aware — showing me where I am and responding to my interactions — so that navigation feels effortless and premium.

#### Acceptance Criteria

1. WHEN the Navbar mounts, THE Animation_System SHALL animate it in with `y: -60px → 0` and `opacity: 0 → 1` using `ease.out` over 500 ms, with nav links staggered at 60 ms intervals after the bar itself.
2. WHEN the user scrolls past 50px, THE Animation_System SHALL transition the Navbar background from `transparent` to `rgba(5,5,5,0.92)` with `backdropFilter: blur(16px)` (desktop non-Safari only) and a `border-bottom: 1px solid rgba(255,255,255,0.08)`, animating over 300 ms.
3. WHEN the user scrolls back to the top (scrollY < 50px), THE Animation_System SHALL reverse the Navbar background transition back to transparent over 300 ms.
4. WHEN a nav link becomes the active section link, THE Animation_System SHALL animate the red underline indicator from `scaleX: 0 → 1` with `originX: 0` using a spring transition (`stiffness: 300, damping: 28`).
5. WHEN a nav link is hovered on desktop, THE Animation_System SHALL animate the text from `color: rgba(255,255,255,0.6)` to `color: rgba(255,255,255,1)` over 150 ms and show a faint red underline at `opacity: 0.4`.
6. WHEN the mobile menu is opened, THE Animation_System SHALL animate the container with `height: 0 → auto` and `opacity: 0 → 1` using `ease.out` over 280 ms, with each menu item staggered at 50 ms intervals sliding in from `x: -20px`.
7. WHEN the mobile menu is closed, THE Animation_System SHALL animate the container with `height: auto → 0` and `opacity: 1 → 0` over 220 ms.
8. WHEN the mobile menu toggle icon transitions between hamburger and X, THE Animation_System SHALL animate the outgoing icon with `rotate: 0 → 90deg` and `opacity: 1 → 0`, and the incoming icon with `rotate: -90deg → 0` and `opacity: 0 → 1`, each over 150 ms.
9. WHEN the "Hire Me" CTA button in the Navbar is hovered on desktop, THE Animation_System SHALL apply `scale: 1.05` and `boxShadow: 0 0 20px rgba(255,0,0,0.4)` over 200 ms.

---

### Requirement 8: Scroll Progress and Scroll-Linked Animations

**User Story:** As a site visitor, I want subtle scroll-linked feedback that shows my reading progress and adds depth to the page, so that scrolling feels rewarding and spatially grounded.

#### Acceptance Criteria

1. THE Animation_System SHALL render a scroll progress bar fixed at the top of the viewport, scaling from `scaleX: 0` to `scaleX: 1` on the X axis as the user scrolls from top to bottom, using a `useSpring`-smoothed `scrollYProgress` value.
2. THE scroll progress bar SHALL use a `background: linear-gradient(90deg, #FF0000, #FF4444, #FF0000)` and a height of `2px`.
3. WHEN the About section is in view, THE Animation_System SHALL apply a parallax offset to the profile/bio image at 0.3× scroll speed using `useTransform` on `scrollYProgress`.
4. WHEN the Hero section is scrolled past, THE Animation_System SHALL fade the Hero content to `opacity: 0` by the time `scrollYProgress` reaches `0.7` within the section.
5. THE scroll progress bar SHALL use `useSpring` with `stiffness: 200, damping: 40` to track scroll position without noticeable lag.
6. WHEN Device_Tier is "low" or the device is mobile, THE Animation_System SHALL disable parallax scroll effects and retain only opacity-based scroll transitions.

---

### Requirement 9: Loading Screen Animation

**User Story:** As a site visitor, I want the loading screen to feel like a premium brand moment, so that my first impression of the portfolio is one of quality and attention to detail.

#### Acceptance Criteria

1. WHEN the LoadingScreen mounts, THE Animation_System SHALL animate the logo/name in with a `scale: 0.7 → 1` and `opacity: 0 → 1` spring entrance (`stiffness: 200, damping: 22`).
2. THE LoadingScreen SHALL display a progress indicator that animates from `scaleX: 0` to `scaleX: 1` over the loading duration using `ease.inOut`.
3. WHEN loading is complete, THE Animation_System SHALL play an exit animation: the LoadingScreen fades to `opacity: 0` and scales to `scale: 1.05` over 500 ms before unmounting.
4. THE LoadingScreen exit animation SHALL use `AnimatePresence` with `mode: "wait"` to ensure the main content does not render until the exit animation completes.
5. THE LoadingScreen SHALL replace the ParticleCanvas with 6 CSS-animated dots using `animation: float` keyframes — no canvas, no `requestAnimationFrame` loop.

---

### Requirement 10: Reduced Motion and Performance Compliance

**User Story:** As a site visitor with motion sensitivity or a low-end device, I want the site to respect my preferences and device capabilities, so that I can browse comfortably without performance issues or discomfort.

#### Acceptance Criteria

1. WHEN `prefers-reduced-motion: reduce` is detected, THE Animation_System SHALL disable all decorative motion (parallax, floating, shimmer, tilt, glow pulses) and replace entrance animations with simple `opacity: 0 → 1` transitions of 200 ms or less.
2. WHEN `prefers-reduced-motion: reduce` is detected, THE Animation_System SHALL retain functional animations only: focus ring transitions, form state feedback, and the scroll progress bar.
3. WHEN Device_Tier is "low", THE Animation_System SHALL disable 3D transforms, backdrop-filter blur, canvas operations, and continuous loop animations.
4. WHEN the browser is Safari (desktop or iOS), THE Animation_System SHALL disable `filter: blur()` mid-animation, `backdropFilter` on mobile, and canvas-based rendering.
5. THE Animation_System SHALL use `will-change: transform, opacity` only on elements that are actively animating, and SHALL remove the property via `onAnimationComplete` callback after animation completion to avoid excess memory usage.
6. THE Animation_System SHALL cap all continuous loop animations (floating, shimmer, pulse) to elements that are currently within the viewport using `useInView` or `IntersectionObserver`, pausing them when off-screen.

---

### Requirement 11: Unified AnimationProvider Context

**User Story:** As a developer maintaining this portfolio, I want a single source of truth for device capability and animation config, so that I don't have to call `detectDeviceCapability()` in every component and risk inconsistent results.

#### Acceptance Criteria

1. A single `AnimationProvider` component SHALL wrap the entire app and compute device tier once on mount.
2. All components SHALL consume animation config via a `useAnimationConfig()` hook instead of calling `detectDeviceCapability()` directly.
3. THE AnimationProvider SHALL expose: `tier` (high / mid / low), `reduceMotion` (boolean), `isSafari` (boolean), `isIOS` (boolean), and `isMobile` (boolean).
4. Device_Tier SHALL be classified as: high (desktop Chrome/Edge/Firefox with 8+ cores, or 4+ cores with a discrete GPU), mid (desktop Safari, high-end mobile Chrome), low (mid/low Android, older iOS, any device with fewer than 4 cores).
5. THE AnimationProvider SHALL listen to the `prefers-reduced-motion` media query reactively and update `reduceMotion` without requiring a page reload.

---

### Requirement 12: Canvas Removal and CSS-Only Ambient Layer

**User Story:** As a site visitor on any device, I want the portfolio to load fast and stay smooth, so that GPU-heavy canvas animations never block my interaction with the page.

#### Acceptance Criteria

1. THE ParticleCanvas in LoadingScreen SHALL be removed and replaced with 6 CSS-animated dots using `animation: float` keyframes.
2. THE LiveBackground canvas in Home.tsx SHALL be removed entirely — no canvas element, no `requestAnimationFrame` loop.
3. THE ParticleField component import and all usages in Home.tsx SHALL be removed.
4. THE StellarBackground usage in Hero.tsx portrait container SHALL be removed.
5. THE StellarBackground usage in About.tsx image container SHALL be removed.
6. A new `AmbientLayer` CSS component SHALL replace all of the above — rendering a maximum of 12 dots on desktop, 6 on mobile, and 0 on low-tier devices.
7. THE AmbientLayer SHALL use only CSS `@keyframes` with `opacity` and `translateY` properties — no JavaScript animation loop of any kind.

---

### Requirement 13: Portfolio Section UX Fixes

**User Story:** As a mobile visitor browsing the portfolio, I want to see project titles and be able to interact with cards and modals naturally, so that I can explore the work without friction.

#### Acceptance Criteria

1. Portfolio cards SHALL always show title and role text on mobile — content SHALL NOT be hidden behind a hover state on touch devices.
2. THE portfolio modal SHALL support a swipe-down-to-close gesture on mobile using touch events (`touchstart`, `touchmove`, `touchend`).
3. THE "Case Studies: 0" stat card SHALL be hidden when its count is 0, so that zero-value stats are never displayed to visitors.
4. WHEN a filter tab is clicked, THE Portfolio section SHALL smooth-scroll to the top of the portfolio grid.
5. WHEN a filter returns 0 results, THE Portfolio section SHALL display an empty state message: "No projects in this category yet."
6. THE filter tab row on mobile SHALL show a gradient fade on both the left and right edges to indicate horizontal scrollability.
7. Portfolio card category badges SHALL use a colored dot indicator matching the category color, not plain text alone.

---

### Requirement 14: Navbar IntersectionObserver Active State

**User Story:** As a site visitor scrolling through the portfolio, I want the navbar to always show which section I'm currently reading, so that I maintain spatial awareness without having to click anything.

#### Acceptance Criteria

1. THE Navbar SHALL use `IntersectionObserver` to detect which section is currently in the viewport.
2. WHEN a section enters the viewport at greater than 40% visibility, THE corresponding nav link SHALL become active.
3. THE active link underline indicator SHALL animate with a spring transition using `stiffness: 300, damping: 28`.
4. THE active state SHALL update automatically on scroll without requiring any click interaction.

---

### Requirement 15: Hero Bug Fixes

**User Story:** As a site visitor, I want the Hero section to display correct icons and a clean layout on mobile, so that the first impression is polished and error-free.

#### Acceptance Criteria

1. THE "Competition Winner" stat card SHALL use the `Trophy` icon from lucide-react — the `Github` icon currently used is a bug and SHALL be replaced.
2. THE Hero scroll indicator SHALL be hidden on mobile to reduce visual noise on small screens.
3. THE Hero portrait floating badge ("Available for Freelance") SHALL be visible on mobile — the current `hidden sm:block` class SHALL be removed or adjusted so the badge renders on all screen sizes.

---

### Requirement 16: Magnetic Button Effect

**User Story:** As a desktop visitor hovering over primary CTAs, I want the buttons to subtly attract my cursor, so that the interaction feels premium and physically satisfying.

#### Acceptance Criteria

1. Primary CTA buttons ("Hire Me", "Send Message") SHALL implement a magnetic effect: WHEN the cursor enters a proximity zone of 80px around the button, THE button SHALL translate toward the cursor by up to 12px using `useMotionValue` and `useSpring`.
2. WHEN the cursor leaves the magnetic proximity zone, THE button SHALL spring back to its original position with no residual offset.
3. THE magnetic effect SHALL be disabled on mobile devices and low-tier devices.
4. THE magnetic effect SHALL use spring config `stiffness: 150, damping: 15`.

---

### Requirement 17: Contact Form UX Improvements

**User Story:** As a site visitor submitting the contact form, I want clear visual feedback when fields are filled and a non-disruptive success notification, so that I can send multiple messages without the form disappearing.

#### Acceptance Criteria

1. WHEN a form field loses focus with a non-empty value, THE field border SHALL remain `rgba(255,0,0,0.4)` to indicate a filled state — it SHALL NOT revert to the default unfocused border color.
2. WHEN form submission succeeds, a Toast notification SHALL appear at the top-right of the viewport instead of replacing the form content.
3. THE Toast SHALL animate in with `y: -20 → 0` and `opacity: 0 → 1`, and SHALL auto-dismiss after 4 seconds with a `y: 0 → -20` and `opacity: 1 → 0` exit animation.
4. THE form SHALL remain fully visible and usable after a successful submission so the visitor can send another message without waiting.
5. WHEN form submission fails, THE submit button SHALL play an error shake animation `x: [0, -8, 8, -6, 6, 0]` over 400 ms, then return to its default state.

---

### Requirement 18: Mobile Menu Overlay

**User Story:** As a mobile visitor, I want the menu to feel focused and intentional when it opens, so that I don't accidentally tap content behind it.

#### Acceptance Criteria

1. WHEN the mobile menu opens, a semi-transparent overlay with `background: rgba(0,0,0,0.6)` SHALL appear behind the menu panel and above all page content.
2. THE overlay SHALL animate in with `opacity: 0 → 0.6` over 200 ms.
3. WHEN the overlay is tapped, THE mobile menu SHALL close.
4. THE overlay SHALL prevent pointer interaction with page content behind it while the menu is open.

---

### Requirement 19: Enhanced CursorGlow

**User Story:** As a desktop visitor, I want the cursor glow to be visible and reactive to interactive elements, so that the cursor feels like a first-class part of the UI.

#### Acceptance Criteria

1. THE CursorGlow base opacity SHALL be `rgba(255,0,0,0.15)` on desktop high-tier devices — the current `0.07` value is too subtle to be perceived.
2. WHEN the cursor hovers over an interactive element (button, card, or link), THE CursorGlow SHALL intensify to `rgba(255,0,0,0.25)` and scale to `1.5×` its default size.
3. THE glow size and opacity transition SHALL use spring config `stiffness: 200, damping: 20`.
4. THE CursorGlow SHALL be disabled entirely on mid-tier and low-tier devices.

---

### Requirement 20: Cross-Platform Optimization Matrix

**User Story:** As a visitor on any device or browser, I want the portfolio to deliver the best possible experience for my hardware, so that I never see janky animations or a drained battery.

#### Acceptance Criteria

1. HIGH tier (desktop Chrome/Edge/Firefox): THE Animation_System SHALL enable all effects — 3D tilt, CursorGlow, MagneticButton, AmbientLayer at 12 dots, scroll parallax, shimmer sweeps, and cursor spotlight.
2. MID tier (desktop Safari, high-end mobile Chrome): THE Animation_System SHALL disable `backdropFilter`, disable `filter: blur()` mid-animation, disable canvas, set AmbientLayer to 6 dots, disable 3D tilt, disable cursor effects, and disable scroll parallax.
3. LOW tier (mid/low Android, older iOS, fewer than 4 cores): THE Animation_System SHALL restrict all motion to `transform` and `opacity` only, set AmbientLayer to 0 dots, disable all continuous loop animations, replace spring physics with tween easing, and disable parallax entirely.
4. iOS Safari specifically: THE Navbar `backdropFilter` SHALL be disabled. All `filter:` CSS properties SHALL be replaced with `box-shadow` equivalents.
5. THE `will-change: transform, opacity` property SHALL be set only during active animation and removed via `onAnimationComplete` callback.
6. All scroll event listeners SHALL use the `{ passive: true }` option.
7. All continuous loop animations (floating dots, shimmer, pulse rings) SHALL be paused when their container is not in the viewport, using `useInView` from Framer Motion.

---

### Requirement 21: Section Personality Transitions

**User Story:** As a site visitor scrolling through the portfolio, I want each section to have its own distinct entrance character, so that the page feels like a curated experience rather than a template.

#### Acceptance Criteria

1. WHEN the Services section enters the viewport, THE Animation_System SHALL animate service cards sliding up from `y: 60 → 0` with an 80 ms stagger between cards, as if rising from below the fold.
2. WHEN the About section enters the viewport, THE Animation_System SHALL animate the profile image from `x: -60 → 0` (slide from left) and the text content from `x: 60 → 0` (slide from right), both with `opacity: 0 → 1`.
3. WHEN the Skills section enters the viewport, THE Animation_System SHALL animate skill rings drawing their stroke sequentially left-to-right with a 200 ms stagger between each ring.
4. WHEN the Portfolio section enters the viewport, THE Animation_System SHALL animate portfolio cards with a `rotateX: 8deg → 0` card-flip-forward effect with an 80 ms stagger between cards.
5. WHEN the Contact section enters the viewport, THE Animation_System SHALL animate contact cards with `y: 30 → 0` and `opacity: 0 → 1`, accompanied by a left-border accent line that draws from top to bottom over 400 ms.
6. Each section transition SHALL use `once: true` so the entrance animation plays only on the first scroll-into-view and does not repeat.
