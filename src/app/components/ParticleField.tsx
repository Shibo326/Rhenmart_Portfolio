import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
}

export function ParticleField({ density = 50, color = "255,0,0" }: { density?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;

    // Drastically reduce on mobile/low-end
    const count = isMobile || isLowEnd
      ? Math.floor(density * 0.2)
      : Math.floor(density * 0.6);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 0.8 + Math.random() * 1.2,
      opacity: 0.08 + Math.random() * 0.25,
    }));

    // Connection distance — smaller = fewer calculations
    const connDist = isMobile ? 0 : 100; // disable connections on mobile entirely

    let animationFrame: number;
    let lastTime = 0;
    const fps = isMobile ? 24 : 40; // cap fps
    const interval = 1000 / fps;

    const draw = (timestamp: number) => {
      animationFrame = requestAnimationFrame(draw);
      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      // Connections — desktop only
      if (connDist > 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = dx * dx + dy * dy;
            if (d < connDist * connDist) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${color},${(1 - Math.sqrt(d) / connDist) * 0.06})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles — no radial gradient on mobile
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity})`;
        ctx.fill();
      }
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, contain: "strict" }}
    />
  );
}

// Floating orbs — reduced, no blur on mobile
export function FloatingOrbs() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) return null; // skip entirely on mobile

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, (i % 2 === 0 ? 40 : -40), 0],
            y: [0, (i % 2 === 0 ? -30 : 30), 0],
            opacity: [0.03, 0.07, 0.03],
          }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          className="fixed rounded-full blur-[100px] pointer-events-none"
          style={{
            width: `${280 + i * 40}px`,
            height: `${280 + i * 40}px`,
            background: `radial-gradient(circle, rgba(255,${i * 15},0,0.35) 0%, transparent 70%)`,
            left: `${i * 30}%`,
            top: `${i * 20}%`,
            zIndex: -2,
          }}
        />
      ))}
    </>
  );
}
