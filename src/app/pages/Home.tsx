import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ParticleField } from "../components/ParticleField";
import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { ChevronUp } from "lucide-react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const isLowEnd = typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
const reduceEffects = isMobile || isLowEnd;

// ── Lightweight canvas background ──────────────────────────────────────────
const LiveBackground = memo(function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduceEffects) return; // skip entirely on mobile/low-end

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const nodeCount = 30;
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.2,
    }));

    let frame: number;
    let lastTime = 0;
    const interval = 1000 / 30; // 30fps cap

    const draw = (ts: number) => {
      frame = requestAnimationFrame(draw);
      if (ts - lastTime < interval) return;
      lastTime = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = dx * dx + dy * dy;
          if (d < 14400) { // 120px
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,0,0,${(1 - Math.sqrt(d) / 120) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,40,40,0.3)";
        ctx.fill();
      }
    };

    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  if (reduceEffects) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" style={{ zIndex: -1, contain: "strict" }} />;
});

// ── Scroll progress bar ─────────────────────────────────────────────────────
const ScrollProgressBar = memo(function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF0000] to-[#FF4444] z-[100]"
    />
  );
});

// ── Section reveal ──────────────────────────────────────────────────────────
const RevealSection = memo(function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduceEffects ? 0 : 50 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
});

// ── Scroll orbs — desktop only, simplified ─────────────────────────────────
const ScrollOrbs = memo(function ScrollOrbs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 4000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 4000], [0, -150]);

  if (reduceEffects) return null;

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, willChange: "transform" }}
        className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-[#FF0000] rounded-full blur-[180px] opacity-[0.08]"
      />
      <motion.div
        style={{ y: y2, willChange: "transform" }}
        className="absolute -bottom-48 -right-48 w-[450px] h-[450px] bg-[#FF0000] rounded-full blur-[160px] opacity-[0.05]"
      />
    </div>
  );
});

// ── Cursor glow — desktop only ──────────────────────────────────────────────
const CursorGlow = memo(function CursorGlow() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 300, damping: 40 });
  const sy = useSpring(y, { stiffness: 300, damping: 40 });

  useEffect(() => {
    if (reduceEffects) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (reduceEffects) return null;

  return (
    <motion.div
      className="fixed z-[-1] w-48 h-48 rounded-full pointer-events-none"
      style={{
        left: sx, top: sy,
        x: "-50%", y: "-50%",
        background: "radial-gradient(circle, rgba(255,0,0,0.07) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
});

// ── Animated section divider ───────────────────────────────────────────────
function Divider() {
  return (
    <div className="h-px relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0000]/25 to-transparent" />
      {!isMobile && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-[#FF0000]/50 to-transparent"
        />
      )}
    </div>
  );
}

// ── Home ────────────────────────────────────────────────────────────────────
export function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="bg-[#030303] min-h-screen text-white font-sans selection:bg-[#FF0000] selection:text-white overflow-x-hidden relative"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Backgrounds */}
      <LiveBackground />
      {!reduceEffects && <ParticleField density={30} color="255,0,0" />}
      <ScrollOrbs />
      <CursorGlow />

      {/* Static grid — no animation */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,3,0.9) 100%)" }}
      />

      <ScrollProgressBar />
      <Navbar />

      <main>
        <Hero />
        <Divider />
        <RevealSection><Services /></RevealSection>
        <Divider />
        <RevealSection><About /></RevealSection>
        <Divider />
        <RevealSection><Skills /></RevealSection>
        <Divider />
        <RevealSection><Portfolio /></RevealSection>
        <Divider />
        <RevealSection><Contact /></RevealSection>
      </main>

      <Footer />

      {/* Back to top */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.15, rotate: isMobile ? 0 : 360, boxShadow: "0 0 28px rgba(255,0,0,0.6)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#FF0000]/15 border border-[#FF0000]/40 text-white rounded-full hover:bg-[#FF0000] transition-colors duration-300 group overflow-hidden"
            aria-label="Scroll to top"
          >
            <ChevronUp size={22} className="group-hover:animate-bounce" />
            {/* Animated gradient border — desktop only */}
            {!reduceEffects && (
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <motion.div
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full p-[1.5px]"
                  style={{
                    background: "linear-gradient(90deg, #FF0000, #FF4444, #FF8888, #FF4444, #FF0000)",
                    backgroundSize: "200% 100%",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude"
                  }}
                />
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
