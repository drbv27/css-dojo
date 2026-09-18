import { act, cleanup, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";

// Escena owns the real react-three-fiber <Canvas>; mocking the whole module
// keeps these tests WebGL-free while still exercising Landing3D's error
// boundary (Design Decision 2) and its "onOmitirEscena" escape wiring.
let escenaDebeFallar = false;
vi.mock("./Escena", () => ({
  default: function EscenaMock() {
    if (escenaDebeFallar) throw new Error("glb 404 (mocked)");
    return <div data-testid="escena-mock" />;
  },
}));

beforeAll(() => {
  // debeUsar3D() needs a truthy WebGL context and a desktop, motion-enabled
  // environment so Landing3D reaches modo === "3d" in these tests.
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockReturnValue({}) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false, // neither "prefers-reduced-motion: reduce" nor "max-width: 767px" matches
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  // jsdom has no IntersectionObserver; LandingEstatica's framer-motion
  // `whileInView` reveal needs a stub to mount past the escape path.
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
});

beforeEach(() => {
  escenaDebeFallar = false;
});

afterEach(() => {
  cleanup();
});

describe("Landing3D", () => {
  // Scenario: `/landing-preview` inherits automatically — same component,
  // no separate implementation.
  it("renders the redesigned loader over the 3D scene with no separate implementation", async () => {
    const { default: Landing3D } = await import("./Landing3D");
    render(<Landing3D hasSession={false} />);

    expect(screen.getByRole("status").textContent).toBe("Preparando el dojo…");
    expect(screen.getByTestId("escena-mock")).toBeTruthy();
  });

  // Scenario: Escape retires the 3D layer and hands the screen back to the
  // server-rendered static landing.
  //
  // Landing3D ya no renderiza la landing estatica: esa la sirve el servidor
  // desde app/page.tsx, fuera del boundary `ssr: false`, para que exista en el
  // HTML inicial. Lo que este componente controla es la marca
  // `data-landing3d`, que oculta la base mientras la capa 3D esta arriba.
  // Escapar tiene que retirar la capa Y la marca; si retirara solo la capa, la
  // pantalla quedaria en negro sobre una base escondida por CSS.
  it("retires the 3D layer and unhides the server landing when the user escapes", async () => {
    escenaDebeFallar = true;
    const { default: Landing3D } = await import("./Landing3D");
    const { container } = render(<Landing3D hasSession={false} />);

    const boton = await screen.findByRole("button", { name: /continuar sin la escena/i });
    expect(screen.queryByTestId("escena-mock")).toBeNull();
    expect(document.documentElement.dataset.landing3d).toBe("1");

    act(() => {
      boton.click();
    });

    expect(screen.queryByRole("status")).toBeNull();
    expect(container.innerHTML).toBe("");
    expect(document.documentElement.dataset.landing3d).toBeUndefined();
  });
});
