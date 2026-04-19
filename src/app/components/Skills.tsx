import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState, memo } from "react";
import { Brain, Wrench, Bot, Sparkles, Code } from "lucide-react";
import { useAnimationConfig } from "../context/AnimationContext";

function Counter({ target, isInView }: { target: number; isInView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, { duration: 1.6, ease: [0, 0, 0.2, 1] });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [isInView, target]);
  return <>{display}</>;
}

const SkillRing = memo(function SkillRing({ label, percentage, delay = 0, description }: {
  label: string; percentage: number; delay?: number; description?: string;
}) {
  const { enable3DTilt } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [hovered, setHovered] = useState(false);

  const SIZE = 120;
  const CENTER = SIZE / 2;
  const RADIUS = 48;
  const STROKE = 5;
  const circ = 2 * Math.PI * RADIUS;
  const offset = circ - (percentage / 100) * circ;
  const gradId = `g-${label.replace(/\s/g, "")}`;

  // Tip dot position
  const angle = -90 + (percentage / 100) * 360;
  const rad = (angle * Math.PI) / 180;
  const tx = CENTER + RADIUS * Math.cos(rad);
  const ty = CENTER + RADIUS * Math.sin(rad);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.88 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0, 0, 0.2, 1] }}
      onHoverStart={() => !reduceEffects && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col items-center gap-4 group cursor-default"
    >
      <motion.div
        whileHover={reduceEffects ? {} : { scale: 1.1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Ambient glow */}
        <motion.div
          animate={{ scale: hovered ? [1, 1.2, 1] : [1, 1.1, 1], opacity: hovered ? [0.4, 0.65, 0.4] : [0.08, 0.2, 0.08] }}
          transition={{ duration: hovered ? 1.2 : 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,0,0,0.35) 0%, transparent 70%)" }}
        />

        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute"
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6666" />
              <stop offset="50%" stopColor="#FF0000" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
            {/* Glow filter — desktop non-Safari only */}
            {!reduceEffects && (
              <filter id={`glow-${label.replace(/\s/g, "")}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            )}
          </defs>

          {/* Track */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          <circle cx={CENTER} cy={CENTER} r={RADIUS - STROKE - 2} fill="none" stroke="rgba(255,0,0,0.04)" strokeWidth={1} />

          {/* Glow arc — desktop non-Safari only */}
          {!reduceEffects && (
            <motion.circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none" stroke="rgba(255,0,0,0.35)" strokeWidth={STROKE + 4}
              strokeLinecap="round" strokeDasharray={`${circ} ${circ}`}
              initial={{ strokeDashoffset: circ }}
              animate={isInView ? { strokeDashoffset: offset } : {}}
              transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
              filter={`url(#glow-${label.replace(/\s/g, "")})`}
              style={{ opacity: hovered ? 0.65 : 0.35 }}
            />
          )}

          {/* Main arc */}
          <motion.circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={`url(#${gradId})`}
            strokeWidth={STROKE} strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Tip dot */}
          {isInView && (
            <motion.circle
              cx={tx} cy={ty} r={3}
              fill="white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.4, 1] }}
              transition={{ delay: delay + 1.5, duration: 0.4 }}
              filter={!reduceEffects ? `url(#glow-${label.replace(/\s/g, "")})` : undefined}
            />
          )}
        </svg>

        {/* Center % */}
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 280 }}
          className="relative z-10 flex flex-col items-center"
        >
          <span className="text-xl font-black text-white leading-none tabular-nums">
            <Counter target={percentage} isInView={isInView} />%
          </span>
        </motion.div>
      </motion.div>

      <div className="text-center">
        <motion.p
          animate={{ color: hovered ? "#FF0000" : "rgba(255,255,255,0.85)" }}
          transition={{ duration: 0.2 }}
          className="font-semibold text-sm"
        >
          {label}
        </motion.p>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.8 }}
            className="text-white/30 text-[10px] mt-0.5 max-w-[110px] leading-tight"
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
});

