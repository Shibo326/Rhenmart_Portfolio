import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download, Sparkles, Zap, Trophy, Linkedin, Github, Instagram, Facebook } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import profileImg from "../../Image/Rhenmart_Profile.jpeg";
import { ease, springs } from "../hooks/useDeviceAnimations";
import { generateResume } from "../utils/generateResume";
import { useAnimationConfig } from "../context/AnimationContext";
import { MagneticButton } from "./MagneticButton";

// Typing Animation Component
function TypingAnimation() {
  const titles = ["UX/UI Designer", "Product Designer"];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000); // Pause for 2 seconds before deleting
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting && displayText === currentTitle) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, currentTitleIndex]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000]">
      <motion.span
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="inline-block"
        style={{ 
          backgroundImage: "linear-gradient(90deg, #FF0000, #FF4444, #FF0000)", 
          backgroundClip: "text", 
          WebkitBackgroundClip: "text", 
          color: "transparent", 
          backgroundSize: "200% 100%" 
        }}
      >
        {displayText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-8 sm:h-10 md:h-12 bg-[#FF0000] ml-1 align-middle"
        aria-hidden="true"
      />
    </span>
  );
}

export function Hero() {
  const { enable3DTilt, isMobile } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  const reduceHero = isMobile;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduceHero ? 0 : -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceHero ? 0 : 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceHero ? 1 : 0]);
  
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const socials = [
    { href: "https://github.com/Shibo326", icon: <Github size={20} />, color: "#333", shadow: "rgba(255,255,255,0.2)", label: "GitHub" },
    { href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", icon: <Linkedin size={20} />, color: "#0077B5", shadow: "rgba(0,119,181,0.5)", label: "LinkedIn" },
    { href: "https://www.instagram.com/_rhenmart_/", icon: <Instagram size={20} />, color: "#E1306C", shadow: "rgba(225,48,108,0.5)", label: "Instagram" },
    { href: "https://www.facebook.com/rhenmart1234", icon: <Facebook size={20} />, color: "#1877F2", shadow: "rgba(24,119,242,0.5)", label: "Facebook" },
  ];

  return (
    <section ref={sectionRef} id="home"
      className="min-h-[100svh] w-full flex items-center relative overflow-hidden bg-[#050505]">

      {/* Bg orbs — box-shadow instead of blur on Safari */}
      {!reduceEffects ? (
        <>
          <motion.div animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-[15%] w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 160px 80px rgba(255,0,0,0.12)", background: "transparent" }} />
          <motion.div animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 -right-[15%] w-[280px] h-[280px] rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 140px 70px rgba(139,0,0,0.08)", background: "transparent" }} />
        </>
      ) : (
        <div className="absolute top-1/4 -left-[20%] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 80px 40px rgba(255,0,0,0.04)", background: "transparent" }} />
      )}

      {/* Floating particles — desktop non-Safari only */}
      {!reduceEffects && [0,1,2,3,4].map((i) => (
        <motion.div key={i}
          aria-hidden="true"
          animate={{ y: [0, -20, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${10 + i * 18}%`, top: `${25 + (i % 3) * 20}%` }} />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 md:py-0 md:min-h-[100svh] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-center">

          {/* ── Left Content ── */}
          <motion.div style={{ y: textY, opacity }}
            className="flex flex-col gap-6 order-2 md:order-1">

            {/* Available badge — HUD style */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.1, ease: ease.out }}
              className="inline-flex items-center gap-2.5 w-fit px-4 py-2 bg-black/60 border border-[#FF0000]/30 rounded font-mono">
              <motion.span animate={{ opacity:[1,0.2,1] }} transition={{ duration:1, repeat:Infinity }}
                className="w-2 h-2 bg-[#FF0000] rounded-full block" />
              <span className="text-[#FF0000] text-[10px] tracking-[0.2em] uppercase font-bold">STATUS: AVAILABLE</span>
              <span className="text-white/20 text-[10px] font-mono">|</span>
              <span className="text-white/40 text-[10px] tracking-widest uppercase">OPEN_TO_WORK</span>
            </motion.div>

            <div className="space-y-2">
              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:0.2, ease: ease.out }}
                className="text-[#FF0000] text-base sm:text-lg font-semibold tracking-wide font-mono uppercase">
                Hello, I'm
              </motion.p>

              {/* Letter-by-letter name — enhanced */}
              <motion.h1 initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-hud-flicker">
                {"Rhenmart".split("").map((c, i) => (
                  <motion.span key={i} initial={{ opacity:0, y:40, rotateX: -90 }} animate={{ opacity:1, y:0, rotateX: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, ease: ease.out, duration: 0.6 }}
                    whileHover={{ scale: 1.1, color: "#FF0000", transition: { duration: 0.2 } }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 cursor-default">
                    {c}
                  </motion.span>
                ))}
                <br />
                {"Dela Cruz".split("").map((c, i) => (
                  <motion.span key={i} initial={{ opacity:0, y:40, rotateX: -90 }} animate={{ opacity:1, y:0, rotateX: 0 }}
                    transition={{ delay: 0.7 + i * 0.04, ease: ease.out, duration: 0.6 }}
                    whileHover={{ scale: 1.1, color: "#FF0000", transition: { duration: 0.2 } }}
                    className="inline-block text-white/40 cursor-default">
                    {c === " " ? "\u00A0" : c}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:1.1, ease: ease.out }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight relative inline-block">
                <TypingAnimation />
              </motion.h2>
            </div>

            {/* Social icons — enhanced with labels */}
            <div className="flex gap-3 items-center flex-wrap">
              {socials.map(({ href, icon, color, shadow, label }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity:0, y:20, scale:0.8 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ delay: 1.3 + i * 0.1, ...springs.bouncy }}
                  whileHover={{ scale:1.15, y: -5 }} 
                  whileTap={{ scale:0.9 }}
                  className="group relative p-3 sm:p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all duration-300"
                  onMouseEnter={e => {
                    if (reduceEffects) return;
                    const el = e.currentTarget as HTMLElement;
                    el.style.backgroundColor=color;
                    el.style.boxShadow=`0 0 25px ${shadow}, 0 10px 20px rgba(0,0,0,0.3)`;
                    el.style.borderColor=color;
                  }}
                  onMouseLeave={e => { 
                    const el = e.currentTarget as HTMLElement; 
                    el.style.backgroundColor=""; 
                    el.style.boxShadow=""; 
                    el.style.borderColor=""; 
                  }}>
                  {icon}
                  {/* Tooltip */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {label}
                  </motion.span>
                </motion.a>
              ))}
            </div>

            {/* CTA buttons — HUD style */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:1.4, ease: ease.out }}
              className="flex flex-wrap gap-3">
              <MagneticButton>
                <motion.a href="#contact"
                  whileHover={{ scale:1.04, boxShadow:"0 0 30px rgba(255,0,0,0.5)" }}
                  whileTap={{ scale:0.97 }}
                  className="group relative px-7 sm:px-8 py-3 bg-[#FF0000] text-white font-mono font-bold rounded text-xs sm:text-sm overflow-hidden uppercase tracking-widest flex items-center gap-2">
                  <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-white" />
                  HIRE_ME
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </MagneticButton>
              <motion.a href="#"
                whileHover={{ scale:1.04, borderColor:"#FF0000", color:"#FF0000" }}
                whileTap={{ scale:0.97 }}
                onClick={(e) => { e.preventDefault(); generateResume(); }}
                className="px-7 sm:px-8 py-3 bg-transparent border border-white/20 text-white/70 font-mono font-bold rounded text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 uppercase tracking-widest cursor-pointer">
                <Download size={13} />
                DL_CV.PDF
              </motion.a>
            </motion.div>

            {/* Divider — enhanced */}
            <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
              transition={{ delay:1.6, duration:0.8, ease: ease.out }} style={{ originX:0 }}
              className="relative w-full h-[2px] bg-gradient-to-r from-[#FF0000] via-white/20 to-transparent rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent"
              />
            </motion.div>

            {/* Stats — HUD panels */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:1.7, ease: ease.out }}
              className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
              {[
                { value:"5+", label:"YRS SOLO LEARNING", code:"EXP", icon: Sparkles, color: "#FF0000" }, 
                { value:"8", label:"PROJECTS", code:"PRJ", icon: Zap, color: "#FF4444" }, 
                { value:"5x", label:"COMPETITION WIN", code:"AWD", icon: Trophy, color: "#FF0000" }
              ].map(({ value, label, code, icon: Icon, color }, i) => (
                <motion.div key={i} 
                  whileHover={{ scale:1.03, y:-4 }} 
                  whileTap={{ scale:0.95 }}
                  onHoverStart={() => setHoveredStat(i)}
                  onHoverEnd={() => setHoveredStat(null)}
                  transition={springs.snappy} 
                  className="relative group cursor-default">
                  <div className="relative p-3 sm:p-4 bg-black/60 border border-white/10 rounded group-hover:border-[#FF0000]/50 transition-all duration-300 overflow-hidden">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#FF0000]/40" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#FF0000]/40" />
                    {/* Code label */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#FF0000]/40 text-[8px] font-mono">[{code}]</span>
                      <Icon size={10} className="text-[#FF0000]/40" />
                    </div>
                    {/* Value */}
                    <motion.span 
                      className="block text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#FF0000] to-[#FF4444] font-mono"
                      animate={{ scale: hoveredStat === i ? 1.08 : 1 }}
                    >
                      {value}
                    </motion.span>
                    {/* Label */}
                    <span className="block text-[10px] sm:text-xs text-white/30 uppercase tracking-wider font-mono mt-0.5 leading-tight">
                      {label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Portrait ── */}
          <motion.div style={{ y: imgY }}
            initial={{ opacity:0, scale:0.8, x:40 }} animate={{ opacity:1, scale:1, x:0 }}
            transition={{ duration:0.9, delay:0.4, ease: ease.out }}
            className="order-1 md:order-2 flex justify-center md:justify-end relative group pb-10 md:pb-0">

            {/* Orbital rings — desktop non-Safari only */}
            {!reduceEffects && [0, 1].map((i) => (
              <motion.div
                key={`portrait-ring-${i}`}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF0000]/10 pointer-events-none"
                style={{ width: `${300 + i * 60}px`, height: `${370 + i * 75}px` }}
              />
            ))}

            {/* Animated gradient border — reduced on Safari/mobile */}
            <div className="absolute -inset-2 sm:-inset-3 rounded-[2.5rem] pointer-events-none">
              <motion.div
                animate={reduceEffects ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[2.5rem]"
                style={{
                  background: "linear-gradient(90deg, #FF0000, #FF4444, #FF8888, #FF4444, #FF0000)",
                  backgroundSize: "200% 100%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "2px",
                  opacity: reduceEffects ? 0.2 : 0.55,
                }}
              />
            </div>

            {/* Outer glow — box-shadow instead of blur */}
            <motion.div
              animate={{ opacity: reduceEffects ? [0.04, 0.07, 0.04] : [0.12, 0.2, 0.12] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-[2.5rem] -z-10"
              style={{ boxShadow: "0 0 60px 30px rgba(255,0,0,0.1)", background: "transparent" }}
            />

            {/* Image container with enhanced effects */}
            <motion.div 
              animate={{ y:[0,-12,0] }} 
              transition={{ repeat:Infinity, duration:6, ease:"easeInOut" }}
              whileHover={{ scale: 1.02 }}
              className={`relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[360px] aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-black/60 via-black/30 to-black/60 border border-white/20 transition-all duration-700 ${reduceEffects ? "shadow-[0_0_20px_rgba(255,0,0,0.08)]" : "shadow-[0_0_50px_rgba(255,0,0,0.15)] group-hover:shadow-[0_0_70px_rgba(255,0,0,0.3)]"}`}>
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 via-transparent to-[#8B00FF]/5 z-10 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />
              
              {/* Image */}
              <motion.img 
                src={profileImg} 
                alt="Rhenmart Portrait"
                whileHover={{ scale:1.08 }} 
                transition={{ duration:0.6, ease: ease.out }}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover object-top filter contrast-110 brightness-105" 
              />

              {/* Scan line effect — desktop non-Safari only */}
              {!reduceEffects && (
                <motion.div
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
                />
              )}
            </motion.div>

            {/* HUD floating badge */}
            <motion.div 
              initial={{ opacity:0, x:20, scale:0.8 }} 
              animate={{ opacity:1, x:0, scale:1 }}
              transition={{ delay:1.2, ...springs.bouncy }}
              className="absolute bottom-4 left-2 sm:-left-6 bg-black/90 border border-[#FF0000]/30 rounded px-4 py-2.5 z-20 font-mono overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF0000]/60" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF0000]/60" />
              <div className="flex items-center gap-2">
                <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.2, repeat:Infinity }}
                  className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{ boxShadow:"0 0 6px rgba(74,222,128,0.8)" }} />
                <div>
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">STATUS</p>
                  <p className="text-xs text-white font-bold uppercase tracking-wider">FREELANCE_OPEN</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator — retro HUD style */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.5, duration:1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-[#FF0000]/40 text-[9px] uppercase tracking-[0.3em] font-mono animate-pixel-blink">SCROLL_DOWN</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#FF0000]/60 to-transparent">
          <motion.div animate={{ scaleY:[0,1,0], originY:0 }} transition={{ repeat:Infinity, duration:1.5, ease:"easeInOut" }}
            className="w-full h-full bg-[#FF0000]" />
        </div>
      </motion.div>
    </section>
  );
}
