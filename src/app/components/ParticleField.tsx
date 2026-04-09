import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }

export function ParticleField({ density = 50, color = "255,0,0" }: { density?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    if (isMobile || isLowEnd) return; // skip entirely on mobile/low-end

    const count = Math.floor(density * 0.5);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: 0.7 + Math.random() * 1.1,
      opacity: 0.07 + Math.random() * 0.2,
    }));

    const connDist = 90;
    const connDistSq = connDist * connDist;
    let frame: number;
    let lastTime = 0;
    const interval = 1000 / 35; // 35fps cap

    const draw = (ts: number) => {
      frame = requestAnimationFrame(draw);
      if (ts - lastTime < interval) return;
      lastTime = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < connDistSq) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color},${(1 - Math.sqrt(d) / connDist) * 0.055})`;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [density, color]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, contain: "strict" }} />;
}

export function FloatingOrbs() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div key={i}
          animate={{ x: [0, i % 2 === 0 ? 35 : -35, 0], y: [0, i % 2 === 0 ? -25 : 25, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: `${260 + i * 40}px`, height: `${260 + i * 40}px`,
            background: `radial-gradient(circle, rgba(255,${i * 12},0,0.3) 0%, transparent 70%)`,
            filter: "blur(90px)",
            left: `${i * 30}%`, top: `${i * 20}%`, zIndex: -2,
          }}
        />
      ))}
    </>
  );
}
