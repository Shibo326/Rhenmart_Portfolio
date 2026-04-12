import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Smartphone, Monitor, Search, Handshake, Sparkles, Zap } from "lucide-react";
import { useRef, useState, memo } from "react";
import { useAnimationConfig } from "../context/AnimationContext";

const services = [
  { title: "UI Design", description: "Crafting visually compelling interfaces with strong layout systems, design tokens, and micro-animation details.", icon: Monitor, color: "#FF0000", gradient: "from-[#FF0000] to-[#FF4444]", number: "01" },
  { title: "UX Research", description: "Conducting user interviews, usability testing, and data-driven research to validate design decisions.", icon: Search, color: "#FF2222", gradient: "from-[#FF2222] to-[#FF6666]", number: "02" },
  { title: "Prototyping", description: "Building interactive prototypes in Figma and Framer — from low-fidelity wireframes to high-fidelity flows.", icon: Smartphone, color: "#FF4444", gradient: "from-[#FF4444] to-[#FF8888]", number: "03" },
  { title: "Design to Dev Collaboration", description: "Seamless handoffs and strong communication with developers to bring designs to life with precision.", icon: Handshake, color: "#FF0000", gradient: "from-[#FF0000] to-[#FF4444]", number: "04", span: true },
];

const ServiceCard = memo(function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { enable3DTilt, isMobile } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [4, -4]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-4, 4]), { stiffness: 150, damping: 25 });
  const glowX = useTransform(mouseX, [-100, 100], [0, 100]);
  const glowY = useTransform(mouseY, [-100, 100], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceEffects || !hovered) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={reduceEffects ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", willChange: hovered ? "transform" : "auto" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reduceEffects && setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative p-5 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0d0d0d] to-[#080808] border border-white/10 overflow-hidden group cursor-default ${service.span ? "md:col-span-8 md:col-start-3" : "md:col-span-4"}`}
    >
      {/* Animated gradient bg — subtle on mobile */}
      <motion.div
        animate={{ opacity: hovered ? 0.15 : 0.05 }}
        transition={{ duration: 0.4 }}
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-3xl pointer-events-none`}
      />

      {/* Cursor spotlight — desktop non-Safari only */}
      {!reduceEffects && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
          style={{ background: useTransform([glowX, glowY], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,0,0,0.18) 0%, transparent 55%)`) }}
        />
      )}

      {/* Border glow on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${service.color}50, 0 0 35px ${service.color}25` }}
      />

      {/* Animated gradient border — desktop non-Safari only */}
      {!reduceEffects && (
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-3xl pointer-events-none">
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl p-[1.5px]"
            style={{
              background: `linear-gradient(90deg, ${service.color}, ${service.color}88, ${service.color}44, ${service.color}88, ${service.color})`,
              backgroundSize: "200% 100%",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude"
            }}
          />
        </motion.div>
      )}

      {/* Shimmer sweep — desktop non-Safari only */}
      {!reduceEffects && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: hovered ? "200%" : "-100%", opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/6 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      {/* Number watermark */}
      <motion.span
        animate={{ opacity: hovered ? 0.1 : 0.04 }}
        className={`absolute top-4 sm:top-6 right-6 sm:right-8 text-6xl sm:text-8xl font-black bg-gradient-to-br ${service.gradient} bg-clip-text text-transparent select-none pointer-events-none`}
      >
        {service.number}
      </motion.span>

      <div className="relative z-10 flex flex-col items-center text-center gap-4 sm:gap-6">
        {/* Icon with pulse rings */}
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.7, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${service.color}35 0%, transparent 70%)` }}
          />
          {/* Inner pulse ring — desktop non-Safari only */}
          {!reduceEffects && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 + 0.4 }}
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${service.color}25 0%, transparent 70%)` }}
            />
          )}

          <motion.div
            whileHover={reduceEffects ? {} : { rotate: [0, -12, 12, -8, 8, 0], scale: 1.2 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 280 }}
            className={`relative p-3 sm:p-5 bg-gradient-to-br ${service.gradient} rounded-2xl border border-white/20 shadow-lg`}
            style={{ boxShadow: `0 8px 30px ${service.color}35`, transform: reduceEffects ? "none" : "translateZ(25px)" }}
          >
            <Icon size={isMobile ? 24 : 34} className="text-white" />
            {/* Icon inner glow on hover */}
            <motion.div
              animate={{ opacity: hovered ? 0.5 : 0 }}
              className="absolute inset-0 rounded-2xl blur-lg"
              style={{ backgroundColor: service.color }}
            />
          </motion.div>

          {/* Sparkle effects on hover — desktop non-Safari only */}
          {!reduceEffects && hovered && (
            <>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: [0, 1, 0], rotate: 180 }}
                transition={{ duration: 0.5 }} className="absolute -top-2 -right-2">
                <Sparkles size={14} className="text-[#FF0000]" />
              </motion.div>
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: [0, 1, 0], rotate: -180 }}
                transition={{ duration: 0.5, delay: 0.15 }} className="absolute -bottom-2 -left-2">
                <Zap size={12} className="text-[#FF4444]" />
              </motion.div>
            </>
          )}
        </div>

        <div style={reduceEffects ? {} : { transform: "translateZ(18px)" }} className="space-y-2 sm:space-y-3">
          <motion.h3
            animate={{ color: hovered ? service.color : "#ffffff" }}
            transition={{ duration: 0.2 }}
            className="text-xl sm:text-2xl font-black tracking-tight"
          >
            {service.title}
          </motion.h3>
          <motion.p
            animate={{ opacity: hovered ? 1 : 0.6 }}
            className="text-white/60 leading-relaxed text-xs sm:text-sm max-w-md mx-auto"
          >
            {service.description}
          </motion.p>
        </div>

        {/* Bottom accent */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            animate={{ scaleX: hovered ? 1.4 : 1 }}
            style={{ originX: 0.5 }}
            className={`w-10 h-[2px] bg-gradient-to-r ${service.gradient} rounded-full`}
          />
          <motion.div
            animate={{ scale: hovered ? [1, 1.5, 1] : 1, opacity: hovered ? [0.5, 1, 0.5] : 0.5 }}
            transition={{ duration: 1, repeat: hovered ? Infinity : 0 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            animate={{ scaleX: hovered ? 1.4 : 1 }}
            style={{ originX: 0.5 }}
            className={`w-10 h-[2px] bg-gradient-to-l ${service.gradient} rounded-full`}
          />
        </div>

        {/* Hover explore indicator — desktop non-Safari only */}
        {!reduceEffects && (
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            className="flex items-center gap-2 text-xs text-white/40 font-semibold uppercase tracking-wider"
          >
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
            Explore
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export function Services() {
  const { enable3DTilt, isMobile } = useAnimationConfig();
  const reduceEffects = !enable3DTilt;
  return (
    <section id="services" className="py-28 bg-[#080808] relative overflow-hidden">
      {/* Animated grid — desktop non-Safari only */}
      {!reduceEffects ? (
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,0,0,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,0.8) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,0,0,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,0.8) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      )}

      {/* Decorative rotating rings — desktop non-Safari only */}
      {!reduceEffects && (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -top-64 -right-64 w-[600px] h-[600px] border border-white/[0.04] rounded-full pointer-events-none" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-64 -left-64 w-[700px] h-[700px] border border-white/[0.03] rounded-full pointer-events-none" />
        </>
      )}

      {/* Floating gradient orbs — desktop non-Safari only, box-shadow instead of blur */}
      {!reduceEffects && (
        <>
          <motion.div
            animate={{ x: [0, 80, 0], y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 160px 80px rgba(255,0,0,0.07)", background: "transparent" }}
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 50, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 180px 90px rgba(255,68,68,0.05)", background: "transparent" }}
          />
        </>
      )}

      {/* Floating dots — desktop non-Safari only */}
      {!reduceEffects && [0, 1, 2, 3, 4].map((i) => (
        <motion.div key={i}
          aria-hidden="true"
          animate={{ y: [0, -25, 0], opacity: [0, 0.35, 0], scale: [0.5, 1.1, 0.5] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
          className="absolute w-1.5 h-1.5 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${8 + i * 18}%`, top: `${15 + (i % 4) * 22}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 rounded-full mb-4"
          >
            <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="relative">
              <span className="w-2 h-2 bg-[#FF0000] rounded-full block" />
              <motion.span animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 w-2 h-2 bg-[#FF0000] rounded-full" />
            </motion.span>
            <span className="text-[#FF0000] text-xs font-bold uppercase tracking-[0.2em]">What I Do</span>
            <Sparkles size={13} className="text-[#FF0000]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tight"
          >
            Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.2 }}
            className="text-white/45 text-sm max-w-xl mx-auto"
          >
            Comprehensive design solutions from research to implementation
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ originX: 0.5 }}
            className="relative w-16 h-[3px] mx-auto rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent" />
            {!reduceEffects && (
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={isMobile ? {} : { perspective: "1400px" }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
