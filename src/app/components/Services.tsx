import { motion } from "motion/react";
import { Smartphone, Monitor, Search, Handshake } from "lucide-react";

export function Services() {
  const services = [
    {
      title: "App Design",
      description: "Crafting intuitive and engaging mobile experiences with user-centered design principles.",
      icon: <Smartphone size={32} className="text-[#FF0000]" />,
    },
    {
      title: "Web Design",
      description: "Creating responsive and modern websites that perform well and convert users.",
      icon: <Monitor size={32} className="text-[#FF0000]" />,
    },
    {
      title: "Product Research",
      description: "Data-driven insights to validate ideas and ensure product-market fit.",
      icon: <Search size={32} className="text-[#FF0000]" />,
    },
    {
      title: "Design to Development Collaboration",
      description: "Seamless handoffs and strong communication to bring designs to life perfectly.",
      icon: <Handshake size={32} className="text-[#FF0000]" />,
      span: true,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="services" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Services
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-1 bg-[#FF0000] mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={item}
              className={`p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FF0000]/50 hover:bg-white/10 transition-all duration-300 group ${
                service.span ? "md:col-span-8 md:col-start-3" : "md:col-span-4"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 group-hover:bg-[#FF0000]/10 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-[#FF0000] transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
