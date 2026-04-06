import { motion, useMotionValue, useTransform } from "motion/react";
import { Smartphone, Monitor, Search, Handshake } from "lucide-react";
import { useRef } from "react";

const services = [
  {
    title: "App Design",
    description: "Crafting intuitive and engaging mobile experiences with user-centered design principles.",
    icon: Smartphone,
    gradient: "from-[#FF0000]/20 to-transparent",
  },
  {
    title: "Web Design",
    description: "Creating responsive and modern websites that perform well and convert users.",
    icon: Monitor,
    gradient: "from-[#FF4444]/20 to-transparent",
  },
  {
    title: "Product Research",
    description: "Data-driven insights to validate ideas and ensure product-market fit.",
    icon: Search,
    gradient: "from-[#FF2222]/20 to-transparent",
  },
  {
    title: "Design to Development Collaboration",
    description: "Seamless handoffs and strong communication to bring designs to life perfectly.",
    icon: Handshake,
    gradient: "from-[#FF0000]/20 to-transparent",
    span: true,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden group cursor-default ${
        service.span ? "md:col-span-8 md:col-start-3" : "md:col-span-4"
      }`}
    >
      {/* Animated gradient bg on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,0,0,0.3)" }}
      />

      {/* Shimmer line */}
      <motion.div
        initial={{ x: "-100%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        {/* Icon with pulse ring */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 bg-[#FF0000]/20 rounded-full"
          />
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
            transition={{ duration: 0.4 }}
            className="relative p-4 bg-white/5 rounded-full group-hover:bg-[#FF0000]/15 transition-colors duration-300"
          >
            <Icon size={32} className="text-[#FF0000]" />
          </motion.div>
        </div>

        <motion.h3
          className="text-xl font-semibold text-white group-hover:text-[#FF0000] transition-colors duration-300"
        >
          {service.title}
        </motion.h3>

        <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/80 transition-colors duration-300">
          {service.description}
        </p>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          style={{ originX: 0.5 }}
          className="w-8 h-0.5 bg-[#FF0000]/50 rounded-full"
        />
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 border border-white/5 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-96 h-96 border border-white/5 rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full mb-4"
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full"
            />
            <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">What I Do</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Services
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ originX: 0.5 }}
            className="w-16 h-1 bg-[#FF0000] mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ perspective: "1000px" }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
