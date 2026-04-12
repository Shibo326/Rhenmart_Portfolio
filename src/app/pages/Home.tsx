import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { AmbientLayer } from "../components/AmbientLayer";
import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { ChevronUp } from "lucide-react";
import { useAnimationConfig } from "../context/AnimationContext";

// ── Scroll progress bar — smoother spring ──────────────────────────────────
const ScrollProgressBar = memo(function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF0000] via-[#FF4444] to-[#FF0000] z-[100]"
    />
  );
});

// ── Section reveal — personality per section ───────────────────────────────
function makeSectionVariants(reduce: boolean) {
  return {
    services: {
      initial: { opacity: 0, y: reduce ? 0 : 60 },
      animate: { opacity: 1, y: 0 },
    },
    about: {
      initial: { opacity: 0, x: reduce ? 0 : -40 },
      animate: { opacity: 1, x: 0 },
    },
    skills: {
      initial: { opacity: 0, scale: reduce ? 1 : 0.96 },
      animate: { opacity: 1, scale: 1 },
    },
    portfolio: {
      initial: { opacity: 0, y: reduce ? 0 : 50, rotateX: reduce ? 0 : 4 },
      animate: { opacity: 1, y: 0, rotateX: 0 },
    },
    contact: {
      initial: { opacity: 0, y: reduce ? 0 : 40 },
      animate: { opacity: 1, y: 0 },
    },
  };
}

const RevealSection = memo(function RevealSection({ children, section }: { children: React.ReactNode; section?: string }) {
  const { isMobile, isSafari } = useAnimationConfig();
  const sectionVariants = makeSectionVariants(isMobile || isSafari);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const variant = section ? sectionVariants[section] : sectionVariants.services;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.04, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={visible ? variant.animate : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={section === 'portfolio' ? { perspective: "1200px" } : {}}
    >
      {children}
    </motion.div>
  );
});

// ── Scroll orbs — desktop non-Safari only ──────────────────────────────────
const ScrollOrbs = memo(function ScrollOrbs() {
  const { isMobile, isSafari } = useAnimationConfig();
  const reduceEffects = isMobile || isSafari;
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 4000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 4000], [0, -150]);

  if (reduceEffects) return null;

  // box-shadow replaces filter:blur — much cheaper on Safari/macOS
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, willChange: "transform", boxShadow: "0 0 200px 100px rgba(255,0,0,0.08)", background: "transparent" }}
        className="absolute -top-48 -left-48 w-[300px] h-[300px] rounded-full"
      />
      <motion.div
        style={{ y: y2, willChange: "transform", boxShadow: "0 0 180px 90px rgba(255,0,0,0.05)", background: "transparent" }}
        className="absolute -bottom-48 -right-48 w-[300px] h-[300px] rounded-full"
      />
    </div>
  );
});

// ── Cursor glow — desktop only ──────────────────────────────────────────────
const CursorGlow = memo(function CursorGlow() {
  const { enableCursorGlow } = useAnimationConfig();
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const glowOpacity = useMotionValue(0.12);
  const animOpacity = useSpring(glowOpacity, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (!enableCursorGlow) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });

    // Intensify on interactive elements
    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, a, [data-interactive]')) {
        glowOpacity.set(0.2);
      }
    };
    const onLeave = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, a, [data-interactive]')) {
        glowOpacity.set(0.12);
      }
    };
    document.addEventListener("pointerover", onEnter, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
    };
  }, [x, y, glowOpacity, enableCursorGlow]);

  if (!enableCursorGlow) return null;

  return (
    <motion.div
      className="fixed z-[-1] w-32 h-32 rounded-full pointer-events-none"
      style={{
        left: sx, top: sy,
        x: "-50%", y: "-50%",
        opacity: animOpacity,
        background: "radial-gradient(circle, rgba(255,0,0,0.25) 0%, rgba(255,0,0,0.08) 40%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
});

// ── Animated section divider ───────────────────────────────────────────────
function Divider() {
  const { isMobile } = useAnimationConfig();
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
  const { isMobile, isSafari } = useAnimationConfig();
  const reduceEffects = isMobile || isSafari;
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
      <AmbientLayer className="fixed inset-0 z-[-1] pointer-events-none" />
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
        <RevealSection section="services"><Services /></RevealSection>
        <Divider />
        <RevealSection section="about"><About /></RevealSection>
        <Divider />
        <RevealSection section="skills"><Skills /></RevealSection>
        <Divider />
        <RevealSection section="portfolio"><Portfolio /></RevealSection>
        <Divider />
        <RevealSection section="contact"><Contact /></RevealSection>
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
            className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 p-3.5 bg-[#FF0000]/15 border border-[#FF0000]/40 text-white rounded-full hover:bg-[#FF0000] transition-colors duration-300 group overflow-hidden"
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
