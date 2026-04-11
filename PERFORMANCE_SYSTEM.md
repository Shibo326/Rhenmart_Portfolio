# Adaptive Performance System

## Overview
The portfolio now features an intelligent performance detection system that automatically adjusts graphics, animations, and effects based on device capability to maintain 60fps across all devices.

## Performance Tiers

### Low Tier (Budget Devices)
**Detection:**
- Mobile: <4 CPU cores or <4GB RAM
- Desktop: <4 CPU cores or <4GB RAM
- User prefers reduced motion

**Optimizations:**
- ❌ No particles
- ❌ No blur effects
- ❌ No parallax
- ❌ No canvas background
- ❌ No glow effects
- ❌ No complex shadows
- ✅ 30fps cap
- ✅ 0.3s transitions
- ✅ Minimal stagger delays (0.05s)
- ✅ Simple fade/slide animations

### Medium Tier (Mid-Range Devices)
**Detection:**
- Mobile: 4-7 CPU cores, 4-5GB RAM
- Desktop: 4-7 CPU cores, 4-7GB RAM

**Optimizations:**
- ✅ 20 particles
- ✅ Blur effects enabled
- ❌ No parallax
- ❌ No canvas background
- ✅ Glow effects
- ✅ Shadows enabled
- ✅ 60fps target
- ✅ 0.5s transitions
- ✅ Medium stagger delays (0.08s)
- ✅ Full animations

### High Tier (High-End Devices)
**Detection:**
- Mobile: 8+ CPU cores, 6+ GB RAM (iPhone 13+, flagship Android)
- Desktop: 8+ CPU cores, 8+ GB RAM

**Optimizations:**
- ✅ 40 particles
- ✅ All blur effects
- ✅ Parallax enabled
- ✅ Canvas background with 40 nodes
- ✅ All glow effects
- ✅ Complex shadows
- ✅ 60fps target
- ✅ 0.7s smooth transitions
- ✅ Full stagger delays (0.1s)
- ✅ All complex animations

## Technical Implementation

### Device Detection
```typescript
detectDeviceCapability() {
  - CPU cores (navigator.hardwareConcurrency)
  - RAM (navigator.deviceMemory)
  - Screen size (window.innerWidth)
  - User preference (prefers-reduced-motion)
  - Returns: { tier, isMobile, isLowEnd, prefersReducedMotion, cores, memory }
}
```

### Animation Configuration
```typescript
getAnimationConfig() {
  Returns tier-specific config:
  - particleCount
  - blurEffects
  - parallax
  - complexAnimations
  - fps
  - transitionDuration
  - staggerDelay
  - enableGlow
  - enableShadows
  - canvasBackground
}
```

### GPU Optimization
- All animations use `transform` and `opacity` (GPU-accelerated)
- `will-change` property for active animations
- `translateZ(0)` for hardware acceleration
- Efficient re-render prevention

### FPS Monitoring
```typescript
FPSMonitor class:
- Tracks real-time FPS
- Can trigger adaptive degradation if FPS drops
- 60-frame rolling average
- Callback system for performance adjustments
```

## Performance Features

### Automatic Adjustments
1. **Particle System**: 0-40 particles based on tier
2. **Canvas Background**: Only on high-end devices
3. **Blur Effects**: Disabled on low-end
4. **Parallax**: Only on high-end desktop
5. **Glow/Shadows**: Disabled on low-end
6. **Animation Duration**: 0.3s-0.7s based on tier
7. **FPS Cap**: 30fps (low) or 60fps (medium/high)

### Component-Level Optimizations
- **Hero**: Reduced floating particles on low-end
- **Services**: Simplified hover effects on mobile
- **Portfolio**: Optimized card animations
- **Skills**: Conditional glow effects
- **Background**: Adaptive node count in canvas

### Memory Management
- Lazy loading for images
- Efficient event listeners with passive flag
- Proper cleanup in useEffect hooks
- Throttled scroll handlers
- Debounced resize handlers

## Testing Recommendations

### Low-End Testing
- Chrome DevTools: CPU throttling (4x slowdown)
- Network: Slow 3G
- Device: iPhone SE, budget Android

### Mid-Range Testing
- Standard desktop/laptop
- iPhone 11-12, mid-range Android
- No throttling

### High-End Testing
- Gaming PC, MacBook Pro M1+
- iPhone 13+, flagship Android
- Full effects enabled

## Performance Metrics

### Target Metrics
- **Low Tier**: Stable 30fps, <100ms interaction
- **Medium Tier**: Stable 60fps, <50ms interaction
- **High Tier**: Locked 60fps, <16ms interaction

### Bundle Size
- Main bundle: ~520KB (gzipped: ~164KB)
- CSS: ~119KB (gzipped: ~17KB)
- Images: Lazy loaded, optimized

## Future Enhancements
- [ ] Dynamic quality adjustment based on real-time FPS
- [ ] WebGL fallback detection
- [ ] Battery level consideration for mobile
- [ ] Network-aware loading strategies
- [ ] Service worker for offline performance
