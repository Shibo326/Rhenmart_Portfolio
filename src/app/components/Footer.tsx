import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "lucide-react";

const links = ["HOME", "SERVICES", "ABOUT", "SKILLS", "PORTFOLIO", "CONTACT"];
const socials = [
  { Icon: GithubIcon,    href: "https://github.com/Shibo326",                              label: "GitHub" },
  { Icon: LinkedinIcon,  href: "https://www.linkedin.com/in/rhenmart-delacruz-117858312/", label: "LinkedIn" },
  { Icon: InstagramIcon, href: "https://www.instagram.com/_rhenmart_/",                    label: "Instagram" },
  { Icon: FacebookIcon,  href: "https://www.facebook.com/rhenmart1234",                    label: "Facebook" },
];

const TICKER = [
  "PRODUCT_DESIGNER", "UI/UX_DESIGNER", "AI_ASSISTED", "RESEARCH_FIRST",
  "DEV_READY", "FIGMA_NATIVE", "HUMAN_CENTERED", "PHILIPPINES_BASED",
];

export function Footer() {
  const go = (id: string) => {
    const lower = id.toLowerCase();
    if (lower === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(lower)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#030303] border-t border-[rgba(255,0,0,0.20)] animate-flicker overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Marquee ticker */}
      <div className="border-b border-[rgba(255,255,255,0.08)] overflow-hidden py-2 relative bg-[#050505]">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050505, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050505, transparent)" }} />

        <div className="flex w-max" style={{ animation: "smoothMarquee 25s linear infinite" }}>
          {[0, 1, 2, 3].map((_, i) => (
            <span key={i} className="flex items-center font-mono text-[10px] tracking-widest text-[rgba(255,255,255,0.55)]">
              {TICKER.map((t) => (
                <span key={t} className="mx-8 flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[#FF0000] text-[8px]">◆</span>
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative">
        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono font-bold text-2xl">
              <span className="text-white">RHEN_</span>
              <span className="w-2.5 h-2.5 bg-[#FF0000] rounded-full animate-pulse-red" />
            </div>
            <span className="inline-block border-2 border-[rgba(255,0,0,0.30)] text-white font-mono text-[10px] tracking-widest px-3 py-1.5 animate-border-pulse">
              DESIGNER_READY
            </span>
            <p className="text-sm text-[rgba(255,255,255,0.55)] max-w-xs">
              Crafting digital experiences with research, design, and intention.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
            {links.map((l) => (
              <button
                key={l}
                onClick={() => go(l)}
                className="kinetic-link font-mono text-[11px] tracking-widest text-[rgba(255,255,255,0.55)] hover:text-[#FF0000] transition-colors"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Socials */}
          <div className="flex md:justify-end gap-2">
            {socials.map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative w-10 h-10 flex items-center justify-center bg-[#080808] border border-[rgba(255,255,255,0.08)] hover:border-[#FF0000] hover:text-[#FF0000] text-[rgba(255,255,255,0.55)] transition-all hover:-translate-y-1 hover:red-glow overflow-hidden"
              >
                <Icon size={16} className="relative z-10" />
                <span className="absolute inset-0 bg-[rgba(255,0,0,0.10)] scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.08)] text-center font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest break-all">
          // © 2025 RHENMART_DELACRUZ | UX/UI_DESIGNER | PRODUCT_DESIGNER | ALL_RIGHTS_RESERVED
        </div>
      </div>
    </footer>
  );
}
