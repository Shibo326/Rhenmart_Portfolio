import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type Variants } from "motion/react";
import { useState, useRef, useCallback, memo } from "react";
import { X, ExternalLink, Code, Trophy, Layers, Filter } from "lucide-react";
import champImg from "../../Image/umak champ.jpg";
import ndcImg from "../../Image/ndc_startup.jpeg";
import tagisan1 from "../../Image/Tagisan ng talino first Placer.jpg";
import tagisan2 from "../../Image/Tagisan ng talino second placer.jpg";
import uxphImg from "../../Image/UXPH SEMINAR.jpeg";
import beyondUiImg from "../../Image/Beyond ui.jpg";
import exploringFigmaImg from "../../Image/Exploring The basics of figma.jpg";
import { detectDeviceCapability } from "../utils/performance";

const { isMobile, isSafari } = detectDeviceCapability();
const reduceEffects = isMobile || isSafari;

type Category = "All" | "Competition" | "Workshop" | "Seminar" | "Case Studies";

const portfolioItems = [
  { id: 1, title: "Web Design Champion", role: "Design Strategies / UI/UX", category: "Competition" as Category, image: champImg, challenge: "Build a one-page website in 2 hours.\nFast decisions. Strong UX. Tight deadline.", solution: "Created a clear design plan using available components.\nAligned closely with dev to reduce pressure.\nDelivered a structured, efficient layout on time.", impact: "1st Place — UMAK IT Skills Olympics.\nCommended for intuitive flow and clean execution.\nProved speed and quality can coexist." },
  { id: 2, title: "NDC's Breaking Enigma 2025", role: "Product Designer", category: "Competition" as Category, image: ndcImg, challenge: "Build a concept-to-prototype in 4 days.\nAddress a real community problem.\nWork under Technology Track pressure.", solution: "Conceptualized SafePath — an offline GPS SOS app.\nUsers ping location to authorities without internet.\nDivided tasks strategically for rapid delivery.", impact: "Gained invaluable experience and industry connections.\nReceived guidance from professionals throughout.\nStrengthened teamwork, skills, and design thinking." },
  { id: 3, title: "Tagisan ng Talino — 1st Place", role: "UI/UX Designer", category: "Competition" as Category, image: tagisan1, challenge: "Compete in a fast-paced academic design challenge.\nTest UX knowledge under time pressure.\nOutperform peers with accuracy and speed.", solution: "Applied strong UX principles and design theory.\nLeveraged prior competition experience to stay focused.\nAnswered challenges efficiently and confidently.", impact: "Achieved 1st Place in the competition.\nDemonstrated mastery of UI/UX best practices.\nBuilt a strong competitive track record." },
  { id: 4, title: "Tagisan ng Talino — 2nd Place", role: "UI/UX Designer", category: "Competition" as Category, image: tagisan2, challenge: "Multi-round design competition with high stakes.\nRequires both theory and practical UX application.\nCollaborate and perform under pressure.", solution: "Prioritized accuracy and speed each round.\nCollaborated with teammates to cover all areas.\nMaintained consistency across every challenge.", impact: "Secured 2nd Place overall.\nReinforced consistent performance across competitions.\nProven ability to compete at an academic level." },
  { id: 5, title: "UXPH Community Seminar", role: "Attendee / UX Learner", category: "Seminar" as Category, image: uxphImg, challenge: "Stay current with the evolving PH UX landscape.\nConnect with industry professionals and designers.\nAbsorb real-world insights beyond the classroom.", solution: "Attended talks, workshops, and networking sessions.\nGained insights on design systems and research methods.\nEngaged with UXPH — a leading PH design community.", impact: "Expanded professional network significantly.\nDeepened understanding of human-centered design.\nGained real-world industry knowledge and perspective." },
  { id: 6, title: "Exploring The Basics of Figma", role: "Workshop Teacher / UI/UX Facilitator", category: "Workshop" as Category, image: exploringFigmaImg, challenge: "Teach Figma to complete beginners from scratch.\nCover components, frames, and basic prototyping.\nKeep the session engaging and hands-on.", solution: "Led a live demo of Figma's core tools step-by-step.\nWalked students through building a real UI screen.\nFacilitated a group activity to apply the learning.", impact: "Students built their first Figma prototype.\nConfidence and interest in UI/UX visibly increased.\nSparked career curiosity in design among participants." },
  { id: 7, title: "Beyond UI: Designing User Experiences", role: "Workshop Teacher / UI/UX Facilitator", category: "Workshop" as Category, image: beyondUiImg, challenge: "Shift students' mindset beyond visual design.\nTeach UX thinking, flows, and interaction design.\nMake abstract concepts tangible and applicable.", solution: "Covered user research, wireframing, and prototyping.\nUsed live Figma demos and guided exercises.\nStructured content around real-world UX principles.", impact: "Students gained a solid UX foundation.\nSeveral expressed interest in pursuing design careers.\nInspired a new generation of user-centered thinkers." },
];

