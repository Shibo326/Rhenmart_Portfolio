import { lazy, Suspense, useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "lucide-react";
import profileImg from "../../Image/Rhenmart_Profile.jpeg";
import { Particles } from "./Effects";
import { useCountUp, useMagneticRef } from "../hooks/useDeviceAnimations";
import { useAnimationConfig } from "../context/AnimationContext";
import { generateResume } from "../utils/generateResume";

const HeroScene3D = lazy(() =>
  import("./three/HeroScene3D").then((m) => ({ default: m.HeroScene3D }))
);

const TYPE_WORDS = ["UX/UI Designer", "Product Designer"];

function Typer() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = TYPE_WORDS[i];
    if (!del && text === word) {
      const t = setTimeout(() => setDel(true), 1800);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((i + 1) % TYPE_WORDS.length);
      return;
    }
    const t = setTimeout(
      () => setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      del ? 40 : 80
    );
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <span className="text-gradient-red font-bold">
      {text}
      <span className="inline-block w-[3px] h-[0.9em] bg-[#FF0000] align-middle ml-1 animate-blink" />
    </span>
  );
}

const STATS = [
  { code: "EXP", value: 5, suffix: "+", label: "YRS LEARNING" },
  { code: "PRJ", value: 8, suffix: "",  label: "PROJECTS" },
  { code: "AWD", value: 5, suffix: "x", label: "WINS" },
];

function StatBlock({ s, i }: { s: typeof STATS[0]; i: number }) {
  const [ref, v] = useCountUp(s.value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7 + i * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.60)] p-3 md:p-4 transition-colors cursor-default overflow-hidden cut-corner"
    >
      <div className="font-mono text-[9px] text-[#FF0000] tracking-widest">[{s.code}]</div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="text-2xl md:text-4xl font-black text-white mt-1 tabular-nums group-hover:text-glow-red transition-all"
      >
        {v}<span className="text-[#FF0000]">{s.suffix}</span>
      </div>
      <div className="font-mono text-[9px] text-[rgba(255,255,255,0.30)] tracking-wider mt-1">{s.label}</div>
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

