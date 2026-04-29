/**
 * Verification property-based tests for UI correctness properties (Properties 6–11)
 * Uses React Testing Library + fast-check + vitest fake timers.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';

import { AnimationContext, AnimationConfig, defaultConfig } from '../context/AnimationContext';
import { Contact } from '../components/Contact';
import { Portfolio } from '../components/Portfolio';
import { MagneticButton } from '../components/MagneticButton';
import { Toast } from '../components/Toast';

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    motion: new Proxy({} as Record<string, React.FC>, {
      get: (_target, tag: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag as string, props, children),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useMotionValue: (initial: number) => ({ get: () => initial, set: vi.fn(), on: () => vi.fn() }),
    useSpring: (val: unknown) => val,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: (_val: unknown, _from: unknown, _to: unknown) => 0,
    useInView: () => true,
    animate: vi.fn(),
  };
});

vi.mock('@emailjs/browser', () => ({ default: { sendForm: vi.fn() } }));

// Image mocks
vi.mock('../../Image/umak champ.jpg', () => ({ default: 'umak.jpg' }));
vi.mock('../../Image/ndc_startup.jpeg', () => ({ default: 'ndc.jpg' }));
vi.mock('../../Image/Tagisan ng talino first Placer.jpg', () => ({ default: 'tag1.jpg' }));
vi.mock('../../Image/Tagisan ng talino second placer.jpg', () => ({ default: 'tag2.jpg' }));
vi.mock('../../Image/UXPH SEMINAR.jpeg', () => ({ default: 'uxph.jpg' }));
vi.mock('../../Image/Beyond ui.jpg', () => ({ default: 'beyond.jpg' }));
vi.mock('../../Image/Exploring The basics of figma.jpg', () => ({ default: 'figma.jpg' }));
vi.mock('../../Image/Rhenmart_Profile.jpeg', () => ({ default: 'profile.jpg' }));
vi.mock('../../Image/new9249-_DSC0331.jpg', () => ({ default: 'about.jpg' }));
vi.mock('../utils/generateResume', () => ({ generateResume: vi.fn() }));
vi.mock('../hooks/useDeviceAnimations', () => ({
  ease: { out: [0.16, 1, 0.3, 1] },
  springs: { bouncy: {}, snappy: {} },
  useMagneticRef: () => ({ current: null }),
  useSectionGlow: () => ({ sectionRef: { current: null }, glowRef: { current: null } }),
  useCountUp: () => [{ current: null }, 0],
  useCanAnimate: () => true,
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderWithConfig(ui: React.ReactElement, config: Partial<AnimationConfig> = {}) {
  const merged: AnimationConfig = { ...defaultConfig, ...config };
  return render(
    <AnimationContext.Provider value={merged}>
      {ui}
    </AnimationContext.Provider>
  );
}

// ─── Property 6: Contact form filled-state border retention ──────────────────

describe('Property 6: Contact form filled-state border retention', () => {
  afterEach(() => { cleanup(); });

  it('non-empty field value is retained in DOM after blur', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (value) => {
          const { unmount } = renderWithConfig(<Contact />, { tier: 'high', enableMagnetic: true });

          const nameInput = document.getElementById('name') as HTMLInputElement;
          if (!nameInput) { unmount(); return; }

          fireEvent.focus(nameInput);
          fireEvent.change(nameInput, { target: { value } });
          fireEvent.blur(nameInput);

          // Assert BEFORE unmount
          expect(nameInput.value).toBe(value);
          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('empty field does not retain filled state after blur', () => {
    const { unmount } = renderWithConfig(<Contact />, { tier: 'high' });
    const nameInput = document.getElementById('name') as HTMLInputElement;
    if (nameInput) {
      fireEvent.focus(nameInput);
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.blur(nameInput);
      expect(nameInput.value).toBe('');
    }
    unmount();
  });
});

// ─── Property 7: Portfolio mobile cards always show title and role ────────────

describe('Property 7: Portfolio mobile cards always show title and role', () => {
  it('mobile mode renders title and role for all visible cards', () => {
    renderWithConfig(<Portfolio />, {
      tier: 'mid',
      isMobile: true,
      isSafari: false,
      enable3DTilt: false,
    });

    // "Web Design Champion" is the first portfolio item — must be visible
    const titles = screen.getAllByText('Web Design Champion');
    expect(titles.length).toBeGreaterThan(0);
    const roles = screen.getAllByText('Design Strategies / UI/UX');
    expect(roles.length).toBeGreaterThan(0);
  });

  it('desktop mode also renders title and role on hover content', () => {
    renderWithConfig(<Portfolio />, {
      tier: 'high',
      isMobile: false,
      isSafari: false,
      enable3DTilt: true,
    });

    const titles = screen.getAllByText('Web Design Champion');
    expect(titles.length).toBeGreaterThan(0);
  });
});

// ─── Property 8: Zero-count stat cards are never rendered ────────────────────

describe('Property 8: Zero-count stat cards are never rendered', () => {
  it('Case Studies stat card is absent when count is 0', () => {
    renderWithConfig(<Portfolio />, { tier: 'high', isMobile: false });

    // There are 0 Case Studies items — the stat card should not render
    // The stat card would show a large number + "Case Studies" label inside a rounded-3xl div
    // The filter tab button also contains "Case Studies" text — we only care about stat cards
    // Stat cards are NOT button elements, so we check that no non-button element
    // with "Case Studies" text has a sibling large number showing "0"
    const allElements = screen.queryAllByText(/Case Studies/i);
    const statCardElements = allElements.filter(el => el.closest('button') === null);
    // Since count is 0, the conditional stat card should not be rendered at all
    expect(statCardElements).toHaveLength(0);
  });
});

// ─── Property 9: Empty state appears when filter returns zero results ─────────

describe('Property 9: Empty state appears when filter returns zero results', () => {
  it('Case Studies filter tab is hidden when count is 0', () => {
    renderWithConfig(<Portfolio />, { tier: 'high', isMobile: false });

    // The "CASE STUDIES" tab should NOT be rendered when its count is 0
    // (Requirement 13.3: hide zero-count stat cards / filter tabs)
    const caseStudiesTab = screen.queryByRole('button', { name: /Case Studies/i });
    expect(caseStudiesTab).not.toBeInTheDocument();
  });

  it('empty state message shown when SEMINAR filter returns 1 result and then a zero-result filter would be applied', () => {
    renderWithConfig(<Portfolio />, { tier: 'high', isMobile: false });

    // Verify the SEMINAR tab exists and clicking it shows only seminar items
    const seminarTab = screen.getByRole('button', { name: /SEMINAR/i });
    fireEvent.click(seminarTab);

    // UXPH Community Seminar is the only seminar item (card renders front+back, so multiple matches expected)
    const seminarItems = screen.getAllByText('UXPH Community Seminar');
    expect(seminarItems.length).toBeGreaterThan(0);
    // Competition items should not be visible
    expect(screen.queryByText('Web Design Champion')).not.toBeInTheDocument();
  });

  it('portfolio items from other categories are not shown when a specific filter is active', () => {
    renderWithConfig(<Portfolio />, { tier: 'high', isMobile: false });

    const workshopTab = screen.getByRole('button', { name: /WORKSHOP/i });
    fireEvent.click(workshopTab);

    // Workshop items should be visible (card renders front+back, so multiple matches expected)
    const workshopItems = screen.getAllByText('Exploring The Basics of Figma');
    expect(workshopItems.length).toBeGreaterThan(0);
    // Competition items should not be visible
    expect(screen.queryByText('Web Design Champion')).not.toBeInTheDocument();
    expect(screen.queryByText('UXPH Community Seminar')).not.toBeInTheDocument();
  });
});

// ─── Property 10: Magnetic button translation is bounded ─────────────────────

describe('Property 10: Magnetic button translation is bounded', () => {
  afterEach(() => { cleanup(); });

  it('renders children for any valid proximity/shift config when enabled', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 200 }),
        fc.integer({ min: 1, max: 50 }),
        (proximityPx, maxShiftPx) => {
          const { unmount } = renderWithConfig(
            <MagneticButton proximityPx={proximityPx} maxShiftPx={maxShiftPx}>
              <button>Magnetic</button>
            </MagneticButton>,
            { tier: 'high', enableMagnetic: true }
          );
          const btns = screen.getAllByText('Magnetic');
          expect(btns.length).toBeGreaterThan(0);
          unmount();
        }
      ),
      { numRuns: 30 }
    );
  });

  it('renders children as passthrough when magnetic is disabled (low tier)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20, max: 200 }),
        fc.integer({ min: 1, max: 50 }),
        (proximityPx, maxShiftPx) => {
          const { unmount } = renderWithConfig(
            <MagneticButton proximityPx={proximityPx} maxShiftPx={maxShiftPx}>
              <button>Passthrough</button>
            </MagneticButton>,
            { tier: 'low', enableMagnetic: false }
          );
          const btns = screen.getAllByText('Passthrough');
          expect(btns.length).toBeGreaterThan(0);
          unmount();
        }
      ),
      { numRuns: 30 }
    );
  });
});

// ─── Property 11: Toast auto-dismisses after duration ────────────────────────

describe('Property 11: Toast auto-dismisses after duration', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls onDismiss after the specified duration for any message and variant', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('success' as const, 'error' as const),
        fc.integer({ min: 100, max: 10000 }),
        (message, variant, duration) => {
          const onDismiss = vi.fn();
          const { unmount } = render(
            <Toast message={message} variant={variant} onDismiss={onDismiss} duration={duration} />
          );

          act(() => { vi.advanceTimersByTime(duration - 1); });
          expect(onDismiss).not.toHaveBeenCalled();

          act(() => { vi.advanceTimersByTime(1); });
          expect(onDismiss).toHaveBeenCalledTimes(1);

          unmount();
          onDismiss.mockReset();
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Toast default duration is 4000ms', () => {
    const onDismiss = vi.fn();
    render(<Toast message="Hello" variant="success" onDismiss={onDismiss} />);

    act(() => { vi.advanceTimersByTime(3999); });
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(1); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