const TABS: Category[] = ["All", "Competition", "Workshop", "Seminar", "Case Studies"];
const categoryConfig: Record<string, { bg: string; text: string; glow: string; dot: string; rgb: string }> = {
  Competition: { bg: "bg-[#FF0000]", text: "text-white", glow: "rgba(255,0,0,0.4)", dot: "#FF0000", rgb: "255,0,0" },
  Workshop:    { bg: "bg-blue-600",  text: "text-white", glow: "rgba(59,130,246,0.4)", dot: "#3B82F6", rgb: "59,130,246" },
  Seminar:     { bg: "bg-purple-600",text: "text-white", glow: "rgba(147,51,234,0.4)", dot: "#9333EA", rgb: "147,51,234" },
  "Case Studies": { bg: "bg-emerald-600", text: "text-white", glow: "rgba(16,185,129,0.4)", dot: "#10B981", rgb: "16,185,129" },
};

// Mobile scroll animation variants
const mobileCardVariants: Variants = {
  offscreen: {
    y: 100,
    opacity: 0,
    scale: 0.9,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

const PortfolioCard = memo(function PortfolioCard({ item, index, onClick }: { item: typeof portfolioItems[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [4, -4]), { stiffness: 200, damping: 28 });
  const ry = useSpring(useTransform(mx, [-60, 60], [-4, 4]), { stiffness: 200, damping: 28 });
  const [hov, setHov] = useState(false);
  const cfg = categoryConfig[item.category];

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceEffects) return;
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); setHov(false); }, [mx, my]);

  // Mobile/Safari: Use scroll-triggered animation (no 3D tilt)
  if (reduceEffects) {
    return (
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={mobileCardVariants}
        onClick={onClick}
        className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
      >
        {/* Image */}
        <img src={item.image} alt={item.title}
          loading="lazy" decoding="async" className="w-full h-full object-cover" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Category badge */}
        <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          {item.category}
        </div>

        {/* Content - always visible on mobile */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
          <h4 className="text-white font-bold text-base leading-tight mb-1 line-clamp-2">{item.title}</h4>
          <p className="text-white/55 text-xs mb-2">{item.role}</p>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span className="w-4 h-px bg-white/30" />
            Tap to view
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop: Use 3D tilt animation
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={reduceEffects ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", willChange: hov ? "transform" : "auto" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Hover border glow */}
      <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{ boxShadow: `inset 0 0 0 1.5px ${cfg.dot}, 0 0 25px ${cfg.glow}` }} />

      {/* Shimmer sweep on hover */}
      <motion.div initial={{ x: "-100%", opacity: 0 }} whileHover={{ x: "200%", opacity: 1 }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none z-10" />

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
  const [showAll, setShowAll] = useState(false);
  const selectedItem = portfolioItems.find(i => i.id === selectedId);
  const filtered = activeTab === "All" ? portfolioItems : portfolioItems.filter(i => i.category === activeTab);
  const displayedItems = showAll ? filtered : filtered.slice(0, 9);
  const hasMore = filtered.length > 9;
  const counts = TABS.reduce((a, t) => ({ ...a, [t]: t === "All" ? portfolioItems.length : portfolioItems.filter(i => i.category === t).length }), {} as Record<string, number>);

  return (
    <section id="portfolio" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Static grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(255,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,0,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Animated orbs — desktop non-Safari only, box-shadow */}
      {!reduceEffects && (
        <>
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 9, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 200px 100px rgba(255,0,0,0.05)", background: "transparent" }} />
          <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[250px] h-[250px] rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 180px 90px rgba(255,0,0,0.04)", background: "transparent" }} />
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

        {/* Stats - Redesigned Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-5xl mx-auto">
          {/* Row 1: Projects, Competitions, Workshops */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} 
            transition={{ delay: 0, type: "spring", stiffness: 200 }}
            className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.12] rounded-3xl relative overflow-hidden group hover:border-[#FF0000]/30 transition-all duration-500"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <span className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-[#FF0000] to-[#FF4444] bg-clip-text text-transparent relative z-10">7</span>
            <span className="text-white/50 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mt-2 relative z-10">Total Projects</span>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-5 right-5 w-1.5 h-1.5 bg-[#FF0000] rounded-full"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} 
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex flex-col justify-center items-center p-6 sm:p-8 bg-white/[0.04] border border-white/[0.08] rounded-3xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
          >
            <span className="text-5xl sm:text-6xl font-black text-[#FF0000]">4</span>
            <span className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-2">Competitions</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} 
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="flex flex-col justify-center items-center p-6 sm:p-8 bg-white/[0.04] border border-white/[0.08] rounded-3xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
          >
            <span className="text-5xl sm:text-6xl font-black text-[#FF0000]">2</span>
            <span className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-2">Workshops</span>
          </motion.div>

          {/* Row 2: Seminar and Case Studies - Spanning wider */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="sm:col-span-1 flex flex-col justify-center items-center p-6 sm:p-8 bg-white/[0.04] border border-white/[0.08] rounded-3xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
          >
            <span className="text-5xl sm:text-6xl font-black text-[#FF0000]">1</span>
            <span className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-2">Seminar</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} 
            transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
            className="sm:col-span-2 flex flex-col justify-center items-center p-6 sm:p-8 bg-white/[0.04] border border-white/[0.08] rounded-3xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
          >
            <span className="text-5xl sm:text-6xl font-black text-[#FF0000]">0</span>
            <span className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] mt-2">Case Studies</span>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="relative mb-8"
        >
          {/* Scroll fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none z-10" />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide scroll-smooth">
            <div className="flex items-center gap-1.5 text-white/25 text-xs mr-1 flex-shrink-0">
              <Filter size={11} /> Filter
            </div>
            {TABS.map(tab => {
              const active = activeTab === tab;
              const cfg = tab !== "All" ? categoryConfig[tab] : null;
              return (
                <motion.button key={tab} onClick={() => { setActiveTab(tab); setShowAll(false); }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${active ? `${cfg?.bg ?? "bg-white"} ${cfg?.text ?? "text-black"} border-transparent shadow-lg` : "bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:border-white/20"}`}>
                  {tab}
                  <span className={`ml-1.5 text-[10px] ${active ? "opacity-60" : "opacity-35"}`}>{counts[tab]}</span>
                </motion.button>
              );
            })}
          </div>
          
          {isMobile && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-1 mt-2 text-white/20 text-[10px]"
            >
              <span>←</span>
              <span>Swipe to see more</span>
              <span>→</span>
            </motion.div>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={reduceEffects ? {} : { perspective: "1000px" }}>
          {displayedItems.map((item, i) => (
            <PortfolioCard key={`${activeTab}-${item.id}`} item={item} index={i} onClick={() => setSelectedId(item.id)} />
          ))}
        </div>

        {/* See More Button */}
        {hasMore && !showAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,0,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="group relative px-8 py-3.5 bg-white/[0.04] border border-white/[0.12] text-white font-semibold rounded-full hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <motion.span
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
              <span className="relative z-10">See More Projects</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                ↓
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {/* Show Less Button */}
        {showAll && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              onClick={() => {
                setShowAll(false);
                // Scroll to portfolio section
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-white/[0.04] border border-white/[0.12] text-white/70 font-semibold rounded-full hover:border-white/[0.25] hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <span>Show Less</span>
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑
              </motion.span>
            </motion.button>
          </motion.div>
        )}
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
                  ].map(({ icon: Icon, label, text, highlight }) => (
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
