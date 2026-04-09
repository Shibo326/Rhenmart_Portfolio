import { motion, useScroll, useTransform } from "motion/react";
import { LinkedinIcon, ArrowRight, InstagramIcon, FacebookIcon, GithubIcon, Download, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import profileImg from "../../Image/Rhenmart_Profile.jpeg";
import { ease, springs } from "../hooks/useDeviceAnimations";
import { generateResume } from "../utils/generateResume";
import { StellarBackground } from "./StellarBackground";

const reduceHero = typeof window !== "undefined" && window.innerWidth < 768;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduceHero ? 0 : -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceHero ? 0 : 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceHero ? 1 : 0]);
  
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const socials = [
    { href: "https://github.com/Shibo326", icon: <GithubIcon size={20} />, color: "#333", shadow: "rgba(255,255,255,0.2)", label: "GitHub" },
    { href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", icon: <LinkedinIcon size={20} />, color: "#0077B5", shadow: "rgba(0,119,181,0.5)", label: "LinkedIn" },
    { href: "https://www.instagram.com/_rhenmart_/", icon: <InstagramIcon size={20} />, color: "#E1306C", shadow: "rgba(225,48,108,0.5)", label: "Instagram" },
    { href: "https://www.facebook.com/rhenmart1234", icon: <FacebookIcon size={20} />, color: "#1877F2", shadow: "rgba(24,119,242,0.5)", label: "Facebook" },
  ];

  return (
    <section ref={sectionRef} id="home"
      className="min-h-screen w-full flex items-center relative overflow-hidden bg-[#050505]">

      {/* Bg orbs — desktop only, mobile gets very subtle static version */}
      {!reduceHero ? (
        <>
          <motion.div animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-[15%] w-[400px] h-[400px] bg-[#FF0000]/20 rounded-full blur-[120px] pointer-events-none" />
          <motion.div animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 -right-[15%] w-[350px] h-[350px] bg-red-900/15 rounded-full blur-[120px] pointer-events-none" />
        </>
      ) : (
        <div className="absolute top-1/4 -left-[20%] w-[250px] h-[250px] bg-[#FF0000]/8 rounded-full blur-[80px] pointer-events-none" />
      )}

      {/* Floating particles — reduced, desktop only */}
      {!reduceHero && [0,1,2,3,4].map((i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${10 + i * 18}%`, top: `${25 + (i % 3) * 20}%` }} />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 md:py-0 md:min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-center">

          {/* ── Left Content ── */}
          <motion.div style={{ y: textY, opacity }}
            className="flex flex-col gap-6 order-2 md:order-1">

            {/* Available badge — enhanced */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.6, delay:0.1, ease: ease.out }}
              className="inline-flex items-center gap-2.5 w-fit px-4 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-full backdrop-blur-sm">
              <motion.span animate={{ scale:[1,1.5,1], opacity:[0.5,1,0.5] }} 
                transition={{ duration:1.5, repeat:Infinity }}
                className="relative">
                <span className="w-2.5 h-2.5 bg-[#FF0000] rounded-full block" />
                <motion.span 
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 w-2.5 h-2.5 bg-[#FF0000] rounded-full"
                />
              </motion.span>
              <span className="text-white/70 text-xs sm:text-sm tracking-widest uppercase font-semibold">Available for work</span>
              <Sparkles size={14} className="text-[#FF0000]" />
            </motion.div>

            <div className="space-y-2">
              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:0.2, ease: ease.out }}
                className="text-[#FF0000] text-base sm:text-lg font-semibold tracking-wide flex items-center gap-2">
                <Zap size={18} className="animate-pulse" />
                Hi I am,
              </motion.p>

              {/* Letter-by-letter name — enhanced */}
              <motion.h1 initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000] bg-[length:200%_100%]">
                  <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block"
                    style={{ backgroundImage: "linear-gradient(90deg, #FF0000, #FF4444, #FF0000)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", backgroundSize: "200% 100%" }}
                  >
                    UI/UX Designer
                  </motion.span>
                </span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF0000] ml-1 align-middle"
                />
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

            {/* CTA buttons — enhanced */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:1.4, ease: ease.out }}
              className="flex flex-wrap gap-4">
              <motion.a href="#contact"
                whileHover={{ scale:1.05, boxShadow:"0 0 40px rgba(255,0,0,0.6)" }}
                whileTap={{ scale:0.97 }}
                className="group relative px-8 sm:px-9 py-3.5 sm:py-4 bg-[#FF0000] text-white font-bold rounded-full transition-all duration-300 text-sm sm:text-base overflow-hidden">
                <motion.span
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
                <span className="relative flex items-center gap-2">
                  Hire Me
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.a>
              <motion.a href="#download"
                whileHover={{ scale:1.05, borderColor:"#FF0000", color:"#FF0000", backgroundColor:"rgba(255,0,0,0.1)" }}
                whileTap={{ scale:0.97 }}
                onClick={(e) => { e.preventDefault(); generateResume(); }}
                className="px-8 sm:px-9 py-3.5 sm:py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-2 text-sm sm:text-base cursor-pointer backdrop-blur-sm">
                <Download size={16} />
                Download CV
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

            {/* Stats — completely redesigned */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5, delay:1.7, ease: ease.out }}
              className="grid grid-cols-3 gap-4 sm:gap-6">
              {[
                { value:"5+", label:"Solo Learning Experience", icon: Sparkles, color: "#FF0000" }, 
                { value:"7", label:"Projects", icon: Zap, color: "#FF4444" }, 
                { value:"4x", label:"Competition Winner", icon: GithubIcon, color: "#FF0000" }
              ].map(({ value, label, icon: Icon, color }, i) => (
                <motion.div key={i} 
                  whileHover={{ scale:1.05, y:-8 }} 
                  whileTap={{ scale:0.95 }}
                  onHoverStart={() => setHoveredStat(i)}
                  onHoverEnd={() => setHoveredStat(null)}
                  transition={springs.snappy} 
                  className="relative group cursor-default">
                  {/* Background glow */}
                  <motion.div
                    animate={{ 
                      opacity: hoveredStat === i ? 0.3 : 0,
                      scale: hoveredStat === i ? 1 : 0.8
                    }}
                    className="absolute inset-0 rounded-2xl blur-xl"
                    style={{ backgroundColor: color }}
                  />
                  
                  {/* Card */}
                  <div className="relative p-4 sm:p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group-hover:border-[#FF0000]/50 transition-all duration-300">
                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: hoveredStat === i ? 360 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute -top-3 -right-3 p-2 bg-[#FF0000] rounded-full"
                    >
                      <Icon size={14} className="text-white" />
                    </motion.div>
                    
                    {/* Value */}
                    <motion.span 
                      className="block text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#FF0000] to-[#FF4444]"
                      animate={{ scale: hoveredStat === i ? 1.1 : 1 }}
                    >
                      {value}
                    </motion.span>
                    
                    {/* Label */}
                    <span className="block text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider font-bold mt-1 leading-tight">
                      {label}
                    </span>
                    
                    {/* Animated border */}
                    <motion.div
                      animate={{ 
                        opacity: hoveredStat === i ? 1 : 0,
                      }}
                      className="absolute inset-0 rounded-2xl"
                    >
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-2xl p-[2px]"
                        style={{
                          background: `linear-gradient(90deg, ${color}, ${color}88, ${color}44, ${color}88, ${color})`,
                          backgroundSize: "200% 100%",
                          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude"
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right Portrait ── */}
          <motion.div style={{ y: imgY }}
            initial={{ opacity:0, scale:0.8, x:40 }} animate={{ opacity:1, scale:1, x:0 }}
            transition={{ duration:0.9, delay:0.4, ease: ease.out }}
            className="order-1 md:order-2 flex justify-center md:justify-end relative group">

            {/* Stellar background with orbital rings */}
            <div className="absolute inset-0 rounded-[2.5rem] -z-5">
              <StellarBackground density="medium" showOrbitalRings={!reduceHero} className="rounded-[2.5rem]" />
            </div>

            {/* Orbital rings — desktop only */}
            {!reduceHero && [0, 1].map((i) => (
              <motion.div
                key={`portrait-ring-${i}`}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF0000]/10 pointer-events-none"
                style={{ width: `${300 + i * 60}px`, height: `${370 + i * 75}px` }}
              />
            ))}

            {/* Animated gradient border — reduced on mobile */}
            <div className="absolute -inset-2 sm:-inset-3 rounded-[2.5rem] pointer-events-none">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[2.5rem]"
                style={{
                  background: "linear-gradient(90deg, #FF0000, #FF4444, #FF8888, #FF4444, #FF0000)",
                  backgroundSize: "200% 100%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "2px",
                  opacity: reduceHero ? 0.2 : 0.55,
                }}
              />
            </div>

            {/* Outer glow — much softer on mobile */}
            <motion.div
              animate={{ opacity: reduceHero ? [0.04, 0.07, 0.04] : [0.12, 0.2, 0.12] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-[2.5rem] bg-[#FF0000]/10 blur-2xl -z-10"
            />

            {/* Image container with enhanced effects */}
            <motion.div 
              animate={{ y:[0,-12,0] }} 
              transition={{ repeat:Infinity, duration:6, ease:"easeInOut" }}
              whileHover={{ scale: 1.02 }}
              className={`relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[360px] aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-black/60 via-black/30 to-black/60 border border-white/20 transition-all duration-700 ${reduceHero ? "shadow-[0_0_20px_rgba(255,0,0,0.1)]" : "shadow-[0_0_60px_rgba(255,0,0,0.2)] group-hover:shadow-[0_0_90px_rgba(255,0,0,0.4)]"}`}>
              
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

              {/* Scan line effect */}
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
              />
            </motion.div>

            {/* Enhanced floating badge */}
            <motion.div 
              initial={{ opacity:0, x:20, scale:0.8 }} 
              animate={{ opacity:1, x:0, scale:1 }}
              transition={{ delay:1.2, ...springs.bouncy }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute bottom-4 -left-2 sm:-left-6 bg-gradient-to-br from-[#111] to-[#000] border border-white/20 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-md hidden sm:block overflow-hidden group/badge">
              
              {/* Badge glow */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl"
              />
              
              <div className="relative z-10">
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Available</p>
                <p className="text-sm text-white font-bold">For Freelance</p>
              </div>
              
              {/* Pulsing dot */}
              <div className="absolute top-3 right-3">
                <motion.div 
                  animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} 
                  transition={{ duration:1.5, repeat:Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                  style={{ boxShadow: "0 0 10px rgba(74,222,128,0.8)" }}
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.5, duration:1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
        <span className="text-white/25 text-[9px] uppercase tracking-[0.2em] font-medium hidden sm:block">Scroll Down</span>
        <div className="w-4 h-7 border border-white/20 rounded-full flex justify-center p-1">
          <motion.div animate={{ y:[0,8,0], opacity:[1,0,1] }} transition={{ repeat:Infinity, duration:1.5 }}
            className="w-1 h-1.5 bg-[#FF0000] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
