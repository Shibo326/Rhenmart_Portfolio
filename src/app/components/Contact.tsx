import { motion } from "motion/react";
import { Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#050505] relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF0000]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Contact me
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Have a project in mind or just want to say hi? Feel free to reach out to me!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-1 bg-[#FF0000] mx-auto rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl"
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2 col-span-1">
              <label htmlFor="name" className="text-sm font-medium text-white/70">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2 col-span-1">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label htmlFor="subject" className="text-sm font-medium text-white/70">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all"
                placeholder="Project Inquiry"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label htmlFor="message" className="text-sm font-medium text-white/70">
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="group px-8 py-4 bg-[#FF0000] text-white font-semibold rounded-full hover:bg-red-700 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center"
              >
                Send Message
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
