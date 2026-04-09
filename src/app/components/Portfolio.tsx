import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useRef, useCallback, memo } from "react";
import { X, ExternalLink, Code, Trophy, Layers, Filter } from "lucide-react";
import champImg from "../../Image/umak champ.jpg";
import ndcImg from "../../Image/ndc_startup.jpeg";
import tagisan1 from "../../Image/Tagisan ng talino first Placer.jpg";
import tagisan2 from "../../Image/Tagisan ng talino second placer.jpg";
import uxphImg from "../../Image/UXPH SEMINAR.jpeg";
import beyondUiImg from "../../Image/Beyond ui.jpg";
import exploringFigmaImg from "../../Image/Exploring The basics of figma.jpg";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

type Category = "All" | "Competition" | "Workshop" | "Seminar";

const portfolioItems = [
  { id: 1, title: "Web Design Champion", role: "Design Strategies / UI/UX", category: "Competition" as Category, image: champImg, challenge: "Build a one-page website in 2 hours.\nFast decisions. Strong UX. Tight deadline.", solution: "Created a clear design plan using available components.\nAligned closely with dev to reduce pressure.\nDelivered a structured, efficient layout on time.", impact: "1st Place — UMAK IT Skills Olympics.\nCommended for intuitive flow and clean execution.\nProved speed and quality can coexist." },
  { id: 2, title: "NDC's Breaking Enigma 2025", role: "Product Designer", category: "Competition" as Category, image: ndcImg, challenge: "Build a concept-to-prototype in 4 days.\nAddress a real community problem.\nWork under Technology Track pressure.", solution: "Conceptualized SafePath — an offline GPS SOS app.\nUsers ping location to authorities without internet.\nDivided tasks strategically for rapid delivery.", impact: "Gained invaluable experience and industry connections.\nReceived guidance from professionals throughout.\nStrengthened teamwork, skills, and design thinking." },
  { id: 3, title: "Tagisan ng Talino — 1st Place", role: "UI/UX Designer", category: "Competition" as Category, image: tagisan1, challenge: "Compete in a fast-paced academic design challenge.\nTest UX knowledge under time pressure.\nOutperform peers with accuracy and speed.", solution: "Applied strong UX principles and design theory.\nLeveraged prior competition experience to stay focused.\nAnswered challenges efficiently and confidently.", impact: "Achieved 1st Place in the competition.\nDemonstrated mastery of UI/UX best practices.\nBuilt a strong competitive track record." },
  { id: 4, title: "Tagisan ng Talino — 2nd Place", role: "UI/UX Designer", category: "Competition" as Category, image: tagisan2, challenge: "Multi-round design competition with high stakes.\nRequires both theory and practical UX application.\nCollaborate and perform under pressure.", solution: "Prioritized accuracy and speed each round.\nCollaborated with teammates to cover all areas.\nMaintained consistency across every challenge.", impact: "Secured 2nd Place overall.\nReinforced consistent performance across competitions.\nProven ability to compete at an academic level." },
  { id: 5, title: "UXPH Community Seminar", role: "Attendee / UX Learner", category: "Seminar" as Category, image: uxphImg, challenge: "Stay current with the evolving PH UX landscape.\nConnect with industry professionals and designers.\nAbsorb real-world insights beyond the classroom.", solution: "Attended talks, workshops, and networking sessions.\nGained insights on design systems and research methods.\nEngaged with UXPH — a leading PH design community.", impact: "Expanded professional network significantly.\nDeepened understanding of human-centered design.\nGained real-world industry knowledge and perspective." },
  { id: 6, title: "Exploring The Basics of Figma", role: "Workshop Teacher / UI/UX Facilitator", category: "Workshop" as Category, image: exploringFigmaImg, challenge: "Teach Figma to complete beginners from scratch.\nCover components, frames, and basic prototyping.\nKeep the session engaging and hands-on.", solution: "Led a live demo of Figma's core tools step-by-step.\nWalked students through building a real UI screen.\nFacilitated a group activity to apply the learning.", impact: "Students built their first Figma prototype.\nConfidence and interest in UI/UX visibly increased.\nSparked career curiosity in design among participants." },
  { id: 7, title: "Beyond UI: Designing User Experiences", role: "Workshop Teacher / UI/UX Facilitator", category: "Workshop" as Category, image: beyondUiImg, challenge: "Shift students' mindset beyond visual design.\nTeach UX thinking, flows, and interaction design.\nMake abstract concepts tangible and applicable.", solution: "Covered user research, wireframing, and prototyping.\nUsed live Figma demos and guided exercises.\nStructured content around real-world UX principles.", impact: "Students gained a solid UX foundation.\nSeveral expressed interest in pursuing design careers.\nInspired a new generation of user-centered thinkers." },
];

const TABS: Category[] = ["All", "Competition", "Workshop", "Seminar"];
const categoryConfig: Record<string, { bg: string; text: string; glow: string; dot: string; rgb: string }> = {
  Competition: { bg: "bg-[#FF0000]", text: "text-white", glow: "rgba(255,0,0,0.4)", dot: "#FF0000", rgb: "255,0,0" },
  Workshop:    { bg: "bg-blue-600",  text: "text-white", glow: "rgba(59,130,246,0.4)", dot: "#3B82F6", rgb: "59,130,246" },
  Seminar:     { bg: "bg-purple-600",text: "text-white", glow: "rgba(147,51,234,0.4)", dot: "#9333EA", rgb: "147,51,234" },
};

