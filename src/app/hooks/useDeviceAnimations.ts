import { useEffect, useState, useRef, useCallback } from "react";
import { useMotionValue, useSpring, useScroll, useTransform } from "motion/react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// Magnetic button hook — pulls element toward cursor
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [onMove, onLeave]);

  return { ref, x: sx, y: sy };
}

// Enhanced parallax scroll hook
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  return { ref, y };
}

// Mouse position tracker
export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return { x, y };
}

// Smooth scroll reveal hook
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Responsive spring configs
export const springs = {
  snappy:  { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.5 },
  smooth:  { type: "spring" as const, stiffness: 200, damping: 25, mass: 0.8 },
  bouncy:  { type: "spring" as const, stiffness: 300, damping: 18, mass: 0.6 },
  slow:    { type: "spring" as const, stiffness: 80,  damping: 20, mass: 1 },
  ultra:   { type: "spring" as const, stiffness: 500, damping: 35, mass: 0.3 },
};

// Easing curves
export const ease = {
  out:     [0.16, 1, 0.3, 1] as const,
  inOut:   [0.4, 0, 0.2, 1] as const,
  elastic: [0.68, -0.55, 0.27, 1.55] as const,
  expo:    [0.87, 0, 0.13, 1] as const,
  smooth:  [0.25, 0.46, 0.45, 0.94] as const,
};

// Stagger children
export const stagger = (count: number, base = 0.08) =>
  Array.from({ length: count }, (_, i) => i * base);
