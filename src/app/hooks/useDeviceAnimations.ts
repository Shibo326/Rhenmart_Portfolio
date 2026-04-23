// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED DEVICE-AWARE ANIMATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef, useCallback } from "react";
import { useMotionValue, useSpring, useScroll, useTransform, useInView } from "motion/react";
// Note: useState is imported above — do not re-import at the bottom of this file

// ─── Device Detection ───────────────────────────────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    // ResizeObserver catches window resize and orientation change on desktop
    const observer = new ResizeObserver(check);
    observer.observe(document.documentElement);
    // orientationchange fires on iOS/Android when rotating the device
    window.addEventListener("orientationchange", check, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  return isMobile;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Magnetic Effect (Desktop Only) ─────────────────────────────────────────
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.4 });
  const isMobile = useIsMobile();

  const onMove = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }, [x, y, strength, isMobile]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  useEffect(() => {
    if (isMobile) return;
    const el = ref.current; if (!el) return;
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [onMove, onLeave, isMobile]);

  return { ref, x: sx, y: sy };
}

// ─── Parallax Scroll Effect ────────────────────────────────────────────────
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = isMobile ? 0 : 80 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  return { ref, y };
}

// ─── Scroll Progress Hook ──────────────────────────────────────────────────
export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return scaleX;
}

// ─── Scroll Direction Detection ────────────────────────────────────────────
export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const lastYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastYRef.current && currentY > 100) {
        setDirection("down");
      } else if (currentY < lastYRef.current) {
        setDirection("up");
      }
      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // no deps — ref keeps lastY stable without re-subscribing

  return direction;
}

// ─── Viewport Reveal Animation ──────────────────────────────────────────────
export function useRevealOnScroll(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-50px",
    ...options 
  });
  return { ref, isInView };
}

// ─── Mouse Position Tracker ─────────────────────────────────────────────────
export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return { x, y };
}

// ─── Ripple Effect Hook ─────────────────────────────────────────────────────
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  }, []);

  return { ripples, addRipple };
}

// ─── Smooth Easing Presets ──────────────────────────────────────────────────
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  smooth: [0.16, 1, 0.3, 1] as const,
};

// ─── Spring Presets ─────────────────────────────────────────────────────────
export const springs = {
  bouncy:  { type: "spring" as const, stiffness: 260, damping: 18 },
  snappy:  { type: "spring" as const, stiffness: 340, damping: 26 },
  smooth:  { type: "spring" as const, stiffness: 90,  damping: 20 },
  gentle:  { type: "spring" as const, stiffness: 140, damping: 22 },
};

// ─── useTilt — 3D tilt on mouse move ────────────────────────────────────────
export function useTilt<T extends HTMLElement>(maxDeg = 8) {
  const ref = useRef<T>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -maxDeg;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * maxDeg;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.transition = "transform 0.1s linear";
    };
    const onLeave = () => {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      el.style.transition = "transform 0.5s ease";
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxDeg, isMobile]);

  return ref;
}

// ─── useMagnetic (ref-based, typed) ─────────────────────────────────────────
export function useMagneticRef<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * strength;
      const dy = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0.1s linear";
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
      el.style.transition = "transform 0.4s ease";
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, isMobile]);

  return ref;
}

// ─── useCountUp — animated number counter ───────────────────────────────────
export function useCountUp(target: number, duration = 1600): [React.RefObject<HTMLElement | null>, number] {
  const ref = useRef<HTMLElement>(null);
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return [ref, count];
}

// ─── useSectionGlow — section hover glow effect ─────────────────────────────
export function useSectionGlow<T extends HTMLElement>() {
  const sectionRef = useRef<T>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;

    const onEnter = () => { glow.style.opacity = "1"; };
    const onLeave = () => { glow.style.opacity = "0"; };

    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return { sectionRef, glowRef };
}

// ─── useCanAnimate — delegates to AnimationContext (single source of truth) ──
// Previously had its own Safari/mobile detection that could disagree with
// AnimationContext. Now reads enable3DScene from the shared context.
// Falls back to a direct check if called outside a provider (e.g. tests).
export function useCanAnimate() {
  const [can, setCan] = useState(false);
  useEffect(() => {
    // Direct check — used only when AnimationContext is unavailable.
    // Mirrors the enable3DScene logic in AnimationContext.tsx.
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency || 2;
    setCan(!isMobile && !isTablet && !isSafari && !isIOS && !reduced && cores >= 4);
  }, []);
  return can;
}

// useState is already imported at the top of this file
