import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { SectionBadge, RedDivider, HudCorners } from "./Hud";
import { useCountUp, useSectionGlow } from "../hooks/useDeviceAnimations";

// Images
import champImg       from "../../Image/umak champ.jpg";
import ndcImg         from "../../Image/ndc_startup.jpeg";
import tagisan1       from "../../Image/Tagisan ng talino first Placer.jpg";
import tagisan2       from "../../Image/Tagisan ng talino second placer.jpg";
import uxphImg        from "../../Image/UXPH SEMINAR.jpeg";
import beyondUiImg    from "../../Image/Beyond ui.jpg";
import exploringFigmaImg from "../../Image/Exploring The basics of figma.jpg";
import collaboratechImg  from "../../Image/Collaboratech2026AndroidhACK.jpg";

type Category = "COMPETITION" | "WORKSHOP" | "SEMINAR";

type Project = {
  title: string;
  category: Category;
  role: string;
  image: string;
  challenge: string;
  solution: string;
  impact: string;
};

const PROJECTS: Project[] = [
  {
    title: "Web Design Champion", category: "COMPETITION", role: "Design Strategies / UI/UX", image: champImg,
    challenge: "Build a one-page website in 2 hours. Fast decisions. Strong UX. Tight deadline.",
    solution: "Created a clear design plan using available components. Aligned closely with dev to reduce pressure. Delivered a structured, efficient layout on time.",
    impact: "1st Place — UMAK IT Skills Olympics. Commended for intuitive flow and clean execution. Proved speed and quality can coexist.",
  },
  {
    title: "NDC's Breaking Enigma 2025", category: "COMPETITION", role: "Product Designer", image: ndcImg,
    challenge: "Build a concept-to-prototype in 4 days. Address a real community problem. Work under Technology Track pressure.",
    solution: "Conceptualized SafePath — an offline GPS SOS app. Users ping location to authorities without internet. Divided tasks strategically for rapid delivery.",
    impact: "Gained invaluable experience and industry connections. Received guidance from professionals throughout. Strengthened teamwork, skills, and design thinking.",
  },
  {
    title: "Tagisan ng Talino — 1st Place", category: "COMPETITION", role: "UI/UX Designer", image: tagisan1,
    challenge: "Compete in a fast-paced academic design challenge. Test UX knowledge under time pressure. Outperform peers with accuracy and speed.",
    solution: "Applied strong UX principles and design theory. Leveraged prior competition experience to stay focused. Answered challenges efficiently and confidently.",
    impact: "Achieved 1st Place in the competition. Demonstrated mastery of UI/UX best practices. Built a strong competitive track record.",
  },
  {
    title: "Tagisan ng Talino — 2nd Place", category: "COMPETITION", role: "UI/UX Designer", image: tagisan2,
    challenge: "Multi-round design competition with high stakes. Requires both theory and practical UX application. Collaborate and perform under pressure.",
    solution: "Prioritized accuracy and speed each round. Collaborated with teammates to cover all areas. Maintained consistency across every challenge.",
    impact: "Secured 2nd Place overall. Reinforced consistent performance across competitions. Proven ability to compete at an academic level.",
  },
  {
    title: "Collaboratech 2026 — Android Hackathon", category: "COMPETITION", role: "Product Designer & UI Strategist", image: collaboratechImg,
    challenge: "Build a fully working Android application in just 6 hours. Solve a real-world problem based on a given niche. Deliver a complete, functional product under extreme time pressure.",
    solution: "Used pen-and-paper rapid prototyping to map user flows and system structure — eliminating design bottlenecks before touching any tool. Aligned every design decision to the team's technical skill set, reducing back-end complexity and accelerating development. Acted as the bridge between design intent and engineering execution, ensuring zero miscommunication during the sprint.",
    impact: "2nd Place — Collaboratech 2026 Android Hackathon. Built and shipped 'ShopLift' — an online high-discount store app — within the 6-hour window. Demonstrated that strategic design thinking and team alignment can outperform raw technical speed.",
  },
  {
    title: "UXPH Community Seminar", category: "SEMINAR", role: "Attendee / UX Learner", image: uxphImg,
    challenge: "Stay current with the evolving PH UX landscape. Connect with industry professionals and designers. Absorb real-world insights beyond the classroom.",
    solution: "Attended talks, workshops, and networking sessions. Gained insights on design systems and research methods. Engaged with UXPH — a leading PH design community.",
    impact: "Expanded professional network significantly. Deepened understanding of human-centered design. Gained real-world industry knowledge and perspective.",
  },
  {
    title: "Exploring The Basics of Figma", category: "WORKSHOP", role: "Workshop Teacher / UI/UX Facilitator", image: exploringFigmaImg,
    challenge: "Teach Figma to complete beginners from scratch. Cover components, frames, and basic prototyping. Keep the session engaging and hands-on.",
    solution: "Led a live demo of Figma's core tools step-by-step. Walked students through building a real UI screen. Facilitated a group activity to apply the learning.",
    impact: "Students built their first Figma prototype. Confidence and interest in UI/UX visibly increased. Sparked career curiosity in design among participants.",
  },
  {
    title: "Beyond UI: Designing User Experiences", category: "WORKSHOP", role: "Workshop Teacher / UI/UX Facilitator", image: beyondUiImg,
    challenge: "Shift students' mindset beyond visual design. Teach UX thinking, flows, and interaction design. Make abstract concepts tangible and applicable.",
    solution: "Covered user research, wireframing, and prototyping. Used live Figma demos and guided exercises. Structured content around real-world UX principles.",
    impact: "Students gained a solid UX foundation. Several expressed interest in pursuing design careers. Inspired a new generation of user-centered thinkers.",
  },
];

