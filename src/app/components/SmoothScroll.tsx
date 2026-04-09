import { useEffect, ReactNode } from "react";

// Lightweight smooth scroll — no heavy parallax hooks
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);
  return <>{children}</>;
}
