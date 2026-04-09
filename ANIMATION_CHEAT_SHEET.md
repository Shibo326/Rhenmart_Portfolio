# 🎯 Animation Cheat Sheet

## Quick Reference for Common Tasks

---

## 🚀 Most Used Animations

### 1. Fade In Element
```tsx
import { motion } from "motion/react";
import { fadeInUp } from "@/app/utils/animations";

<motion.div {...fadeInUp}>
  Content
</motion.div>
```

### 2. Magnetic Button
```tsx
import { Magnetic } from "@/app/components/MicroInteractions";

<Magnetic>
  <button>Hover Me</button>
</Magnetic>
```

### 3. Fade In On Scroll
```tsx
import { FadeInScroll } from "@/app/components/ScrollAnimations";

<FadeInScroll direction="up">
  <YourComponent />
</FadeInScroll>
```

### 4. Hover Glow
```tsx
import { HoverGlow } from "@/app/components/MicroInteractions";

<HoverGlow color="#FF0000">
  <div>Card</div>
</HoverGlow>
```

### 5. Parallax Background
```tsx
import { ParallaxSection } from "@/app/components/ScrollAnimations";

<ParallaxSection speed={0.5}>
  <img src="bg.jpg" />
</ParallaxSection>
```

---

## 📦 Import Paths

```tsx
// Animation presets
import { fadeInUp, scaleIn, rotateIn } from "@/app/utils/animations";

// Hooks
import { useIsMobile, useParallax } from "@/app/hooks/useDeviceAnimations";

// Scroll components
import { FadeInScroll, ParallaxSection } from "@/app/components/ScrollAnimations";

// Micro-interactions
import { Magnetic, Ripple, HoverGlow } from "@/app/components/MicroInteractions";

// Motion library
import { motion } from "motion/react";
```

---

## 🎨 Animation Presets

| Preset | Effect | Usage |
|--------|--------|-------|
| `fadeInUp` | Fade + slide up | `<motion.div {...fadeInUp}>` |
| `fadeInDown` | Fade + slide down | `<motion.div {...fadeInDown}>` |
| `fadeInLeft` | Fade + slide left | `<motion.div {...fadeInLeft}>` |
| `fadeInRight` | Fade + slide right | `<motion.div {...fadeInRight}>` |
| `scaleIn` | Fade + scale | `<motion.div {...scaleIn}>` |
| `rotateIn` | Fade + rotate | `<motion.div {...rotateIn}>` |
| `blurIn` | Blur to focus | `<motion.div {...blurIn}>` |

---

## 🔧 Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useIsMobile()` | Detect mobile | `boolean` |
| `useReducedMotion()` | Check accessibility | `boolean` |
| `useMagnetic()` | Magnetic effect | `{ ref, x, y }` |
| `useParallax()` | Parallax scroll | `{ ref, y }` |
| `useScrollProgress()` | Scroll position | `MotionValue` |
| `useScrollDirection()` | Scroll direction | `"up" \| "down"` |
| `useRevealOnScroll()` | Viewport reveal | `{ ref, isInView }` |

---

## 🎯 Components

### Scroll Animations
| Component | Props | Effect |
|-----------|-------|--------|
| `<FadeInScroll>` | `direction, delay` | Fade on scroll |
| `<ParallaxSection>` | `speed` | Parallax effect |
| `<ScaleOnScroll>` | `scaleFrom, scaleTo` | Scale on scroll |
| `<RotateOnScroll>` | `rotateFrom, rotateTo` | Rotate on scroll |
| `<BlurOnScroll>` | `blurAmount` | Blur transition |
| `<StaggerScroll>` | `staggerDelay` | Stagger children |

### Micro-Interactions
| Component | Props | Effect |
|-----------|-------|--------|
| `<Magnetic>` | `strength` | Magnetic hover |
| `<Ripple>` | `color` | Click ripple |
| `<TiltCard>` | `maxTilt` | 3D tilt |
| `<HoverGlow>` | `color, intensity` | Hover glow |
| `<Floating>` | `duration, distance` | Float animation |
| `<Pulse>` | `scale, duration` | Pulse effect |
| `<Shimmer>` | `duration` | Shimmer sweep |

---

## ⚡ Performance Tips

### ✅ DO
```tsx
// Use transform/opacity
<motion.div animate={{ x: 100, opacity: 1 }} />

// Add will-change for active animations
<motion.div style={{ willChange: "transform" }} />

// Use passive listeners
window.addEventListener("scroll", handler, { passive: true });

// Detect device
const isMobile = useIsMobile();
```

### ❌ DON'T
```tsx
// Don't animate width/height
<motion.div animate={{ width: 200 }} /> // ❌

// Don't over-use will-change
<div style={{ willChange: "transform, opacity, width, height" }} /> // ❌

// Don't ignore mobile
<ParallaxSection speed={1.0}> // ❌ Too heavy for mobile
```

---

## 🎨 Common Patterns

