import { motion } from "motion/react";
import { useMemo, memo } from "react";

interface StellarBackgroundProps {
  density?: "low" | "medium" | "high";
  className?: string;
  showOrbitalRings?: boolean;
}

// Memoized to prevent unnecessary re-renders
export const StellarBackground = memo(function StellarBackground({ 
  density = "medium", 
  className = "", 
  showOrbitalRings = false 
}: StellarBackgroundProps) {
  // Optimize particle count based on density and device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const counts = useMemo(() => {
    const base = {
      low: { stars: 12, bigStars: 3, dust: 20, nebulas: 1, orbs: 2, rings: 2 },
      medium: { stars: 20, bigStars: 5, dust: 28, nebulas: 2, orbs: 4, rings: 3 },
      high: { stars: 30, bigStars: 8, dust: 40, nebulas: 2, orbs: 6, rings: 3 }
    };
    
    const selected = base[density];
    
    // Reduce by 60% on mobile for better performance
    if (isMobile) {
      return {
        stars: Math.floor(selected.stars * 0.4),
        bigStars: Math.floor(selected.bigStars * 0.4),
        dust: Math.floor(selected.dust * 0.4),
        nebulas: 1,
        orbs: Math.floor(selected.orbs * 0.5),
        rings: Math.max(2, selected.rings - 1)
      };
    }
    
    return selected;
  }, [density, isMobile]);

  // Pre-calculate particle positions for better performance
  const particlePositions = useMemo(() => {
    return {
      stars: Array.from({ length: counts.stars }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2
      })),
      bigStars: Array.from({ length: counts.bigStars }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random()
      })),
      dust: Array.from({ length: counts.dust }, () => ({
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        endX: Math.random() * 100,
        endY: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 5,
        color: `rgba(255,${150 + Math.random() * 105},${100 + Math.random() * 100},0.8)`
      }))
    };
  }, [counts]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Orbital rings (like in the reference) */}
      {showOrbitalRings && [...Array(counts.rings)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 40 + i * 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF0000]/15"
          style={{
            width: `${200 + i * 150}px`,
            height: `${200 + i * 150}px`,
            boxShadow: `0 0 15px rgba(255,0,0,0.08)`,
            willChange: 'transform'
          }}
        />
      ))}

      {/* Glowing orbs moving in orbits - optimized */}
      {[...Array(counts.orbs)].map((_, i) => {
        const radius = 100 + (i % 3) * 80;
        return (
          <motion.div
            key={`orb-${i}`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5
            }}
            className="absolute top-1/2 left-1/2"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              marginLeft: `-${radius}px`,
              marginTop: `-${radius}px`,
              willChange: 'transform'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,${100 + i * 20},${50 + i * 10},1) 0%, rgba(255,0,0,0.3) 70%)`,
                boxShadow: `0 0 12px rgba(255,${100 + i * 20},${50 + i * 10},0.7)`,
                willChange: 'transform, opacity'
              }}
            />
          </motion.div>
        );
      })}

      {/* Small twinkling stars - optimized with pre-calculated positions */}
      {particlePositions.stars.map((pos, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            boxShadow: "0 0 3px rgba(255,255,255,0.7), 0 0 6px rgba(255,0,0,0.2)",
            willChange: 'opacity, transform'
          }}
        />
      ))}
      
      {/* Larger cross-shaped stars - optimized */}
      {particlePositions.bigStars.map((pos, i) => (
        <motion.div
          key={`bigstar-${i}`}
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [0.9, 1.05, 0.9],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            willChange: 'transform, opacity'
          }}
        >
          <div className="relative w-2.5 h-2.5">
            <div className="absolute inset-0 bg-white rounded-full blur-[0.5px]" 
              style={{ boxShadow: "0 0 6px rgba(255,255,255,0.8), 0 0 10px rgba(255,0,0,0.3)" }} />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/60" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/60" />
          </div>
        </motion.div>
      ))}

      {/* Cosmic dust particles - optimized with pre-calculated paths */}
      {particlePositions.dust.map((pos, i) => (
        <motion.div
          key={`dust-${i}`}
          animate={{
            x: [`${pos.startX}vw`, `${pos.endX}vw`, `${pos.startX}vw`],
            y: [`${pos.startY}vh`, `${pos.endY}vh`, `${pos.startY}vh`],
            opacity: [0, 0.5, 0],
            scale: [0.5, 0.9, 0.5]
          }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
          className="absolute w-[2px] h-[2px] rounded-full"
          style={{
            left: 0,
            top: 0,
            background: `radial-gradient(circle, ${pos.color} 0%, transparent 70%)`,
            boxShadow: `0 0 6px ${pos.color}`,
            willChange: 'transform, opacity'
          }}
        />
      ))}

      {/* Nebula clouds - optimized */}
      {[...Array(counts.nebulas)].map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.06, 0.14, 0.06],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            left: `${20 + i * 40}%`,
            top: `${25 + i * 30}%`,
            background: i === 0 
              ? "radial-gradient(circle, rgba(255,0,0,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(138,43,226,0.08) 0%, transparent 70%)",
            willChange: 'transform, opacity'
          }}
        />
      ))}

      {/* Constellation lines - simplified */}
      <svg className="absolute inset-0 w-full h-full opacity-15" style={{ mixBlendMode: "screen" }}>
        <motion.line
          x1="10%" y1="20%" x2="30%" y2="40%"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.25, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.line
          x1="70%" y1="30%" x2="85%" y2="50%"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.25, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </svg>
    </div>
  );
});
