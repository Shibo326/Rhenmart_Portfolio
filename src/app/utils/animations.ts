// Enhanced animation variants for consistent motion design

export const fadeInUp = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -80, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 80, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 25 }
};

export const slideInFromBottom = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -10, scale: 0.9 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Hover effects
export const hoverScale = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

export const hoverLift = {
  y: -8,
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(255, 0, 0, 0.5)",
  transition: { duration: 0.3 }
};

// Tap effects
export const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

// Infinite animations
export const float = {
  y: [0, -15, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const pulse = {
  scale: [1, 1.05, 1],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const rotate360 = {
  rotate: 360,
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "linear"
  }
};

export const shimmer = {
  x: ["-100%", "200%"],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
    repeatDelay: 1
  }
};
