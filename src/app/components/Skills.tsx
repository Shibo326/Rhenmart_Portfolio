import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useInView } from "motion/react";
import { Wrench, Bot, Code, Users, Sparkles } from "lucide-react";
import { SectionBadge, RedDivider, HudCorners, StatusBadge } from "./Hud";
import { useSectionGlow } from "../hooks/useDeviceAnimations";

// ── Typing Quote ──────────────────────────────────────────────────────────
const QUOTE_PLAIN = `"I start with human centered research, validate decisions with data, and leverage AI as a tool not a shortcut to craft `;
const QUOTE_RED   = `intentional, accessible, and meaningful digital experiences`;
const QUOTE_END   = `."`;
const FULL_TEXT   = QUOTE_PLAIN + QUOTE_RED + QUOTE_END;

function TypingQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setCount(i);
      if (i >= FULL_TEXT.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [inView]);

  const displayed = FULL_TEXT.slice(0, count);
  const plainLen  = QUOTE_PLAIN.length;
  const redEnd    = plainLen + QUOTE_RED.length;

  return (
    <div ref={ref} className="relative max-w-2xl mx-auto text-center px-12">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-px bg-gradient-to-r from-[#FF0000] to-transparent" />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-px bg-gradient-to-l from-[#FF0000] to-transparent" />
      <p className="text-xl md:text-2xl font-light italic text-[rgba(255,255,255,0.80)] leading-relaxed min-h-[6rem]">
        {/* Plain part */}
        {displayed.slice(0, Math.min(count, plainLen))}
        {/* Red part */}
        {count > plainLen && (
          <span className="text-[#FF0000]">
            {displayed.slice(plainLen, Math.min(count, redEnd))}
          </span>
        )}
        {/* End part */}
        {count > redEnd && displayed.slice(redEnd)}
        {/* Blinking cursor while typing */}
        {count < FULL_TEXT.length && (
          <span className="inline-block w-[2px] h-[1em] bg-[#FF0000] align-middle ml-0.5 animate-blink" />
        )}
      </p>
    </div>
  );
}

// ── Skill Rings ───────────────────────────────────────────────────────────
const RINGS = [
  { label: "UI Design",      value: 85, sub: "Visual design, dashboards & interfaces" },
  { label: "UX Research",    value: 78, sub: "User interviews, workshops & analysis" },
  { label: "Prototyping",    value: 82, sub: "Interactive flows, Figma & Framer" },
  { label: "AI-Assisted UX", value: 70, sub: "ChatGPT & AI tools for research" },
];

