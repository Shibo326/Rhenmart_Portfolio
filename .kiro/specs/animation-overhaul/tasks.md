# Implementation Plan: Animation & Interaction Overhaul

## Overview

Incremental implementation of the v2 animation system. Each task builds on the previous, starting with the shared context layer and ending with a full migration of all components to `useAnimationConfig()`. Canvas rendering is removed in Task 4 once the CSS replacement is in place.

## Tasks

- [x] 1. Write exploration property-based tests for AnimationConfig and AmbientLayer
  - [x] 1.1 Install fast-check and create AnimationContext test file
  - [x] 1.2 Write Property 1 - AmbientLayer dot count never exceeds tier limit
  - [x] 1.3 Write Property 2 - Low-tier and Safari configs always produce zero dots
  - [x] 1.4 Write Property 3 - AnimationConfig always contains all required fields
  - [x] 1.5 Write Property 4 - Tier classification invariants
  - [x] 1.6 Write Property 5 - Feature flag monotonicity across tiers

- [x] 2. Create AnimationContext - AnimationProvider and useAnimationConfig
  - [x] 2.1 Create AnimationContext.tsx with AnimationConfig interface and defaultConfig
  - [x] 2.2 Implement computeAnimationConfig pure function
  - [x] 2.3 Implement AnimationProvider component
  - [x] 2.4 Implement useAnimationConfig hook
  - [x] 2.5 Wrap App.tsx with AnimationProvider

- [x] 3. Update animation token constants and performance thresholds
  - [x] 3.1 Update animations.ts with new spring configs
  - [x] 3.2 Update tier classification thresholds in performance.ts

- [x] 4. Create AmbientLayer and remove all canvas rendering
  - [x] 4.1 Create AmbientLayer.tsx component
  - [x] 4.2 Remove LiveBackground canvas from Home.tsx
  - [x] 4.3 Remove ParticleField import and usage from Home.tsx
  - [x] 4.4 Add AmbientLayer to Home.tsx
  - [x] 4.5 Remove StellarBackground from Hero.tsx portrait container
  - [x] 4.6 Remove StellarBackground from About.tsx image container
  - [x] 4.7 Replace ParticleCanvas in LoadingScreen.tsx with CSS dots

- [x] 5. Create MagneticButton component
  - [x] 5.1 Create MagneticButton.tsx
  - [x] 5.2 Wrap Hire Me CTA in Hero.tsx with MagneticButton
  - [x] 5.3 Wrap Send Message button in Contact.tsx with MagneticButton

- [x] 6. Create Toast component
  - [x] 6.1 Create Toast.tsx with success and error variants

- [x] 7. Update Contact component
  - [x] 7.1 Add filledFields Set state for filled-state border retention
  - [x] 7.2 Replace form-replacement states with Toast integration
  - [x] 7.3 Add error shake animation on submit button

- [x] 8. Update Navbar
  - [x] 8.1 Add IntersectionObserver for scroll-based active state
  - [x] 8.2 Update nav active underline spring config
  - [x] 8.3 Add mobile menu overlay backdrop
  - [x] 8.4 Update ScrollProgressBar spring config in Home.tsx

- [x] 9. Fix Hero bugs and update
  - [x] 9.1 Replace Github icon with Trophy on Competition Winner stat
  - [x] 9.2 Remove hidden sm:block from floating badge
  - [x] 9.3 Add hidden sm:flex to scroll indicator container
  - [x] 9.4 Verify scan-line uses translateY only

- [x] 10. Update Portfolio UX
  - [x] 10.1 Verify mobile cards always show title and role
  - [x] 10.2 Add swipe-down-to-close on modal
  - [x] 10.3 Hide Case Studies stat card when count is 0
  - [x] 10.4 Add empty state message when filter returns 0 results
  - [x] 10.5 Add scroll-to-top on filter tab click

- [x] 11. Update CursorGlow
  - [x] 11.1 Update CursorGlow to use useAnimationConfig and new opacity values
  - [x] 11.2 Add hover intensification to CursorGlow

- [x] 12. Switch all components to useAnimationConfig
  - [x] 12.1 Update Services.tsx
  - [x] 12.2 Update About.tsx
  - [x] 12.3 Update Skills.tsx
  - [x] 12.4 Update Footer.tsx
  - [x] 12.5 Update Navbar.tsx
  - [x] 12.6 Update Home.tsx
  - [x] 12.7 Update Portfolio.tsx
  - [x] 12.8 Update Contact.tsx
  - [x] 12.9 Update LoadingScreen.tsx
  - [x] 12.10 Update Hero.tsx

- [x] 13. Checkpoint - Ensure all tests pass

- [x] 14. Write verification property-based tests for UI correctness properties
  - [x] 14.1 Create ui-properties test file with React Testing Library and fast-check
  - [x] 14.2 Write Property 6 - Contact form filled-state border retention
  - [x] 14.3 Write Property 7 - Portfolio mobile cards always show title and role
  - [x] 14.4 Write Property 8 - Zero-count stat cards are never rendered
  - [x] 14.5 Write Property 9 - Empty state appears when filter returns zero results
  - [x] 14.6 Write Property 10 - Magnetic button translation is bounded
  - [x] 14.7 Write Property 11 - Toast auto-dismisses after duration

- [x] 15. Final checkpoint - Ensure all tests pass
