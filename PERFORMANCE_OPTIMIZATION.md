# Performance Optimization Guide

## Current Optimizations Implemented

### 1. GPU Acceleration
All animated elements use GPU-accelerated properties:
- `transform` instead of `top/left/width/height`
- `opacity` for fading
- `will-change: transform` on frequently animated elements
- `contain: strict` on canvas elements

### 2. Canvas Optimizations
- **Alpha channel**: `getContext("2d", { alpha: true })`
- **Mobile detection**: Reduced particle count on mobile (40% of desktop)
- **Distance calculations**: Optimized with squared distance (no sqrt until needed)
- **Connection limits**: Only draw connections within 120-150px range
- **RequestAnimationFrame**: Proper frame management with cleanup

### 3. Intersection Observer
- Lazy animation triggers using `IntersectionObserver`
- Threshold: 0.05 (5% visibility)
- Root margin: `-100px` (trigger before fully visible)
- `once: true` for one-time animations

### 4. Spring Physics
Optimized spring configurations:
```typescript
{
  stiffness: 350,  // Fast response
  damping: 35,     // Smooth stop
  mass: 0.2        // Light weight
}
```

### 5. Event Listeners
- `{ passive: true }` on scroll/mousemove
- Proper cleanup in useEffect
- Debounced resize handlers

### 6. Memory Management
- Canvas cleanup on unmount
- Event listener removal
- RequestAnimationFrame cancellation
- ResizeObserver disconnect

## Build Optimization

### Current Bundle Sizes
```
CSS:     106.33 kB (gzip: 16.26 kB)
Motion:  108.14 kB (gzip: 36.34 kB)
React:   134.65 kB (gzip: 43.22 kB)
Main:    513.77 kB (gzip: 162.79 kB)
```

### Code Splitting
Already implemented via Vite:
- Vendor chunks (React, Motion, Router)
- Lazy-loaded routes
- Dynamic imports for heavy components

### Image Optimization
- Lazy loading: `loading="lazy"`
- Async decoding: `decoding="async"`
- Proper sizing and compression

## Further Optimization Strategies

### 1. Reduce Motion Preference
Add support for users who prefer reduced motion:

```typescript
// Add to useDeviceAnimations.ts
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReduced;
}
```

Usage:
```typescript
const prefersReduced = usePrefersReducedMotion();
const duration = prefersReduced ? 0 : 0.6;
```

### 2. Virtual Scrolling
For long lists (Portfolio items), implement virtual scrolling:
```bash
npm install @tanstack/react-virtual
```

### 3. Image Optimization
Convert images to WebP/AVIF:
```bash
npm install -D vite-plugin-imagemin
```

### 4. Bundle Analysis
Analyze bundle size:
```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true })
  ]
}
```

### 5. Lazy Load Heavy Components
```typescript
import { lazy, Suspense } from 'react';

const Portfolio = lazy(() => import('./components/Portfolio'));

<Suspense fallback={<LoadingSpinner />}>
  <Portfolio />
</Suspense>
```

### 6. Memoization
For expensive calculations:
```typescript
import { useMemo, memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processed = useMemo(() => 
    heavyCalculation(data), 
    [data]
  );
  return <div>{processed}</div>;
});
```

### 7. Debounce Scroll Events
```typescript
import { useCallback } from 'react';
import { debounce } from 'lodash-es';

const handleScroll = useCallback(
  debounce(() => {
    // Scroll logic
  }, 100),
  []
);
```

### 8. Web Workers
For heavy canvas calculations:
```typescript
// particles.worker.ts
self.onmessage = (e) => {
  const { particles, width, height } = e.data;
  // Calculate particle positions
  self.postMessage(updatedParticles);
};
```

## Performance Monitoring

### 1. React DevTools Profiler
Enable profiling in development:
```typescript
import { Profiler } from 'react';

<Profiler id="Home" onRender={onRenderCallback}>
  <Home />
</Profiler>
```

### 2. Chrome DevTools
- Performance tab: Record and analyze
- Rendering tab: Enable "Paint flashing"
- Network tab: Check resource loading

### 3. Lighthouse
Run Lighthouse audit:
```bash
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

### 4. Web Vitals
Add web vitals monitoring:
```bash
npm install web-vitals
```

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Best Practices Checklist

- [x] Use GPU-accelerated properties
- [x] Implement lazy loading
- [x] Optimize canvas rendering
- [x] Use Intersection Observer
- [x] Proper event cleanup
- [x] Mobile-specific optimizations
- [ ] Add reduced motion support
- [ ] Implement virtual scrolling
- [ ] Convert images to WebP
- [ ] Add bundle analysis
- [ ] Implement code splitting for routes
- [ ] Add performance monitoring
- [ ] Optimize font loading
- [ ] Add service worker for caching

## Recommended Next Steps

1. **Add Reduced Motion Support** (Accessibility)
2. **Convert Images to WebP** (Performance)
3. **Implement Virtual Scrolling** (Portfolio section)
4. **Add Performance Monitoring** (Analytics)
5. **Optimize Font Loading** (FOUT prevention)

## Testing Performance

### Development
```bash
npm run dev
# Open Chrome DevTools > Performance
# Record while scrolling and interacting
```

### Production
```bash
npm run build
npm run preview
# Test with Lighthouse
```

### Mobile Testing
- Use Chrome DevTools device emulation
- Test on real devices
- Check network throttling (3G/4G)

## Expected Performance Metrics

### Target Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Troubleshooting

### Slow Animations
- Reduce particle count
- Increase spring damping
- Use `will-change` sparingly
- Check for layout thrashing

### High Memory Usage
- Verify cleanup in useEffect
- Check for memory leaks
- Reduce canvas size on mobile
- Limit concurrent animations

### Janky Scrolling
- Use `passive: true` on listeners
- Debounce scroll handlers
- Reduce parallax calculations
- Optimize intersection observers
