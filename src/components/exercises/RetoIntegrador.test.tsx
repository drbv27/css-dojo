import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RetoIntegrador from "./RetoIntegrador";
import type { Exercise } from "@/types";

/**
 * La llave de la solucion de referencia, y los pasos numerados.
 *
 * Editor y preview se apoyan en Monaco y en un iframe, que no aportan nada en
 * jsdom, asi que van mockeados. Lo que este archivo guarda es la REGLA: quien
 * no completo el reto no ve la solucion, y quien lo completo si.
 */

vi.mock("@/components/editor/CSSEditor", () => ({
  default: ({ value, language, readOnly }: { value: string; language?: string; readOnly?: boolean }) => (
    <textarea readOnly data-testid={`editor-${language ?? "css"}`} data-readonly={String(!!readOnly)} value={value} />
  ),
}));
vi.mock("@/components/editor/LivePreview", () => ({
  default: () => <div data-testid="preview" />,
}));

// Sin esto los renders se acumulan entre tests y `getByText` encuentra dos.
afterEach(cleanup);

const SOLUCION = ".tarjeta { box-sizing: border-box; width: 300px; }";

const reto: Exercise = {
  id: "reto-demo",
  type: "live-editor",
  difficulty: 3,
  xpReward: 60,
  order: 9,
  prompt: "Arma la tarjeta",
  retoPasos: [
    { instruccion: "Primero, usa border-box", esperado: ".tarjeta { box-sizing: border-box; }" },
    { instruccion: "Segundo, dale 300px de ancho", esperado: ".tarjeta { width: 300px; }" },
  ],
  codeTemplate: { html: "<div class='tarjeta'></div>", cssPrefix: "", cssSuffix: "", blanks: [] },
  validation: { type: "css-rules" },
  referenceSolution: SOLUCION,
};

describe("RetoIntegrador: la llave de la solucion", () => {
  it("A.10 — sin haberlo completado, la solucion NO esta en la pagina", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} yaCompletado={false} />);

    // Ni el contenido ni el control que lo revelaria.
    expect(screen.queryByText(SOLUCION)).toBeNull();
    expect(screen.queryByText(/solucion de referencia/i)).toBeNull();
  });

  it("A.10 — habiendolo completado, la solucion esta disponible", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} yaCompletado={true} />);

    expect(screen.getByText(/ver la solucion de referencia/i)).toBeTruthy();
  });

  it("marcar el ejercicio como enviado NO abre la solucion", () => {
    // Enviar no es completar. Diez intentos fallidos siguen sin abrirla.
    render(
      <RetoIntegrador exercise={reto} onSubmit={() => {}} submitted={true} yaCompletado={false} />,
    );

    expect(screen.queryByText(/solucion de referencia/i)).toBeNull();
  });
});

describe("RetoIntegrador: los pasos", () => {
  it("muestra todas las instrucciones ANTES de intentar nada", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);

    expect(screen.getByText("Primero, usa border-box")).toBeTruthy();
    expect(screen.getByText("Segundo, dale 300px de ancho")).toBeTruthy();
  });

  it("arranca en 0 de 2 con el editor vacio", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);
    expect(screen.getByText("0 de 2")).toBeTruthy();
  });

  it("un reto sin pasos no rompe: no es un reto", () => {
    // `esRetoIntegrador` lo filtra antes, pero el componente no puede confiar
    // en que alguien mas lo haya hecho.
    const sinPasos = { ...reto, retoPasos: undefined };
    render(<RetoIntegrador exercise={sinPasos} onSubmit={() => {}} />);
    expect(screen.getByText("0 de 0")).toBeTruthy();
  });
});

describe("RetoIntegrador: la pestaña de HTML", () => {
  it("arranca mostrando la vista previa, no el HTML", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);

    expect(screen.getByTestId("preview")).toBeTruthy();
    expect(screen.queryByTestId("editor-html")).toBeNull();
  });

  it("al elegir HTML se ve el marcado y se esconde el preview", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole("tab", { name: /html/i }));

    const visor = screen.getByTestId("editor-html");
    expect((visor as HTMLTextAreaElement).value).toContain("class='tarjeta'");
    expect(screen.queryByTestId("preview")).toBeNull();
  });

  it("el HTML es de SOLO LECTURA", () => {
    // Poder editarlo convertiria "aplicale esto a .tarjeta" en "renombra la
    // clase y listo".
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole("tab", { name: /html/i }));

    expect(screen.getByTestId("editor-html").getAttribute("data-readonly")).toBe("true");
  });

  it("se puede volver a la vista previa", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole("tab", { name: /html/i }));
    fireEvent.click(screen.getByRole("tab", { name: /vista previa/i }));

    expect(screen.getByTestId("preview")).toBeTruthy();
  });
});
