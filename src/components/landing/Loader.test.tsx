import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useProgress } from "@react-three/drei";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Loader from "./Loader";

function resetProgress() {
  useProgress.setState({
    active: false,
    progress: 0,
    errors: [],
    item: "",
    loaded: 0,
    total: 0,
  });
}

// Minimal matchMedia double shared by the reduced-motion scenarios. Returns an
// object with a manual `emit` so tests can simulate a mid-load OS flip via the
// same `change` listener Loader subscribes to (Design Decision 7).
//
// `matches` is a LIVE getter over a mutable value, not a frozen boolean. A real
// MediaQueryList updates `matches` before dispatching `change`, and Loader reads
// the current value through useSyncExternalStore's getSnapshot rather than
// trusting the event payload — so a frozen `matches` would make this double lie
// about the mid-flip case.
function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  let matches = initialMatches;

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
      listeners.delete(cb);
    },
  })) as unknown as typeof window.matchMedia;

  return {
    emit(nextMatches: boolean) {
      matches = nextMatches;
      for (const cb of listeners) cb({ matches: nextMatches } as MediaQueryListEvent);
    },
  };
}

describe("Loader — enso gate", () => {
  beforeEach(() => {
    resetProgress();
    mockMatchMedia(false);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Requirement: Determinate Progress Ring
  it("tracks real asset progress on the ring with no indeterminate spin", () => {
    useProgress.setState({ active: true, progress: 0 });
    render(<Loader onOmitirEscena={() => {}} />);

    const arco = screen.getByTestId("enso-arco");
    const before = Number(arco.getAttribute("stroke-dashoffset"));

    act(() => {
      useProgress.setState({ progress: 50 });
    });

    const after = Number(arco.getAttribute("stroke-dashoffset"));
    expect(after).toBeLessThan(before);
    expect(screen.queryByTestId("indeterminate-spin")).toBeNull();
  });

  // Requirement: Determinate Progress Ring — token audit
  it("uses only existing design tokens for color", () => {
    const source = readFileSync(resolve(__dirname, "./Loader.tsx"), "utf-8");
    const used = new Set([...source.matchAll(/--color-([a-z0-9-]+)/g)].map((m) => m[1]));
    const allowed = new Set([
      "neon-blue",
      "neon-purple",
      "editor-bg",
      "editor-border",
      "editor-muted",
      "neon-red",
    ]);

    expect(used.size).toBeGreaterThan(0);
    for (const token of used) {
      expect(allowed.has(token)).toBe(true);
    }
  });

  // Requirement: Accessible Status Announcements
  it("carries no accessible name on the decorative ring", () => {
    useProgress.setState({ active: true, progress: 10 });
    render(<Loader onOmitirEscena={() => {}} />);

    const svg = document.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.hasAttribute("aria-label")).toBe(false);
  });

  // Requirement: Accessible Status Announcements
  it("announces only coarse milestones, never every percent", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 0 });
    render(<Loader onOmitirEscena={() => {}} />);
    const live = screen.getByRole("status");

    act(() => {
      useProgress.setState({ progress: 10 });
    });
    expect(live.textContent).toBe("Preparando el dojo…");

    act(() => {
      useProgress.setState({ progress: 25 });
    });
    expect(live.textContent).toContain("25");

    act(() => {
      useProgress.setState({ progress: 40 });
    });
    expect(live.textContent).toContain("25"); // unchanged between milestones

    act(() => {
      useProgress.setState({ progress: 50 });
    });
    expect(live.textContent).toContain("50");

    act(() => {
      useProgress.setState({ progress: 100, active: false });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(live.textContent).toBe("Dojo listo.");
  });

  // Requirement: Stalled-Load Hint at 8 Seconds
  it("shows a non-blocking stall hint after 8s with no advance", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 30 });
    render(<Loader onOmitirEscena={() => {}} />);

    expect(screen.queryByTestId("hint-visible")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(8_000);
    });

    expect(screen.getByTestId("hint-visible")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /continuar sin la escena/i })).toBeNull();
  });

  // Requirement: Stalled-Load Hint at 8 Seconds
  it("clears the stall hint once progress resumes", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 30 });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(8_000);
    });
    expect(screen.getByTestId("hint-visible")).toBeTruthy();

    act(() => {
      useProgress.setState({ progress: 45 });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.queryByTestId("hint-visible")).toBeNull();
  });

  // Requirement: Failure Escape at 20 Seconds or on Load Error
  it("enters the error state after 20s with no advance", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 10 });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    expect(screen.getByTestId("error-visible")).toBeTruthy();
    expect(screen.getByRole("button", { name: /continuar sin la escena/i })).toBeTruthy();
  });

  // Requirement: Failure Escape at 20 Seconds or on Load Error
  it("enters the error state immediately when drei reports a load error, no wait", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 15, errors: ["/models/ninja/ninja.glb"] });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId("error-visible")).toBeTruthy();
    expect(screen.getByRole("button", { name: /continuar sin la escena/i })).toBeTruthy();
  });

  // Requirement: Failure Escape at 20 Seconds or on Load Error
  // Regression: found by real-browser QA against a genuinely 404ing .glb, which
  // the jsdom scenarios missed because they never asserted what the visible
  // caption does in the error phase. drei's progress can reach 100 even when an
  // asset failed, so the caption printed "Preparando el dojo… 100 %" directly
  // above "No pudimos cargar la escena 3D." The sr-only announcement was always
  // correct, so only sighted users saw the contradiction.
  it("hides the progress caption in the error state so it cannot contradict the failure", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 100, errors: ["/models/ninja/ninja.glb"] });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId("error-visible")).toBeTruthy();
    expect(screen.queryByTestId("caption-progreso")).toBeNull();
    expect(screen.queryByText(/Preparando el dojo… 100 %/)).toBeNull();
  });

  // Requirement: Determinate Progress Ring — the caption must still be there
  // while loading and through the completion beat; only the error phase hides it.
  it("keeps the progress caption visible while loading", () => {
    useProgress.setState({ active: true, progress: 42 });
    render(<Loader onOmitirEscena={() => {}} />);

    expect(screen.getByTestId("caption-progreso").textContent).toMatch(/42/);
  });

  // Requirement: Failure Escape at 20 Seconds or on Load Error
  it("calls onOmitirEscena when the escape action is activated, with no retry action", () => {
    vi.useFakeTimers();
    const onOmitir = vi.fn();
    useProgress.setState({ active: true, progress: 10 });
    render(<Loader onOmitirEscena={onOmitir} />);

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    expect(screen.queryByRole("button", { name: /reintentar/i })).toBeNull();
    const boton = screen.getByRole("button", { name: /continuar sin la escena/i });
    act(() => {
      boton.click();
    });
    expect(onOmitir).toHaveBeenCalledTimes(1);
  });

  // Requirement: Failure Escape — same escape button also honors escenaFallo
  it("also enters the error state when Landing3D reports escenaFallo", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 40 });
    render(<Loader escenaFallo onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId("error-visible")).toBeTruthy();
  });

  // Requirement: Reduced-Motion Compliance
  it("renders a static ring with no pulse when reduced motion is active at mount", () => {
    vi.useFakeTimers();
    mockMatchMedia(true);
    useProgress.setState({ active: true, progress: 20 });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.queryByTestId("enso-pulse")).toBeNull();
  });

  // Requirement: Reduced-Motion Compliance
  it("switches to the static presentation when reduced motion flips mid-load, without remounting", () => {
    const mq = mockMatchMedia(false);
    useProgress.setState({ active: true, progress: 33 });
    render(<Loader onOmitirEscena={() => {}} />);
    expect(screen.getByTestId("enso-pulse")).toBeTruthy();

    act(() => {
      mq.emit(true);
    });

    expect(screen.queryByTestId("enso-pulse")).toBeNull();
    // State survived the flip: no full remount reset the in-flight caption.
    expect(screen.getByText(/33 %/)).toBeTruthy();
  });

  // Requirement: Animated Exit on Completion
  // Framer-motion timing caveat (documented, per orchestrator classification):
  // fake timers do not deterministically drive AnimatePresence's own exit
  // animation in jsdom, so only the "does not vanish on the same render" and
  // "aria-busy flips once complete" halves of the scenario are asserted here.
  it("holds the completed ring for one beat instead of vanishing on the same render", () => {
    vi.useFakeTimers();
    useProgress.setState({ active: true, progress: 100 });
    render(<Loader onOmitirEscena={() => {}} />);

    act(() => {
      useProgress.setState({ active: false });
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    const live = screen.getByRole("status");
    expect(screen.getByText("Dojo listo.")).toBeTruthy();
    expect(live.getAttribute("aria-busy")).toBe("false");
  });
});
