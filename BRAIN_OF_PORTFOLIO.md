# BRAIN OF PORTFOLIO — Rhenmart Dela Cruz
> Single source of truth. Update this file after every major change.
> Kiro reads this to understand the full project context and adapt accordingly.

---

## 1. OWNER INFO
- **Name:** Rhenmart Dela Cruz
- **Title:** UX/UI Designer / Product Designer
- **Degree:** Bachelor of Science in Information Technology (BSIT)
- **Email:** Rhenmart978@gmail.com
- **GitHub:** Shibo326 — https://github.com/Shibo326
- **LinkedIn:** rhenmart-delacruz-117858312 — https://www.linkedin.com/in/rhenmart-delacruz-117858312/
- **Instagram:** _rhenmart_ — https://www.instagram.com/_rhenmart_/
- **Facebook:** rhenmart1234 — https://www.facebook.com/rhenmart1234

---

## 2. PROJECT OVERVIEW
Personal portfolio website — single-page app built with React + TypeScript + Vite + Tailwind CSS + Motion/React.

**Theme:** Dark retro game HUD / terminal / CRT monitor aesthetic.
- Near-black backgrounds, `#FF0000` red accents
- Monospace fonts for all HUD labels
- Corner brackets, scanlines, status badges, boot sequences
- Everything feels like a game UI or military HUD

**Stack:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Motion/React (animations — NOT framer-motion, use `motion/react`)
- EmailJS (contact form)
- Lucide React (icons)
- Vercel Analytics

---

## 3. BRAND IDENTITY

### Colors
```css
--bg-primary:   #030303
--bg-secondary: #050505
--bg-tertiary:  #080808
--accent:       #FF0000
--accent-light: #FF4444
--accent-dark:  #CC0000
--text-primary: #FFFFFF
--text-muted:   rgba(255,255,255,0.4)
--border:       rgba(255,255,255,0.08)
--border-red:   rgba(255,0,0,0.2)
```

### Typography
- Body: Inter (sans-serif)
- HUD elements: `font-mono` — all labels, codes, status text
- Headings: `font-black` or `font-bold`, tight tracking

### HUD Design Language
- Corner brackets: `absolute w-4 h-4 border-t border-l border-[#FF0000]/30`
- HUD badge: `bg-black/60 border border-[#FF0000]/20 rounded font-mono`
- Status dot: `w-1.5 h-1.5 rounded-full bg-[#FF0000]` with blink animation
- Monospace labels: `text-[10px] font-mono uppercase tracking-[0.2em]`
- Section badges: `SECTION.EXE // COMMENT` format
- Buttons: square `rounded` not `rounded-full`, monospace text, `UPPERCASE_SNAKE_CASE`
- Status badges: COMPLETE (green), ACTIVE (red blink), QUEUED (yellow)

---

## 4. FILE STRUCTURE

```
src/
  app/
    components/
      Navbar.tsx          — Fixed nav, HUD logo RHEN_, active link underline
      Hero.tsx            — Name, typing animation, HUD stats, portrait, social links
      Services.tsx        — 4 service cards with 3D tilt (desktop only)
      About.tsx           — Bio, profile image, code-block bio, download resume
      Skills.tsx          — Skill rings, tools, AI tools, IDE cards, workflow HUD
      Portfolio.tsx       — Filterable gallery, HUD stat cards, modal case studies
      Contact.tsx         — EmailJS form + contact info cards
      Footer.tsx          — Brand, nav links, socials, copyright
      LoadingScreen.tsx   — Boot sequence HUD loading screen
      AmbientLayer.tsx    — Floating ambient dots (desktop non-Safari only)
      MagneticButton.tsx  — Magnetic hover effect wrapper
      Toast.tsx           — Success/error toast notifications
    context/
      AnimationContext.tsx  — Device tier detection, feature flags
      AnimationContext.test.ts
    hooks/
      useDeviceAnimations.ts  — ease/springs presets, magnetic, parallax hooks
    pages/
      Home.tsx            — Main layout, scroll progress bar, cursor glow, back-to-top
    routes.tsx            — Browser router, 404 page
    utils/
      generateResume.ts   — PDF resume generator
      performance.ts      — Device capability detection, animation config
    tests/
      setup.ts
      ui-properties.test.tsx
  styles/
    index.css             — Global styles + retro game CSS animations
    fonts.css
    tailwind.css
    theme.css
  types/
    assets.d.ts
    motion-react.d.ts
  main.tsx
```

### Deleted Dead Files (do NOT recreate)
- `SmoothScroll.tsx` — never used
- `ScrollAnimations.tsx` — never used
- `AnimatedElements.tsx` — never used
- `MicroInteractions.tsx` — never used
- `StellarBackground.tsx` — never used
- `ParticleField.tsx` — never used
- `utils/animations.ts` — duplicated useDeviceAnimations.ts, never imported

