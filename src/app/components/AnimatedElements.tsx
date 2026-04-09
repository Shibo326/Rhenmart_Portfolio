import { motion } from "motion/react";
import { ReactNode } from "react";

// Magnetic button with enhanced hover
export function MagneticButton({ 
  children, 
  className = "",
  onClick,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) {
  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 25px rgba(255,0,0,0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated card with 3D tilt
export function TiltCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating badge
export function FloatingBadge({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
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

// Pulse dot indicator
export function PulseDot({ 
  color = "#FF0000",
  size = 8 
}: { 
  color?: string; 
  size?: number;
}) {
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

// Shimmer effect overlay
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

// Animated gradient border
export function AnimatedGradientBorder({ 
  className = "",
  duration = 3,
  color = "#FF0000"
}: { 
  className?: string;
  duration?: number;
  color?: string;
}) {
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

// Animated gradient text
export function GradientText({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
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

// Stagger container for children
export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) {
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

// Fade in item (use with StaggerContainer)
export function FadeInItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
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

// Glowing orb
export function GlowOrb({ 
  size = 400,
  color = "255,0,0",
  blur = 120,
  opacity = 0.1,
  className = ""
}: {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  className?: string;
}) {
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
        background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, transparent 70%)`,
        filter: `blur(${blur}px)`
      }}
    />
  );
}

// Loading spinner
export function LoadingSpinner({ 
  size = 40,
  color = "#FF0000" 
}: { 
  size?: number; 
  color?: string;
}) {
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
