import { useRef, useEffect } from 'react';
import { useAnimationConfig } from '../context/AnimationContext';

// Dot configs computed once at module level (stable, no runtime updates)
const DOT_CONFIGS = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + i * 7.5}%`,
  top: `${15 + (i % 4) * 20}%`,
  color: i % 3 === 0 ? 'rgba(255,255,255,0.4)' : '#FF0000',
  duration: `${3 + (i % 4) * 0.8}s`,
  delay: `${(i % 5) * 0.6}s`,
  size: i % 4 === 0 ? '1.5px' : '1px',
}));

export function AmbientLayer({ className }: { className?: string }) {
  const { tier, isSafari, isMobile } = useAnimationConfig();
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause dots when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        el.style.setProperty('--play-state', entry.isIntersecting ? 'running' : 'paused');
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (tier === 'low' || isSafari) return null;

  const dotCount = isMobile ? 6 : 12;
  const dots = DOT_CONFIGS.slice(0, dotCount);

  return (
    <>
      <style>{`
        @keyframes ambientFloat {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.35; transform: translateY(-20px); }
        }
      `}</style>
      <div
        ref={containerRef}
        className={className}
        aria-hidden="true"
        style={{ '--play-state': 'running' } as React.CSSProperties}
      >
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
              animation: `ambientFloat ${dot.duration} ease-in-out ${dot.delay} infinite`,
              animationPlayState: 'var(--play-state)',
            }}
          />
        ))}
      </div>
    </>
  );
}
