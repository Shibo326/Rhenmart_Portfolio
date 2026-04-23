// ── Particles ────────────────────────────────────────────────────────────
export function Particles({ count = 20 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {items.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.7) % 8;
        const dur = 6 + (i % 5);
        return (
          <span
            key={i}
            className="absolute bottom-0 w-1 h-1 rounded-full bg-[#FF0000] animate-particle"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}
