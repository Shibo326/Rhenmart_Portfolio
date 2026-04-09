import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Smartphone, Monitor, Search, Handshake, Sparkles, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { StellarBackground } from "./StellarBackground";

const services = [
  {
    title: "UI Design",
    description: "Crafting visually compelling interfaces with strong layout systems, design tokens, and micro-animation details.",
    icon: Monitor,
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#FF4444]",
    number: "01",
  },
  {
    title: "UX Research",
    description: "Conducting user interviews, usability testing, and data-driven research to validate design decisions.",
    icon: Search,
    color: "#FF2222",
    gradient: "from-[#FF2222] to-[#FF6666]",
    number: "02",
  },
  {
    title: "Prototyping",
    description: "Building interactive prototypes in Figma and Framer — from low-fidelity wireframes to high-fidelity flows.",
    icon: Smartphone,
    color: "#FF4444",
    gradient: "from-[#FF4444] to-[#FF8888]",
    number: "03",
  },
  {
    title: "Design to Dev Collaboration",
    description: "Seamless handoffs and strong communication with developers to bring designs to life with precision.",
    icon: Handshake,
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#FF4444]",
    number: "04",
    span: true,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-6, 6]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mouseX, [-100, 100], [0, 100]);
  const glowY = useTransform(mouseY, [-100, 100], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hovered) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.92, rotateX: -12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: hovered ? 'transform' : 'auto' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0d0d0d] to-[#080808] border border-white/10 overflow-hidden group cursor-default ${
        service.span ? "md:col-span-8 md:col-start-3" : "md:col-span-4"
      }`}
    >
      {/* Animated gradient background */}
      <motion.div
        animate={{ 
          opacity: hovered ? 0.15 : 0.05,
          scale: hovered ? 1.1 : 1
        }}
        transition={{ duration: 0.4 }}
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-3xl pointer-events-none`}
      />

      {/* Dynamic spotlight follow cursor */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,0,0,0.2) 0%, transparent 50%)`
          ),
        }}
      />

      {/* Enhanced border glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 0 2px ${service.color}40, 0 0 40px ${service.color}30`,
        }}
      />

      {/* Animated gradient border */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-3xl p-[2px]"
          style={{
            background: `linear-gradient(90deg, ${service.color}, ${service.color}88, ${service.color}44, ${service.color}88, ${service.color})`,
            backgroundSize: "200% 100%",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />
      </motion.div>

      {/* Shimmer sweep */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: hovered ? "200%" : "-100%", opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
      />

      {/* Number watermark with gradient */}
      <motion.span
        animate={{ 
          opacity: hovered ? 0.1 : 0.04,
          scale: hovered ? 1.05 : 1
        }}
        className={`absolute top-6 right-8 text-8xl font-black bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent select-none pointer-events-none`}
      >
        {service.number}
      </motion.span>

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        {/* Icon with enhanced multi-layer animation */}
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.8, 1], 
              opacity: [0.3, 0, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${service.color}40 0%, transparent 70%)` }}
          />
          {/* Middle pulse ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.4, 0, 0.4],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 + 0.3 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${service.color}30 0%, transparent 70%)` }}
          />
          {/* Inner pulse ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.6 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${service.color}20 0%, transparent 70%)` }}
          />

          <motion.div
            whileHover={{ 
              rotate: [0, -15, 15, -10, 10, 0], 
              scale: 1.25,
            }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
            className={`relative p-5 bg-gradient-to-br ${service.gradient} rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-lg`}
            style={{ 
              transform: "translateZ(30px)",
              boxShadow: `0 10px 40px ${service.color}40`
            }}
          >
            <Icon size={36} className="text-white drop-shadow-lg" />
            
            {/* Icon glow */}
            <motion.div
              animate={{ opacity: hovered ? 0.6 : 0 }}
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ backgroundColor: service.color }}
            />
          </motion.div>

          {/* Sparkle effects */}
          {hovered && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 1, 0], rotate: 180 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles size={16} className="text-[#FF0000]" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 1, 0], rotate: -180 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute -bottom-2 -left-2"
              >
                <Zap size={14} className="text-[#FF4444]" />
              </motion.div>
            </>
          )}
        </div>

        <div style={{ transform: "translateZ(20px)" }} className="space-y-3">
          <motion.h3
            animate={{ 
              color: hovered ? service.color : "#ffffff"
            }}
            className="text-2xl font-black tracking-tight"
          >
            {service.title}
          </motion.h3>

          <motion.p
            animate={{
              opacity: hovered ? 1 : 0.6
            }}
            className="text-white/60 leading-relaxed text-sm max-w-md mx-auto"
          >
            {service.description}
          </motion.p>
        </div>

        {/* Animated bottom accent */}
        <motion.div className="flex items-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: index * 0.15 + 0.5 }}
            animate={{ 
              scaleX: hovered ? 1.5 : 1,
              height: hovered ? "3px" : "2px"
            }}
            style={{ originX: 0.5 }}
            className={`w-12 bg-gradient-to-r ${service.gradient} rounded-full`}
          />
          <motion.div
            animate={{ 
              scale: hovered ? [1, 1.5, 1] : 1,
              opacity: hovered ? [0.5, 1, 0.5] : 0.5
            }}
            transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: index * 0.15 + 0.5 }}
            animate={{ 
              scaleX: hovered ? 1.5 : 1,
              height: hovered ? "3px" : "2px"
            }}
            style={{ originX: 0.5 }}
            className={`w-12 bg-gradient-to-l ${service.gradient} rounded-full`}
          />
        </motion.div>

        {/* Hover indicator */}
        <motion.div
          animate={{ 
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 10
          }}
          className="flex items-center gap-2 text-xs text-white/40 font-semibold uppercase tracking-wider"
        >
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            →
          </motion.span>
          Explore
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="py-28 bg-[#080808] relative overflow-hidden">
      {/* Stellar background with orbital rings */}
      <div className="absolute inset-0">
        <StellarBackground density="low" showOrbitalRings={true} />
      </div>

      {/* Enhanced animated grid */}
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Large rotating decorative rings */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-64 -right-64 w-[600px] h-[600px] border-2 border-white/5 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.15, 1] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-64 -left-64 w-[700px] h-[700px] border-2 border-white/4 rounded-full pointer-events-none"
      />

      {/* Floating gradient orbs */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF0000]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1.1, 1, 1.1],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FF4444]/15 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Enhanced floating dots */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -30, 0], 
            opacity: [0, 0.4, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-1.5 h-1.5 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${8 + i * 10}%`, top: `${15 + (i % 4) * 22}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-full mb-4 backdrop-blur-sm"
          >
            <motion.span
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative"
            >
              <span className="w-2 h-2 bg-[#FF0000] rounded-full block" />
              <motion.span
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-2 h-2 bg-[#FF0000] rounded-full"
              />
            </motion.span>
            <span className="text-[#FF0000] text-xs font-bold uppercase tracking-[0.2em]">What I Do</span>
            <Sparkles size={14} className="text-[#FF0000]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tight"
          >
            Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed"
          >
            Comprehensive design solutions from research to implementation
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0.5 }}
            className="relative w-20 h-1 mx-auto rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent" />
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ perspective: "1500px" }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
