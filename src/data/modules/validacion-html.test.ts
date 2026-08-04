import { describe, it, expect } from "vitest";
import { compararEstructura } from "@/lib/htmlStructure";
import { ALL_MODULES } from "@/data/modules";

/**
 * Guards the HTML curriculum DATA.
 *
 * These exercises used to be graded with `includes`, a substring search over the
 * submission for tag fragments. It could not see nesting -- `<td></td><table>
 * </table>` satisfied a table exercise -- and some tokens were so short they
 * matched almost anything: `html17-ej-04` expected `"0"`, and `html16-ej-01`
 * expected `"es"` for `lang="es"`, which matches "test" and "Martinez".
 *
 * REFERENCIAS below is the point of this file. Every migrated exercise has a
 * reference solution that MUST score 100%. Without it, an over-strict selector
 * would silently make an exercise unpassable -- which is exactly what happened
 * to three Bootstrap/Tailwind exercises during the CSS migration before an audit
 * caught it. These are hand-authored, so treat a failure here as a bug in the
 * expectations, not in the student.
 */
const REFERENCIAS: Record<string, string> = {
  "html-01-ej-05": `<!DOCTYPE html>
<html lang="es">
<head><title>Mi Web</title></head>
<body><h1>Bienvenido</h1></body>
</html>`,
  "html-02-ej-06": `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dev Dojo</title>
</head>
<body><p>Aprendiendo HTML</p></body>
</html>`,
  "html-03-ej-05": `<h1>Mi Blog</h1>
<h2>Primer Articulo</h2>
<p>Texto con una palabra en <strong>negrita</strong>.</p>
<hr>
<p>Otro parrafo.</p>`,
  "html-03-ej-08": `<pre><code>&lt;h1&gt;Hola&lt;/h1&gt;</code></pre>`,
  "html-04-ej-05": `<ul>
<li><a href="#inicio">Inicio</a></li>
<li><a href="#servicios">Servicios</a></li>
<li><a href="#contacto">Contacto</a></li>
</ul>
<a href="mailto:info@devdojo.com">Escribinos</a>`,
  "html-05-ej-05": `<figure>
<img src="foto.jpg" alt="Paisaje de montana" width="400" height="300">
<figcaption>Vista panoramica de los Andes</figcaption>
</figure>`,
  "html-06-ej-05": `<ul>
<li>Uno</li>
<li>Dos
<ol><li>Sub uno</li><li>Sub dos</li></ol>
</li>
<li>Tres</li>
</ul>`,
  "html-06-ej-07": `<dl>
<dt>HTML</dt><dd>Estructura</dd>
<dt>CSS</dt><dd>Presentacion</dd>
</dl>`,
  "html-07-ej-05": `<table>
<caption>Notas del curso</caption>
<thead><tr><th>Estudiante</th><th>Nota</th><th>Estado</th></tr></thead>
<tbody>
<tr><td>Ana</td><td>9</td><td>Aprobado</td></tr>
<tr><td>Luis</td><td>7</td><td>Aprobado</td></tr>
</tbody>
</table>`,
  "html-08-ej-06": `<form action="/registro" method="POST">
<label for="n">Nombre</label><input type="text" id="n">
<label for="e">Email</label><input type="email" id="e">
<label for="p">Password</label><input type="password" id="p">
<button type="submit">Registrarse</button>
</form>`,
  "html-08-ej-08": `<form>
<label for="n">Nombre</label><input type="text" id="n">
<label for="e">Email</label><input type="email" id="e">
<label for="a">Asunto</label><select id="a"><option>Consulta</option><option>Soporte</option><option>Otro</option></select>
<label for="m">Mensaje</label><textarea id="m"></textarea>
<button type="submit">Enviar</button>
<button type="reset">Limpiar</button>
</form>`,
  "html16-ej-01": `<!DOCTYPE html>
<html lang="es">
<head><title>CV de Ana Martinez</title></head>
<body></body>
</html>`,
  "html16-ej-02": `<header>
<h1>Ana Martinez</h1>
<p>Desarrolladora Frontend</p>
<a href="mailto:ana@ejemplo.com">ana@ejemplo.com</a>
<a href="tel:+541100000000">+54 11 0000 0000</a>
</header>`,
  "html16-ej-04": `<main>
<section>
<h2>Perfil</h2>
<p>Desarrolladora con foco en accesibilidad.</p>
</section>
</main>`,
  "html16-ej-05": `<section>
<h2>Experiencia</h2>
<h3>Frontend Developer</h3>
<ul><li>Migre el design system</li><li>Baje el bundle un 40%</li></ul>
</section>`,
  "html16-ej-06": `<table>
<thead><tr><th>Habilidad</th><th>Nivel</th></tr></thead>
<tbody>
<tr><td>CSS</td><td>Avanzado</td></tr>
<tr><td>HTML</td><td>Avanzado</td></tr>
</tbody>
</table>`,
  "html16-ej-07": `<figure>
<img src="ana.jpg" alt="Retrato de Ana Martinez">
<figcaption>Ana Martinez</figcaption>
</figure>`,
  "html16-ej-09": `<!DOCTYPE html>
<html lang="es">
<head><title>CV de Ana Martinez</title></head>
<body>
<header><h1>Ana Martinez</h1></header>
<main>
<section><h2>Perfil</h2><p>Hola.</p></section>
<figure><img src="a.jpg" alt="Retrato"><figcaption>Ana</figcaption></figure>
<table><thead><tr><th>Habilidad</th></tr></thead><tbody><tr><td>CSS</td></tr></tbody></table>
</main>
<footer>Contacto</footer>
</body>
</html>`,
  "html17-ej-03": `<progress value="40" max="100">40%</progress>`,
  "html17-ej-04": `<meter value="8" min="0" max="10">8 de 10</meter>`,};

