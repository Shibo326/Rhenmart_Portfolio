import { useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import secondProfileImg from "../../Image/new9249-_DSC0331.jpg";
import { generateResume } from "../utils/generateResume";
import { useTilt, useMagneticRef } from "../hooks/useDeviceAnimations";
import { SectionBadge, HudCorners } from "./Hud";

const PARAGRAPHS = [
  "Self-taught UI/UX Designer and Bachelor of Science in Information Technology (BSIT) student from the Philippines with 5 years of hands-on learning. I build user-friendly interfaces through research, rapid prototyping in Figma, and close collaboration with developers.",
  "My process starts with human research — interviews, papers, and real observation — before touching any tool. I use AI to enhance and validate findings, not replace the thinking.",
  "From academic competitions to community workshops, I've been sharpening my craft through real projects and real feedback.",
];

const FLOATING = ["UI/UX Design", "Prototyping", "Dev Collab"];

export function About() {
  const tiltRef = useTilt<HTMLDivElement>(5);
  const hireRef = useMagneticRef<HTMLAnchorElement>(0.25);
  const [cvLoading, setCvLoading] = useState(false);

  const handleDownloadCV = async (e: MouseEvent) => {
    e.preventDefault();
    if (cvLoading) return;
    setCvLoading(true);
    try {
      await generateResume();
    } finally {
      setCvLoading(false);
    }
  };

  return (
    <section id="about" className="relative py-24 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section badge */}
        <div className="mb-12">
          <SectionBadge name="PROFILE.EXE" comment="ABOUT_ME" />
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-sm"
          >
            {/* Orbital rings */}
            <div className="absolute inset-0 -m-8 hidden md:block pointer-events-none">
              <div
                className="absolute inset-0 border border-[rgba(255,0,0,0.20)] animate-rotate-slow"
                style={{ borderRadius: "50%" }}
              />
              <div
                className="absolute inset-6 border border-[rgba(255,0,0,0.10)] animate-rotate-slower"
                style={{ borderRadius: "50%" }}
              />
            </div>

            <div ref={tiltRef} className="relative animate-float tilt-3d">
              {/* Glow border */}
              <div className="absolute -inset-1 bg-gradient-to-br from-[#FF0000] via-[#CC0000] to-[#FF4444] opacity-60 blur-sm rounded-t-[10rem] rounded-b-[2rem]" />

              <div className="relative aspect-[3/4] overflow-hidden border border-[rgba(255,0,0,0.40)] rounded-t-[10rem] rounded-b-[2rem] group">
                <img
                  src={secondProfileImg}
                  alt="About Rhenmart"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/70 to-transparent" />
                <div className="absolute inset-0 scanlines opacity-30" />
                {/* Scan beam — fixed with proper overflow container */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[rgba(255,0,0,0.25)] to-transparent"
                    style={{ animation: "aboutScan 3s linear infinite", top: 0 }}
                  />
                </div>
              </div>
            </div>

            {/* Floating skill badges */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 space-y-3 hidden sm:block">
              {FLOATING.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  whileHover={{ x: 8, scale: 1.05 }}
                  className="bg-[rgba(3,3,3,0.90)] border border-[rgba(255,0,0,0.20)] px-3 py-2 font-mono text-[10px] tracking-widest text-white hover:border-[#FF0000] transition-colors cursor-default"
                >
                  <span className="text-[#FF0000] mr-1">▸</span>
                  {f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Text ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <div className="font-mono text-xs text-[#FF0000] tracking-widest mb-2">[BIO]</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                ABOUT_ME
                <span className="text-[#FF0000] animate-blink">_</span>
              </h2>
            </div>

            {/* Code block bio */}
            <div className="relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.30)] p-6 transition-colors group">
              <HudCorners />
              <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest mb-4 pb-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span>// DESIGNER_PROFILE.md</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse-red" />
                  ACTIVE
                </span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                {PARAGRAPHS.map((p, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <span className="text-[#FF0000] text-xs pt-1 select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[rgba(255,255,255,0.55)] leading-relaxed hover:text-[rgba(255,255,255,0.80)] transition-colors">
                      {p}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                ref={hireRef}
                href="#contact"
                className="group relative text-white font-mono text-xs tracking-widest px-7 py-4 flex items-center gap-3 overflow-hidden"
                style={{ background: "transparent", border: "1px solid rgba(255,0,0,0.6)" }}
              >
                {/* Animated fill on hover */}
                <span className="absolute inset-0 bg-[#FF0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                {/* Corner accents */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF0000] group-hover:w-full group-hover:h-full transition-all duration-500" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF0000] group-hover:w-full group-hover:h-full transition-all duration-500" />
                {/* Scan sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                {/* Pulse dot */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-75 group-hover:bg-white" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0000] group-hover:bg-white transition-colors" />
                </span>
                <span className="relative text-[#FF0000] group-hover:text-white transition-colors duration-300">HIRE_ME</span>
              </a>
              <a
                href="#"
                onClick={handleDownloadCV}
                aria-disabled={cvLoading}
                className={`group relative border border-[rgba(255,255,255,0.08)] hover:border-[#FF0000] text-[rgba(255,255,255,0.55)] hover:text-white font-mono text-xs tracking-widest px-5 py-3 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer overflow-hidden ${cvLoading ? "opacity-60 pointer-events-none" : ""}`}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                <Download size={14} className={`relative transition-transform ${cvLoading ? "animate-bounce" : "group-hover:translate-y-0.5"}`} />
                <span className="relative">{cvLoading ? "GENERATING..." : "DL_RESUME.PDF"}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
