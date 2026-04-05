import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ExternalLink, Code, Layout, Trophy } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Web Design Champion",
    role: "Lead UI/UX",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1623652653308-d49d335c92eb?q=80&w=1080&auto=format&fit=crop",
    challenge: "Design an entire e-commerce platform in 48 hours under strict competition rules, focusing on accessibility and conversion rates.",
    solution: "Leveraged Figma Auto-Layout and Component Properties for rapid prototyping. Created a comprehensive design system for seamless dev handoff.",
    impact: "1st Place / Champion result. Commended for intuitive user flows and detailed wireframes.",
  },
  {
    id: 2,
    title: "FinTech Dashboard Redesign",
    role: "UI/UX Designer",
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop",
    challenge: "Modernize a legacy financial dashboard that was cluttered and difficult for users to extract meaningful insights.",
    solution: "Conducted user research to identify key metrics. Implemented a modular widget system using a strict 12-column grid and high-contrast typography.",
    impact: "Increased user engagement by 45% and reduced support tickets related to navigation by 30%.",
  },
  {
    id: 3,
    title: "Health Tracking Mobile App",
    role: "Product Designer",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1669850850090-54237ab4a4a3?q=80&w=1080&auto=format&fit=crop",
    challenge: "Create an engaging fitness app that encourages daily habit formation without overwhelming the user.",
    solution: "Designed a gamified onboarding experience with micro-interactions. Used subtle animations and a clean, dark-mode interface.",
    impact: "Featured in Top 10 Health & Fitness apps locally. 4.8/5 average rating across 10k+ users.",
  },
  {
    id: 4,
    title: "E-Learning Platform UI",
    role: "UX Researcher & Designer",
    category: "Web",
    image: "https://images.unsplash.com/photo-1623652653308-d49d335c92eb?q=80&w=1080&auto=format&fit=crop",
    challenge: "Design an intuitive interface for students of various age groups to access video courses and assignments seamlessly.",
    solution: "Simplified navigation utilizing progressive disclosure and clear typography hierarchy. Built accessible color palettes.",
    impact: "Boosted course completion rates by 25% within the first three months of launch.",
  },
  {
    id: 5,
    title: "Crypto Wallet Interface",
    role: "UI/UX Designer",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1669850850090-54237ab4a4a3?q=80&w=1080&auto=format&fit=crop",
    challenge: "Simplify complex blockchain transactions into a user-friendly mobile experience for beginners.",
    solution: "Created guided walkthroughs and visual feedback loops for transaction statuses. Implemented biometric authentication flows.",
    impact: "Successfully acquired 50k+ active users in beta testing with a 98% task success rate.",
  },
  {
    id: 6,
    title: "SaaS Analytics Tool",
    role: "Lead Designer",
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop",
    challenge: "Visualize large datasets for marketing teams without causing cognitive overload.",
    solution: "Designed interactive charts and customizable dashboards. Implemented smart filters and automated reporting flows.",
    impact: "Reduced time spent on data analysis by marketing teams by an average of 4 hours per week.",
  },
];

export function Portfolio() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedItem = portfolioItems.find((item) => item.id === selectedId);

  return (
    <section id="portfolio" className="py-20 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Portfolio <span className="text-[#FF0000]">Gallery</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 font-medium"
          >
            With Use-Cases
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-1 bg-[#FF0000] mx-auto rounded-full mt-4"
          />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedId(item.id)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10"
              layoutId={`card-${item.id}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0">
                <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[#FF0000] font-medium text-sm mb-3">{item.role}</p>
                <span className="text-white/70 text-sm line-clamp-2">Click to view case study &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-12 overflow-y-auto"
          >
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#111] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden flex flex-col md:flex-row relative"
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-[#FF0000] text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111] hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent block md:hidden" />
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#FF0000]/20 text-[#FF0000] rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    {selectedItem.category}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h3>
                  <p className="text-white/50 font-medium flex items-center gap-2">
                    <Layout size={16} />
                    {selectedItem.role}
                  </p>
                </div>

                <div className="space-y-6 text-white/70">
                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-lg border-b border-white/10 pb-2">
                      <ExternalLink size={18} className="text-[#FF0000]" />
                      Challenge
                    </h4>
                    <p className="leading-relaxed text-sm md:text-base">{selectedItem.challenge}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-lg border-b border-white/10 pb-2">
                      <Code size={18} className="text-[#FF0000]" />
                      Solution
                    </h4>
                    <p className="leading-relaxed text-sm md:text-base">{selectedItem.solution}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-lg border-b border-white/10 pb-2">
                      <Trophy size={18} className="text-[#FF0000]" />
                      Impact
                    </h4>
                    <p className="leading-relaxed text-sm md:text-base text-[#FF0000]/90 font-medium bg-[#FF0000]/10 p-4 rounded-xl">
                      {selectedItem.impact}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
