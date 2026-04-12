import { useEffect, useRef } from "react";
import { detectDeviceCapability } from "../utils/performance";

const { isMobile, isSafari, tier } = detectDeviceCapability();
const skipCanvas = isMobile || isSafari || tier === "low";

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }

export function ParticleField({ density = 50, color = "255,0,0" }: { density?: number; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (skipCanvas) return; // skip on Safari, mobile, low-end

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const count = Math.floor(density * 0.4); // reduced from 0.5
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15, // slower
      vy: (Math.random() - 0.5) * 0.15,
      size: 0.6 + Math.random() * 0.9,
      opacity: 0.05 + Math.random() * 0.15,
    }));

    const connDist = 80; // reduced from 90
    const connDistSq = connDist * connDist;
    let frame: number;
    let lastTime = 0;
    const interval = 1000 / 30; // 30fps cap — was 35

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

      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy;
          if (d < connDistSq) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color},${(1 - Math.sqrt(d) / connDist) * 0.04})`;
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

  if (skipCanvas) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, contain: "strict" }} />;
}
