import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp } from "lucide-react";

export function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Smooth scroll behavior for anchor links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#FF0000] selection:text-white overflow-x-hidden relative" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Background Decor: Fine grid + subtle radial gradient */}
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none opacity-20 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
        }}
      />
      
      <div className="fixed inset-0 z-[-2] bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.02)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />

      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <About />
        <Skills />
        <Portfolio />
        <Contact />
      </main>

      <Footer />

      {/* Back to top FAB */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            whileHover={{ scale: 1.1, backgroundColor: "#FF0000" }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-colors hover:border-[#FF0000]"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