const ToolPill = memo(function ToolPill({ name, url, index, primary }: { name: string; url: string; index: number; primary?: boolean }) {
  const { enable3DTilt } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={reduceEffects ? {} : { scale: 1.08, y: -3 }}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
        primary
          ? "bg-[#FF0000]/15 border border-[#FF0000]/40 text-white hover:bg-[#FF0000]/25 hover:border-[#FF0000]/60"
          : "bg-white/5 border border-white/10 text-white/70 hover:border-[#FF0000]/40 hover:text-white hover:bg-[#FF0000]/8"
      }`}
    >
      {primary && <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />}
      {name}
      {primary && <span className="text-[#FF0000]/70 text-[9px] font-semibold uppercase tracking-wider ml-0.5">Primary</span>}
    </motion.a>
  );
});

const coreSkills = [
  { label: "UI Design", percentage: 85, description: "Visual design, dashboards & interfaces" },
  { label: "UX Research", percentage: 78, description: "User interviews, workshops & analysis" },
  { label: "Prototyping", percentage: 82, description: "Interactive flows, Figma & Framer" },
  { label: "AI-Assisted UX", percentage: 70, description: "ChatGPT & AI tools for research" },
];

const tools = [
  { name: "Figma", url: "https://figma.com", primary: true },
  { name: "Framer", url: "https://framer.com" },
  { name: "WIX Studio", url: "https://wix.com/studio" },
  { name: "V0", url: "https://v0.dev" },
];
const aiTools = [
  { name: "ChatGPT", url: "https://chatgpt.com" },
  { name: "Gemini", url: "https://gemini.google.com" },
  { name: "Claude", url: "https://claude.ai" },
  { name: "Loveable", url: "https://lovable.dev" },
];
const ideTools = [
  { name: "Kiro", url: "https://kiro.dev", primary: true },
  { name: "VS Code", url: "https://code.visualstudio.com" },
];

export function Skills() {
  const { enable3DTilt } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10px" });

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Bg orb — box-shadow instead of blur, skip on Safari */}
      {!reduceEffects && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 200px 100px rgba(255,0,0,0.05)", background: "transparent" }}
        />
      )}

      {/* Floating particles — desktop non-Safari only */}
      {!reduceEffects && [0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div key={i}
          aria-hidden="true"
          animate={{ y: [0, -20, 0], opacity: [0, 0.25, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${8 + i * 16}%`, top: `${20 + (i % 4) * 20}%` }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-20">

        {/* Core Skills */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }} className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-[#FF0000]/20 rounded font-mono">
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
              <Brain size={12} className="text-[#FF0000]" />
              <span className="text-[#FF0000] text-[10px] font-bold uppercase tracking-[0.2em]">SKILLS.EXE</span>
              <span className="text-white/20 text-[10px]">// CORE_SKILLS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">What I Bring to the Table</h2>
            <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }} style={{ originX: 0.5 }}
              className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {coreSkills.map((s, i) => <SkillRing key={s.label} {...s} delay={i * 0.14} />)}
          </div>

          {/* Quote with animated accents */}
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-10 max-w-2xl mx-auto text-center">
            <div className="relative px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
              {/* Animated accent lines — desktop non-Safari only */}
              {!reduceEffects && (
                <>
                  <motion.div
                    animate={{ height: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF0000] to-transparent rounded-full"
                  />
                  <motion.div
                    animate={{ height: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute right-0 top-0 w-[2px] bg-gradient-to-b from-transparent via-[#FF0000] to-transparent rounded-full"
                  />
                </>
              )}
              <p className="text-white/55 text-sm leading-relaxed italic">
                "I start with human research, validate with data, and use AI as a tool — not a shortcut — to design{" "}
                <span className="text-white/85 font-medium not-italic">experiences that are intentional, accessible, and real.</span>"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tools & AI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tools */}
          <motion.div initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            className="relative p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div whileHover={reduceEffects ? {} : { rotate: 18 }}
                  className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                  <Wrench size={15} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-sm">Tools I Use</h3>
                  <p className="text-white/35 text-xs">Design & Prototyping</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => <ToolPill key={t.name} name={t.name} url={t.url} index={i} primary={t.primary} />)}
              </div>
            </div>
          </motion.div>

          {/* AI Tools */}
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}
            className="relative p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl overflow-hidden group">
            {/* Shimmer — desktop non-Safari only */}
            {!reduceEffects && (
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF0000]/5 to-transparent skew-x-12 pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  animate={reduceEffects ? {} : { rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                  <Bot size={15} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Tools</h3>
                  <p className="text-white/35 text-xs">Modern UX Research</p>
                </div>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-green-400 text-[9px] font-semibold uppercase tracking-wider">Active</span>
                </motion.div>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiTools.map((t, i) => (
                  <motion.a
                    key={t.name}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09 }}
                    whileHover={reduceEffects ? {} : { scale: 1.08, y: -3 }}
                    className="px-4 py-2 bg-[#FF0000]/8 border border-[#FF0000]/20 rounded-full text-white/70 text-sm font-medium hover:border-[#FF0000]/50 hover:text-white hover:bg-[#FF0000]/15 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={9} className="text-[#FF0000]" />
                    {t.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* IDE Tools */}
          <motion.div initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
            className="relative p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div whileHover={reduceEffects ? {} : { rotate: -18 }}
                  className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                  <Code size={15} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-sm">IDE</h3>
                  <p className="text-white/35 text-xs">Code Editors</p>
                </div>
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  <span className="text-blue-400 text-[9px] font-semibold uppercase tracking-wider">Main</span>
                </motion.div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ideTools.map((t, i) => (
                  <motion.a
                    key={t.name}
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09 }}
                    whileHover={reduceEffects ? {} : { scale: 1.08, y: -3 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      t.primary
                        ? "bg-[#FF0000]/15 border border-[#FF0000]/40 text-white hover:bg-[#FF0000]/25 hover:border-[#FF0000]/60"
                        : "bg-white/5 border border-white/10 text-white/70 hover:border-[#FF0000]/40 hover:text-white hover:bg-[#FF0000]/8"
                    }`}
                  >
                    {t.primary && <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />}
                    {t.name}
                    {t.primary && <span className="text-[#FF0000]/70 text-[9px] font-semibold uppercase tracking-wider ml-0.5">Primary</span>}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Research-Driven Design Process — Game HUD Style */}
        <div>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
              <Sparkles size={12} className="text-[#FF0000]" />
              <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">My Process</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Research-Driven Design Process</h2>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }} style={{ originX: 0.5 }}
              className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full" />
          </motion.div>

          {/* HUD Panel */}
          <div className="relative w-full">

            {/* Outer HUD frame */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative border border-[#FF0000]/20 rounded-2xl p-4 sm:p-6 lg:p-8 bg-black/40 overflow-hidden w-full"
            >
              {/* Corner brackets */}
              {[
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl",
                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl",
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-[#FF0000]/60 ${cls}`} />
              ))}

              {/* Scanline overlay */}
              {!reduceEffects && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.03]"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)", backgroundSize: "100% 3px" }}
                />
              )}

              {/* HUD top bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-[#FF0000]/10">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#FF0000]" />
                  <span className="text-[#FF0000] text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em]">DESIGN_PROCESS.exe</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-white/20 text-[10px] sm:text-xs font-mono">STEPS: 06/06</span>
                  <span className="text-white/20 text-[10px] sm:text-xs font-mono hidden sm:block">STATUS: ACTIVE</span>
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                    className="text-green-400 text-[10px] sm:text-xs font-mono">■ ONLINE</motion.div>
                </div>
              </div>

              {/* Step cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {[
                  { step: "01", code: "INIT", label: "Human Research", icon: "🔍", status: "COMPLETE", color: "green",
                    desc: "Human-first investigation before any tool is opened.",
                    bullets: ["User interviews & observation", "Reading papers & case studies", "Documenting all gathered insights", "Identifying pain points & patterns"] },
                  { step: "02", code: "PROC", label: "AI Enhancement", icon: "🤖", status: "COMPLETE", color: "green",
                    desc: "AI amplifies research — never replaces it.",
                    bullets: ["Enhance & validate findings with AI", "UX & design architecture recommendations", "Competitive analysis support", "Synthesize large research into insights"] },
                  { step: "03", code: "SYNC", label: "Stakeholder Sync", icon: "🤝", status: "COMPLETE", color: "green",
                    desc: "Align with everyone before touching Figma.",
                    bullets: ["Present findings to client", "Collaborate with dev team", "Identify what needs to change", "Agree on scope & priorities"] },
                  { step: "04", code: "DSGN", label: "Figma Design", icon: "🎨", status: "ACTIVE", color: "red",
                    desc: "Research-backed design, not guesswork.",
                    bullets: ["Wireframes → hi-fi UI", "Component-based design system", "Interactive prototype flows", "Design decisions tied to research"] },
                  { step: "05", code: "PLSH", label: "Kiro Polish", icon: "✨", status: "QUEUED", color: "yellow",
                    desc: "Final quality pass before dev picks it up.",
                    bullets: ["Import design file into Kiro", "Optimize & enhance visuals", "Polish micro-interactions & spacing", "Validate design before handoff"] },
                  { step: "06", code: "HNDOFF", label: "Dev Handoff", icon: "🚀", status: "QUEUED", color: "yellow",
                    desc: "Clean, documented, ready to build.",
                    bullets: ["Annotated specs for developers", "Asset export & design tokens", "Support during implementation", "Feedback loop for adjustments"] },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    whileHover={reduceEffects ? {} : { scale: 1.02 }}
                    className="relative group bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 sm:p-6 hover:border-[#FF0000]/30 hover:bg-[#FF0000]/[0.03] transition-all duration-300 cursor-default overflow-hidden"
                  >
                    {/* Card corner accent */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#FF0000]/30 rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#FF0000]/30 rounded-br-xl" />

                    {/* Top row: step code + status badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF0000]/50 text-xs sm:text-sm font-mono font-bold">[{item.step}]</span>
                        <span className="text-white/20 text-xs sm:text-sm font-mono">{item.code}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] sm:text-xs font-mono font-bold uppercase ${
                        item.color === "green" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        item.color === "red"   ? "bg-[#FF0000]/10 text-[#FF4444] border border-[#FF0000]/20" :
                                                 "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        <motion.span
                          animate={item.color === "red" ? { opacity: [1, 0.3, 1] } : {}}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-current"
                        />
                        {item.status}
                      </div>
                    </div>

                    {/* Icon + label */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-white font-bold text-sm sm:text-base group-hover:text-[#FF4444] transition-colors duration-200 font-mono">{item.label}</p>
                    </div>

                    {/* Desc */}
                    <p className="text-white/40 text-xs sm:text-sm leading-snug mb-3 font-mono">{item.desc}</p>

                    {/* Divider */}
                    <div className="w-full h-px bg-[#FF0000]/10 mb-3" />

                    {/* Bullets */}
                    <ul className="space-y-1.5">
                      {item.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-white/40 text-xs sm:text-sm leading-snug font-mono">
                          <span className="text-[#FF0000]/50 shrink-0 mt-0.5">▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* HUD bottom bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-3 border-t border-[#FF0000]/10">
                <span className="text-white/20 text-xs sm:text-sm font-mono">RHENMART_DELACRUZ // UX/UI DESIGNER // PRODUCT DESIGNER</span>
                <motion.span animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-[#FF0000]/50 text-xs sm:text-sm font-mono">DESIGNER_READY</motion.span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
