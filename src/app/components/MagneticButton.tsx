import { useRef, useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useAnimationConfig } from '../context/AnimationContext';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  proximityPx?: number;
  maxShiftPx?: number;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  proximityPx = 80,
  maxShiftPx = 12,
  disabled = false,
}: MagneticButtonProps) {
  const { enableMagnetic } = useAnimationConfig();
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    if (!enableMagnetic || disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < proximityPx) {
        const factor = (1 - dist / proximityPx) * maxShiftPx;
        rawX.set((dx / dist) * factor);
        rawY.set((dy / dist) * factor);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMagnetic, disabled, proximityPx, maxShiftPx, rawX, rawY]);

  if (!enableMagnetic || disabled) {
    return <>{children}</>;
  }

  return (
    <motion.div ref={ref} style={{ x, y }} className={`inline-flex ${className ?? ''}`}>
      {children}
    </motion.div>
  );
}
