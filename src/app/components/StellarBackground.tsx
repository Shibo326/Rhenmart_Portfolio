import { motion } from "motion/react";
import { useMemo, memo } from "react";
import { detectDeviceCapability } from "../utils/performance";

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
  // Computed inside component — not stale on SSR or resize
  const { isMobile, isSafari, tier } = detectDeviceCapability();
  const reduce = isMobile || isSafari || tier === "low";
  const counts = useMemo(() => {
    const base = {
      low:    { stars: 6,  bigStars: 1, rings: 1 },
      medium: { stars: 10, bigStars: 2, rings: 1 },
      high:   { stars: 14, bigStars: 3, rings: 2 },
    };
    const s = base[density];
    // Safari/mobile: cut stars in half, no big stars
    return reduce
      ? { stars: Math.max(3, Math.floor(s.stars * 0.4)), bigStars: 0, rings: 0 }
      : s;
  }, [density]);

  // Deterministic positions — no Math.random() on render
  const stars = useMemo(() =>
    Array.from({ length: counts.stars }, (_, i) => ({
      left: (i * 37 + 11) % 100,
      top:  (i * 53 + 7)  % 100,
      delay: (i * 0.45) % 3,
      duration: 2.5 + (i % 3) * 0.8,
    })), [counts.stars]);

  const bigStars = useMemo(() =>
    Array.from({ length: counts.bigStars }, (_, i) => ({
      left: (i * 61 + 23) % 100,
      top:  (i * 43 + 17) % 100,
      delay: (i * 0.8) % 2,
      duration: 3.5 + (i % 2),
    })), [counts.bigStars]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orbital rings — desktop non-Safari only */}
      {showOrbitalRings && !reduce && [...Array(counts.rings)].map((_, i) => (
        <motion.div key={`ring-${i}`}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF0000]/8"
          style={{ width: `${200 + i * 150}px`, height: `${200 + i * 150}px` }}
        />
      ))}

      {/* Twinkling stars — CSS opacity only, no scale (cheaper) */}
      {stars.map((pos, i) => (
        <motion.div key={`star-${i}`}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: pos.duration, repeat: Infinity, delay: pos.delay, ease: "easeInOut" }}
          className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
        />
      ))}

      {/* Cross stars — desktop non-Safari only, no filter */}
      {!reduce && bigStars.map((pos, i) => (
        <motion.div key={`bigstar-${i}`}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: pos.duration, repeat: Infinity, delay: pos.delay, ease: "easeInOut" }}
          className="absolute"
          style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
        >
          <div className="relative w-2.5 h-2.5">
            <div className="absolute inset-0 bg-white rounded-full opacity-80" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/30" />
          </div>
        </motion.div>
      ))}

      {/* Nebula — desktop non-Safari only, reduced blur */}
      {!reduce && (
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: "180px", height: "180px",
            left: "20%", top: "25%",
            background: "radial-gradient(circle, rgba(255,0,0,0.07) 0%, transparent 70%)",
            filter: "blur(30px)", // reduced from 40px
          }}
        />
      )}
    </div>
  );
});
