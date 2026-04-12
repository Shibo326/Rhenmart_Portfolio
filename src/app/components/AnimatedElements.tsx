import { motion, Transition, MotionProps } from "motion/react";
import { ReactNode } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type MagneticButtonProps = MotionProps & {
  children: ReactNode;
  className?: string;
};

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

interface FloatingBadgeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface PulseDotProps {
  color?: string;
  size?: number;
}

interface AnimatedGradientBorderProps {
  className?: string;
  duration?: number;
  color?: string;
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

interface FadeInItemProps {
  children: ReactNode;
  className?: string;
}

interface GlowOrbProps {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  className?: string;
}

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

const TILT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export function MagneticButton({ 
  children, 
  className = "",
  ...props 
}: MagneticButtonProps) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 25px rgba(255,0,0,0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={SPRING_TRANSITION}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function TiltCard({ 
  children, 
  className = "" 
}: TiltCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={TILT_TRANSITION}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBadge({ 
  children, 
  className = "",
  delay = 0 
}: FloatingBadgeProps) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PulseDot({ 
  color = "#FF0000",
  size = 8 
}: PulseDotProps) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <motion.span
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [1, 0, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span 
        className="relative rounded-full"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: color 
        }}
      />
    </div>
  );
}

export function ShimmerOverlay() {
  return (
    <motion.div
      animate={{ x: ["-100%", "200%"] }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 1
      }}
      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
    />
  );
}

export function AnimatedGradientBorder({ 
  className = "",
  duration = 3,
  color = "#FF0000"
}: AnimatedGradientBorderProps) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(90deg, ${color}, ${color}88, ${color}44, ${color}88, ${color})`,
        backgroundSize: "200% 100%",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "2px"
      }}
    />
  );
}

export function GradientText({ 
  children, 
  className = "" 
}: GradientTextProps) {
  return (
    <motion.span
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`bg-gradient-to-r from-white via-[#FF0000] to-white bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: "200% 100%"
      }}
    >
      {children}
    </motion.span>
  );
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ 
  children, 
  className = "" 
}: FadeInItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowOrb({ 
  size = 400,
  color = "255,0,0",
  blur: _blur = 120, // kept for API compat but not used — filter:blur is Safari-unsafe
  opacity = 0.1,
  className = ""
}: GlowOrbProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [opacity * 0.5, opacity, opacity * 0.5]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        // box-shadow instead of filter:blur — Safari/macOS safe
        boxShadow: `0 0 ${size / 2}px ${size / 4}px rgba(${color},${opacity})`,
        background: "transparent",
      }}
    />
  );
}

export function LoadingSpinner({ 
  size = 40,
  color = "#FF0000" 
}: LoadingSpinnerProps) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: color,
          borderRightColor: color
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-2 rounded-full border-2 border-transparent"
        style={{
          borderBottomColor: color,
          borderLeftColor: color,
          opacity: 0.5
        }}
      />
    </div>
  );
}
