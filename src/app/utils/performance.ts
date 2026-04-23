// ═══════════════════════════════════════════════════════════════════════════
// DEVICE CAPABILITY DETECTION — cross-platform: iOS / Android / macOS / Windows
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Detect browser / OS. Uses modern userAgentData where available,
 * falls back to UA string parsing. navigator.platform is deprecated
 * and unreliable on iPadOS 13+ so we avoid it.
 */
export const detectBrowser = () => {
  if (typeof window === "undefined") {
    return { isSafari: false, isIOS: false, isMacOS: false, isAndroid: false, isWindows: false };
  }

  const ua = navigator.userAgent;

  // ── iOS detection ──────────────────────────────────────────────────────
  // iPadOS 13+ reports as "Macintosh" in UA — use maxTouchPoints as the
  // reliable signal instead of the deprecated navigator.platform.
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  // ── Android detection ──────────────────────────────────────────────────
  const isAndroid = /Android/.test(ua);

  // ── macOS detection ────────────────────────────────────────────────────
  // Must exclude iOS (iPadOS masquerades as macOS in UA)
  const isMacOS = /Macintosh/.test(ua) && !isIOS;

  // ── Windows detection ──────────────────────────────────────────────────
  const isWindows = /Windows/.test(ua);

  // ── Safari detection ───────────────────────────────────────────────────
  // Matches Safari but not Chrome/Edge/Android (all include "Safari" in UA).
  // This correctly identifies: Safari on macOS, Safari on iOS, WKWebView.
  // It correctly excludes: Chrome, Edge, Firefox, Samsung Browser, Android WebView.
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);

  return { isSafari, isIOS, isMacOS, isAndroid, isWindows };
};

/**
 * Detect device tier for animation budget decisions.
 *
 * Tier matrix:
 * ┌─────────────────────────────────────────────┬──────┐
 * │ Condition                                   │ Tier │
 * ├─────────────────────────────────────────────┼──────┤
 * │ prefers-reduced-motion                      │ low  │
 * │ iOS (any)                                   │ low  │
 * │ Android mobile, cores < 6                   │ low  │
 * │ Android mobile, cores ≥ 6                   │ mid  │
 * │ Android tablet (≥768px), cores < 6          │ mid  │
 * │ Android tablet (≥768px), cores ≥ 6          │ high │
 * │ macOS Safari, cores < 4                     │ low  │
 * │ macOS Safari, cores ≥ 4                     │ mid  │
 * │ Windows/macOS Chrome/Edge/Firefox, cores<4  │ mid  │
 * │ Windows/macOS Chrome/Edge/Firefox, cores≥4  │ high │
 * └─────────────────────────────────────────────┴──────┘
 */
export const detectDeviceCapability = () => {
  if (typeof window === "undefined") {
    return {
      tier: "low" as const,
      isMobile: false,
      isTablet: false,
      isLowEnd: false,
      prefersReducedMotion: false,
      isSafari: false,
      isIOS: false,
      isMacOS: false,
      isAndroid: false,
      isWindows: false,
      cores: 2,
    };
  }

  const vw = window.innerWidth;
  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1024;
  const cores = navigator.hardwareConcurrency || 2;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { isSafari, isIOS, isMacOS, isAndroid, isWindows } = detectBrowser();

  let tier: "low" | "mid" | "high" = "mid";

  if (prefersReducedMotion) {
    tier = "low";
  } else if (isIOS) {
    // iOS: always low — WebKit compositor limits, no WebGL guarantee
    tier = "low";
  } else if (isAndroid && isMobile) {
    // Android phone: gate on cores — many mid-range phones report 8 cores
    // but are still slow (efficiency cores). Use 6 as the threshold.
    tier = cores >= 6 ? "mid" : "low";
  } else if (isAndroid && (isTablet || !isMobile)) {
    // Android tablet / large screen
    tier = cores >= 6 ? "high" : "mid";
  } else if (isSafari) {
    // macOS Safari: backdrop-filter and 3D transforms are expensive
    tier = cores >= 4 ? "mid" : "low";
  } else {
    // Windows / macOS Chrome / Edge / Firefox
    tier = cores >= 4 ? "high" : "mid";
  }

  return {
    tier,
    isMobile,
    isTablet,
    isLowEnd: tier === "low",
    prefersReducedMotion,
    isSafari,
    isIOS,
    isMacOS,
    isAndroid,
    isWindows,
    cores,
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T => {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
};
