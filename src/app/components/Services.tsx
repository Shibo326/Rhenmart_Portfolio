import { memo } from "react";
import { motion } from "motion/react";
import { Monitor, Search, Smartphone, Handshake } from "lucide-react";
import { SectionBadge, RedDivider, HudCorners } from "./Hud";
import { useTilt } from "../hooks/useDeviceAnimations";

const SERVICES = [
  {
    Icon: Monitor,
    title: "UI Design",
    desc: "Crafting visually compelling interfaces with strong layout systems, design tokens, and micro-animation details.",
  },
  {
    Icon: Search,
    title: "UX Research",
    desc: "Conducting user interviews, usability testing, and data-driven research to validate design decisions.",
  },
  {
    Icon: Smartphone,
    title: "Prototyping",
    desc: "Building interactive prototypes in Figma and Framer — from low-fidelity wireframes to high-fidelity flows.",
  },
  {
    Icon: Handshake,
    title: "Design to Dev",
    desc: "Seamless handoffs and strong communication with developers to bring designs to life with precision.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-32 bg-[#080808] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 holo opacity-40 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-orb"
        style={{ background: "rgba(255,0,0,0.05)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="grid md:grid-cols-12 gap-8 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 space-y-4"
          >
            <SectionBadge name="SERVICES.EXE" comment="WHAT_I_DO" />
            <h2
              className="font-black tracking-tighter text-gradient-white leading-[0.85]"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              SERVICES
            </h2>
            <div className="max-w-xs">
              <RedDivider />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 space-y-3"
          >
            <p className="text-[rgba(255,255,255,0.55)] leading-relaxed">
              Comprehensive design solutions from research to implementation. Every service is
              delivered with a research-first, dev-friendly mindset.
            </p>
            <div className="font-mono text-[10px] text-[#FF0000] tracking-widest">
              ▸ FOUR_CORE_OFFERINGS // 100% CUSTOM
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="perspective-1500 grid md:grid-cols-2 gap-6">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const ServiceCard = memo(function ServiceCard({
  Icon,
  title,
  desc,
  index,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useTilt<HTMLDivElement>(10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        ref={ref}
        className="group relative bg-gradient-to-br from-[#050505] to-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.60)] p-8 transition-colors overflow-hidden tilt-3d spotlight gradient-border h-full depth-shadow cut-corner"
      >
        <HudCorners />

        {/* Shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden pointer-events-none">
          <div className="absolute -inset-y-2 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shimmer" />
        </div>

        <div className="relative tilt-layer space-y-5">
          {/* Icon */}
          <div className="flex items-start justify-between">
            <div className="relative w-16 h-16 flex items-center justify-center bg-[#0a0000] border border-[rgba(255,0,0,0.35)] group-hover:border-[#FF0000] transition-all duration-300 overflow-hidden">
              {/* Corner brackets */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#FF0000]" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#FF0000]" />
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#FF0000]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#FF0000]" />
              {/* Glow bg on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(255,0,0,0.18) 0%, transparent 75%)" }} />
              {/* Icon */}
              <Icon
                size={26}
                className="relative z-10 text-[#FF0000] transition-all duration-300 group-hover:scale-110"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,0,0,0.7))" }}
              />
              {/* Bottom scan line */}
              <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-3xl font-black tracking-tight mb-3 group-hover:text-[#FF0000] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-[rgba(255,255,255,0.55)] leading-relaxed">{desc}</p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest">
              STATUS: AVAILABLE
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";
