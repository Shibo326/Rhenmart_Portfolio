import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Brain, Wrench, Sparkles, Bot } from "lucide-react";
import { StellarBackground } from "./StellarBackground";

// Animated counter
function Counter({ target, isInView }: { target: number; isInView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, { duration: 1.8, ease: [0, 0, 0.2, 1] });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [isInView, target]);

  return <>{display}</>;
}

// Circular skill ring
function SkillRing({ label, percentage, delay = 0, description }: {
  label: string; percentage: number; delay?: number; description?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  const SIZE = 120;
  const CENTER = SIZE / 2;
  const RADIUS = 48;
  const STROKE = 5;
  const circ = 2 * Math.PI * RADIUS;
  const offset = circ - (percentage / 100) * circ;
  const gradId = `grad-${label.replace(/\s/g, "")}`;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const inc = percentage / 60;
    const timer = setInterval(() => {
      start = Math.min(start + inc, percentage);
      if (start >= percentage) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [isInView, percentage]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35, scale: 0.85 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col items-center gap-4 group cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Outer ambient glow */}
        <motion.div
          animate={{
            scale: hovered ? [1, 1.25, 1] : [1, 1.12, 1],
            opacity: hovered ? [0.4, 0.7, 0.4] : [0.1, 0.25, 0.1],
          }}
          transition={{ duration: hovered ? 1.2 : 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,0,0,0.35) 0%, transparent 70%)" }}
        />

        {/* SVG rings */}
        <svg
          width={SIZE} height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute"
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        >
          <defs>
            {/* Gradient for the progress arc */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6666" />
              <stop offset="50%" stopColor="#FF0000" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
            {/* Blur filter for glow */}
            <filter id={`glow-${label.replace(/\s/g, "")}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track ring */}
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />

          {/* Subtle inner track */}
          <circle
            cx={CENTER} cy={CENTER} r={RADIUS - STROKE - 2}
            fill="none"
            stroke="rgba(255,0,0,0.04)"
            strokeWidth={1}
          />

          {/* Glow duplicate (blurred) */}
          <motion.circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none"
            stroke="rgba(255,0,0,0.4)"
            strokeWidth={STROKE + 4}
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
            filter={`url(#glow-${label.replace(/\s/g, "")})`}
            style={{ opacity: hovered ? 0.7 : 0.4 }}
          />

          {/* Main crisp progress arc */}
          <motion.circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Bright tip dot at end of arc */}
          {isInView && (() => {
            const angle = -90 + (percentage / 100) * 360;
            const rad = (angle * Math.PI) / 180;
            const tx = CENTER + RADIUS * Math.cos(rad);
            const ty = CENTER + RADIUS * Math.sin(rad);
            return (
              <motion.circle
                cx={tx} cy={ty} r={3}
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.4, 1] }}
                transition={{ delay: delay + 1.6, duration: 0.4 }}
                filter={`url(#glow-${label.replace(/\s/g, "")})`}
              />
            );
          })()}
        </svg>

        {/* Center content */}
        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative z-10 flex flex-col items-center"
        >
          <span className="text-xl font-black text-white leading-none tabular-nums">
            <Counter target={percentage} isInView={isInView} />%
          </span>
        </motion.div>
      </motion.div>

      {/* Label */}
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
}

// Tool pill
function ToolPill({ name, index }: { name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.08, y: -3 }}
      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm font-medium hover:border-[#FF0000]/40 hover:text-white hover:bg-[#FF0000]/8 transition-all duration-300 cursor-default"
    >
      {name}
    </motion.div>
  );
}

const coreSkills = [
  { label: "UI Design", percentage: 85, description: "Visual design, dashboards & interfaces" },
  { label: "UX Research", percentage: 78, description: "User interviews, workshops & analysis" },
  { label: "Prototyping", percentage: 82, description: "Interactive flows, Figma & Framer" },
  { label: "AI-Assisted UX", percentage: 70, description: "ChatGPT & AI tools for research" },
];

const tools = ["Figma", "Framer", "WIX Studio", "V0"];
const aiTools = ["ChatGPT", "Gemini", "Claude", "Loveable"];

export function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Stellar background with orbital rings */}
      <div className="absolute inset-0">
        <StellarBackground density="low" showOrbitalRings={true} />
      </div>

      {/* Animated bg */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FF0000]/10 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], opacity: [0, 0.25, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${8 + i * 12}%`, top: `${20 + (i % 4) * 20}%` }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-20">

        {/* ── CORE SKILLS ── */}
        <div>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
              <Brain size={12} className="text-[#FF0000]" />
              <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">Core Skills</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              What I Bring to the Table
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ originX: 0.5 }}
              className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full"
            />
          </motion.div>

          {/* Skill rings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {coreSkills.map((s, i) => (
              <SkillRing key={s.label} {...s} delay={i * 0.15} />
            ))}
          </div>

          {/* Micro description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-10 max-w-2xl mx-auto text-center"
          >
            <div className="relative px-6 py-4 bg-white/3 border border-white/8 rounded-2xl">
              {/* Animated left accent */}
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
              <p className="text-white/60 text-sm leading-relaxed italic">
                "I combine user-centered design with AI-assisted research to create{" "}
                <span className="text-white/90 font-medium not-italic">data-driven, efficient, and impactful</span>{" "}
                digital experiences."
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── TOOLS & AI ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Tools I Use */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-6 bg-white/3 border border-white/8 rounded-3xl overflow-hidden group"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  whileHover={{ rotate: 20 }}
                  className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20"
                >
                  <Wrench size={16} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base">Tools I Use</h3>
                  <p className="text-white/35 text-xs">Design & Prototyping</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => <ToolPill key={t} name={t} index={i} />)}
              </div>
            </div>
          </motion.div>

          {/* AI Tools */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-6 bg-white/3 border border-white/8 rounded-3xl overflow-hidden group"
          >
            {/* Animated shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF0000]/5 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-bl from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20"
                >
                  <Bot size={16} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base">AI Tools</h3>
                  <p className="text-white/35 text-xs">Modern UX Research</p>
                </div>
                {/* Live badge */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-green-400 text-[9px] font-semibold uppercase tracking-wider">Active</span>
                </motion.div>
              </div>

              <div className="flex flex-wrap gap-2">
                {aiTools.map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.08, y: -3 }}
                    className="px-4 py-2 bg-[#FF0000]/8 border border-[#FF0000]/20 rounded-full text-white/70 text-sm font-medium hover:border-[#FF0000]/50 hover:text-white hover:bg-[#FF0000]/15 transition-all duration-300 cursor-default flex items-center gap-1.5"
                  >
                    <Sparkles size={10} className="text-[#FF0000]" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
