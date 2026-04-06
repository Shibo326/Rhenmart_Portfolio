import { motion } from "motion/react";
import { Download } from "lucide-react";
import secondProfileImg from "../../Image/new9249-_DSC0331.jpg";

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
                src={secondProfileImg}
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
                I'm a passionate UI/UX Designer with over 6 years of experience, dedicated to crafting digital products that are both visually compelling and highly intuitive. With a strong foundation in BSIT, I specialize in transforming complex user challenges into elegant, functional solutions that delight users and drive results.
              </p>
              <p>
                My design process is research-driven and human-centered, combining deep product research, rapid prototyping, and seamless collaboration with development teams. I continuously adapt modern development practices, ensuring my designs are technically feasible, scalable, and optimized for a smooth user experience.
              </p>
              <p>
                To accelerate innovation, I integrate AI tools into my workflow—helping me iterate faster, explore creative solutions, and deliver smarter, problem-solving designs. Whether refining UX flows, creating interactive prototypes, or optimizing interfaces for accessibility and performance, I aim to create digital experiences that are both beautiful and effective.
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
