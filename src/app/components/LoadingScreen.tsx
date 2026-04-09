import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Canvas — desktop only
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isMobile) return; // skip entirely on mobile

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    type Particle = { orbitRadius: number; orbitSpeed: number; orbitAngle: number; size: number; opacity: number };
    const particles: Particle[] = Array.from({ length: 20 }, () => ({
      orbitRadius: 80 + Math.random() * 100,
      orbitSpeed: (0.004 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
      orbitAngle: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.2,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.orbitAngle += p.orbitSpeed;
        const x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        const y = cy + Math.sin(p.orbitAngle) * p.orbitRadius * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,40,40,${p.opacity})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  if (isMobile) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// Counter
function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.3 });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [value]);

  return <span>{display}</span>;
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        const inc = p < 50 ? 1.2 : p < 80 ? 0.6 : p < 95 ? 0.25 : 0.12;
        return Math.min(p + inc, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >
          <ParticleCanvas />

          {/* Static bg orb — no animation on mobile */}
          {!isMobile && (
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-[500px] h-[500px] bg-[#FF0000]/12 rounded-full blur-[140px] pointer-events-none"
            />
          )}

          {/* Logo */}
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Single rotating ring — mobile optimized */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: isMobile ? 8 : 6, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, #FF0000 0%, transparent 40%, #FF0000 70%, transparent 100%)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                opacity: 0.6,
              }}
            />

            {/* Inner ring — desktop only */}
            {!isMobile && (
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-24 h-24 rounded-full pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg, #FF4444, transparent 50%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                  opacity: 0.5,
                }}
              />
            )}

            {/* Center text */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1">
              <div className="flex items-center">
                {"Portfolio".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    className="text-base font-black text-white tracking-tight"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="w-8 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent rounded-full"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[7px] text-white/30 uppercase tracking-[0.3em] font-medium"
              >
                Design
              </motion.span>
            </div>
          </div>

          {/* Name */}
          <div className="mt-8 flex gap-[1px]">
            {"RHENMART DELA CRUZ".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: char === " " ? 0 : 0.4 }}
                transition={{ delay: 0.5 + i * 0.02, duration: 0.2 }}
                className="text-[10px] tracking-[0.2em] font-medium text-white"
              >
                {char === " " ? "\u00A0\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex flex-col items-center gap-2"
          >
            <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #FF0000, #FF4444)",
                }}
              />
            </div>
            <span className="text-[9px] font-mono text-white/30 tracking-wider">
              <Counter value={Math.round(progress)} />%
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 text-white/8 text-[8px] tracking-[0.4em] uppercase"
          >
            Crafting Digital Experiences
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
