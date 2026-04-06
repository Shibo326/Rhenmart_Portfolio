import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 800);
          }, 300);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#FF0000]/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Outer rotating ring */}
          <div className="relative flex items-center justify-center w-48 h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                background: "conic-gradient(from 0deg, #FF0000, transparent, #FF0000)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
              }}
            />

            {/* Inner counter-rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full"
              style={{
                background: "conic-gradient(from 180deg, transparent, #FF0000 40%, transparent)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
              }}
            />

            {/* Center logo */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-black text-white tracking-tighter leading-none"
              >
                UI/UX
              </motion.span>
              <div className="w-8 h-[2px] bg-[#FF0000] rounded-full my-1" />
              <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-medium">Design</span>
            </motion.div>
          </div>

          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-white/60 text-sm tracking-[0.3em] uppercase font-medium"
          >
            Rhenmart Dela Cruz
          </motion.p>

          {/* Progress bar */}
          <div className="mt-6 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#FF0000] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-white/30 text-xs font-mono">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