const FILTERS = ["ALL", "COMPETITION", "WORKSHOP", "SEMINAR", "CASE STUDIES"] as const;
type Filter = typeof FILTERS[number];

const STAT_CARDS = [
  { code: "TOTAL", value: 8, label: "TOTAL_PROJECTS", big: true },
  { code: "COMP",  value: 5, label: "COMPETITIONS" },
  { code: "WKSP",  value: 2, label: "WORKSHOPS" },
  { code: "SEM",   value: 1, label: "SEMINAR" },
];

// ── Stat card ─────────────────────────────────────────────────────────────
const StatCard = memo(function StatCard({ s, i }: { s: typeof STAT_CARDS[0]; i: number }) {
  const [ref, v] = useCountUp(s.value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="group relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.40)] p-5 transition-colors overflow-hidden"
    >
      <HudCorners />
      <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="font-mono text-[10px] text-[#FF0000] tracking-widest">[{s.code}]</div>
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`font-black text-white mt-2 tabular-nums group-hover:text-[#FF0000] transition-colors ${s.big ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"}`}
      >
        {v}
      </div>
      <div className="font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest mt-1">{s.label}</div>
    </motion.div>
  );
});
StatCard.displayName = "StatCard";

// ── Project card (flip) ───────────────────────────────────────────────────
const ProjectCard = memo(function ProjectCard({
  p,
  i,
  onOpen,
}: {
  p: Project;
  i: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="group relative aspect-[4/5] preserve-3d cursor-pointer card-flip-wrapper"
    >
      <span className="hud-orbit pointer-events-none" aria-hidden />
      <div className="card-flip-inner relative w-full h-full hud-card">

        {/* FRONT */}
        <div className="card-face bg-[#030303] border border-[rgba(255,255,255,0.08)] group-hover:border-[#FF0000] transition-colors overflow-hidden depth-shadow cut-corner">
          <HudCorners />
          <span className="status-badge-hover status-complete absolute top-2 left-1/2 -translate-x-1/2 z-20">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            CASE_READY
          </span>

          <div className="relative w-full h-full overflow-hidden">
            <img
              src={p.image}
              alt={p.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[rgba(3,3,3,0.40)] to-transparent" />

            {/* Shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div className="absolute -inset-y-2 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 group-hover:animate-shimmer" />
            </div>

            {/* Glow pulse */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hud-glow-target" />

            {/* Scanlines */}
            <div className="absolute inset-0 scanlines opacity-20 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />

            {/* Scan beam */}
            <div className="absolute left-0 right-0 h-12 bg-gradient-to-b from-[rgba(255,0,0,0.40)] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none" />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="font-mono text-[9px] tracking-widest px-2 py-1 bg-[#FF0000] text-white">
                {p.category}
              </span>
            </div>

            {/* Index */}
            <div className="absolute top-3 right-3 z-10 font-mono text-[9px] text-white/80 bg-[rgba(3,3,3,0.80)] px-2 py-1 border border-[rgba(255,0,0,0.20)]">
              #{String(i + 1).padStart(2, "0")}
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 z-10">
              <h4 className="font-black text-lg tracking-tight group-hover:text-[#FF0000] transition-colors duration-300">
                {p.title}
              </h4>
              <p className="font-mono text-[10px] text-[rgba(255,255,255,0.55)] tracking-wider">{p.role}</p>
            </div>

            <div className="absolute bottom-3 right-3 z-10 font-mono text-[9px] text-[#FF0000] tracking-widest opacity-60 animate-pulse">
              <span className="hidden sm:inline">[ HOVER_TO_FLIP ]</span>
              <span className="sm:hidden">[ TAP_TO_VIEW ]</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="card-face card-back bg-gradient-to-br from-[#030303] to-[#050505] border border-[#FF0000] overflow-hidden depth-shadow cut-corner">
          <HudCorners />
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
          <div className="absolute inset-0 holo opacity-50 pointer-events-none" />

          <div className="relative w-full h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] tracking-widest px-2 py-1 bg-[#FF0000] text-white">
                  {p.category}
                </span>
                <span className="font-mono text-[9px] text-[#FF0000]">
                  // CASE_{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h4 className="font-black text-lg tracking-tight mb-3">{p.title}</h4>
              <div className="border-l-2 border-[#FF0000] pl-3 space-y-2">
                <div>
                  <div className="font-mono text-[9px] text-[#FF0000] tracking-widest">// CHALLENGE</div>
                  <p className="text-[11px] text-[rgba(255,255,255,0.70)] leading-snug line-clamp-3">{p.challenge}</p>
                </div>
                <div>
                  <div className="font-mono text-[9px] text-[#FF0000] tracking-widest">// IMPACT</div>
                  <p className="text-[11px] text-[rgba(255,255,255,0.70)] leading-snug line-clamp-2">{p.impact}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)]">
              <span className="font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest">{p.role}</span>
              <span className="font-mono text-[10px] text-[#FF0000] tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                OPEN_CASE →
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

// ── Portfolio ─────────────────────────────────────────────────────────────
export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selected, setSelected] = useState<Project | null>(null);
  const { sectionRef, glowRef } = useSectionGlow<HTMLElement>();

  const handleFilter = (f: Filter) => {
    setFilter(f);
  };

  const counts: Record<string, number> = {
    ALL: PROJECTS.length,
    COMPETITION: PROJECTS.filter((p) => p.category === "COMPETITION").length,
    WORKSHOP:    PROJECTS.filter((p) => p.category === "WORKSHOP").length,
    SEMINAR:     PROJECTS.filter((p) => p.category === "SEMINAR").length,
    "CASE STUDIES": 0,
  };

  const items =
    filter === "ALL"
      ? PROJECTS
      : filter === "CASE STUDIES"
      ? []
      : PROJECTS.filter((p) => p.category === filter);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    if (selected) window.dispatchEvent(new Event("portfolio-modal-open"));
    else window.dispatchEvent(new Event("portfolio-modal-close"));
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section ref={sectionRef} id="portfolio" className="relative py-32 bg-[#080808] overflow-hidden min-h-screen">
        <div ref={glowRef} className="section-glow" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 holo opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative space-y-12">

          {/* Header */}
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 space-y-4"
            >
              <SectionBadge name="PORTFOLIO.EXE" comment="MY_WORK" />
              <h2
                className="font-black tracking-tighter leading-[0.85]"
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
              >
                <span className="text-gradient-white">PORTFOLIO</span>
                <span className="block text-stroke">GALLERY</span>
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
              className="md:col-span-4 space-y-2"
            >
              <div className="font-mono text-[10px] text-[#FF0000] tracking-widest">▸ ARCHIVE_INDEX</div>
              <p className="text-sm text-[rgba(255,255,255,0.55)] leading-relaxed">
                Selected work across competitions, workshops, and seminars. Click any card to flip and inspect.
              </p>
            </motion.div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAT_CARDS.map((s, i) => (
              <StatCard key={s.code} s={s} i={i} />
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] text-[rgba(255,255,255,0.55)] tracking-widest">FILTER_BY:</span>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.filter((f) => f !== "CASE STUDIES" || counts["CASE STUDIES"] > 0).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`relative font-mono text-[10px] tracking-widest px-4 py-2.5 border transition-all overflow-hidden group cut-corner ${
                    filter === f
                      ? "bg-[#FF0000] text-white border-[#FF0000] red-glow"
                      : "bg-[#030303] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.55)] hover:border-[#FF0000] hover:text-white hover:scale-105"
                  }`}
                >
                  <span className="absolute inset-0 bg-[rgba(255,0,0,0.20)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="relative">
                    {f} ({counts[f]})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="perspective-1500 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start content-start">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <ProjectCard key={p.title} p={p} i={i} onOpen={() => setSelected(p)} />
              ))}
            </AnimatePresence>
          </div>

          {items.length === 0 && (
            <div className="text-center py-16 font-mono text-[rgba(255,255,255,0.55)]">
              // No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Modal via portal */}
      {createPortal(
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4 overflow-y-auto"
              style={{ background: "rgba(0,0,0,0.92)" }}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#030303] border border-[rgba(255,0,0,0.20)] my-10"
              >
                <HudCorners />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[#080808] border border-[rgba(255,255,255,0.08)] hover:border-[#FF0000] hover:text-[#FF0000] transition-all"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-[10px] tracking-widest px-2 py-1 bg-[#FF0000] text-white">
                      {selected.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-5">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">{selected.title}</h3>
                    <p className="font-mono text-xs text-[rgba(255,255,255,0.55)] tracking-wider mt-1">
                      // {selected.role}
                    </p>
                  </div>

                  {[
                    { label: "CHALLENGE", text: selected.challenge },
                    { label: "SOLUTION",  text: selected.solution },
                    { label: "IMPACT",    text: selected.impact },
                  ].map((s) => (
                    <div key={s.label} className="border-l-2 border-[#FF0000] pl-4">
                      <div className="font-mono text-[10px] text-[#FF0000] tracking-widest mb-1">
                        // {s.label}
                      </div>
                      <p className="text-sm text-[rgba(255,255,255,0.80)] leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