---

## 5. SECTIONS DETAIL

### Navbar
- Logo: `RHEN_` with blinking red dot + `v2.0` badge
- Nav links: monospace, active state = red underline spring animation
- CTA: `HIRE_ME` button — HUD style, blink dot
- Mobile menu: `// LINK_NAME` format, same HUD CTA
- Scrolled state: `bg-[#050505]/95 border-b border-[#FF0000]/10` + `animate-hud-flicker`

### Hero
- Available badge: `STATUS: AVAILABLE | OPEN_TO_WORK`
- Name: letter-by-letter animation with `animate-hud-flicker`
- Typing animation: cycles "Product Designer" / "UI/UX Designer"
- Stats: 3 HUD panels — `[EXP] 5+`, `[PRJ] 7`, `[AWD] 5x`
- CTAs: `HIRE_ME` + `DL_CV.PDF`
- Portrait: floating animation, scan line sweep, orbital rings (desktop)
- Badge: `FREELANCE_OPEN` with green pulse dot
- Scroll indicator: vertical red line sweep + `SCROLL_DOWN` pixel blink

### About
- Section badge: `PROFILE.EXE // ABOUT_ME`
- Heading: `ABOUT_ME` monospace
- Bio: code block with line numbers `01 02 03`
- CTAs: `HIRE_ME` + `DL_RESUME.PDF`

### Services
- Section badge: `SERVICES.EXE // WHAT_I_DO`
- 4 cards: UI Design, UX Research, Prototyping, Design-to-Dev Collaboration
- 3D tilt on desktop, scroll animation on mobile

### Skills
- Section badge: `SKILLS.EXE // CORE_SKILLS`
- 4 skill rings: UI Design 85%, UX Research 78%, Prototyping 82%, AI-Assisted UX 70%
- Quote block with animated red accent lines
- 3 tool cards (3-column grid):
  - Tools I Use: Figma (PRIMARY), Framer, WIX Studio, V0
  - AI Tools: ChatGPT, Gemini, Claude, Loveable (all clickable links)
  - IDE: Kiro (PRIMARY), VS Code (all clickable links)
  - Collaboration: GitHub, Microsoft Teams, Google Meet, Zoom (all clickable links)
- Workflow HUD: `DESIGN_PROCESS.exe` — 6 step cards (see Section 8)

### Portfolio
- Section badge: `PORTFOLIO.EXE // MY_WORK`
- HUD stat cards with corner brackets + `[TOTAL]` `[COMP]` `[WKSP]` `[SEM]` codes
- Filter tabs: `FILTER_BY:` monospace, square buttons
- 8 portfolio items (see Section 10)
- Modal: case study detail with challenge/solution/impact
- **Modal uses React Portal (`createPortal`) — renders on `document.body` outside the section**
- This is required because `<section>` has `overflow-hidden` which clips `position: fixed` on mobile
- Only the X button closes the modal (no backdrop tap, no swipe-to-close)
- Body scroll locked when modal is open (`document.body.style.overflow = 'hidden'`)
- Back-to-top button hides when modal is open (via custom window events)

### Contact
- Section badge: `CONTACT.EXE // GET_IN_TOUCH`
- Form panel: `MSG_COMPOSE.exe` HUD header with corner brackets
- Send button: `SEND_MSG` HUD style
- Contact info cards: Email, Phone, Location
- Availability badge: green pulse

### Footer
- Brand: `RHEN_` + `DESIGNER_READY` badge with border pulse
- Nav links: monospace uppercase
- Copyright: `// © YEAR RHENMART_DELACRUZ | UX/UI_DESIGNER | PRODUCT_DESIGNER | ALL_RIGHTS_RESERVED`
- Has `retro-scanlines` + `animate-hud-flicker`

### Loading Screen
- Full boot sequence HUD panel
- Corner brackets, `PORTFOLIO_OS v2.0` header
- Rotating rings with `LOADING` text (no name inside ring)
- Identity: `RHENMART DELA CRUZ` + `UX/UI_DESIGNER // PRODUCT_DESIGNER`
- Boot log: 5 lines revealing sequentially
- Progress bar with 0/25/50/75/100 tick marks
- Bottom: `CRAFTING_DIGITAL_EXPERIENCES`

---

## 6. EMAILJS CONFIGURATION
```
Service ID:  service_6r1ytvj
Template ID: template_pwo3l8a
Public Key:  3WXrUwoLmtApet7xn
To Email:    Rhenmart978@gmail.com
```

