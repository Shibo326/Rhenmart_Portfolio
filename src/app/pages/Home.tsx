import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { ParticleField, FloatingOrbs } from "../components/ParticleField";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { ChevronUp, Sparkles } from "lucide-react";

// ── Lightweight canvas — fewer nodes, throttled ─────────────────────────────
function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 25 : 50;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame: number;
    let time = 0;
    
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Enhanced connections with gradient
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          
          if (d < 150) {
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            const alpha = (1 - d / 150) * 0.1;
            gradient.addColorStop(0, `rgba(255,0,0,${alpha})`);
            gradient.addColorStop(0.5, `rgba(255,40,40,${alpha * 1.5})`);
            gradient.addColorStop(1, `rgba(255,0,0,${alpha})`);
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Enhanced particles with pulse
      nodes.forEach((n) => {
        const pulseSize = n.r + Math.sin(n.pulse) * 0.5;
        const pulseAlpha = 0.2 + Math.sin(n.pulse) * 0.15;
        
        // Glow
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseSize * 4);
        gradient.addColorStop(0, `rgba(255,40,40,${pulseAlpha})`);
        gradient.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,40,40,${pulseAlpha + 0.2})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none opacity-40" style={{ willChange: "transform", contain: "strict" }} />;
}

// ── Scroll progress bar — enhanced with glow ───────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <>
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000] z-[100]"
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: ["0 0 10px rgba(255,0,0,0.5)", "0 0 25px rgba(255,0,0,0.9)", "0 0 10px rgba(255,0,0,0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        />
      </motion.div>
      
      {/* Moving indicator dot */}
      <motion.div
        style={{ left: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        className="fixed top-0 z-[101] -translate-x-1/2"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: 360 }}
          transition={{ scale: { duration: 1.5, repeat: Infinity }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
          className="w-3 h-3 bg-white rounded-full"
          style={{ boxShadow: "0 0 20px rgba(255,0,0,1), 0 0 10px rgba(255,255,255,0.8)" }}
        />
      </motion.div>
    </>
  );
}

// ── Section reveal — enhanced with scale and blur ──────────────────────────
function RevealSection({ children, direction = "up" }: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05, rootMargin: "0px 0px -100px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 80 : 0,
        x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
        scale: 0.95,
        filter: "blur(10px)",
      }}
      animate={visible ? { 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1,
        filter: "blur(0px)",
      } : {}}
      transition={{ 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1],
        filter: { duration: 0.6 }
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Scroll-parallax orbs — enhanced with more movement ─────────────────────
function ScrollOrbs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, -400]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 5000], [0, 150]);
  const rotate1 = useTransform(scrollY, [0, 5000], [0, 360]);
  const rotate2 = useTransform(scrollY, [0, 5000], [0, -360]);

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, rotate: rotate1, willChange: "transform" }}
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-[#FF0000] rounded-full blur-[200px]"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2, willChange: "transform" }}
        animate={{ 
          opacity: [0.05, 0.12, 0.05],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-[#FF0000] rounded-full blur-[180px]"
      />
      <motion.div
        style={{ y: y3, willChange: "transform" }}
        animate={{ 
          opacity: [0.03, 0.08, 0.03],
          x: [-100, 100, -100]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4444] rounded-full blur-[160px]"
      />
    </div>
  );
}

// ── Cursor glow — enhanced with trail effect ───────────────────────────────
function CursorGlow() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 350, damping: 35, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 350, damping: 35, mass: 0.2 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      {/* Main glow */}
      <motion.div
        className="fixed z-[-1] w-64 h-64 rounded-full pointer-events-none"
        style={{
          left: sx, top: sy,
          x: "-50%", y: "-50%",
          background: "radial-gradient(circle, rgba(255,0,0,0.08) 0%, rgba(255,40,40,0.03) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
      
      {/* Secondary trail */}
      <motion.div
        className="fixed z-[-1] w-48 h-48 rounded-full pointer-events-none"
        style={{
          left: useSpring(x, { stiffness: 200, damping: 40 }),
          top: useSpring(y, { stiffness: 200, damping: 40 }),
          x: "-50%", y: "-50%",
          background: "radial-gradient(circle, rgba(255,0,0,0.05) 0%, transparent 60%)",
          willChange: "transform",
        }}
      />
    </>
  );
}

// ── Animated section divider — enhanced ────────────────────────────────────
function Divider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="h-px overflow-hidden relative">
      <motion.div
        style={{ scaleX, opacity, originX: 0.5 }}
        className="h-full bg-gradient-to-r from-transparent via-[#FF0000]/40 to-transparent relative"
      >
        {/* Animated glow */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#FF0000]/60 to-transparent"
        />
      </motion.div>
      
      {/* Floating particles on divider */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: ["0%", "100%"],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: "easeInOut"
          }}
          className="absolute top-0 w-1 h-1 bg-[#FF0000] rounded-full"
          style={{ left: `${i * 30}%` }}
        />
      ))}
    </div>
  );
}

// ── Home ────────────────────────────────────────────────────────────────────
export function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const onScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className="bg-[#030303] min-h-screen text-white font-sans selection:bg-[#FF0000] selection:text-white overflow-x-hidden relative"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* Backgrounds */}
      <LiveBackground />
      <ParticleField density={40} color="255,0,0" />
      <FloatingOrbs />
      <ScrollOrbs />
      <CursorGlow />

      {/* Enhanced animated grid */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
        }}
      />
      
      {/* Animated grid overlay */}
      <motion.div
        animate={{ 
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed inset-0 z-[-1] pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,3,0.95) 100%)" }}
      />

      <ScrollProgressBar />
      <Navbar />

      <main>
        <Hero />
        <Divider />
        <RevealSection direction="up"><Services /></RevealSection>
        <Divider />
        <RevealSection direction="left"><About /></RevealSection>
        <Divider />
        <RevealSection direction="up"><Skills /></RevealSection>
        <Divider />
        <RevealSection direction="right"><Portfolio /></RevealSection>
        <Divider />
        <RevealSection direction="up"><Contact /></RevealSection>
      </main>

      <Footer />

      {/* Back to top — enhanced */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ 
              scale: 1.15, 
              rotate: 360,
              boxShadow: "0 0 30px rgba(255,0,0,0.6)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#FF0000]/15 backdrop-blur-xl border border-[#FF0000]/40 text-white rounded-full hover:bg-[#FF0000] hover:border-[#FF0000] transition-colors duration-300 group"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} className="group-hover:animate-bounce" />
            
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-full pointer-events-none">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full p-[2px]"
                style={{
                  background: "linear-gradient(90deg, #FF0000, #FF4444, #FF8888, #FF4444, #FF0000)",
                  backgroundSize: "200% 100%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude"
                }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Floating action hint */}
      <AnimatePresence>
        {!showTopBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 2 }}
            className="fixed bottom-6 right-6 z-40 pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/40 text-xs"
            >
              <Sparkles size={12} className="text-[#FF0000]" />
              Scroll to explore
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
