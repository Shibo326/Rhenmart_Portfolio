# Animation Quick Start Guide

## Overview
Your portfolio now features heavy, professional animations with optimized performance. Here's how to use and customize them.

## New Components

### 1. ParticleField
Animated particle network background.

```tsx
import { ParticleField } from "./components/ParticleField";

<ParticleField 
  density={40}        // Number of particles (default: 50)
  color="255,0,0"     // RGB color (default: "255,0,0")
/>
```

### 2. FloatingOrbs
Ambient floating gradient orbs.

```tsx
import { FloatingOrbs } from "./components/ParticleField";

<FloatingOrbs />
```

### 3. Animated Elements
Pre-built animated components.

```tsx
import { 
  MagneticButton,
  TiltCard,
  FloatingBadge,
  PulseDot,
  ShimmerOverlay,
  RotatingBorder,
  GradientText,
  LoadingSpinner
} from "./components/AnimatedElements";

// Magnetic button
<MagneticButton onClick={handleClick}>
  Click Me
</MagneticButton>

// 3D tilt card
<TiltCard>
  <div>Card content</div>
</TiltCard>

// Floating badge
<FloatingBadge delay={0.5}>
  <span>New</span>
</FloatingBadge>

// Pulse indicator
<PulseDot color="#FF0000" size={8} />

// Shimmer effect
<div className="relative">
  <ShimmerOverlay />
  Content
</div>

// Rotating border
<div className="relative">
  <RotatingBorder duration={20} color="#FF0000" />
  Content
</div>

// Animated gradient text
<GradientText>
  Amazing Text
</GradientText>

// Loading spinner
<LoadingSpinner size={40} color="#FF0000" />
```

### 4. Scroll Components
Scroll-based animations.

```tsx
import { 
  ScrollProgress,
  ParallaxSection,
  ScrollReveal 
} from "./components/SmoothScroll";

// Enhanced progress bar
<ScrollProgress />

// Parallax section
<ParallaxSection speed={0.5}>
  <YourComponent />
</ParallaxSection>

// Scroll reveal
<ScrollReveal direction="up" delay={0.2}>
  <YourComponent />
</ScrollReveal>
```

## Animation Utilities

### Pre-configured Variants
```tsx
import { 
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInFromBottom,
  rotateIn,
  hoverScale,
  hoverLift,
  tapScale
} from "./utils/animations";

<motion.div
  {...fadeInUp}
  whileHover={hoverScale}
  whileTap={tapScale}
>
  Content
</motion.div>
```

### Infinite Animations
```tsx
import { float, pulse, rotate360, shimmer } from "./utils/animations";

<motion.div animate={float}>
  Floating element
</motion.div>
```

## Custom Hooks

### useParallax
```tsx
import { useParallax } from "./hooks/useDeviceAnimations";

const { ref, y } = useParallax(0.5); // 0.5 = speed

<motion.div ref={ref} style={{ y }}>
  Parallax content
</motion.div>
```

### useScrollReveal
```tsx
import { useScrollReveal } from "./hooks/useDeviceAnimations";

const { ref, isVisible } = useScrollReveal(0.1);

<motion.div 
  ref={ref}
  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
>
  Content
</motion.div>
```

### useMagnetic
```tsx
import { useMagnetic } from "./hooks/useDeviceAnimations";

const { ref, x, y } = useMagnetic(0.3); // 0.3 = strength

<motion.button ref={ref} style={{ x, y }}>
  Magnetic Button
</motion.button>
```

## Customization

### Adjust Animation Speed
Edit `src/app/hooks/useDeviceAnimations.ts`:

```typescript
export const springs = {
  snappy:  { stiffness: 400, damping: 30, mass: 0.5 },
  smooth:  { stiffness: 200, damping: 25, mass: 0.8 },
  bouncy:  { stiffness: 300, damping: 18, mass: 0.6 },
  slow:    { stiffness: 80,  damping: 20, mass: 1 },
  ultra:   { stiffness: 500, damping: 35, mass: 0.3 },
};
```

### Change Colors
Update color values in components:
- Particle color: `ParticleField` component
- Glow colors: CSS classes with `bg-[#FF0000]`
- Gradient colors: `bg-gradient-to-r from-[#FF0000]`

### Adjust Particle Density
In `Home.tsx`:
```tsx
<ParticleField density={60} /> // Increase for more particles
```

### Modify Scroll Speed
In scroll components:
```tsx
<ParallaxSection speed={0.8}> // Higher = faster
```

## Performance Tips

### Mobile Optimization
Animations automatically reduce on mobile:
- Fewer particles (40% of desktop)
- Simplified effects
- Optimized spring physics

### Disable Animations
For testing or accessibility:
```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

{!prefersReduced && <ParticleField />}
```

### Reduce Particle Count
If performance is slow:
```tsx
<ParticleField density={20} /> // Lower number
```

## Common Patterns

### Staggered List
```tsx
import { StaggerContainer, FadeInItem } from "./components/AnimatedElements";

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <FadeInItem key={item.id}>
      {item.content}
    </FadeInItem>
  ))}
</StaggerContainer>
```

### Hover Card
```tsx
<motion.div
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0 0 30px rgba(255,0,0,0.5)"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  Card content
</motion.div>
```

### Scroll Progress Indicator
```tsx
import { useScroll, useSpring } from "motion/react";

const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30
});

<motion.div 
  style={{ scaleX }}
  className="fixed top-0 left-0 right-0 h-1 bg-red-500"
/>
```

## Troubleshooting

### Animations Not Working
1. Check if Motion is imported: `import { motion } from "motion/react"`
2. Verify component is wrapped in motion: `<motion.div>`
3. Check browser console for errors

### Performance Issues
1. Reduce particle density
2. Disable canvas background temporarily
3. Check Chrome DevTools Performance tab
4. Reduce number of simultaneous animations

### Layout Shift
1. Add `will-change: transform` to animated elements
2. Use `transform` instead of `top/left`
3. Set explicit dimensions on images

## Examples in Your Portfolio

### Hero Section
- Letter-by-letter name animation
- Floating particles
- Pulsing availability badge
- Rotating profile border
- Parallax scroll effect

### About Section
- Scroll reveal with blur
- Rotating border on image
- Floating skill badges
- Animated divider line

### Portfolio Section
- 3D tilt cards
- Shimmer sweep on hover
- Dynamic spotlight effect
- Animated modal with glow

### Skills Section
- Circular progress rings with pulse
- Animated tool pills
- Floating particles
- Shimmer effects

## Next Steps

1. **Customize colors** to match your brand
2. **Adjust speeds** to your preference
3. **Add more micro-interactions** where needed
4. **Test on mobile** devices
5. **Monitor performance** with DevTools

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Principles](https://www.framer.com/motion/animation/)
- [Spring Physics](https://www.framer.com/motion/transition/)
- [Performance Tips](https://www.framer.com/motion/guide-reduce-bundle-size/)
