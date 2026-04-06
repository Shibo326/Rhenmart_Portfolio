import { motion } from "motion/react";
import { Download, Sparkles, Code2, Lightbulb } from "lucide-react";
import secondProfileImg from "../../Image/new9249-_DSC0331.jpg";

const skills = [
  { label: "UI/UX Design", icon: Sparkles },
  { label: "Prototyping", icon: Lightbulb },
  { label: "Dev Collab", icon: Code2 },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Animated bg orb */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF0000]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z-10 relative">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full"
            />
            <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">About Me</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="col-span-1 md:col-span-5 relative group"
          >
            {/* Rotating border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-t-[10rem] rounded-b-[2rem] pointer-events-none opacity-30"
              style={{
                background: "conic-gradient(from 0deg, #FF0000, transparent 50%, #FF0000)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
              }}
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[#FF0000] rounded-t-[10rem] rounded-b-[2rem] blur-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"
            />

            <div className="aspect-[4/5] relative rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border border-white/10">
              <motion.img
                src={secondProfileImg}
                alt="About Rhenmart"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

              {/* Floating skill badges */}
              {skills.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  animate={{ y: [0, -4, 0] }}
                  className="absolute right-4 flex items-center gap-2 bg-[#111]/90 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm shadow-lg"
                  style={{ top: `${25 + i * 28}%` } as React.CSSProperties}
                >
                  <Icon size={14} className="text-[#FF0000]" />
                  <span className="text-white text-xs font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-1 md:col-span-7 flex flex-col items-start gap-6"
          >
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              >
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                  Me
                </span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ originX: 0 }}
                className="w-16 h-1 bg-[#FF0000] rounded-full mt-3"
              />
            </div>

            <div className="space-y-4 text-white/70 leading-relaxed text-base md:text-lg">
              {[
                "I'm a passionate UI/UX Designer with over 6 years of experience, dedicated to crafting digital products that are both visually compelling and highly intuitive. With a strong foundation in BSIT, I specialize in transforming complex user challenges into elegant, functional solutions that delight users and drive results.",
                "My design process is research-driven and human-centered, combining deep product research, rapid prototyping, and seamless collaboration with development teams. I continuously adapt modern development practices, ensuring my designs are technically feasible, scalable, and optimized for a smooth user experience.",
                "To accelerate innovation, I integrate AI tools into my workflow—helping me iterate faster, explore creative solutions, and deliver smarter, problem-solving designs. Whether refining UX flows, creating interactive prototypes, or optimizing interfaces for accessibility and performance, I aim to create digital experiences that are both beautiful and effective.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all duration-300"
              >
                Hire Me
              </motion.a>
              <motion.a
                href="#download"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 text-white/70 hover:text-[#FF0000] transition-colors font-medium text-base border-b border-transparent hover:border-[#FF0000] pb-1"
              >
                <Download size={18} />
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
