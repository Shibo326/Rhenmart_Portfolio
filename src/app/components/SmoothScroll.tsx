// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED SMOOTH SCROLL PROVIDER
// Optimized smooth scrolling with performance enhancements
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, ReactNode } from "react";

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Performance optimizations
    if (!isMobile) {
      // Enable GPU acceleration for smoother scrolling on desktop
      document.body.style.transform = "translateZ(0)";
      document.body.style.willChange = "scroll-position";
    }

    // Optimize scroll performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.transform = "";
      document.body.style.willChange = "";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <>{children}</>;
}
