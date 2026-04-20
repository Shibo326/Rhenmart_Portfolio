import { motion } from "motion/react";
import { Download, Sparkles, Code2, Lightbulb } from "lucide-react";
import secondProfileImg from "../../Image/new9249-_DSC0331.jpg";
import { generateResume } from "../utils/generateResume";
import { useAnimationConfig } from "../context/AnimationContext";

const skills = [
  { label: "UI/UX Design", icon: Sparkles },
  { label: "Prototyping", icon: Lightbulb },
  { label: "Dev Collab", icon: Code2 },
];

export function About() {
  const { enable3DTilt } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  return (
    <section id="about" className="pt-20 pb-24 bg-[#050505] relative overflow-hidden">
      {/* Bg orb — box-shadow instead of blur, skip on Safari/mobile */}
      {!reduceEffects && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 180px 90px rgba(255,0,0,0.06)", background: "transparent" }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        {/* Section label — HUD style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-[#FF0000]/20 rounded font-mono">
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
            <span className="text-[#FF0000] text-[10px] font-bold uppercase tracking-[0.2em]">PROFILE.EXE</span>
            <span className="text-white/20 text-[10px] font-mono">// ABOUT_ME</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-5 relative group"
          >
            {/* Orbital rings — desktop non-Safari only */}
            {!reduceEffects && [0, 1].map((i) => (
              <motion.div
                key={`about-ring-${i}`}
                animate={{ rotate: i % 2 === 0 ? -360 : 360 }}
                transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-t-[10rem] rounded-b-[2rem] border border-[#FF0000]/10 pointer-events-none"
                style={{
                  width: `calc(100% + ${30 + i * 40}px)`,
                  height: `calc(100% + ${30 + i * 40}px)`,
                }}
              />
            ))}

            {/* Gradient border — desktop non-Safari only */}
            {!reduceEffects && (
              <div className="absolute -inset-2 rounded-t-[10rem] rounded-b-[2rem] pointer-events-none">
                <motion.div
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] opacity-30"
                  style={{
                    background: "linear-gradient(90deg, #FF0000, #FF4444, #FF8888, #FF4444, #FF0000)",
                    backgroundSize: "200% 100%",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "2px"
                  }}
                />
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[#FF0000] rounded-t-[10rem] rounded-b-[2rem] opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ boxShadow: "0 0 60px 30px rgba(255,0,0,0.15)" }}
            />

            <div className="aspect-[4/5] relative rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-black/40">
              <motion.img
                src={secondProfileImg}
                alt="About Rhenmart"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover filter contrast-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

              {/* Floating skill badges — desktop non-Safari only */}
              {!reduceEffects && skills.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  animate={{ y: [0, -5, 0] }}
                  style={{ top: `${25 + i * 28}%`, animationDuration: `${3 + i * 0.5}s`, animationDelay: `${i * 0.4}s` } as React.CSSProperties}
                  className="absolute right-3 flex items-center gap-2 bg-[#111]/90 border border-white/10 rounded-xl px-3 py-2 shadow-lg"
                >
                  <Icon size={14} className="text-[#FF0000]" />
                  <span className="text-white text-xs font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-7 flex flex-col items-start gap-6"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="text-[#FF0000]/40 text-xs font-mono">[BIO]</span>
                <motion.h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-mono">
                  ABOUT<span className="text-[#FF0000]">_</span>ME
                </motion.h2>
              </motion.div>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.15, duration: 0.4 }}
                style={{ originX: 0 }}
                className="w-16 h-[2px] bg-gradient-to-r from-[#FF0000] to-transparent rounded-full mt-1 mb-2"
              />
            </div>

            <div className="space-y-3 leading-relaxed text-sm md:text-base border border-white/[0.06] rounded bg-black/30 p-4 relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#FF0000]/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#FF0000]/30" />
              <div className="text-[#FF0000]/30 text-[9px] font-mono uppercase tracking-widest mb-3">// DESIGNER_PROFILE.md</div>
              {[
                "Self-taught UI/UX Designer and Bachelor of Science in Information Technology (BSIT) student from the Philippines with 5 years of hands-on learning. I build user-friendly interfaces through research, rapid prototyping in Figma, and close collaboration with developers.",
                "My process starts with human research — interviews, papers, and real observation — before touching any tool. I use AI to enhance and validate findings, not replace the thinking.",
                "From academic competitions to community workshops, I've been sharpening my craft through real projects and real feedback.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex gap-3"
                >
                  <span className="text-[#FF0000]/20 text-[10px] select-none shrink-0 mt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-white/55 text-sm leading-relaxed">{text}</span>
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(255,0,0,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF0000]/10 border border-[#FF0000]/40 text-[#FF0000] font-mono font-bold rounded text-xs uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-200"
              >
                <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
                HIRE_ME
              </motion.a>
              <motion.a
                href="#"
                onClick={(e) => { e.preventDefault(); generateResume(); }}
                whileHover={{ scale: 1.04, color: "#FF0000" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 text-white/40 hover:text-[#FF0000] transition-colors font-mono text-xs uppercase tracking-widest border border-white/10 px-6 py-2.5 rounded hover:border-[#FF0000]/30 cursor-pointer"
              >
                <Download size={13} />
                DL_RESUME.PDF
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