const SOCIALS = [
  { Icon: GithubIcon,    href: "https://github.com/Shibo326",                                    color: "#ffffff", label: "GitHub" },
  { Icon: LinkedinIcon,  href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/",       color: "#0a66c2", label: "LinkedIn" },
  { Icon: InstagramIcon, href: "https://www.instagram.com/_rhenmart_/",                          color: "#e4405f", label: "Instagram" },
  { Icon: FacebookIcon,  href: "https://www.facebook.com/rhenmart1234",                          color: "#1877f2", label: "Facebook" },
];

export function Hero() {
  const hireRef = useMagneticRef<HTMLAnchorElement>(0.25);
  const { enable3DScene, isMobile, isSafari } = useAnimationConfig();
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
    <section id="home" className="relative min-h-screen pt-24 pb-16 bg-[#050505]">
      {/* Backdrop layers */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 holo opacity-60 pointer-events-none" />
      <div className="absolute inset-0 crt-vignette pointer-events-none" />
      {/* Orb glows — skip filter:blur on Safari/iOS (GPU expensive) */}
      {!isSafari && !isMobile && (
        <>
          <div
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none animate-orb"
            style={{ background: "rgba(255,0,0,0.15)", filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full pointer-events-none animate-orb"
            style={{ background: "rgba(255,0,0,0.10)", filter: "blur(80px)", animationDelay: "2s" }}
          />
        </>
      )}
      {/* Mobile/Safari: use box-shadow instead of filter:blur — same visual, no GPU layer */}
      {(isSafari || isMobile) && (
        <>
          <div
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 160px 80px rgba(255,0,0,0.12)" }}
          />
          <div
            className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 160px 80px rgba(255,0,0,0.08)" }}
          />
        </>
      )}
      <Particles count={20} />

      {/* Side coordinates — desktop only */}
      <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col gap-3 font-mono text-[9px] text-[rgba(255,255,255,0.30)] tracking-widest vertical-rl">
        <span>LAT: 14.5995° N</span>
        <span className="text-[#FF0000]">LON: 120.9842° E</span>
        <span>SECTOR: PH_01</span>
      </div>
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3 font-mono text-[9px] text-[rgba(255,255,255,0.30)] tracking-widest vertical-rl">
        <span className="text-[#FF0000]">SYS: ONLINE</span>
        <span>UPLINK: STABLE</span>
        <span>v2.0.1</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" style={{ overflow: "visible" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-10rem)]" style={{ overflow: "visible" }}>

          {/* ── Right — portrait (order-first on mobile) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="order-first lg:order-last lg:col-span-5 relative aspect-square w-full max-w-[280px] lg:max-w-md mx-auto lg:ml-auto lg:mr-0"
            style={{ overflow: "visible" }}
          >
            {/* WebGL scene — desktop only */}
            {enable3DScene && (
              <div className="hidden lg:block absolute -inset-32 z-0">
                <Suspense fallback={null}>
                  <HeroScene3D />
                </Suspense>
              </div>
            )}

            {/* Floating data labels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="absolute -left-2 top-8 z-30 font-mono text-[9px] text-[#FF0000] tracking-widest bg-[rgba(3,3,3,0.80)] border border-[rgba(255,0,0,0.20)] px-2 py-1 cut-corner hidden sm:block"
            >
              ID: 0x4A7F
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="absolute -right-2 bottom-24 z-30 font-mono text-[9px] text-white tracking-widest bg-[rgba(3,3,3,0.80)] border border-[rgba(255,0,0,0.20)] px-2 py-1 cut-corner hidden sm:block"
            >
              <span className="text-[#FF0000]">▸</span> RENDERING_LIVE
            </motion.div>

            {/* Portrait */}
            <motion.div className="relative mx-auto w-[75%] lg:w-[68%] max-w-[260px] lg:max-w-none aspect-[3/4] z-20 mt-6">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#FF0000] via-[#CC0000] to-[#FF4444] opacity-70 blur-md cut-corner-lg" />
              <div className="relative w-full h-full overflow-hidden border border-[rgba(255,0,0,0.50)] group cut-corner-lg depth-shadow">
                <img
                  src={profileImg}
                  alt="Rhenmart Dela Cruz"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-[#050505]/20" />
                <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
                <div className="absolute left-0 right-0 h-12 bg-gradient-to-b from-[rgba(255,0,0,0.40)] to-transparent animate-scan pointer-events-none" />
                <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FF0000]" />
                <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#FF0000]" />
                <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#FF0000]" />
                <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FF0000]" />
                <div className="absolute bottom-3 left-3 right-3 bg-[rgba(3,3,3,0.90)] border border-[rgba(255,0,0,0.20)] px-3 py-2 flex items-center gap-2 cut-corner">
                  <span className="relative w-2 h-2 bg-green-400 rounded-full">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ripple" />
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-[8px] text-[rgba(255,255,255,0.30)] uppercase tracking-widest">SUBJECT</div>
                    <div className="font-mono text-[10px] text-white">RHENMART_DC</div>
                  </div>
                  <span className="font-mono text-[9px] text-[#FF0000]">█████</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Left — text content ── */}
          <div className="order-last lg:order-first lg:col-span-7 flex flex-col items-center lg:items-start space-y-7 relative z-10 text-center lg:text-left" style={{ overflow: "visible" }}>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-2.5 bg-[rgba(3,3,3,0.90)] cursor-default group"
              style={{ border: "1px solid rgba(255,0,0,0.55)" }}
            >
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF0000] transition-all duration-500 group-hover:w-4 group-hover:h-4" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF0000] transition-all duration-500 group-hover:w-4 group-hover:h-4" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF0000] transition-all duration-500 group-hover:w-4 group-hover:h-4" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF0000] transition-all duration-500 group-hover:w-4 group-hover:h-4" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(255,0,0,0.08) 0%, transparent 70%)" }} />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0000]" />
              </span>
              <span className="text-[rgba(255,255,255,0.40)] text-[9px] tracking-widest">SYS</span>
              <span className="text-[rgba(255,255,255,0.20)]">/</span>
              <span className="text-white font-bold tracking-[0.2em]">DESIGNER</span>
              <span className="text-[#FF0000] font-black">_READY</span>
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Name */}
            <div className="space-y-2 py-4 w-full" style={{ overflow: "visible" }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center lg:justify-start gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#FF0000]"
              >
                <span className="h-px w-8 bg-[#FF0000]" />
                <span>Hello, I'm</span>
              </motion.div>

              <h1
                className="relative font-black tracking-tighter leading-[0.85]"
                style={{ fontSize: "clamp(2.2rem, 13vw, 8rem)", paddingTop: "0.2em", paddingBottom: "0.2em", overflow: "visible" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-gradient-white relative"
                  style={{ overflow: "visible" }}
                >
                  RHENMART
                  <span className="absolute inset-0 text-[rgba(255,0,0,0.30)] animate-glitch-hard hidden md:block" aria-hidden>
                    RHENMART
                  </span>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-stroke"
                  style={{ overflow: "visible" }}
                >
                  DELA CRUZ
                </motion.span>
              </h1>
            </div>

            {/* Typing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center lg:justify-start gap-3 text-2xl md:text-3xl font-bold h-10"
            >
              <span className="font-mono text-[#FF0000] text-sm">▸</span>
              <Typer />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-[rgba(255,255,255,0.55)] max-w-lg leading-relaxed"
            >
              Self-taught designer turning{" "}
              <span className="text-white">human research</span> into{" "}
              <span className="text-[#FF0000]">intentional digital products</span>. Based in the
              Philippines, building from terminal-grade attention to detail.
            </motion.p>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex items-center justify-center lg:justify-start gap-3 flex-wrap"
            >
              {SOCIALS.map(({ Icon, href, color, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative w-11 h-11 flex items-center justify-center bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:border-transparent transition-all hover:-translate-y-1.5 hover:scale-110 overflow-hidden cut-corner"
                >
                  <Icon size={18} className="text-[rgba(255,255,255,0.55)] group-hover:text-white transition-colors relative z-10" />
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: color, boxShadow: `0 0 20px ${color}` }}
                  />
                </a>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto"
            >
              <a
                ref={hireRef}
                href="#contact"
                className="group relative text-white font-mono text-xs tracking-widest px-7 py-4 flex items-center justify-center gap-3 overflow-hidden w-full sm:w-auto"
                style={{ background: "transparent", border: "1px solid rgba(255,0,0,0.6)" }}
              >
                <span className="absolute inset-0 bg-[#FF0000] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF0000] group-hover:w-full group-hover:h-full transition-all duration-500 opacity-100" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF0000] group-hover:w-full group-hover:h-full transition-all duration-500 opacity-100" />
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0000] opacity-75 group-hover:bg-white" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF0000] group-hover:bg-white transition-colors" />
                </span>
                <span className="relative text-[#FF0000] group-hover:text-white transition-colors duration-300">HIRE_ME</span>
                <ArrowRight size={14} className="relative text-[#FF0000] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </a>
              <a
                href="#"
                onClick={handleDownloadCV}
                aria-disabled={cvLoading}
                className={`group relative border border-[rgba(255,255,255,0.08)] hover:border-[#FF0000] text-white font-mono text-xs tracking-widest px-7 py-4 flex items-center justify-center gap-2 transition-all hover:bg-[rgba(255,0,0,0.05)] hover:scale-105 cut-corner cursor-pointer w-full sm:w-auto ${cvLoading ? "opacity-60 pointer-events-none" : ""}`}
              >
                <Download size={14} className={`transition-transform ${cvLoading ? "animate-bounce" : "group-hover:translate-y-0.5"}`} />
                {cvLoading ? "GENERATING..." : "DL_CV.PDF"}
              </a>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {STATS.map((s, idx) => (
                <StatBlock key={s.code} s={s} i={idx} />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll down */}
        <div className="flex mt-12 flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-[rgba(255,255,255,0.55)] animate-blink">
            [ SCROLL_DOWN ]
          </span>
          <span className="relative w-px h-12 bg-gradient-to-b from-[#FF0000] to-transparent overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-3 bg-[#FF0000] animate-beam hidden sm:block" />
          </span>
        </div>
      </div>
    </section>
  );
}
