// ═══════════════════════════════════════════════════════════════════════════
// MICRO-INTERACTION COMPONENTS
// Delightful, performant micro-animations for enhanced UX
// ═══════════════════════════════════════════════════════════════════════════

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Magnetic Button ────────────────────────────────────────────────────────
interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
          x: (e.clientX - rect.left - rect.width / 2) * strength,
          y: (e.clientY - rect.top - rect.height / 2) * strength,
        });
      }}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}

// ─── Ripple Effect ──────────────────────────────────────────────────────────
interface RippleProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Ripple({ children, color = "rgba(255,255,255,0.3)", className = "" }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={addRipple}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              backgroundColor: color,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Tilt Card ──────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
}

export function TiltCard({ children, maxTilt = 10, className = "" }: TiltCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top - rect.height / 2) / rect.height;
        const y = (e.clientX - rect.left - rect.width / 2) / rect.width;
        setRotation({ x: -x * maxTilt, y: y * maxTilt });
      }}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}

// ─── Hover Glow ─────────────────────────────────────────────────────────────
interface HoverGlowProps {
  children: ReactNode;
  color?: string;
  intensity?: number;
  className?: string;
}

export function HoverGlow({ 
  children, 
  color = "#FF0000", 
  intensity = 0.4,
  className = "" 
}: HoverGlowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered
          ? `0 0 30px ${color}${Math.round(intensity * 255).toString(16)}`
          : "0 0 0px rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Element ───────────────────────────────────────────────────────
interface FloatingProps {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function Floating({ 
  children, 
  duration = 3, 
  distance = 10,
  className = "" 
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Effect ──────────────────────────────────────────────────────────
interface PulseProps {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function Pulse({ 
  children, 
  scale = 1.05, 
  duration = 2,
  className = "" 
}: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Shimmer Effect ─────────────────────────────────────────────────────────
interface ShimmerProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export function Shimmer({ children, duration = 3, className = "" }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
    </div>
  );
}

// ─── Bounce On Hover ────────────────────────────────────────────────────────
interface BounceProps {
  children: ReactNode;
  className?: string;
}

export function BounceOnHover({ children, className = "" }: BounceProps) {
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        y: [0, -10, 0],
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Rotate On Hover ────────────────────────────────────────────────────────
interface RotateHoverProps {
  children: ReactNode;
  degrees?: number;
  className?: string;
}

export function RotateOnHover({ children, degrees = 10, className = "" }: RotateHoverProps) {
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ rotate: degrees }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Scale On Hover ─────────────────────────────────────────────────────────
interface ScaleHoverProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function ScaleOnHover({ children, scale = 1.05, className = "" }: ScaleHoverProps) {
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
