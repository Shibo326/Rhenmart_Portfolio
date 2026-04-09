# Stellar Theme - Quick Reference Guide 🌟

## Quick Adjustments

### Change Particle Density
```tsx
// In any component
<StellarBackground density="low" />    // Fewer particles
<StellarBackground density="medium" /> // Balanced
<StellarBackground density="high" />   // Maximum particles
```

### Current Density Settings
- **Hero:** high (maximum impact)
- **About:** medium (balanced)
- **Services:** low (subtle)
- **Skills:** low (subtle)
- **Portfolio:** medium (balanced)
- **Contact:** low (subtle)

---

## Particle Counts Reference

| Density | Stars | Big Stars | Shooting | Dust | Nebulas |
|---------|-------|-----------|----------|------|---------|
| Low     | 10    | 3         | 1        | 15   | 1       |
| Medium  | 15    | 5         | 2        | 20   | 2       |
| High    | 25    | 8         | 3        | 30   | 2       |

**Mobile:** All counts reduced by 50% automatically

---

## Color Customization

### Primary Colors (in StellarBackground.tsx)
```tsx
// Stars
boxShadow: "0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,0,0,0.3)"

// Shooting stars
boxShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 5px rgba(255,0,0,0.5)"

// Nebula clouds
background: "radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)"
background: "radial-gradient(circle, rgba(138,43,226,0.1) 0%, transparent 70%)"
```

### To Change Theme Color:
Replace `rgba(255,0,0,...)` with your color:
- Blue: `rgba(0,119,255,...)`
- Purple: `rgba(138,43,226,...)`
- Green: `rgba(34,197,94,...)`

---

## Animation Speed Adjustments

### In StellarBackground.tsx

```tsx
// Twinkling stars (line ~40)
duration: 2 + Math.random() * 2  // Change 2 to adjust speed

// Big stars (line ~60)
duration: 3 + Math.random()      // Change 3 to adjust speed

// Shooting stars (line ~85)
duration: 2.5                    // Change 2.5 to adjust speed

// Cosmic dust (line ~105)
duration: 5 + Math.random() * 3  // Change 5 to adjust speed

// Nebula clouds (line ~125)
duration: 20 + i * 5             // Change 20 to adjust speed
```

---

## Add/Remove Elements

### To Remove Shooting Stars:
Comment out lines ~75-95 in StellarBackground.tsx

### To Remove Nebula Clouds:
Comment out lines ~115-140 in StellarBackground.tsx

### To Add More Constellation Lines:
Add more `<motion.line>` elements in the SVG section (lines ~145-165)

---

## Performance Tuning

### If Performance Issues:
1. Reduce density: `high` → `medium` → `low`
2. Lower mobile multiplier (line ~20):
   ```tsx
   // Change from 0.5 to 0.3 for 70% reduction
   stars: Math.floor(selected.stars * 0.3)
   ```
3. Increase animation durations (slower = less CPU)

### If Too Subtle:
1. Increase density
2. Increase opacity values
3. Add more glow effects

---

## Common Modifications

### Make Stars Brighter
```tsx
// Line ~45
boxShadow: "0 0 8px rgba(255,255,255,1), 0 0 12px rgba(255,0,0,0.6)"
```

### Make Shooting Stars Faster
```tsx
// Line ~85
duration: 1.5  // Faster
duration: 3.5  // Slower
```

### Add More Nebula Colors
```tsx
// Add after line ~140
<motion.div
  className="absolute rounded-full blur-3xl"
  style={{
    background: "radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)"
  }}
/>
```

---

## Troubleshooting

### Stars Not Visible
- Check background color (needs dark background)
- Increase opacity values
- Check z-index layering

### Performance Issues
- Reduce particle counts
- Increase animation durations
- Check mobile detection

### Layout Issues
- Ensure parent has `position: relative`
- Check `overflow: hidden` on parent
- Verify z-index values

---

## File Locations

```
src/app/components/
├── StellarBackground.tsx    # Main stellar component
├── Hero.tsx                 # Uses: high density
├── About.tsx                # Uses: medium density
├── Services.tsx             # Uses: low density
├── Skills.tsx               # Uses: low density
├── Portfolio.tsx            # Uses: medium density
└── Contact.tsx              # Uses: low density
```

---

## Quick Copy-Paste

### Add to New Section
```tsx
import { StellarBackground } from "./StellarBackground";

// In your component
<section className="relative overflow-hidden">
  <div className="absolute inset-0">
    <StellarBackground density="medium" />
  </div>
  
  {/* Your content */}
  <div className="relative z-10">
    {/* Content here */}
  </div>
</section>
```

### Custom Density
```tsx
// Edit StellarBackground.tsx, add new density
const base = {
  low: { stars: 10, bigStars: 3, shootingStars: 1, dust: 15, nebulas: 1 },
  medium: { stars: 15, bigStars: 5, shootingStars: 2, dust: 20, nebulas: 2 },
  high: { stars: 25, bigStars: 8, shootingStars: 3, dust: 30, nebulas: 2 },
  ultra: { stars: 40, bigStars: 12, shootingStars: 5, dust: 50, nebulas: 3 }, // NEW
};
```

---

## Best Practices

1. **Use low density** for text-heavy sections
2. **Use high density** for hero/landing sections
3. **Test on mobile** after any changes
4. **Keep animations smooth** (60 FPS target)
5. **Maintain consistency** across similar sections

---

## Quick Commands

```bash
# Build and check
npm run build

# Development server
npm run dev

# Check for errors
npm run build 2>&1 | grep -i error
```

---

**Need Help?** Check STELLAR_THEME_COMPLETE.md for full documentation.
