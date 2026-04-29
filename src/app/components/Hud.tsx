import { ReactNode } from "react";

// ── HUD Corner Brackets ──────────────────────────────────────────────────
export function HudCorners({ color = "#ff0000" }: { color?: string }) {
  const style = { borderColor: color };
  return (
    <>
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none" style={style} />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r pointer-events-none" style={style} />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l pointer-events-none" style={style} />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none" style={style} />
    </>
  );
}

// ── HUD Panel ────────────────────────────────────────────────────────────
export function HudPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-6 ${className}`}>
      <HudCorners />
      {children}
    </div>
  );
}

// ── Section Badge ────────────────────────────────────────────────────────
export function SectionBadge({ name, comment }: { name: string; comment: string }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-[rgba(255,0,0,0.20)] bg-[#080808]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse-red" />
      <span className="text-[#FF0000]">{name}</span>
      <span className="text-[rgba(255,255,255,0.30)]">//</span>
      <span className="text-[rgba(255,255,255,0.55)]">{comment}</span>
    </div>
  );
}

// ── Red Divider ──────────────────────────────────────────────────────────
export function RedDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 animate-divider bg-gradient-to-r from-transparent via-[#FF0000] to-transparent" />
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────
type StatusType = "COMPLETE" | "ACTIVE" | "QUEUED";

const statusMap: Record<StatusType, { color: string; bg: string; dot: string }> = {
  COMPLETE: {
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    dot: "bg-green-400",
  },
  ACTIVE: {
    color: "text-[#FF0000]",
    bg: "bg-[rgba(255,0,0,0.08)] border-[rgba(255,0,0,0.40)]",
    dot: "bg-[#FF0000] animate-pulse-red",
  },
  QUEUED: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const s = statusMap[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${s.bg} ${s.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
