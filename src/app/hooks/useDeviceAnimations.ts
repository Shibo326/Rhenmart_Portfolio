// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED DEVICE-AWARE ANIMATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useRef, useCallback } from "react";
import { useMotionValue, useSpring, useScroll, useTransform, useInView } from "motion/react";

// ─── Device Detection ───────────────────────────────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    const observer = new ResizeObserver(check);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
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
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 100) {
        setDirection("down");
      } else if (currentY < lastY) {
        setDirection("up");
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

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
