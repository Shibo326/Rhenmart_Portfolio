import { motion } from "motion/react";
import { Linkedin, ArrowRight, Instagram, Facebook } from "lucide-react";
import profileImg from "../../Image/Rhenmart_Profile.jpeg";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen w-full flex items-center relative overflow-hidden bg-[#050505]"
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-[10%] w-[500px] h-[500px] bg-[#FF0000]/20 rounded-full blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 -right-[10%] w-[500px] h-[500px] bg-red-900/15 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full py-28 md:py-0 md:min-h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full items-center">

          {/* Left Content */}
          <div className="flex flex-col gap-6 order-2 md:order-1">

            {/* Badge */}
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 w-fit">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-[#FF0000] rounded-full"
              />
              <span className="text-white/50 text-sm tracking-widest uppercase font-medium">Available for work</span>
            </motion.div>

            <div className="space-y-2">
              <motion.p {...fadeUp(0.2)} className="text-[#FF0000] text-lg font-medium tracking-wide">
                Hi I am,
              </motion.p>

              {/* Animated name letters */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight"
              >
                {"Rhenmart".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, ease: "easeOut" }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40"
                  >
                    {char}
                  </motion.span>
                ))}
                <br />
                {"Dela Cruz".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.04, ease: "easeOut" }}
                    className="inline-block text-white/30"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.h2 {...fadeUp(1.1)} className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#FF0000] tracking-tight">
                UI/UX Designer
              </motion.h2>
            </div>

            {/* Social Icons */}
            <motion.div {...fadeUp(1.2)} className="flex gap-3 items-center">
              {[
                { href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", icon: <Linkedin size={18} />, color: "#0077B5", shadow: "rgba(0,119,181,0.5)" },
                { href: "https://www.instagram.com/_rhenmart_/", icon: <Instagram size={18} />, color: "#E1306C", shadow: "rgba(225,48,108,0.5)" },
                { href: "https://www.facebook.com/rhenmart1234", icon: <Facebook size={18} />, color: "#1877F2", shadow: "rgba(24,119,242,0.5)" },
              ].map(({ href, icon, color, shadow }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white transition-all duration-300"
                  style={{
                    ["--hover-bg" as string]: color,
                    ["--hover-shadow" as string]: shadow,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${shadow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                    (e.currentTarget as HTMLElement).style.borderColor = "";
                  }}
                >
                  {icon}
                </motion.a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div {...fadeUp(1.4)} className="flex flex-wrap gap-4">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all duration-300 text-sm sm:text-base"
              >
                Hire Me
              </motion.a>
              <motion.a
                href="#download"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:border-[#FF0000] hover:text-[#FF0000] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base group"
              >
                Download CV
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </motion.a>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
              style={{ originX: 0 }}
              className="w-full h-px bg-white/10"
            />

            {/* Stats */}
            <motion.div {...fadeUp(1.7)} className="flex flex-wrap gap-8 sm:gap-12">
              {[
                { value: "4+", label: "Years BSIT" },
                { value: "10+", label: "Projects" },
                { value: "3x", label: "Competition Winner" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col gap-1 cursor-default"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-[#FF0000]">{value}</span>
                  <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="order-1 md:order-2 flex justify-center md:justify-end relative group"
          >
            {/* Rotating border ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-[3rem] pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg, #FF0000, transparent 40%, #FF0000 70%, transparent)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                opacity: 0.4,
              }}
            />

            <div className="absolute inset-0 rounded-[3rem] bg-[#FF0000]/10 blur-2xl group-hover:bg-[#FF0000]/20 transition-all duration-700 -z-10 scale-90" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(255,0,0,0.1)] group-hover:shadow-[0_0_70px_rgba(255,0,0,0.25)] transition-shadow duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent z-10 pointer-events-none" />
              <motion.img
                src={profileImg}
                alt="Rhenmart Portrait"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover object-top filter contrast-110"
              />
            </motion.div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-6 -left-4 md:-left-8 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm"
            >
              <p className="text-xs text-white/50 font-medium">Available</p>
              <p className="text-sm text-white font-bold">For Freelance</p>
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll Down</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-[#FF0000] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
