import { motion } from "motion/react";
import { Download } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-5 relative group"
          >
             <div className="absolute inset-0 bg-[#FF0000] rounded-t-[10rem] rounded-b-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="aspect-[4/5] relative rounded-t-[10rem] rounded-b-[2rem] overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1647473824609-748cc19b482d?q=80&w=1080&auto=format&fit=crop"
                alt="About Rhenmart"
                className="w-full h-full object-cover filter contrast-125 saturate-50 hover:saturate-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 md:col-span-7 flex flex-col items-start gap-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Me</span>
            </h2>
            <div className="w-16 h-1 bg-[#FF0000] rounded-full" />
            
            <div className="space-y-4 text-white/70 leading-relaxed text-lg">
              <p>
                I am a passionate UI/UX Designer dedicated to creating digital products 
                that are not only visually stunning but also highly functional. With over 
                4 years of experience and a strong background in BSIT, I bridge the gap 
                between complex user problems and elegant, intuitive solutions.
              </p>
              <p>
                My process involves deep product research, rapid prototyping, and close 
                collaboration with development teams to ensure pixel-perfect implementation. 
                I've successfully delivered over 10+ projects and proudly hold 3 competition 
                wins, demonstrating my commitment to excellence and innovation in design.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              <a
                href="#contact"
                className="px-8 py-3.5 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all duration-300"
              >
                Hire Me
              </a>
              <a
                href="#download"
                className="flex items-center gap-2 text-white/70 hover:text-[#FF0000] transition-colors font-medium text-lg border-b border-transparent hover:border-[#FF0000] pb-1"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
