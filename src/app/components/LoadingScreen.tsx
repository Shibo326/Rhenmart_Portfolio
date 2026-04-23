import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, useRef } from "react";

const LINES = [
  "> Initializing design system...",
  "> Loading portfolio assets...",
  "> Establishing connection...",
  "> Rendering components...",
  "> Designer is ready",
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [shown, setShown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [done, setDone] = useState(false);
  const initialized = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    // Clear any pending timers
    timers.current.forEach(clearTimeout);
    setHide(true);
    setTimeout(() => {
      setDone(true);
      onComplete();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const lineTimer = setInterval(() => setShown((s) => Math.min(s + 1, LINES.length)), 200);
    const progTimer = setInterval(() => setProgress((p) => Math.min(p + 10, 100)), 60);

    // Max wait: 1s hide + 400ms fade = 1.4s total (down from 1.9s)
    const hideTimer = setTimeout(() => setHide(true), 1000);
    const finishTimer = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 1400);

    timers.current = [hideTimer, finishTimer];

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      timers.current.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: hide ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={finish}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center"
          style={{ pointerEvents: hide ? "none" : "all", cursor: "pointer" }}
          title="Click to skip"
        >
          {/* Grid bg */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines opacity-40" />

          {/* HUD Panel */}
          <div className="relative w-full max-w-xl mx-6 p-8 border border-[rgba(255,0,0,0.20)] bg-[#050505]">
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0000]" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0000]" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF0000]" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF0000]" />

            {/* Top bar */}
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest mb-6">
              <span className="text-[#FF0000]">PORTFOLIO_OS v2.0</span>
              <span className="text-[rgba(255,255,255,0.55)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse-red" />
                BOOTING
              </span>
            </div>

            {/* Identity row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="absolute inset-0 border-2 border-[rgba(255,0,0,0.20)] rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[#FF0000] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-[#FF0000]">
                  LOAD
                </div>
              </div>
              <div>
                <div className="font-black text-lg tracking-tight text-white">RHENMART DELA CRUZ</div>
                <div className="font-mono text-[10px] text-[rgba(255,255,255,0.55)] tracking-widest">
                  UX/UI_DESIGNER // PRODUCT_DESIGNER
                </div>
              </div>
            </div>

            {/* Boot log */}
            <div className="space-y-1 font-mono text-xs mb-6 min-h-[110px]">
              {LINES.slice(0, shown).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={i === LINES.length - 1 ? "text-green-400" : "text-[rgba(255,255,255,0.55)]"}
                >
                  <span className={i === LINES.length - 1 ? "text-green-400" : "text-[#FF0000]"}>{l.slice(0, 1)}</span>
                  {l.slice(1)}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-[#080808] border border-[rgba(255,255,255,0.08)] mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#CC0000] via-[#FF0000] to-[#FF4444] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-[rgba(255,255,255,0.30)] mb-4">
              {[0, 25, 50, 75, 100].map((t) => (
                <span key={t}>{t}%</span>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="text-center font-mono text-[10px] text-[#FF0000] tracking-[0.3em] uppercase">
                CRAFTING_DIGITAL_EXPERIENCES
              </div>
              <span className="font-mono text-[9px] text-[rgba(255,255,255,0.25)] tracking-widest animate-blink">
                [ CLICK TO SKIP ]
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