### Pattern 1: Animated Card
```tsx
<HoverGlow color="#FF0000">
  <motion.div
    {...fadeInUp}
    whileHover={{ scale: 1.05 }}
    className="card"
  >
    Content
  </motion.div>
</HoverGlow>
```

### Pattern 2: Staggered List
```tsx
<motion.div {...staggerContainer}>
  {items.map(item => (
    <motion.div key={item.id} {...fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Pattern 3: Interactive Button
```tsx
<Magnetic>
  <Ripple>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Click Me
    </motion.button>
  </Ripple>
</Magnetic>
```

### Pattern 4: Hero Section
```tsx
<section>
  <ParallaxSection speed={0.5}>
    <img src="bg.jpg" />
  </ParallaxSection>
  
  <motion.div {...fadeInUp}>
    <h1>Title</h1>
  </motion.div>
</section>
```

---

## 📱 Device-Specific

### Mobile Check
```tsx
import { isMobile } from "@/app/utils/animations";

const distance = isMobile ? 20 : 40;
const duration = isMobile ? 0.4 : 0.6;
```

### Conditional Rendering
```tsx
{!isMobile && <ParallaxBackground />}
{!isMobile && <ComplexAnimation />}
```

### Reduced Motion
```tsx
import { useReducedMotion } from "@/app/hooks/useDeviceAnimations";

const reduced = useReducedMotion();
const animation = reduced ? {} : fadeInUp;
```

---

## 🎯 Timing & Easing

### Easing Curves
```tsx
import { ease } from "@/app/utils/animations";

transition={{ ease: ease.out }}      // Smooth exit
transition={{ ease: ease.in }}       // Smooth entry
transition={{ ease: ease.inOut }}    // Smooth both
transition={{ ease: ease.smooth }}   // Very smooth
```

### Spring Physics
```tsx
import { springs } from "@/app/utils/animations";

transition={springs.bouncy}  // Bouncy feel
transition={springs.snappy}  // Quick & snappy
transition={springs.smooth}  // Smooth & slow
transition={springs.gentle}  // Gentle motion
```

---

## 🔥 Quick Wins

### 1. Add to All Sections
```tsx
<FadeInScroll direction="up">
  <YourSection />
</FadeInScroll>
```

### 2. Enhance All Buttons
```tsx
<Magnetic>
  <motion.button whileHover={{ scale: 1.05 }}>
    Button
  </motion.button>
</Magnetic>
```

### 3. Glow All Cards
```tsx
<HoverGlow color="#FF0000">
  <div className="card">Card</div>
</HoverGlow>
```

### 4. Float All Badges
```tsx
<Floating duration={3} distance={10}>
  <span className="badge">New</span>
</Floating>
```

---

## 📊 Performance Checklist

- [ ] Using transform/opacity only
- [ ] Added will-change for active animations
- [ ] Using passive event listeners
- [ ] Detecting device type
- [ ] Respecting reduced motion
- [ ] Testing on mobile
- [ ] Checking FPS
- [ ] Monitoring bundle size

---

## 🎓 Learning Order

1. **Start**: Basic fade-ins (`fadeInUp`)
2. **Next**: Scroll animations (`FadeInScroll`)
3. **Then**: Hover effects (`HoverGlow`)
4. **Advanced**: Magnetic buttons (`Magnetic`)
5. **Pro**: Custom combinations

---

## 💡 Pro Tips

1. **Stagger delays**: Add `delay={index * 0.1}` for lists
2. **Combine effects**: Nest components for rich interactions
3. **Test mobile**: Always check mobile performance
4. **Use presets**: Don't reinvent the wheel
5. **Monitor FPS**: Keep it at 60 on desktop
6. **Respect users**: Honor reduced motion preference
7. **Less is more**: Don't over-animate

---

## 🚀 Copy-Paste Ready

### Fade In Section
```tsx
<motion.section {...fadeInUp}>
  <h2>Title</h2>
  <p>Content</p>
</motion.section>
```

### Animated Button
```tsx
<Magnetic>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Click Me
  </motion.button>
</Magnetic>
```

### Glowing Card
```tsx
<HoverGlow color="#FF0000" intensity={0.4}>
  <motion.div {...scaleIn} className="card">
    Card Content
  </motion.div>
</HoverGlow>
```

### Parallax Hero
```tsx
<section className="hero">
  <ParallaxSection speed={0.5}>
    <img src="bg.jpg" alt="Background" />
  </ParallaxSection>
  <motion.div {...fadeInUp}>
    <h1>Hero Title</h1>
  </motion.div>
</section>
```

---

## 📚 Full Documentation

- **Complete Guide**: `ANIMATION_SYSTEM_GUIDE.md`
- **Quick Examples**: `ANIMATION_QUICK_IMPLEMENTATION.md`
- **Performance**: `PERFORMANCE_OPTIMIZATION_CHECKLIST.md`
- **Summary**: `ANIMATION_ENHANCEMENT_SUMMARY.md`

---

**Keep this cheat sheet handy for quick reference! 🎨✨**
