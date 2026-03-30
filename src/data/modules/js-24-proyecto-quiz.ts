import type { ModuleData } from "@/types";

export const jsProyectoQuizModule: ModuleData = {
  slug: "js-proyecto-quiz",
  title: "Proyecto: Quiz Interactivo",
  description:
    "Construye un quiz interactivo con preguntas, puntuacion, temporizador y pantalla de resultados.",
  order: 124,
  category: "js-projects",
  icon: "HelpCircle",
  dojo: "js",
  lessons: [
    {
      id: "js24-leccion-01",
      title: "Estructura del quiz",
      content: `## Proyecto: Quiz App

Vamos a construir un quiz interactivo con las siguientes funcionalidades:

### Funcionalidades
1. Mostrar preguntas una por una
2. Seleccionar respuesta
3. Mostrar si es correcta o incorrecta
4. Llevar puntuacion
5. Mostrar resultados al final

### Modelo de datos

\`\`\`javascript
const preguntas = [
  {
    pregunta: "Que es JavaScript?",
    opciones: ["Un lenguaje", "Un framework", "Un sistema operativo"],
    correcta: 0
  }
];
\`\`\`

### Estado del quiz

\`\`\`javascript
let estado = {
  preguntaActual: 0,
  puntuacion: 0,
  respondida: false
};
\`\`\`

### Flujo
1. Mostrar pregunta y opciones
2. Usuario selecciona una opcion
3. Verificar si es correcta
4. Mostrar feedback visual
5. Pasar a la siguiente pregunta
6. Al terminar, mostrar resultados

> **Patron:** Maquina de estados. El quiz tiene estados claros: preguntando, respondida, finalizado.`,
      codeExample: {
        html: '<div id="quiz">\n  <div id="progreso"></div>\n  <h3 id="pregunta"></h3>\n  <div id="opciones"></div>\n  <button id="siguiente" style="display:none;">Siguiente</button>\n  <div id="resultado-quiz" style="display:none;"></div>\n</div>',
        css: '#quiz { max-width: 450px; } #progreso { font-size: 12px; color: #a6adc8; margin-bottom: 8px; } #pregunta { color: #cdd6f4; margin-bottom: 12px; } #opciones { display: flex; flex-direction: column; gap: 6px; } .opcion { padding: 10px 14px; background: #313244; color: #cdd6f4; border: 2px solid #45475a; border-radius: 6px; cursor: pointer; text-align: left; font-size: 14px; } .opcion:hover { border-color: #89b4fa; } .opcion.correcta { border-color: #a6e3a1; background: #1a3a1a; color: #a6e3a1; } .opcion.incorrecta { border-color: #f38ba8; background: #3a1a1a; color: #f38ba8; } .opcion.disabled { pointer-events: none; } #siguiente { margin-top: 12px; padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #resultado-quiz { text-align: center; padding: 20px; background: #313244; border-radius: 8px; color: #cdd6f4; }',
        js: `var preguntas = [
  { pregunta: "Que palabra clave declara una constante en JavaScript?", opciones: ["var", "let", "const", "define"], correcta: 2 },
  { pregunta: "Que metodo agrega un elemento al final de un array?", opciones: ["push()", "pop()", "shift()", "unshift()"], correcta: 0 },
  { pregunta: "Que devuelve typeof null?", opciones: ['"null"', '"undefined"', '"object"', '"boolean"'], correcta: 2 },
  { pregunta: "Que operador compara valor Y tipo?", opciones: ["==", "===", "!=", ">="], correcta: 1 }
];

var actual = 0;
var puntos = 0;
var respondida = false;

function mostrarPregunta() {
  if (actual >= preguntas.length) { mostrarResultado(); return; }
  respondida = false;
  var p = preguntas[actual];
  document.getElementById("progreso").textContent = "Pregunta " + (actual + 1) + " de " + preguntas.length + " | Puntos: " + puntos;
  document.getElementById("pregunta").textContent = p.pregunta;
  document.getElementById("siguiente").style.display = "none";

  var opcDiv = document.getElementById("opciones");
  opcDiv.innerHTML = "";
  p.opciones.forEach(function(opc, i) {
    var btn = document.createElement("button");
    btn.className = "opcion";
    btn.textContent = opc;
    btn.addEventListener("click", function() { seleccionar(i); });
    opcDiv.appendChild(btn);
  });
}

function seleccionar(i) {
  if (respondida) return;
  respondida = true;
  var btns = document.querySelectorAll(".opcion");
  var correcta = preguntas[actual].correcta;
  if (i === correcta) puntos++;
  btns.forEach(function(btn, idx) {
    btn.classList.add("disabled");
    if (idx === correcta) btn.classList.add("correcta");
    if (idx === i && i !== correcta) btn.classList.add("incorrecta");
  });
  document.getElementById("progreso").textContent = "Pregunta " + (actual + 1) + " de " + preguntas.length + " | Puntos: " + puntos;
  document.getElementById("siguiente").style.display = "block";
}

function mostrarResultado() {
  document.getElementById("pregunta").style.display = "none";
  document.getElementById("opciones").style.display = "none";
  document.getElementById("siguiente").style.display = "none";
  var res = document.getElementById("resultado-quiz");
  res.style.display = "block";
  var pct = Math.round(puntos / preguntas.length * 100);
  res.innerHTML = "<h2>" + pct + "%</h2><p>" + puntos + " de " + preguntas.length + " correctas</p><p>" + (pct >= 75 ? "Excelente!" : pct >= 50 ? "Bien hecho!" : "Sigue practicando!") + "</p>";
}

document.getElementById("siguiente").addEventListener("click", function() { actual++; mostrarPregunta(); });
mostrarPregunta();`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js24-leccion-02",
      title: "Temporizador y feedback",
      content: `## Agregar temporizador

Un temporizador anade urgencia y hace el quiz mas divertido:

\`\`\`javascript
let tiempoRestante = 30;
let timer;

function iniciarTimer() {
  tiempoRestante = 30;
  timer = setInterval(function() {
    tiempoRestante--;
    actualizarTimer();
    if (tiempoRestante <= 0) {
      clearInterval(timer);
      autoResponder(); // se acabo el tiempo
    }
  }, 1000);
}

function detenerTimer() {
  clearInterval(timer);
}
\`\`\`

### Feedback visual

Elementos que mejoran la experiencia:
- **Barra de progreso** que muestra el avance
- **Colores** verde/rojo para correcto/incorrecto
- **Animacion** al cambiar de pregunta
- **Sonido** (opcional) al acertar

### Mezclar preguntas

Para que el quiz no siempre sea igual:
\`\`\`javascript
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
\`\`\`

> **UX:** Un buen quiz da feedback inmediato y muestra el progreso del usuario.`,
      codeExample: {
        html: '<div id="quiz2">\n  <div class="timer-bar"><div id="timer-fill"></div></div>\n  <div id="prog2"></div>\n  <h3 id="preg2"></h3>\n  <div id="opts2"></div>\n  <div id="feedback" style="display:none;"></div>\n</div>',
        css: '#quiz2 { max-width: 450px; } .timer-bar { height: 4px; background: #313244; border-radius: 2px; margin-bottom: 8px; overflow: hidden; } #timer-fill { height: 100%; background: #a6e3a1; transition: width 1s linear; width: 100%; } #timer-fill.warning { background: #f9e2af; } #timer-fill.danger { background: #f38ba8; } #prog2 { font-size: 12px; color: #a6adc8; margin-bottom: 8px; } #preg2 { color: #cdd6f4; margin-bottom: 12px; } #opts2 { display: flex; flex-direction: column; gap: 6px; } .opt2 { padding: 10px; background: #313244; color: #cdd6f4; border: 2px solid #45475a; border-radius: 6px; cursor: pointer; text-align: left; } .opt2:hover { border-color: #89b4fa; } .opt2.ok { border-color: #a6e3a1; background: #1a3a1a; } .opt2.bad { border-color: #f38ba8; background: #3a1a1a; } .opt2.off { pointer-events: none; opacity: 0.7; } #feedback { margin-top: 8px; padding: 8px; border-radius: 4px; font-size: 13px; }',
        js: `var qs = [
  { p: "Que metodo convierte JSON string a objeto?", o: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"], c: 0 },
  { p: "Que evento se dispara al escribir en un input?", o: ["click", "input", "change", "submit"], c: 1 },
  { p: "Como seleccionas un elemento por id?", o: ["querySelector()", "getElementById()", "getElement()", "findById()"], c: 1 }
];

var qi = 0, pts = 0, tiempo = 10, tmr, contestada = false;

function iniciar() {
  qi = 0; pts = 0;
  // Mezclar
  for (var i = qs.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = qs[i]; qs[i] = qs[j]; qs[j] = tmp;
  }
  render2();
}

function render2() {
  if (qi >= qs.length) {
    var pct = Math.round(pts / qs.length * 100);
    document.getElementById("quiz2").innerHTML = '<div style="text-align:center;padding:20px;color:#cdd6f4;"><h2>' + pct + '%</h2><p>' + pts + '/' + qs.length + ' correctas</p></div>';
    return;
  }
  contestada = false;
  var q = qs[qi];
  document.getElementById("prog2").textContent = (qi + 1) + "/" + qs.length + " | Puntos: " + pts;
  document.getElementById("preg2").textContent = q.p;
  document.getElementById("feedback").style.display = "none";

  var od = document.getElementById("opts2");
  od.innerHTML = "";
  q.o.forEach(function(op, i) {
    var b = document.createElement("button");
    b.className = "opt2";
    b.textContent = op;
    b.addEventListener("click", function() { responder(i); });
    od.appendChild(b);
  });

  tiempo = 10;
  clearInterval(tmr);
  var fill = document.getElementById("timer-fill");
  fill.style.width = "100%";
  fill.className = "";
  tmr = setInterval(function() {
    tiempo--;
    fill.style.width = (tiempo / 10 * 100) + "%";
    if (tiempo <= 3) fill.className = "danger";
    else if (tiempo <= 5) fill.className = "warning";
    if (tiempo <= 0) { clearInterval(tmr); responder(-1); }
  }, 1000);
}

function responder(i) {
  if (contestada) return;
  contestada = true;
  clearInterval(tmr);
  var c = qs[qi].c;
  if (i === c) pts++;
  var btns = document.querySelectorAll(".opt2");
  btns.forEach(function(b, idx) { b.classList.add("off"); if (idx === c) b.classList.add("ok"); if (idx === i && i !== c) b.classList.add("bad"); });
  var fb = document.getElementById("feedback");
  fb.style.display = "block";
  fb.style.color = i === c ? "#a6e3a1" : "#f38ba8";
  fb.textContent = i === c ? "Correcto!" : (i === -1 ? "Tiempo agotado!" : "Incorrecto. La respuesta era: " + qs[qi].o[c]);
  setTimeout(function() { qi++; render2(); }, 1500);
}

iniciar();`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js24-leccion-03",
      title: "Categorias y almacenamiento",
      content: `## Mejoras avanzadas

### Categorias de preguntas

Organiza las preguntas por temas y deja que el usuario elija:

\`\`\`javascript
const categorias = {
  "variables": [...preguntas],
  "arrays": [...preguntas],
  "dom": [...preguntas]
};
\`\`\`

### Guardar mejores puntuaciones

\`\`\`javascript
function guardarPuntuacion(nombre, puntos, total) {
  const scores = JSON.parse(
    localStorage.getItem("quiz_scores")
  ) || [];
  scores.push({ nombre, puntos, total, fecha: new Date() });
  scores.sort((a, b) => b.puntos - a.puntos);
  localStorage.setItem("quiz_scores",
    JSON.stringify(scores.slice(0, 10))
  );
}
\`\`\`

### Conceptos aplicados en este proyecto
- **Arrays y objetos** para los datos del quiz
- **DOM** para renderizar preguntas y opciones
- **Eventos** para capturar respuestas
- **Temporizadores** con setInterval
- **localStorage** para persistencia
- **Condicionales** para verificar respuestas
- **Funciones** para organizar la logica

> Este proyecto integra casi todos los conceptos del curso en una aplicacion divertida e interactiva.`,
      codeExample: {
        html: '<div id="quiz3">\n  <h3>Resultados de Quiz</h3>\n  <table id="tabla-scores"></table>\n  <button id="nuevo-score">Simular nuevo puntaje</button>\n  <button id="limpiar-scores">Limpiar</button>\n</div>',
        css: '#quiz3 { max-width: 400px; } table { width: 100%; border-collapse: collapse; margin: 8px 0; } th, td { padding: 6px 8px; text-align: left; border-bottom: 1px solid #313244; color: #cdd6f4; font-size: 13px; } th { color: #89b4fa; font-size: 12px; } tr:hover td { background: #313244; } button { margin: 4px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; } #nuevo-score { background: #a6e3a1; color: #1e1e2e; } #limpiar-scores { background: #f38ba8; color: #1e1e2e; }',
        js: `var KEY = "dojo_quiz_scores";
var nombres = ["Ana", "Luis", "Maria", "Carlos", "Sofia", "Pedro", "Laura", "Diego"];

function getScores() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch(e) { return []; }
}

function saveScores(scores) {
  localStorage.setItem(KEY, JSON.stringify(scores));
}

function renderScores() {
  var scores = getScores();
  var tabla = document.getElementById("tabla-scores");
  var html = "<tr><th>#</th><th>Nombre</th><th>Puntos</th><th>%</th></tr>";
  if (scores.length === 0) {
    html += '<tr><td colspan="4" style="text-align:center;color:#a6adc8;">Sin puntajes aun</td></tr>';
  } else {
    scores.forEach(function(s, i) {
      var pct = Math.round(s.puntos / s.total * 100);
      var color = pct >= 75 ? "#a6e3a1" : pct >= 50 ? "#f9e2af" : "#f38ba8";
      html += "<tr><td>" + (i + 1) + "</td><td>" + s.nombre + "</td><td>" + s.puntos + "/" + s.total + '</td><td style="color:' + color + '">' + pct + "%</td></tr>";
    });
  }
  tabla.innerHTML = html;
}

document.getElementById("nuevo-score").addEventListener("click", function() {
  var scores = getScores();
  var total = 10;
  var puntos = Math.floor(Math.random() * (total + 1));
  scores.push({ nombre: nombres[Math.floor(Math.random() * nombres.length)], puntos: puntos, total: total });
  scores.sort(function(a, b) { return (b.puntos / b.total) - (a.puntos / a.total); });
  saveScores(scores.slice(0, 10));
  renderScores();
});

document.getElementById("limpiar-scores").addEventListener("click", function() {
  localStorage.removeItem(KEY);
  renderScores();
});

renderScores();`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js24-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Que funcion de JavaScript se usa para ejecutar codigo repetidamente cada cierto intervalo?",
      options: [
        { id: "a", text: "setTimeout()", isCorrect: false },
        { id: "b", text: "setInterval()", isCorrect: true },
        { id: "c", text: "setRepeat()", isCorrect: false },
        { id: "d", text: "repeat()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Interval = intervalo (repetido).",
      explanation: "setInterval() ejecuta una funcion repetidamente cada X milisegundos hasta que se llame clearInterval().",
    },
    {
      id: "js24-ej-02",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 2,
      prompt: "Como detienes un temporizador creado con setInterval?",
      options: [
        { id: "a", text: "stopInterval()", isCorrect: false },
        { id: "b", text: "clearInterval(id)", isCorrect: true },
        { id: "c", text: "timer.stop()", isCorrect: false },
        { id: "d", text: "cancelInterval()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "clear = limpiar/detener.",
      explanation: "clearInterval(id) detiene el intervalo. El id es el valor devuelto por setInterval().",
    },
    {
      id: "js24-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que algoritmo se usa para mezclar un array de forma aleatoria?",
      options: [
        { id: "a", text: "Bubble sort", isCorrect: false },
        { id: "b", text: "Fisher-Yates shuffle", isCorrect: true },
        { id: "c", text: "Quick sort", isCorrect: false },
        { id: "d", text: "Binary search", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Es el algoritmo estandar para mezclar arrays.",
      explanation: "Fisher-Yates (o Knuth shuffle) es el algoritmo estandar para mezclar arrays de forma uniforme y eficiente.",
    },
    {
      id: "js24-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 4,
      prompt: "En el patron de 'maquina de estados', por que es util definir estados claros para el quiz?",
      options: [
        { id: "a", text: "Para hacerlo mas lento", isCorrect: false },
        { id: "b", text: "Para controlar que acciones son validas en cada momento", isCorrect: true },
        { id: "c", text: "Para usar menos variables", isCorrect: false },
        { id: "d", text: "No es necesario", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Evita que el usuario haga cosas invalidas como responder dos veces.",
      explanation: "Los estados claros (preguntando, respondida, finalizado) permiten controlar que acciones son validas en cada momento.",
    },
    {
      id: "js24-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Completa para calcular el porcentaje de respuestas correctas:",
      codeTemplate: {
        html: "",
        cssPrefix: "const porcentaje = Math.",
        cssSuffix: "(puntos / total * 100);",
        blanks: ["round"],
      },
      validation: { type: "exact", answer: "round" },
      hint: "Redondear al entero mas cercano.",
      explanation: "Math.round() redondea al entero mas cercano. 7/10*100 = 70.0, Math.round(70.0) = 70.",
    },
    {
      id: "js24-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Que metodo de array ordena los puntajes de mayor a menor?",
      options: [
        { id: "a", text: "sort((a,b) => a - b)", isCorrect: false },
        { id: "b", text: "sort((a,b) => b - a)", isCorrect: true },
        { id: "c", text: "reverse()", isCorrect: false },
        { id: "d", text: "orderBy('desc')", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "b - a ordena de mayor a menor.",
      explanation: "sort((a,b) => b - a) ordena de forma descendente (mayor a menor). a - b seria ascendente.",
    },
  ],
};