### Template Variables
- `{{from_name}}` — sender name
- `{{from_email}}` — sender email
- `{{subject}}` — subject (optional)
- `{{message}}` — message body

---

## 7. ANIMATION SYSTEM

### Device Tiers (AnimationContext.tsx)
| Tier | Condition | Effects Enabled |
|------|-----------|-----------------|
| high | Desktop Chrome/Edge/Firefox, ≥4 cores | Full 3D tilt, particles, cursor glow, parallax |
| mid | Desktop Safari, Mobile Chrome ≥6 cores | No blur, no 3D tilt, scroll animations |
| low | iOS, prefersReducedMotion, <4 cores | Minimal — scroll fade only |

### Feature Flags (from useAnimationConfig())
```ts
enable3DTilt       // 3D card tilt on hover
enableCursorGlow   // Red cursor glow trail
enableMagnetic     // Magnetic button effect
enableParallax     // Scroll parallax
enableBackdropBlur // backdrop-filter: blur()
enableInfiniteLoops // Infinite CSS animations
enableShimmer      // Shimmer sweep effects
enableAmbientLayer // Floating ambient dots
```

### Rule: `reduceEffects = !enable3DTilt`
Used throughout components to gate expensive animations.

### Retro Game CSS Animations (src/styles/index.css)
```css
animate-glitch        /* clip-path text glitch with chromatic aberration */
animate-hud-flicker   /* CRT screen flicker, 8s cycle — used on Navbar, Footer */
animate-pixel-blink   /* Hard on/off pixel cursor blink */
animate-border-pulse  /* Red glow border pulse — used on DESIGNER_READY badge */
animate-scan-sweep    /* Scanline sweep across panels */
.retro-scanlines      /* CSS ::after pseudo-element CRT overlay */
.glitch-text          /* Full glitch with red + cyan ghost layers */
.hud-text-*           /* clamp()-based fluid font scaling */
```

### Animation Import Rule
Always import from `motion/react` NOT `framer-motion`:
```ts
import { motion, AnimatePresence, useScroll } from "motion/react";
```

---

## 8. RESEARCH-DRIVEN DESIGN PROCESS (Workflow HUD)

**Section title:** "Research-Driven Design Process"
**HUD label:** `DESIGN_PROCESS.exe`
**Philosophy:** Human-first research, AI as enhancement tool — not the lead.

| Step | Code | Status | Label | Description |
|------|------|--------|-------|-------------|
| 01 | INIT | COMPLETE (green) | Human Research | Interviews, papers, documents — gather raw insights first |
| 02 | PROC | COMPLETE (green) | AI Enhancement | AI enhances findings, UX research & design architecture |
| 03 | SYNC | COMPLETE (green) | Stakeholder Sync | Talk with devs & clients, identify changes & improvements |
| 04 | DSGN | ACTIVE (red blink) | Figma Design | Prototype & hi-fi UI based on research |
| 05 | PLSH | QUEUED (yellow) | Kiro Polish | Import design, optimize & enhance before development |
| 06 | HNDOFF | QUEUED (yellow) | Dev Handoff | Final polished design ready for development |

**Bottom bar:** `RHENMART_DELACRUZ // UX/UI DESIGNER // PRODUCT DESIGNER` + `DESIGNER_READY`

---

## 9. TOOLS & SKILLS

### Tools I Use (Design & Prototyping)
| Tool | Primary | URL |
|------|---------|-----|
| Figma | ✅ PRIMARY | https://figma.com |
| Framer | — | https://framer.com |
| WIX Studio | — | https://wix.com/studio |
| V0 | — | https://v0.dev |

### AI Tools (Modern UX Research) — Active badge
| Tool | URL |
|------|-----|
| ChatGPT | https://chatgpt.com |
| Gemini | https://gemini.google.com |
| Claude | https://claude.ai |
| Loveable | https://lovable.dev |

### IDE (Code Editors) — Main badge
| Tool | Primary | URL |
|------|---------|-----|
| Kiro | ✅ PRIMARY | https://kiro.dev |
| VS Code | — | https://code.visualstudio.com |

### Collaboration Tools — Collab badge
| Tool | URL |
|------|-----|
| GitHub | https://github.com |
| Microsoft Teams | https://teams.microsoft.com |
| Google Meet | https://meet.google.com |
| Zoom | https://zoom.us |

### Core Skill Rings
| Skill | % | Description |
|-------|---|-------------|
| UI Design | 85% | Visual design, dashboards & interfaces |
| UX Research | 78% | User interviews, workshops & analysis |
| Prototyping | 82% | Interactive flows, Figma & Framer |
| AI-Assisted UX | 70% | ChatGPT & AI tools for research |

---

## 10. PORTFOLIO ITEMS

