import { motion } from "motion/react";
import { useMemo, memo } from "react";

interface StellarBackgroundProps {
  density?: "low" | "medium" | "high";
  className?: string;
  showOrbitalRings?: boolean;
}

export const StellarBackground = memo(function StellarBackground({
  density = "medium",
  className = "",
  showOrbitalRings = false,
}: StellarBackgroundProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isLowEnd = typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
  const reduce = isMobile || isLowEnd;

  const counts = useMemo(() => {
    const base = {
      low:    { stars: 8,  bigStars: 2, rings: 1 },
      medium: { stars: 12, bigStars: 3, rings: 2 },
      high:   { stars: 18, bigStars: 4, rings: 2 },
    };
    const s = base[density];
    return reduce
      ? { stars: Math.floor(s.stars * 0.4), bigStars: 1, rings: 1 }
      : s;
  }, [density, reduce]);

  const stars = useMemo(() =>
    Array.from({ length: counts.stars }, (_, i) => ({
      left: (i * 37 + 11) % 100,
      top: (i * 53 + 7) % 100,
      delay: (i * 0.4) % 3,
      duration: 2.5 + (i % 3),
    })), [counts.stars]);

  const bigStars = useMemo(() =>
    Array.from({ length: counts.bigStars }, (_, i) => ({
      left: (i * 61 + 23) % 100,
      top: (i * 43 + 17) % 100,
      delay: (i * 0.7) % 2,
      duration: 3 + (i % 2),
    })), [counts.bigStars]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orbital rings — desktop only */}
      {showOrbitalRings && !reduce && [...Array(counts.rings)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 50 + i * 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF0000]/10"
          style={{
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Small twinkling stars */}
      {stars.map((pos, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: pos.duration, repeat: Infinity, delay: pos.delay, ease: "easeInOut" }}
          className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
        />
      ))}

      {/* Larger cross stars — desktop only */}
      {!reduce && bigStars.map((pos, i) => (
        <motion.div
          key={`bigstar-${i}`}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: pos.duration, repeat: Infinity, delay: pos.delay, ease: "easeInOut" }}
          className="absolute"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
        >
          <div className="relative w-2.5 h-2.5">
            <div className="absolute inset-0 bg-white rounded-full" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/50" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/50" />
          </div>
        </motion.div>
      ))}

      {/* Single nebula — desktop only */}
      {!reduce && (
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: "200px", height: "200px",
            left: "20%", top: "25%",
            background: "radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
});
