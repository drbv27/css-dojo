import { useEffect, useRef, useState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Regression test for a bug that CORRUPTED the student's submission.
 *
 * Symptom: in a visual-match exercise, switching to the read-only HTML tab and
 * back to CSS left the HTML sitting in the CSS editor. Verificar then sent that
 * markup to the grader as the student's CSS.
 *
 * Cause, inside @monaco-editor/react: when the tab being switched TO is
 * read-only, the wrapper takes its `editor.setValue(value)` path, and
 * `setValue` fires `onDidChangeModelContent` SYNCHRONOUSLY -- from inside the
 * `[value]` effect, which is declared BEFORE the effect that disposes and
 * re-subscribes `onChange`. So the event announcing "the HTML was loaded"
 * reaches the listener registered during the PREVIOUS render, whose closure
 * still believes the active tab is CSS.
 *
 * The double below reproduces exactly that ordering, and nothing else about
 * Monaco. A test that merely clicked tabs against a naive fake would pass on
 * the broken code, which is why the ordering has to be faked faithfully.
 */

/** The listener the wrapper has actually subscribed -- always one commit behind. */
let listenerSuscrito: ((v: string) => void) | undefined;

vi.mock("@monaco-editor/react", () => ({
  default: function EditorFalso({
    value,
    options,
    onChange,
  }: {
    value: string;
    options: { readOnly?: boolean };
    onChange: (v: string) => void;
  }) {
    const valorPrevio = useRef<string | undefined>(undefined);

    // Wrapper's `[value]` effect. Declared FIRST, like in the real one.
    useEffect(() => {
      const cambio = valorPrevio.current !== undefined && valorPrevio.current !== value;
      valorPrevio.current = value;
      // Only the read-only path calls setValue, and only setValue leaks an
      // unsuppressed change event.
      if (cambio && options.readOnly) listenerSuscrito?.(value);
    }, [value, options.readOnly]);

    // Wrapper's re-subscription effect. Declared SECOND: it runs after the one
    // above, which is the whole reason a stale listener can get the event.
    //
    // No cleanup function here ON PURPOSE. The real wrapper disposes the old
    // monaco subscription INSIDE this setup, not in a cleanup -- so on a
    // re-render the old listener stays live until this runs. Modelling it with a
    // cleanup would make React clear the listener before the `[value]` effect
    // above (React runs every destroy in a commit before any create), the race
    // would vanish from the double, and this test would pass against the broken
    // code. Verified: it does.
    useEffect(() => {
      listenerSuscrito = onChange;
    }, [onChange]);

    // The wrapper's unmount handler, which DOES dispose the subscription. This
    // is what makes a keyed remount safe, so the double has to have it.
    useEffect(() => () => {
      listenerSuscrito = undefined;
    }, []);

    return (
      <div
        data-testid="editor"
        data-value={value}
        data-readonly={String(!!options.readOnly)}
      />
    );
  },
}));

const { default: TabCodeEditor } = await import("./TabCodeEditor");

const HTML_EJERCICIO = '<div class="tarjeta">\n  <h2>Mi Tarjeta</h2>\n</div>';

/** Mirrors VisualMatchExercise: HTML read-only, CSS editable and held in state. */
function EjercicioVisualMatch({ onCss }: { onCss: (v: string) => void }) {
  const [css, setCss] = useState("");
  return (
    <>
      <TabCodeEditor
        html={HTML_EJERCICIO}
        css={css}
        onCSSChange={(v) => {
          setCss(v);
          onCss(v);
        }}
        showHTML={true}
        showCSS={true}
        showJS={false}
        readOnlyHTML={true}
        height="200px"
        activeTab="css"
      />
      <output data-testid="estado-css">{css}</output>
    </>
  );
}

afterEach(() => {
  listenerSuscrito = undefined;
  cleanup();
});

describe("TabCodeEditor: ir al HTML y volver", () => {
  it("no deja el HTML en el editor de CSS ni en el estado del ejercicio", () => {
    const onCss = vi.fn();
    render(<EjercicioVisualMatch onCss={onCss} />);

    // Arranca en CSS, vacio.
    expect(screen.getByTestId("editor").getAttribute("data-value")).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /html/i }));
    expect(screen.getByTestId("editor").getAttribute("data-value")).toBe(HTML_EJERCICIO);
    expect(screen.getByTestId("editor").getAttribute("data-readonly")).toBe("true");

    // Aca estaba el bug: el evento del setValue del HTML llegaba al listener
    // viejo y se escribia en el CSS del alumno.
    expect(onCss).not.toHaveBeenCalled();
    expect(screen.getByTestId("estado-css").textContent).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /css/i }));
    expect(screen.getByTestId("editor").getAttribute("data-value")).toBe("");
    expect(screen.getByTestId("editor").getAttribute("data-readonly")).toBe("false");
    expect(screen.getByTestId("estado-css").textContent).toBe("");
  });

  it("sigue propagando lo que el alumno escribe en la pestana editable", () => {
    const onCss = vi.fn();
    render(<EjercicioVisualMatch onCss={onCss} />);

    // El listener suscrito es el de la pestana CSS activa: simula tipear.
    act(() => listenerSuscrito?.(".tarjeta { color: white; }"));
    expect(onCss).toHaveBeenCalledWith(".tarjeta { color: white; }");

    // Y despues de pasear por el HTML, tipear sigue yendo al CSS.
    fireEvent.click(screen.getByRole("button", { name: /html/i }));
    fireEvent.click(screen.getByRole("button", { name: /css/i }));
    onCss.mockClear();
    act(() => listenerSuscrito?.(".tarjeta { padding: 20px; }"));
    expect(onCss).toHaveBeenCalledWith(".tarjeta { padding: 20px; }");
  });
});
