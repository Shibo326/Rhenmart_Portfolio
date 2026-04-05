import { motion } from "motion/react";
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-32 pb-20 flex items-center max-w-7xl mx-auto px-6 overflow-hidden relative"
    >
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-[20%] w-[500px] h-[500px] bg-[#FF0000]/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      <div className="absolute bottom-1/4 -right-[20%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] mix-blend-screen opacity-50" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full z-10 items-center"
      >
        {/* Left Content */}
        <div className="col-span-1 md:col-span-7 flex flex-col items-start gap-8">
          <div className="space-y-4 w-full">
            <motion.h2 variants={itemVariants} className="text-[#FF0000] text-xl font-medium tracking-wide">
              Hi I am,
            </motion.h2>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                Rhenmart
              </span>
              <br />
              <span className="text-white/40">Dela Cruz</span>
            </motion.h1>
            <motion.h3
              variants={itemVariants}
              className="text-3xl md:text-5xl font-semibold text-[#FF0000] tracking-tight"
            >
              UI/UX designer
            </motion.h3>
          </div>

          <motion.div variants={itemVariants} className="flex gap-4 items-center">
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
              <Github size={20} />
            </a>
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
              <Linkedin size={20} />
            </a>
            <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
              <Twitter size={20} />
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 mt-4">
            <a
              href="#contact"
              className="px-8 py-3.5 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300"
            >
              Hire Me
            </a>
            <a
              href="#download"
              className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-semibold rounded-full hover:border-[#FF0000] hover:text-[#FF0000] transition-colors flex items-center gap-2"
            >
              Download CV
              <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-white/10 my-4"
          />

          {/* Hero Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-8 md:gap-16 w-full items-center justify-start text-center md:text-left"
          >
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-[#FF0000]">4+</span>
              <span className="text-sm text-white/50 uppercase tracking-wider font-semibold">
                Years BSIT
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-[#FF0000]">10+</span>
              <span className="text-sm text-white/50 uppercase tracking-wider font-semibold">
                Projects
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-[#FF0000]">3x</span>
              <span className="text-sm text-white/50 uppercase tracking-wider font-semibold">
                Competition Winner
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Portrait */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 50, delay: 0.5 },
            },
          }}
          className="col-span-1 md:col-span-5 relative group"
        >
          {/* Subtle frame behind image with glow on hover */}
          <div className="absolute inset-0 rounded-[4rem] bg-[#FF0000]/10 -z-10 translate-x-4 translate-y-4 blur-xl group-hover:bg-[#FF0000]/20 transition-all duration-700"></div>
          
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 p-2 shadow-[0_0_40px_rgba(255,0,0,0.1)] group-hover:shadow-[0_0_60px_rgba(255,0,0,0.2)] transition-shadow duration-700"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1647473824609-748cc19b482d?q=80&w=1080&auto=format&fit=crop"
              alt="Rhenmart Portrait"
              className="w-full h-full object-cover rounded-[2.5rem] filter contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-700"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">Scroll Down</span>
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
