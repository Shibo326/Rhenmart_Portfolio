import { motion, useInView } from "motion/react";
import { Mail, Phone, Heart } from "lucide-react";
import { Linkedin, Github, Instagram, Facebook } from "lucide-react";
import { useRef } from "react";
import { detectDeviceCapability } from "../utils/performance";

const { isMobile, isSafari } = detectDeviceCapability();
const reduceEffects = isMobile || isSafari;

const navLinks = ["Home", "Services", "About", "Portfolio", "Contact"];
const socials = [
  { href: "https://github.com/Shibo326", icon: Github, color: "#6e40c9", shadow: "rgba(110,64,201,0.5)" },
  { href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", icon: Linkedin, color: "#0077B5", shadow: "rgba(0,119,181,0.5)" },
  { href: "https://www.instagram.com/_rhenmart_/", icon: Instagram, color: "#E1306C", shadow: "rgba(225,48,108,0.5)" },
  { href: "https://www.facebook.com/rhenmart1234", icon: Facebook, color: "#1877F2", shadow: "rgba(24,119,242,0.5)" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="py-12 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      {/* Top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8 }}
        style={{ originX: 0.5 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF0000]/40 to-transparent"
      />

      {/* Ambient glow — desktop non-Safari only, box-shadow */}
      {!reduceEffects && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[120px] rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 120px 60px rgba(255,0,0,0.04)", background: "transparent" }}
        />
      )}

      {/* Floating particles — desktop non-Safari only */}
      {!reduceEffects && [0, 1, 2, 3, 4].map((i) => (
        <motion.div key={i}
          animate={{ y: [0, -14, 0], opacity: [0, 0.2, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${15 + i * 18}%`, bottom: `${20 + (i % 3) * 20}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center gap-6">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={reduceEffects ? {} : { textShadow: ["0 0 0px #FF0000", "0 0 18px #FF0000", "0 0 0px #FF0000"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-3xl font-black tracking-tighter text-[#FF0000]"
          >
            RHEN.
          </motion.span>
        </motion.div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {navLinks.map((name, i) => (
            <motion.a
              key={name}
              href={`#${name.toLowerCase()}`}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="text-white/40 text-xs font-semibold uppercase tracking-widest hover:text-[#FF0000] transition-colors duration-200"
            >
              {name}
            </motion.a>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex gap-3">
          {socials.map(({ href, icon: Icon, color, shadow }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              whileHover={reduceEffects ? {} : { scale: 1.15, rotate: 6 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white transition-colors duration-200"
              onMouseEnter={e => {
                if (reduceEffects) return;
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = color;
                el.style.boxShadow = `0 0 16px ${shadow}`;
                el.style.borderColor = color;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "";
                el.style.boxShadow = "";
                el.style.borderColor = "";
              }}
            >
              <Icon size={17} />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {[
            { href: "mailto:Rhenmart978@gmail.com", icon: Mail, label: "Rhenmart978@gmail.com" },
            { href: "tel:+639672212791", icon: Phone, label: "0967 221 2791" },
          ].map(({ href, icon: Icon, label }, i) => (
            <motion.a
              key={i}
              href={href}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
            >
              <span className="p-1.5 bg-white/5 rounded-full">
                <Icon size={13} className="text-[#FF0000]" />
              </span>
              {label}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-1.5 text-white/15 text-xs"
        >
          <span>&copy; {year} Rhenmart Dela Cruz. Made with</span>
          <Heart size={10} className="text-[#FF0000] fill-[#FF0000]" />
          <span>All rights reserved.</span>
        </motion.div>
      </div>
    </footer>
  );
}
