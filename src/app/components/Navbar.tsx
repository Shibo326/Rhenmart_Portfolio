import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { detectDeviceCapability } from "../utils/performance";

const { isMobile, isSafari } = detectDeviceCapability();
const reduceEffects = isMobile || isSafari;

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About Me", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact me", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Handle home link
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    // Handle other section links
    const target = document.querySelector(href);
    if (target) {
      const offset = 80; // Account for fixed navbar
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[#050505]/90 border-b border-white/8"
          : "bg-transparent border-b border-transparent"
      }`}
      // No backdrop-blur on mobile/Safari — too expensive
      style={scrolled && !reduceEffects ? { backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="relative group">
          <motion.span
            animate={reduceEffects ? {} : { textShadow: ["0 0 0px #FF0000", "0 0 12px #FF0000", "0 0 0px #FF0000"] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-xl sm:text-2xl font-black tracking-tighter text-[#FF0000]"
          >
            RHEN.
          </motion.span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            style={{ originX: 0 }}
            className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#FF0000] rounded-full"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              onClick={(e) => {
                handleNavClick(e, link.href);
                setActive(link.name);
              }}
              className="relative text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
            >
              {link.name}
              <motion.span
                animate={{ scaleX: active === link.name ? 1 : 0 }}
                style={{ originX: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#FF0000] rounded-full"
              />
            </motion.a>
          ))}
        </div>

        {/* Desktop CTA */}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleNavClick(e, "#contact")}
          className="hidden md:block px-5 py-2 bg-[#FF0000] text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors duration-200"
        >
          Hire Me
        </motion.a>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
              : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu — no backdrop-blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#050505]/98 border-b border-white/8"
          >
            <div className="flex flex-col items-center py-5 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="w-full text-center py-3 text-base font-medium text-white/60 hover:text-[#FF0000] transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => handleNavClick(e, "#contact")}
                className="mt-2 px-8 py-3 bg-[#FF0000] text-white font-bold rounded-full w-4/5 text-center hover:bg-red-700 transition-colors"
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
