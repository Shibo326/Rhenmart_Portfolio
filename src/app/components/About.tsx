import { motion } from "motion/react";
import { Download, Sparkles, Code2, Lightbulb } from "lucide-react";
import secondProfileImg from "../../Image/new9249-_DSC0331.jpg";
import { generateResume } from "../utils/generateResume";
import { StellarBackground } from "./StellarBackground";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const skills = [
  { label: "UI/UX Design", icon: Sparkles },
  { label: "Prototyping", icon: Lightbulb },
  { label: "Dev Collab", icon: Code2 },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Bg orb — static on mobile */}
      {!isMobile && (
        <motion.div
          animate={{ opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF0000]/10 rounded-full blur-[100px] pointer-events-none"
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full"
            />
            <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">About Me</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-1 md:col-span-5 relative group"
          >
            {/* Stellar background — desktop only */}
            <div className="absolute inset-0 rounded-t-[10rem] rounded-b-[2rem] overflow-hidden pointer-events-none -z-5">
              {!isMobile && <StellarBackground density="low" showOrbitalRings={false} className="rounded-t-[10rem] rounded-b-[2rem]" />}
            </div>

            {/* Orbital rings — desktop only */}
            {!isMobile && [0, 1].map((i) => (
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

            {/* Gradient border — desktop only */}
            {!isMobile && (
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
              className="absolute inset-0 bg-[#FF0000] rounded-t-[10rem] rounded-b-[2rem] blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"
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
                className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

              {/* Floating skill badges — desktop only */}
              {!isMobile && skills.map(({ label, icon: Icon }, i) => (
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
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-1 md:col-span-7 flex flex-col items-start gap-6"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              >
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                  Me
                </span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ originX: 0 }}
                className="w-16 h-1 bg-[#FF0000] rounded-full mt-3"
              />
            </div>

            <div className="space-y-4 text-white/70 leading-relaxed text-base md:text-lg">
              {[
                "Junior UI/UX Designer with 5 years of self-learning experience crafting user-friendly web and mobile interfaces. I specialize in user research, interactive prototyping in Figma, and design strategies that drive product success.",
                "My process is research-driven and human-centered — combining rapid prototyping with seamless developer collaboration. I integrate AI tools to accelerate innovation, iterate faster, and deliver smarter design solutions.",
                "From UX flows to accessible interfaces, I create digital experiences that are both beautiful and effective.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all duration-300"
              >
                Hire Me
              </motion.a>
              <motion.a
                href="#download"
                onClick={(e) => { e.preventDefault(); generateResume(); }}
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 text-white/70 hover:text-[#FF0000] transition-colors font-medium text-base border-b border-transparent hover:border-[#FF0000] pb-1 cursor-pointer"
              >
                <Download size={18} />
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
