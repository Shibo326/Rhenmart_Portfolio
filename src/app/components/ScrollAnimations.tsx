// ═══════════════════════════════════════════════════════════════════════════
// SCROLL-BASED ANIMATION COMPONENTS
// Provides smooth, performant scroll animations for both mobile and desktop
// ═══════════════════════════════════════════════════════════════════════════

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef, ReactNode } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Parallax Section ───────────────────────────────────────────────────────
interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({ children, speed = 0.5, className = "" }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [-100 * speed, 100 * speed]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Fade In On Scroll ──────────────────────────────────────────────────────
interface FadeInScrollProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export function FadeInScroll({ 
  children, 
  direction = "up", 
  delay = 0,
  className = "" 
}: FadeInScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"]
  });

  const distance = isMobile ? 20 : 40;
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  const getTransform = () => {
    switch (direction) {
      case "up": return useTransform(scrollYProgress, [0, 1], [distance, 0]);
      case "down": return useTransform(scrollYProgress, [0, 1], [-distance, 0]);
      case "left": return useTransform(scrollYProgress, [0, 1], [distance, 0]);
      case "right": return useTransform(scrollYProgress, [0, 1], [-distance, 0]);
    }
  };

  const transform = getTransform();
  const style = direction === "left" || direction === "right"
    ? { opacity, x: transform }
    : { opacity, y: transform };

  return (
    <motion.div
      ref={ref}
      style={style}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Scale On Scroll ────────────────────────────────────────────────────────
interface ScaleOnScrollProps {
  children: ReactNode;
  scaleFrom?: number;
  scaleTo?: number;
  className?: string;
}

export function ScaleOnScroll({ 
  children, 
  scaleFrom = 0.8, 
  scaleTo = 1,
  className = "" 
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"]
  });

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 1], [scaleFrom, scaleTo]),
    { stiffness: 100, damping: 30 }
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Rotate On Scroll ───────────────────────────────────────────────────────
interface RotateOnScrollProps {
  children: ReactNode;
  rotateFrom?: number;
  rotateTo?: number;
  className?: string;
}

export function RotateOnScroll({ 
  children, 
  rotateFrom = -10, 
  rotateTo = 0,
  className = "" 
}: RotateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [rotateFrom, rotateTo]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Blur On Scroll ─────────────────────────────────────────────────────────
interface BlurOnScrollProps {
  children: ReactNode;
  blurAmount?: number;
  className?: string;
}

export function BlurOnScroll({ 
  children, 
  blurAmount = 10,
  className = "" 
}: BlurOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"]
  });

  const blur = useTransform(
    scrollYProgress,
    [0, 1],
    [`blur(${blurAmount}px)`, "blur(0px)"]
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ filter: blur, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Children On Scroll ─────────────────────────────────────────────
interface StaggerScrollProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerScroll({ 
  children, 
  staggerDelay = 0.1,
  className = "" 
}: StaggerScrollProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000] origin-left z-[9999]"
      style={{ scaleX }}
    />
  );
}
