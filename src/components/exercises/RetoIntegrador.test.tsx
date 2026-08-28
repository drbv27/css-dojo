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
  // El mock CABLEA onChange: sin eso no se puede probar que lo que el alumno
  // escribe llegue al preview y a la correccion.
  default: ({
    value,
    onChange,
    language,
    readOnly,
  }: {
    value: string;
    onChange?: (v: string) => void;
    language?: string;
    readOnly?: boolean;
  }) => (
    <textarea
      data-testid={`editor-${language ?? "css"}`}
      data-readonly={String(!!readOnly)}
      value={value}
      readOnly={!!readOnly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));
// El mock EXPONE lo que recibe: un preview que ignora sus props no puede
// probar que se le pase lo correcto, y ese fue exactamente el segundo bug del
// reto de Tailwind -- renderizaba la plantilla en vez del trabajo del alumno.
vi.mock("@/components/editor/LivePreview", () => ({
  default: ({ html, css }: { html: string; css?: string }) => (
    <div data-testid="preview" data-html={html} data-css={css ?? ""} />
  ),
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

/**
 * Un reto de ESTRUCTURA: el alumno escribe HTML con clases utilitarias, no CSS.
 *
 * Estos tests no existian y por eso el bug llego a la pantalla: el editor
 * quedaba en modo CSS -Monaco subrayaba en rojo el HTML valido- y la vista
 * previa mostraba la plantilla original en vez del trabajo del alumno.
 */
const retoHtml: Exercise = {
  ...reto,
  id: "reto-html",
  validation: { type: "html-structure" },
  retoPasos: [
    { instruccion: "Agregale `flex` al div", esperado: ".tarjeta.flex" },
    { instruccion: "Agregale `p-6` al div", esperado: ".tarjeta.p-6" },
  ],
  referenceSolution: '<div class="tarjeta flex p-6"></div>',
};

describe("RetoIntegrador: un reto que se escribe en HTML", () => {
  it("el editor esta en modo HTML, no CSS", () => {
    render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);
    expect(screen.getByTestId("editor-html")).toBeTruthy();
    expect(screen.queryByTestId("editor-css")).toBeNull();
  });

  it("el editor arranca con la plantilla de HTML, no con el cssPrefix", () => {
    render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);
    const editor = screen.getByTestId("editor-html") as HTMLTextAreaElement;
    expect(editor.value).toContain("class='tarjeta'");
  });

  it("el editor NO es de solo lectura: es donde se trabaja", () => {
    render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);
    expect(screen.getByTestId("editor-html").getAttribute("data-readonly")).toBe("false");
  });

  it("no ofrece la pestaña HTML, porque el alumno YA esta editando el HTML", () => {
    render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);
    expect(screen.queryByRole("tab", { name: /^html$/i })).toBeNull();
    expect(screen.getByRole("tab", { name: /vista previa/i })).toBeTruthy();
  });

  it("un reto de CSS SI ofrece las dos pestañas", () => {
    // El control del caso contrario: si esto tambien fallara, el test de arriba
    // no estaria probando la distincion.
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);
    expect(screen.getByRole("tab", { name: /^html$/i })).toBeTruthy();
  });
});

describe("RetoIntegrador: que recibe la vista previa", () => {
  it("en un reto de HTML, el preview renderiza lo que ESCRIBE el alumno", () => {
    render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);

    const p = screen.getByTestId("preview");
    // Arranca con la plantilla en el editor, asi que el preview la muestra --
    // pero como `html`, no como plantilla fija: lo que importa es que el CSS
    // vaya vacio y el HTML salga del editor.
    expect(p.getAttribute("data-html")).toContain("tarjeta");
    expect(p.getAttribute("data-css")).toBe("");
  });

  it("en un reto de CSS, el preview usa la plantilla y el CSS del alumno", () => {
    render(<RetoIntegrador exercise={reto} onSubmit={() => {}} />);

    const p = screen.getByTestId("preview");
    expect(p.getAttribute("data-html")).toContain("tarjeta");
    expect(p.getAttribute("data-css")).toBe("");
  });

  it("lo que el alumno escribe LLEGA al preview", () => {
    // El control que faltaba: sin esto, un preview cableado a la plantilla
    // pasaba los tests igual.
    const { container } = render(<RetoIntegrador exercise={retoHtml} onSubmit={() => {}} />);
    const editor = screen.getByTestId("editor-html");
    fireEvent.change(editor, { target: { value: '<div class="tarjeta flex p-6">X</div>' } });

    expect(screen.getByTestId("preview").getAttribute("data-html")).toContain("flex p-6");
    expect(container).toBeTruthy();
  });
});
