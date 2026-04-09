import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Smartphone, Monitor, Search, Handshake } from "lucide-react";
import { useRef, useState, memo } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const services = [
  { title: "UI Design", description: "Crafting visually compelling interfaces with strong layout systems, design tokens, and micro-animation details.", icon: Monitor, color: "#FF0000", gradient: "from-[#FF0000] to-[#FF4444]", number: "01" },
  { title: "UX Research", description: "Conducting user interviews, usability testing, and data-driven research to validate design decisions.", icon: Search, color: "#FF2222", gradient: "from-[#FF2222] to-[#FF6666]", number: "02" },
  { title: "Prototyping", description: "Building interactive prototypes in Figma and Framer — from low-fidelity wireframes to high-fidelity flows.", icon: Smartphone, color: "#FF4444", gradient: "from-[#FF4444] to-[#FF8888]", number: "03" },
  { title: "Design to Dev Collaboration", description: "Seamless handoffs and strong communication with developers to bring designs to life with precision.", icon: Handshake, color: "#FF0000", gradient: "from-[#FF0000] to-[#FF4444]", number: "04", span: true },
];

const ServiceCard = memo(function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // 3D tilt — desktop only
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [4, -4]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-4, 4]), { stiffness: 150, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !hovered) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0); mouseY.set(0); setHovered(false);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={isMobile ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", willChange: hovered ? "transform" : "auto" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative p-8 rounded-3xl bg-gradient-to-br from-[#0d0d0d] to-[#080808] border border-white/10 overflow-hidden group cursor-default ${service.span ? "md:col-span-8 md:col-start-3" : "md:col-span-4"}`}
    >
      {/* Subtle bg gradient — no animation on mobile */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-[0.06] pointer-events-none`} />

      {/* Hover spotlight — desktop only */}
      {!isMobile && hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,0,0,0.15) 0%, transparent 60%)` }}
        />
      )}

      {/* Border glow on hover */}
      {hovered && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${service.color}40` }} />
      )}

      {/* Number watermark */}
      <span className="absolute top-6 right-8 text-8xl font-black text-white/[0.04] select-none pointer-events-none">
        {service.number}
      </span>

      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        {/* Icon */}
        <div className="relative">
          {/* Single pulse ring — reduced */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${service.color}30 0%, transparent 70%)` }}
          />
          <motion.div
            whileHover={isMobile ? {} : { scale: 1.15 }}
            transition={{ duration: 0.3 }}
            className={`relative p-5 bg-gradient-to-br ${service.gradient} rounded-2xl border border-white/20 shadow-lg`}
            style={{ boxShadow: `0 8px 30px ${service.color}30` }}
          >
            <Icon size={32} className="text-white" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight text-white group-hover:text-[#FF4444] transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-white/55 leading-relaxed text-sm max-w-md mx-auto">
            {service.description}
          </p>
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
          style={{ originX: 0.5 }}
          className={`w-10 h-[2px] bg-gradient-to-r ${service.gradient} rounded-full`}
        />
      </div>
    </motion.div>
  );
});

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Static grid — no animation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,0,0,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,0.8) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Static decorative rings — no animation on mobile */}
      {!isMobile && (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -top-64 -right-64 w-[500px] h-[500px] border border-white/[0.04] rounded-full pointer-events-none" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-64 -left-64 w-[600px] h-[600px] border border-white/[0.03] rounded-full pointer-events-none" />
        </>
      )}

      {/* Floating dots — reduced, desktop only */}
      {!isMobile && [0, 1, 2, 3, 4].map((i) => (
        <motion.div key={i}
          animate={{ y: [0, -20, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
            <span className="text-[#FF0000] text-xs font-bold uppercase tracking-widest">What I Do</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight">
            Services
          </motion.h2>

          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }} style={{ originX: 0.5 }}
            className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5" style={isMobile ? {} : { perspective: "1200px" }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