| ID | Title | Category | Result |
|----|-------|----------|--------|
| 1 | Web Design Champion | Competition | 1st Place — UMAK IT Skills Olympics |
| 2 | NDC's Breaking Enigma 2025 | Competition | SafePath concept — offline GPS SOS app |
| 3 | Tagisan ng Talino — 1st Place | Competition | 1st Place |
| 4 | Tagisan ng Talino — 2nd Place | Competition | 2nd Place |
| 8 | Collaboratech 2026 — Android Hackathon | Competition | 2nd Place — ShopLift app |
| 5 | UXPH Community Seminar | Seminar | Attendee / UX Learner |
| 6 | Exploring The Basics of Figma | Workshop | Teacher / Facilitator |
| 7 | Beyond UI: Designing User Experiences | Workshop | Teacher / Facilitator |

**Stats:** 8 Total · 5 Competitions · 2 Workshops · 1 Seminar

---

## 11. PERFORMANCE & OPTIMIZATION

### Rules
- `box-shadow` instead of `filter: blur()` on Safari/mobile — prevents GPU thrash
- `loading="lazy"` on all images except hero portrait (`loading="eager" fetchPriority="high"`)
- `memo()` on all card components: PortfolioCard, ServiceCard, ToolPill, SkillRing, ScrollProgressBar, RevealSection, ScrollOrbs, CursorGlow
- CSS animations preferred over JS for GPU compositing
- `will-change: transform` only set when element is actively hovered
- `clamp()` for fluid responsive font scaling — no JS resize listeners
- `IntersectionObserver` for scroll-triggered animations — no scroll event listeners
- Infinite animations paused when off-screen via `animationPlayState`

### Device-Specific Behavior
- **iOS / Safari:** No blur, no 3D tilt, no infinite loops, no canvas
- **Mobile Chrome:** Scroll animations only, no 3D tilt
- **Desktop:** Full effects — 3D tilt, cursor glow, parallax, particles

### Deleted Dead Code
6 unused component files + 1 unused utility deleted. See Section 4.

---

## 12. NAMING CONVENTIONS

### HUD Text Format
- Section badges: `SECTION_NAME.EXE // COMMENT`
- Buttons: `UPPERCASE_SNAKE_CASE` (e.g., `HIRE_ME`, `DL_CV.PDF`, `SEND_MSG`)
- Status: `DESIGNER_READY`, `DESIGN_PROCESS.exe`, `PORTFOLIO_OS`
- Copyright: `UX/UI_DESIGNER | PRODUCT_DESIGNER`
- Title: `UX/UI Designer / Product Designer` (human-readable contexts)

### Key Decisions
- "Research-Driven Design Process" — NOT "AI-Assisted Design Workflow" (human-first framing)
- `UX/UI` order — NOT `UI/UX` (research comes before interface)
- Kiro listed as PRIMARY IDE — it's the main development tool
- Figma listed as PRIMARY design tool

---

## 13. DEPLOYMENT
- Build: `npm run build`
- Output: `dist/`
- Host: Vercel (Analytics already integrated via `@vercel/analytics/react`)
- Assets: Vite handles chunking and optimization

---

## 14. HOW TO USE THIS FILE

When Kiro reads this file, it should:
1. Know the full project context without scanning every file
2. Understand the HUD design language and apply it consistently
3. Know which files are active vs deleted
4. Apply the correct title/naming conventions
5. Respect the device tier system for all new animations
6. Always use `motion/react` not `framer-motion`
7. Keep all new UI elements in the retro game HUD aesthetic

**Update this file after:**
- Adding new sections or components
- Changing titles, labels, or copy
- Adding/removing tools or portfolio items
- Major design system changes
- Performance optimizations

---

## 15. KNOWN GOTCHAS & FIXES

### Modal / Overlay on Mobile
- **Problem:** `position: fixed` overlays get clipped on mobile when inside a parent with `overflow-hidden`
- **Fix:** Always use `createPortal(content, document.body)` from `react-dom` for modals, drawers, and full-screen overlays
- **Applied in:** `Portfolio.tsx` — modal renders via portal outside the `<section overflow-hidden>`

### Body Scroll Lock
- When a modal is open, set `document.body.style.overflow = 'hidden'`
- Always clean up in the `useEffect` return: `document.body.style.overflow = ''`

### Back-to-Top Button + Modal
- Use custom window events (`portfolio-modal-open` / `portfolio-modal-close`) to hide the back-to-top button when modal is open
- Prevents the button from overlapping the modal on mobile

---

*Last updated: April 2026 · RHENMART_DELACRUZ // UX/UI DESIGNER // PRODUCT DESIGNER · DESIGNER_READY*
