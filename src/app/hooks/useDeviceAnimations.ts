import { useEffect, useState, useRef, useCallback } from "react";
import { useMotionValue, useSpring, useScroll, useTransform } from "motion/react";

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

// Magnetic button — desktop only, passive listener
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

// Parallax — disabled on mobile
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = isMobile ? 0 : 80 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  return { ref, y };
}

// Smooth easing presets
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
};

// Spring presets — tuned for smoothness
export const springs = {
  bouncy:  { type: "spring" as const, stiffness: 260, damping: 18 },
  snappy:  { type: "spring" as const, stiffness: 340, damping: 26 },
  smooth:  { type: "spring" as const, stiffness: 90,  damping: 20 },
  gentle:  { type: "spring" as const, stiffness: 140, damping: 22 },
};
