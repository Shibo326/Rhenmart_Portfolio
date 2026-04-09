import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Live canvas particle system
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    type Particle = {
      angle: number; speed: number; radius: number;
      size: number; opacity: number; trail: { x: number; y: number }[];
      orbitRadius: number; orbitSpeed: number; orbitAngle: number;
    };

    const particles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.004,
      radius: 80 + Math.random() * 120,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.5,
      trail: [],
      orbitRadius: 80 + Math.random() * 120,
      orbitSpeed: (0.003 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
      orbitAngle: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      particles.forEach((p) => {
        p.orbitAngle += p.orbitSpeed;
        const x = cx + Math.cos(p.orbitAngle) * p.orbitRadius;
        const y = cy + Math.sin(p.orbitAngle) * p.orbitRadius * 0.5;

        p.trail.push({ x, y });
        if (p.trail.length > 12) p.trail.shift();

        // Draw trail
        p.trail.forEach((pt, i) => {
          const alpha = (i / p.trail.length) * p.opacity * 0.4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * (i / p.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${30 + i * 5},${30 + i * 5},${alpha})`;
          ctx.fill();
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        grad.addColorStop(0, `rgba(255,60,60,${p.opacity})`);
        grad.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i].trail[particles[i].trail.length - 1];
          const b = particles[j].trail[particles[j].trail.length - 1];
          if (!a || !b) continue;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,0,0,${(1 - dist / 60) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

// Animated counter
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
  const [phase, setPhase] = useState(0); // 0=loading, 1=complete

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase(1);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 900);
          }, 700);
          return 100;
        }
        const inc = p < 50 ? 0.7 : p < 80 ? 0.35 : p < 95 ? 0.15 : 0.08;
        return Math.min(p + inc, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  const letters = "Portfolio".split("");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Live particle canvas */}
          <ParticleCanvas />

          {/* Deep radial bg */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[700px] h-[700px] bg-[#FF0000]/15 rounded-full blur-[160px] pointer-events-none"
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Main logo */}
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-56 sm:h-56">

            {/* Outermost slow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute w-56 h-56 rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, #FF0000 0%, transparent 30%, #FF0000 65%, transparent 100%)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                opacity: 0.7,
                filter: "drop-shadow(0 0 6px #FF0000)",
              }}
            />

            {/* Middle counter ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 120deg, transparent, #FF0000 45%, transparent)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                opacity: 0.5,
              }}
            />

            {/* Inner fast ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 240deg, #FF0000 0%, transparent 20%, transparent 80%, #FF0000 100%)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                opacity: 0.8,
                filter: "drop-shadow(0 0 4px #FF0000)",
              }}
            />

            {/* Innermost tiny ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-20 h-20 rounded-full pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, #FF4444, transparent 50%)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1px), white calc(100% - 1px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1px), white calc(100% - 1px))",
                opacity: 0.6,
              }}
            />

            {/* Pulsing core glow */}
            <motion.div
              animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-[#FF0000]/30 rounded-full blur-2xl pointer-events-none"
            />

            {/* Orbiting dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute w-44 h-44 pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#FF0000]"
              />
            </motion.div>

            {/* Center text */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center overflow-hidden">
                {letters.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: [0, 0, 0.2, 1] }}
                    className="text-[17px] font-black text-white tracking-tight leading-none"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                style={{ originX: 0.5 }}
                className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent rounded-full"
              />

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-[8px] text-white/35 uppercase tracking-[0.4em] font-medium"
              >
                Design
              </motion.span>
            </motion.div>
          </div>

          {/* Name */}
          <div className="mt-10 flex gap-[2px]">
            {"RHENMART DELA CRUZ".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: char === " " ? 0 : 0.45, y: 0 }}
                transition={{ delay: 0.7 + i * 0.025, duration: 0.3 }}
                className="text-[11px] tracking-[0.22em] font-medium text-white"
              >
                {char === " " ? "\u00A0\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-7 flex flex-col items-center gap-2"
          >
            <div className="w-56 h-[3px] bg-white/5 rounded-full overflow-hidden relative">
              {/* Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/15 to-transparent"
              />
              {/* Fill */}
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #FF0000, #FF6666)",
                  boxShadow: "0 0 8px #FF0000",
                }}
              >
                {/* Glowing tip */}
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full blur-[2px]"
                />
              </motion.div>
            </div>

            {/* Percentage */}
            <div className="flex items-center gap-1">
              <motion.span
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[10px] font-mono text-white/40 tracking-widest"
              >
                <Counter value={Math.round(progress)} />%
              </motion.span>
            </div>
          </motion.div>

          {/* Phase complete flash */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-[#FF0000] text-xs tracking-[0.4em] uppercase font-bold"
                >
                  Loading Complete
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 text-white/10 text-[9px] tracking-[0.5em] uppercase"
          >
            Crafting Digital Experiences
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
