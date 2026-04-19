import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { useAnimationConfig } from "../context/AnimationContext";

function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, value, { duration: 0.3 });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [value]);
  return <span>{display}</span>;
}

const BOOT_LINES = [
  { text: "INITIALIZING PORTFOLIO_OS v2.0...", delay: 0.1 },
  { text: "LOADING DESIGN_MODULES...", delay: 0.4 },
  { text: "MOUNTING UX_RESEARCH_ENGINE...", delay: 0.7 },
  { text: "MOUNTING UI_COMPONENTS...", delay: 1.0 },
  { text: "CONNECTING RHENMART_DELACRUZ.exe...", delay: 1.3 },
  { text: "PORTFOLIO READY.", delay: 1.6, highlight: true },
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { isMobile, isSafari, enable3DTilt } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => { setDone(true); setTimeout(onComplete, 600); }, 400);
          return 100;
        }
        const inc = p < 50 ? 1.2 : p < 80 ? 0.6 : p < 95 ? 0.25 : 0.12;
        return Math.min(p + inc, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), (BOOT_LINES[i].delay * 1000));
    });
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden font-mono"
        >
          {/* Scanlines */}
          {!reduceEffects && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)", backgroundSize: "100% 3px" }} />
          )}

          {/* Ambient glow */}
          {!reduceEffects && (
            <motion.div animate={{ opacity: [0.06, 0.14, 0.06] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ boxShadow: "0 0 200px 100px rgba(255,0,0,0.1)", background: "transparent" }} />
          )}

          {/* Floating particles */}
          {!isMobile && !isSafari && Array.from({ length: 6 }, (_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -20, 0], opacity: [0, 0.3, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
              className="absolute w-px h-px bg-[#FF0000] rounded-full pointer-events-none"
              style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 20}%` }}
            />
          ))}

          {/* Main HUD panel */}
          <div className="relative w-[300px] sm:w-[420px] mx-4">
            {/* Outer frame */}
            <div className="border border-[#FF0000]/20 rounded bg-black/60 p-6 relative overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#FF0000]/60" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#FF0000]/60" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#FF0000]/60" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#FF0000]/60" />

              {/* Top bar */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#FF0000]/10">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#FF0000]" />
                  <span className="text-[#FF0000] text-[9px] font-bold uppercase tracking-[0.2em]">PORTFOLIO_OS</span>
                </div>
                <span className="text-white/20 text-[9px] uppercase tracking-widest">v2.0</span>
              </div>

              {/* Logo / identity */}
              <div className="flex flex-col items-center gap-3 mb-6">
                {/* Rotating ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: "conic-gradient(from 0deg, #FF0000 0%, transparent 40%, #FF0000 70%, transparent 100%)",
                      WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                      mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                      opacity: 0.7,
                    }}
                  />
                  {!reduceEffects && (
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute w-12 h-12 rounded-full pointer-events-none"
                      style={{
                        background: "conic-gradient(from 0deg, #FF4444, transparent 50%)",
                        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                        mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))",
                        opacity: 0.4,
                      }}
                    />
                  )}
                  <div className="relative z-10 text-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
                      className="text-[#FF0000] text-[9px] uppercase tracking-widest block"
                    >
                      LOADING
                    </motion.span>
                  </div>
                </div>

                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white text-xs font-bold uppercase tracking-[0.25em]"
                  >
                    RHENMART DELA CRUZ
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/25 text-[9px] uppercase tracking-widest mt-0.5"
                  >
                    UX/UI_DESIGNER // PRODUCT_DESIGNER
                  </motion.p>
                </div>
              </div>

              {/* Boot log */}
              <div className="bg-black/40 border border-white/[0.05] rounded p-3 mb-4 min-h-[80px]">
                <div className="text-[#FF0000]/30 text-[8px] uppercase tracking-widest mb-2">// BOOT_LOG</div>
                {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-2 text-[9px] leading-relaxed ${line.highlight ? "text-green-400" : "text-white/35"}`}
                  >
                    <span className={line.highlight ? "text-green-400" : "text-[#FF0000]/40"}>▸</span>
                    {line.text}
                    {i === visibleLines - 1 && !line.highlight && (
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
                        className="text-[#FF0000] text-[10px]">█</motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/20 text-[8px] uppercase tracking-widest">LOADING_ASSETS</span>
                  <span className="text-[#FF0000] text-[9px] font-bold">
                    <Counter value={Math.round(progress)} />%
                  </span>
                </div>
                <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, #FF0000, #FF4444)" }}
                  />
                  {/* Shimmer on bar */}
                  {!reduceEffects && (
                    <motion.div
                      animate={{ x: ["-100%", "400%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  )}
                </div>
                {/* Segment ticks */}
                <div className="flex justify-between">
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <span key={tick} className={`text-[7px] font-mono ${progress >= tick ? "text-[#FF0000]/50" : "text-white/10"}`}>{tick}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-6 text-white/10 text-[8px] tracking-[0.4em] uppercase font-mono"
          >
            CRAFTING_DIGITAL_EXPERIENCES
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
