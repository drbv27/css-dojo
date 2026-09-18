import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import CodeCompletionExercise from "./CodeCompletionExercise";
import type { Exercise } from "@/types";

/**
 * Este componente NO califica. El corrector es `calificar`, y corre igual en el
 * cliente y en el servidor.
 *
 * Antes comparaba la respuesta contra `codeTemplate.blanks` letra por letra, y
 * eso lo volvia un TERCER validador que no sabe nada del regex de `validation`
 * ni de las equivalencias de `cssRules`. En `16-ej-02` producia una pantalla
 * que se contradecia sola: 100/100 y +10 XP abajo, "algunas respuestas son
 * incorrectas" arriba, y la respuesta "correcta" ofrecida debajo de una
 * respuesta que ya era correcta.
 */

// El ejercicio real: el hint promete `1fr 1fr 1fr`, el blank dice `repeat(3, 1fr)`.
const ejercicio = {
  id: "16-ej-02",
  type: "code-completion",
  difficulty: 1,
  xpReward: 10,
  order: 2,
  prompt: "Completá la propiedad",
  codeTemplate: {
    html: "<div class='grid'></div>",
    cssPrefix: ".grid {\n  grid-template-columns: ",
    cssSuffix: ";\n}",
    blanks: ["repeat(3, 1fr)"],
  },
  validation: { type: "regex", answer: "^\\s*(repeat\\s*\\(\\s*3\\s*,\\s*1fr\\s*\\)|1fr\\s+1fr\\s+1fr)\\s*$" },
  hint: "También podrías escribir '1fr 1fr 1fr'.",
  explanation: "Es equivalente.",
} as unknown as Exercise;

afterEach(cleanup);

function responder(texto: string, aprobado: boolean | null) {
  render(
    <CodeCompletionExercise exercise={ejercicio} onSubmit={vi.fn()} aprobado={aprobado} />
  );
  fireEvent.change(screen.getByPlaceholderText("..."), { target: { value: texto } });
  fireEvent.click(screen.getByRole("button", { name: /verificar|enviar|comprobar/i }));
}

describe("CodeCompletionExercise: el cartel sigue al corrector, no a `blanks`", () => {
  it("una forma equivalente aceptada por el corrector NO se marca como incorrecta", () => {
    // `1fr 1fr 1fr` no coincide letra por letra con el blank, y el corrector
    // igual la acepta porque el propio enunciado la declara equivalente.
    responder("1fr 1fr 1fr", true);

    expect(screen.queryByText(/algunas respuestas son incorrectas/i)).toBeNull();
    expect(screen.getByText(/todas las respuestas son correctas/i)).toBeTruthy();
    // Y no se le ofrece "la respuesta correcta" debajo de una respuesta correcta.
    expect(screen.queryByText("repeat(3, 1fr)")).toBeNull();
  });

  it("GUARD: una respuesta que el corrector RECHAZA sigue marcandose mal", () => {
    responder("1fr 1fr", false);

    expect(screen.getByText(/algunas respuestas son incorrectas/i)).toBeTruthy();
    expect(screen.queryByText(/todas las respuestas son correctas/i)).toBeNull();
  });
});
