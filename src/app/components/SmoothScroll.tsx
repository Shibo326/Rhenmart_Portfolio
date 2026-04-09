import { useEffect, useRef, ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return <div ref={scrollRef}>{children}</div>;
}

// Enhanced scroll progress indicator
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000] z-[100] origin-left"
      >
        {/* Glow effect */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 10px rgba(255,0,0,0.5)",
              "0 0 20px rgba(255,0,0,0.8)",
              "0 0 10px rgba(255,0,0,0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        />
      </motion.div>
      
      {/* Percentage indicator */}
      <motion.div
        style={{ 
          left: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
        }}
        className="fixed top-0 z-[101] -translate-x-1/2"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 bg-white rounded-full shadow-lg"
          style={{ boxShadow: "0 0 15px rgba(255,0,0,0.8)" }}
        />
      </motion.div>
    </>
  );
}

// Parallax section wrapper
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered reveal
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = ""
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getInitial = () => {
    switch (direction) {
      case "up": return { y: 80, opacity: 0 };
      case "down": return { y: -80, opacity: 0 };
      case "left": return { x: -80, opacity: 0 };
      case "right": return { x: 80, opacity: 0 };
    }
  };

  const y = direction === "up" || direction === "down" 
    ? useTransform(scrollYProgress, [0, 0.5], [direction === "up" ? 80 : -80, 0])
    : 0;
  
  const x = direction === "left" || direction === "right"
    ? useTransform(scrollYProgress, [0, 0.5], [direction === "left" ? -80 : 80, 0])
    : 0;

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      style={{ y, x, opacity, scale }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