function SkillRing({ label, value, sub, idx }: { label: string; value: number; sub: string; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const C = 2 * Math.PI * 52;
  const offset = inView ? C - (count / 100) * C : C;

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1600, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const angle = (count / 100) * 360 - 90;
  const tipX = 64 + Math.cos((angle * Math.PI) / 180) * 52;
  const tipY = 64 + Math.sin((angle * Math.PI) / 180) * 52;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="hud-card group relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.40)] p-6 text-center overflow-hidden cursor-pointer"
    >
      <HudCorners />
      <span className="hud-orbit" aria-hidden />

      {/* ACTIVE badge on hover */}
      <span className="status-badge-hover status-active absolute top-2 right-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse-red" />
        ACTIVE
      </span>

      {/* Shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute -inset-y-2 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shimmer" />
      </div>
      <div className="absolute inset-0 scanlines opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />

      {/* Ring */}
      <div className="relative w-32 h-32 mx-auto mb-4 transition-transform duration-500 group-hover:scale-110">
        <div className="absolute inset-0 bg-[rgba(255,0,0,0.10)] blur-2xl group-hover:bg-[rgba(255,0,0,0.40)] transition-all duration-500" />
        <div
          className="absolute inset-[-8px] border border-[rgba(255,0,0,0)] group-hover:border-[rgba(255,0,0,0.30)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-rotate-slow transition-all duration-500"
          style={{ borderStyle: "dashed" }}
        />
        <svg className="relative w-32 h-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="52" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
          <defs>
            <linearGradient id={`g-${idx}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4444" />
              <stop offset="100%" stopColor="#cc0000" />
            </linearGradient>
          </defs>
          <circle
            cx="64" cy="64" r="52"
            stroke={`url(#g-${idx})`}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)" }}
          />
          {inView && (
            <circle cx={tipX} cy={tipY} r="3.5" fill="#ff4444" />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-black text-white">
            {count}<span className="text-[#FF0000]">%</span>
          </span>
        </div>
      </div>

      <h4 className="font-bold group-hover:text-[#FF0000] transition-colors">{label}</h4>
      <p className="text-xs text-[rgba(255,255,255,0.55)] mt-1">{sub}</p>
    </motion.div>
  );
}

// ── Tool cards ────────────────────────────────────────────────────────────
type Pill = {
  name: string;
  url: string;
  primary?: boolean;
  label?: string;
};

type Tool = {
  Icon: ElementType;
  title: string;
  sub: string;
  badge: { text: string; color: string } | null;
  sparkle?: boolean;
  purpleDot?: boolean;
  pills: Pill[];
};

const TOOLS: Tool[] = [
  {
    Icon: Wrench,
    title: "Tools I Use",
    sub: "Design & Prototyping",
    badge: null,
    pills: [
      { name: "Figma",      primary: true, label: "Primary", url: "https://figma.com" },
      { name: "Framer",     url: "https://framer.com" },
      { name: "WIX Studio", url: "https://wix.com/studio" },
      { name: "V0",         url: "https://v0.dev" },
    ],
  },
  {
    Icon: Bot,
    title: "AI Tools",
    sub: "Modern UX Research",
    badge: { text: "Active", color: "text-green-400 border-green-500/40 bg-green-500/10" },
    sparkle: true,
    pills: [
      { name: "ChatGPT",  url: "https://chatgpt.com" },
      { name: "Gemini",   url: "https://gemini.google.com" },
      { name: "Claude",   url: "https://claude.ai" },
      { name: "Loveable", url: "https://lovable.dev" },
    ],
  },
  {
    Icon: Code,
    title: "IDE",
    sub: "Code Editors",
    badge: { text: "Main", color: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
    pills: [
      { name: "Kiro",    primary: true, url: "https://kiro.dev" },
      { name: "VS Code", url: "https://code.visualstudio.com" },
    ],
  },
  {
    Icon: Users,
    title: "Collaboration",
    sub: "Handoff & Communication",
    badge: { text: "Collab", color: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
    purpleDot: true,
    sparkle: true,
    pills: [
      { name: "GitHub",           url: "https://github.com" },
      { name: "Microsoft Teams",  url: "https://teams.microsoft.com" },
      { name: "Google Meet",      url: "https://meet.google.com" },
      { name: "Zoom",             url: "https://zoom.us" },
    ],
  },
];

// ── Process steps ─────────────────────────────────────────────────────────
const STEPS = [
  {
    code: "01 INIT", status: "COMPLETE" as const, title: "Human Research",
    desc: "Human-first investigation before any tool is opened.",
    bullets: ["User interviews & observation", "Reading papers & case studies", "Documenting all gathered insights", "Identifying pain points & patterns"],
  },
  {
    code: "02 PROC", status: "COMPLETE" as const, title: "AI Enhancement",
    desc: "AI amplifies research — never replaces it.",
    bullets: ["Enhance & validate findings with AI", "UX & design architecture recommendations", "Competitive analysis support", "Synthesize large research into insights"],
  },
  {
    code: "03 SYNC", status: "COMPLETE" as const, title: "Stakeholder Sync",
    desc: "Align with everyone before touching Figma.",
    bullets: ["Present findings to client", "Collaborate with dev team", "Identify what needs to change", "Agree on scope & priorities"],
  },
  {
    code: "04 DSGN", status: "ACTIVE" as const, title: "Figma Design",
    desc: "Research-backed design, not guesswork.",
    bullets: ["Wireframes → hi-fi UI", "Component-based design system", "Interactive prototype flows", "Design decisions tied to research"],
  },
  {
    code: "05 PLSH", status: "QUEUED" as const, title: "Kiro Polish",
    desc: "Import design, optimize & enhance before development.",
    bullets: ["Import Figma to code", "Refine animations & interactions", "Performance optimization", "Accessibility review"],
  },
  {
    code: "06 HNDOFF", status: "QUEUED" as const, title: "Dev Handoff",
    desc: "Final polished design ready for development.",
    bullets: ["Export assets & specs", "Document component library", "Final QA review", "Hand off to development"],
  },
];

// ── Skills section ────────────────────────────────────────────────────────
export function Skills() {
  const { sectionRef, glowRef } = useSectionGlow<HTMLElement>();

  return (
    <section ref={sectionRef} id="skills" className="relative py-24 bg-[#050505] overflow-hidden">
      <div ref={glowRef} className="section-glow" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative space-y-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <SectionBadge name="SKILLS.EXE" comment="CORE_SKILLS" />
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient-white">
            What I Bring to the Table
          </h2>
          <div className="max-w-xs mx-auto">
            <RedDivider />
          </div>
        </motion.div>

        {/* Skill rings */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RINGS.map((r, i) => (
            <SkillRing key={r.label} {...r} idx={i} />
          ))}
        </div>

        {/* Quote */}
        <TypingQuote />

        {/* Tool cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.40)] p-6 transition-all overflow-hidden"
            >
              <HudCorners />
              {t.sparkle && (
                <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 overflow-hidden pointer-events-none">
                  <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              )}

              <div className="relative flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 bg-[#0a0000] border border-[rgba(255,0,0,0.35)] group-hover:border-[#FF0000] flex items-center justify-center transition-all duration-300 overflow-hidden shrink-0">
                    {/* Corner brackets */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF0000]" />
                    <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF0000]" />
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF0000]" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF0000]" />
                    {/* Glow bg on hover */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: "radial-gradient(ellipse at center, rgba(255,0,0,0.18) 0%, transparent 75%)" }} />
                    <t.Icon
                      size={18}
                      className="relative z-10 text-[#FF0000] transition-all duration-300 group-hover:scale-110"
                      style={{ filter: "drop-shadow(0 0 5px rgba(255,0,0,0.65))" }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.title}</h4>
                    <p className="text-xs text-[rgba(255,255,255,0.55)]">{t.sub}</p>
                  </div>
                </div>
                {t.badge && (
                  <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${t.badge.color}`}>
                    {t.badge.text}
                  </span>
                )}
              </div>

              <div className="relative flex flex-wrap gap-2">
                {t.pills.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/pill relative inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border transition-all hover:-translate-y-0.5 hover:scale-105 ${
                      p.primary
                        ? "bg-[#1a0000] text-[rgba(255,255,255,0.85)] border-[rgba(255,0,0,0.35)] hover:border-[rgba(255,0,0,0.6)] hover:bg-[#2a0000]"
                        : "bg-[#080808] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.55)] hover:border-[#FF0000] hover:text-white hover:shadow-[0_0_18px_rgba(255,0,0,0.35)]"
                    }`}
                  >
                    {t.sparkle && <Sparkles size={10} />}
                    {t.purpleDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                    {p.primary && !t.sparkle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
                    )}
                    {p.name}
                    {p.label && (
                      <span className="text-[9px] opacity-80">({p.label})</span>
                    )}
                    {/* Hover badge */}
                    <span
                      className={`absolute -top-2 -right-2 opacity-0 scale-75 translate-y-1 group-hover/pill:opacity-100 group-hover/pill:scale-100 group-hover/pill:translate-y-0 transition-all inline-flex items-center gap-1 font-mono text-[8px] tracking-widest px-1.5 py-0.5 border pointer-events-none whitespace-nowrap ${
                        p.primary ? "status-complete" : "status-online"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${p.primary ? "bg-green-400" : "bg-blue-400"} animate-pulse`} />
                      {p.primary ? "COMPLETE" : "ONLINE"}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#FF0000] border border-[rgba(255,0,0,0.20)] px-3 py-1.5">
              <Sparkles size={10} />
              My Process
            </span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-gradient-white">
              Research-Driven Design Process
            </h3>
          </motion.div>

          <div className="relative bg-[#030303] border border-[rgba(255,0,0,0.20)] p-1">
            <HudCorners />
            <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

            <div className="relative bg-[#050505] p-6 md:p-10">
              {/* HUD top bar */}
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest mb-8 pb-5 border-b border-[rgba(255,255,255,0.08)] flex-wrap gap-2">
                <span className="flex items-center gap-2 text-[#FF0000]">
                  <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse-red" />
                  DESIGN_PROCESS.exe
                </span>
                <span className="text-[rgba(255,255,255,0.55)]">STEPS: 06/06</span>
                <span className="text-green-400">■ ONLINE</span>
              </div>

              {/* Step cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.code}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="group relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.40)] p-7 transition-all"
                  >
                    <HudCorners />
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-[#FF0000] tracking-widest">{s.code}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <h4 className="text-lg font-bold mb-2 group-hover:text-[#FF0000] transition-colors">{s.title}</h4>
                    <p className="text-sm text-[rgba(255,255,255,0.55)] mb-4 italic">{s.desc}</p>
                    <ul className="space-y-2 text-sm">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-[rgba(255,255,255,0.55)]">
                          <span className="text-[#FF0000]">▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="mt-8 pt-5 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono text-xs uppercase tracking-widest flex-wrap gap-2">
                <span className="text-[rgba(255,255,255,0.55)]">
                  RHENMART_DELACRUZ // UX/UI DESIGNER // PRODUCT DESIGNER
                </span>
                <span className="border-2 border-[rgba(255,0,0,0.30)] text-white px-2 py-1 animate-border-pulse">
                  DESIGNER_READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