const PortfolioCard = memo(function PortfolioCard({ item, index, onClick }: { item: typeof portfolioItems[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [4, -4]), { stiffness: 200, damping: 28 });
  const ry = useSpring(useTransform(mx, [-60, 60], [-4, 4]), { stiffness: 200, damping: 28 });
  const [hov, setHov] = useState(false);
  const cfg = categoryConfig[item.category];

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); setHov(false); }, [mx, my]);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={isMobile ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", willChange: hov ? "transform" : "auto" }}
      onMouseMove={onMove}
      onMouseEnter={() => !isMobile && setHov(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Hover border glow — desktop only */}
      {!isMobile && (
        <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-2xl pointer-events-none z-20"
          style={{ boxShadow: `inset 0 0 0 1.5px ${cfg.dot}, 0 0 25px ${cfg.glow}` }} />
      )}

      {/* Image */}
      <motion.img src={item.image} alt={item.title}
        animate={{ scale: hov ? 1.06 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        loading="lazy" decoding="async" className="w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Category badge */}
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        {item.category}
      </div>

      {/* Hover content */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 12 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        <h4 className="text-white font-bold text-base leading-tight mb-1 line-clamp-2">{item.title}</h4>
        <p className="text-white/55 text-xs mb-2">{item.role}</p>
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className="w-4 h-px bg-white/30" />
          View case study
        </div>
      </motion.div>
    </motion.div>
  );
});

export function Portfolio() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Category>("All");
  const selectedItem = portfolioItems.find(i => i.id === selectedId);
  const filtered = activeTab === "All" ? portfolioItems : portfolioItems.filter(i => i.category === activeTab);
  const counts = TABS.reduce((a, t) => ({ ...a, [t]: t === "All" ? portfolioItems.length : portfolioItems.filter(i => i.category === t).length }), {} as Record<string, number>);

  return (
    <section id="portfolio" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Static grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(255,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Static orbs — no animation on mobile */}
      {!isMobile && (
        <>
          <motion.div animate={{ opacity: [0.04, 0.08, 0.04] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#FF0000] rounded-full blur-[140px] pointer-events-none" />
          <motion.div animate={{ opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[350px] h-[350px] bg-[#FF0000] rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-full">
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
            <span className="text-[#FF0000] text-xs font-semibold uppercase tracking-widest">My Work</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Portfolio <span className="text-[#FF0000]">Gallery</span>
          </motion.h2>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }} style={{ originX: 0.5 }}
            className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mx-auto rounded-full" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[{ v: "7", l: "Projects" }, { v: "4", l: "Competitions" }, { v: "2", l: "Workshops" }, { v: "1", l: "Seminar" }].map(({ v, l }, i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
              <span className="text-2xl font-black text-[#FF0000]">{v}</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{l}</span>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center px-1">
          <div className="flex items-center gap-1.5 text-white/25 text-xs mr-1 flex-shrink-0">
            <Filter size={11} /> Filter
          </div>
          {TABS.map(tab => {
            const active = activeTab === tab;
            const cfg = tab !== "All" ? categoryConfig[tab] : null;
            return (
              <motion.button key={tab} onClick={() => setActiveTab(tab)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${active ? `${cfg?.bg ?? "bg-white"} ${cfg?.text ?? "text-black"} border-transparent` : "bg-white/5 text-white/40 border-white/10 hover:text-white/70"}`}>
                {tab}
                <span className={`ml-1.5 text-[10px] ${active ? "opacity-60" : "opacity-35"}`}>{counts[tab]}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={isMobile ? {} : { perspective: "1000px" }}>
          {filtered.map((item, i) => (
            <PortfolioCard key={`${activeTab}-${item.id}`} item={item} index={i} onClick={() => setSelectedId(item.id)} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedId && selectedItem && (() => {
          const cfg = categoryConfig[selectedItem.category];
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-[100] bg-black/90 flex items-start sm:items-center justify-center p-3 sm:p-10 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-4xl bg-[#0c0c0c] rounded-3xl border border-white/8 overflow-hidden flex flex-col md:flex-row relative my-auto"
                style={{ boxShadow: `0 0 60px ${cfg.glow}` }}
              >
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/8 text-white rounded-full">
                  <X size={16} />
                </motion.button>

                {/* Image */}
                <div className="w-full md:w-2/5 h-52 md:h-auto relative flex-shrink-0 overflow-hidden">
                  <motion.img src={selectedItem.image} alt={selectedItem.title}
                    initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}
                    loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c0c0c] hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent block md:hidden" />
                  <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    {selectedItem.category}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{selectedItem.title}</h3>
                    <div className="flex items-center gap-2">
                      <Layers size={13} className="text-white/30" />
                      <span className="text-white/35 text-sm">{selectedItem.role}</span>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />
                  {[
                    { icon: ExternalLink, label: "Challenge", text: selectedItem.challenge },
                    { icon: Code, label: "Solution", text: selectedItem.solution },
                    { icon: Trophy, label: "Impact", text: selectedItem.impact, highlight: true },
                  ].map(({ icon: Icon, label, text, highlight }, si) => (
                    <div key={label}>
                      <h4 className="text-white font-semibold flex items-center gap-2 mb-3 text-sm">
                        <span className="p-1.5 rounded-lg" style={{ backgroundColor: `${cfg.dot}20` }}>
                          <Icon size={13} style={{ color: cfg.dot }} />
                        </span>
                        {label}
                      </h4>
                      <div className={`text-sm leading-relaxed space-y-1.5 ${highlight ? "p-4 rounded-xl border" : ""}`}
                        style={highlight ? { backgroundColor: `${cfg.dot}10`, borderColor: `${cfg.dot}25`, color: `${cfg.dot}CC` } : { color: "rgba(255,255,255,0.5)" }}>
                        {text.split('\n').map((line, li) => <p key={li}>{line}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