const ejerciciosHtml = ALL_MODULES.filter((m) => m.dojo === "html").flatMap((m) =>
  m.exercises.map((e) => ({ mod: m.slug, id: e.id, ex: e }))
);

const conEstructura = ejerciciosHtml.filter(
  (e) => e.ex.validation.type === "html-structure"
);

describe("curriculum HTML: integridad de la validacion", () => {
  it("hay ejercicios usando html-structure", () => {
    expect(conEstructura.length).toBe(20);
  });

  it("todo ejercicio html-structure trae expectativas", () => {
    const malos = conEstructura.filter(
      (e) => !Array.isArray(e.ex.validation.answer) || e.ex.validation.answer.length === 0
    );
    expect(malos.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  it("cada ejercicio tiene una solucion de referencia en este archivo", () => {
    const sinRef = conEstructura.filter((e) => !REFERENCIAS[e.id]);
    expect(sinRef.map((m) => `${m.mod}/${m.id}`)).toEqual([]);
  });

  it("LA SOLUCION DE REFERENCIA PUNTUA 100% -- ningun ejercicio quedo imposible", () => {
    const fallan = conEstructura
      .map((e) => ({ e, r: compararEstructura(e.ex.validation.answer, REFERENCIAS[e.id] ?? "") }))
      .filter((x) => !x.r.correct)
      .map((x) => `${x.e.id} score=${x.r.score} faltan=${JSON.stringify(x.r.faltantes)}`);
    expect(fallan).toEqual([]);
  });

  it("la respuesta escrita como prosa NO aprueba ninguno", () => {
    const rotos = conEstructura.filter((e) => {
      const prosa = (e.ex.validation.answer as string[]).join(" ").replace(/[<>[\]"]/g, " ");
      return compararEstructura(e.ex.validation.answer, prosa).correct;
    });
    expect(rotos.map((r) => r.id)).toEqual([]);
  });

  it("no queda ningun ejercicio HTML en 'includes'", () => {
    const rezagados = ejerciciosHtml.filter((e) => e.ex.validation.type === "includes");
    expect(rezagados.map((r) => `${r.mod}/${r.id}`)).toEqual([]);
  });
});
