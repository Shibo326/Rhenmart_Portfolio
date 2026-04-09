import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState, memo } from "react";
import { Brain, Wrench, Bot, Sparkles } from "lucide-react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Counter
function Counter({ target, isInView }: { target: number; isInView: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, { duration: 1.5, ease: [0, 0, 0.2, 1] });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [isInView, target]);
  return <>{display}</>;
}

// Skill ring — simplified SVG, no glow filter on mobile
const SkillRing = memo(function SkillRing({ label, percentage, delay = 0, description }: {
  label: string; percentage: number; delay?: number; description?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const [hovered, setHovered] = useState(false);

  const SIZE = 110;
  const CENTER = SIZE / 2;
  const RADIUS = 44;
  const STROKE = 4;
  const circ = 2 * Math.PI * RADIUS;
  const offset = circ - (percentage / 100) * circ;
  const gradId = `g-${label.replace(/\s/g, "")}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0, 0, 0.2, 1] }}
      onHoverStart={() => !isMobile && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col items-center gap-3 cursor-default"
    >
      <motion.div
        whileHover={isMobile ? {} : { scale: 1.08 }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        {/* Ambient glow — desktop only */}
        {!isMobile && (
          <motion.div
            animate={{ opacity: hovered ? 0.4 : 0.1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)" }}
          />
        )}

        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute"
          style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6666" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          {/* Progress */}
          <motion.circle
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none" stroke={`url(#${gradId})`}
            strokeWidth={STROKE} strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Center % */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-lg font-black text-white tabular-nums">
            <Counter target={percentage} isInView={isInView} />%
          </span>
        </div>
      </motion.div>

      <div className="text-center">
        <p className={`font-semibold text-sm transition-colors duration-200 ${hovered ? "text-[#FF0000]" : "text-white/85"}`}>
          {label}
        </p>
        {description && (
          <p className="text-white/30 text-[10px] mt-0.5 max-w-[100px] leading-tight">{description}</p>
        )}
      </div>
    </motion.div>
  );
});

const ToolPill = memo(function ToolPill({ name, index }: { name: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={isMobile ? {} : { scale: 1.06, y: -2 }}
      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm font-medium hover:border-[#FF0000]/40 hover:text-white transition-colors duration-200 cursor-default"
    >
      {name}
    </motion.div>
  );
});

const coreSkills = [
  { label: "UI Design", percentage: 85, description: "Visual design & interfaces" },
  { label: "UX Research", percentage: 78, description: "User interviews & analysis" },
  { label: "Prototyping", percentage: 82, description: "Figma & Framer flows" },
  { label: "AI-Assisted UX", percentage: 70, description: "AI tools for research" },
];

const tools = ["Figma", "Framer", "WIX Studio", "V0"];
const aiTools = ["ChatGPT", "Gemini", "Claude", "Loveable"];

export function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Static bg orb — no animation on mobile */}
      {!isMobile && (
        <motion.div
          animate={{ opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF0000]/10 rounded-full blur-[130px] pointer-events-none"
        />
      )}

      {/* Floating particles — desktop only, reduced */}
      {!isMobile && [0, 1, 2, 3].map((i) => (
        <motion.div key={i}
          animate={{ y: [0, -18, 0], opacity: [0, 0.2, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${10 + i * 22}%`, top: `${25 + (i % 3) * 22}%` }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">

        {/* Core Skills */}
        <div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }} className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
              <Brain size={12} className="text-[#FF0000]" />
              <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">Core Skills</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">What I Bring to the Table</h2>
            <motion.div initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }} style={{ originX: 0.5 }}
              className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
            {coreSkills.map((s, i) => <SkillRing key={s.label} {...s} delay={i * 0.12} />)}
          </div>

          {/* Quote */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.6 }}
            className="mt-8 max-w-2xl mx-auto text-center">
            <div className="px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
              <p className="text-white/55 text-sm leading-relaxed italic">
                "I combine user-centered design with AI-assisted research to create{" "}
                <span className="text-white/85 font-medium not-italic">data-driven, efficient, and impactful</span>{" "}
                digital experiences."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tools & AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tools */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                <Wrench size={15} className="text-[#FF0000]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Tools I Use</h3>
                <p className="text-white/35 text-xs">Design & Prototyping</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((t, i) => <ToolPill key={t} name={t} index={i} />)}
            </div>
          </motion.div>

          {/* AI Tools */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-[#FF0000]/10 rounded-xl border border-[#FF0000]/20">
                <Bot size={15} className="text-[#FF0000]" />
              </div>
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
                <motion.div key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={isMobile ? {} : { scale: 1.06, y: -2 }}
                  className="px-4 py-2 bg-[#FF0000]/8 border border-[#FF0000]/20 rounded-full text-white/70 text-sm font-medium hover:border-[#FF0000]/40 hover:text-white transition-colors duration-200 cursor-default flex items-center gap-1.5"
                >
                  <Sparkles size={9} className="text-[#FF0000]" />
                  {t}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
