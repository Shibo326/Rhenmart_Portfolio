import { motion, useInView } from "motion/react";
import { Linkedin, Mail, Phone, Instagram, Facebook, Heart, Github } from "lucide-react";
import { useRef } from "react";

const navLinks = ["Home", "Services", "About", "Portfolio", "Contact"];
const socials = [
  { href: "https://github.com/Shibo326", icon: Github, color: "#6e40c9", shadow: "rgba(110,64,201,0.5)" },
  { href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", icon: Linkedin, color: "#0077B5", shadow: "rgba(0,119,181,0.5)" },
  { href: "https://www.instagram.com/_rhenmart_/", icon: Instagram, color: "#E1306C", shadow: "rgba(225,48,108,0.5)" },
  { href: "https://www.facebook.com/rhenmart1234", icon: Facebook, color: "#1877F2", shadow: "rgba(24,119,242,0.5)" },
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });
  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="py-12 bg-[#030303] border-t border-white/5 relative overflow-hidden">
      {/* Animated top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0.5 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF0000]/60 to-transparent"
      />

      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#FF0000] rounded-full blur-[100px] pointer-events-none"
      />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -15, 0], opacity: [0, 0.2, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${15 + i * 18}%`, bottom: `${20 + (i % 3) * 20}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center gap-7">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            animate={{ textShadow: ["0 0 0px #FF0000", "0 0 20px #FF0000", "0 0 0px #FF0000"] }}
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
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, color: "#FF0000" }}
              whileTap={{ scale: 0.95 }}
              className="text-white/40 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 relative group"
            >
              {name}
              <motion.span
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ originX: 0 }}
                className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#FF0000] rounded-full"
              />
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
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.2, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white transition-all duration-300"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = color;
                el.style.boxShadow = `0 0 20px ${shadow}`;
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
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {[
            { href: "mailto:Rhenmart978@gmail.com", icon: Mail, label: "Rhenmart978@gmail.com" },
            { href: "tel:+639672212791", icon: Phone, label: "0967 221 2791" },
          ].map(({ href, icon: Icon, label }, i) => (
            <motion.a
              key={i}
              href={href}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group"
            >
              <motion.span
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="p-2 bg-white/5 rounded-full group-hover:bg-[#FF0000]/20 transition-colors"
              >
                <Icon size={13} className="text-[#FF0000]" />
              </motion.span>
              {label}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-1.5 text-white/15 text-xs"
        >
          <span>&copy; {year} Rhenmart Dela Cruz.</span>
          <span>Made with</span>
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Heart size={11} className="text-[#FF0000] fill-[#FF0000]" />
          </motion.span>
          <span>All rights reserved.</span>
        </motion.div>
      </div>
    </footer>
  );
}
