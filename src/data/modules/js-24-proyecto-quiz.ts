import type { ModuleData } from "@/types";

export const jsProyectoQuizModule: ModuleData = {
  slug: "js-proyecto-quiz",
  title: "Proyecto: App de Quiz",
  description:
    "Construye una aplicacion de Quiz interactiva: estructura de datos para preguntas, renderizado dinamico, tracking de puntuacion, temporizador y pantalla de resultados.",
  order: 124,
  category: "js-projects",
  icon: "help-circle",
  dojo: "js",
  lessons: [
    {
      id: "js-24-leccion-01",
      title: "Estructura de datos y estado del Quiz",
      content: `## Proyecto Quiz: Estructura y estado

### Que vamos a construir?

Una app de Quiz con:
- Preguntas con opciones multiples
- Navegacion entre preguntas
- Tracking de puntuacion
- Temporizador por pregunta
- Pantalla de resultados al final

### Estructura de datos

\`\`\`javascript
const preguntas = [
  {
    id: 1,
    pregunta: 'Cual es el lenguaje de programacion mas usado en la web?',
    opciones: ['Python', 'JavaScript', 'Java', 'C++'],
    respuestaCorrecta: 1, // indice de la respuesta correcta
    explicacion: 'JavaScript es el unico lenguaje que corre nativamente en los navegadores.'
  },
  {
    id: 2,
    pregunta: 'Que significa HTML?',
    opciones: [
      'HyperText Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink Text Management Language'
    ],
    respuestaCorrecta: 0,
    explicacion: 'HTML significa HyperText Markup Language, el lenguaje de marcado de la web.'
  },
  {
    id: 3,
    pregunta: 'Cual metodo de array NO modifica el array original?',
    opciones: ['push()', 'splice()', 'map()', 'sort()'],
    respuestaCorrecta: 2,
    explicacion: 'map() devuelve un nuevo array sin modificar el original.'
  },
];
\`\`\`

### Estado de la aplicacion

\`\`\`javascript
let estado = {
  preguntaActual: 0,      // indice de la pregunta actual
  puntuacion: 0,           // respuestas correctas
  respuestas: [],          // historial de respuestas del usuario
  quizTerminado: false,    // ha terminado el quiz?
  tiempoRestante: 30,      // segundos por pregunta
  timerId: null,           // referencia al setInterval
};
\`\`\`

### Funciones de acceso al estado

\`\`\`javascript
function obtenerPreguntaActual() {
  return preguntas[estado.preguntaActual];
}

function hayMasPreguntas() {
  return estado.preguntaActual < preguntas.length - 1;
}

function obtenerProgreso() {
  return {
    actual: estado.preguntaActual + 1,
    total: preguntas.length,
    porcentaje: ((estado.preguntaActual + 1) / preguntas.length) * 100
  };
}
\`\`\`

### Inicializacion

\`\`\`javascript
function iniciarQuiz() {
  estado = {
    preguntaActual: 0,
    puntuacion: 0,
    respuestas: [],
    quizTerminado: false,
    tiempoRestante: 30,
    timerId: null,
  };
  renderizar();
  iniciarTemporizador();
}
\`\`\`

> **Patron:** Separar los datos (preguntas) del estado de la app (pregunta actual, puntuacion) hace el codigo mas facil de entender y mantener.`,
      order: 1,
    },
    {
      id: "js-24-leccion-02",
      title: "Renderizado de preguntas y opciones",
      content: `## Renderizado de preguntas y opciones

### Renderizar una pregunta

\`\`\`javascript
function renderizarPregunta() {
  const pregunta = obtenerPreguntaActual();
  const progreso = obtenerProgreso();

  return \`
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center;
                  margin-bottom: 8px; font-size: 14px; color: #666;">
        <span>Pregunta \${progreso.actual} de \${progreso.total}</span>
        <span>Puntuacion: \${estado.puntuacion}</span>
      </div>
      <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-bottom: 16px;">
        <div style="height: 100%; width: \${progreso.porcentaje}%;
                    background: #1976d2; border-radius: 3px;
                    transition: width 0.3s;"></div>
      </div>
    </div>

    <h3 style="margin-bottom: 16px; font-size: 18px; color: #333;">
      \${pregunta.pregunta}
    </h3>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      \${pregunta.opciones.map((opcion, indice) => \`
        <button onclick="seleccionarRespuesta(\${indice})"
          style="
            padding: 12px 16px;
            border: 2px solid #ddd;
            border-radius: 8px;
            background: #fff;
            cursor: pointer;
            text-align: left;
            font-size: 15px;
            transition: all 0.2s;
          "
          onmouseover="this.style.borderColor='#1976d2'; this.style.background='#e3f2fd'"
          onmouseout="this.style.borderColor='#ddd'; this.style.background='#fff'"
        >
          <strong>\${String.fromCharCode(65 + indice)}.</strong> \${opcion}
        </button>
      \`).join('')}
    </div>
  \`;
}
\`\`\`

### Renderizado principal

\`\`\`javascript
function renderizar() {
  const app = document.getElementById('app');

  if (estado.quizTerminado) {
    app.innerHTML = renderizarResultados();
    return;
  }

  app.innerHTML = \`
    \${renderizarPregunta()}
    <div style="margin-top: 12px; text-align: center; color: #666; font-size: 14px;">
      Tiempo: <span id="temporizador">\${estado.tiempoRestante}</span>s
    </div>
  \`;
}
\`\`\`

### Mostrar feedback despues de responder

\`\`\`javascript
function mostrarFeedback(indiceSeleccionado) {
  const pregunta = obtenerPreguntaActual();
  const esCorrecta = indiceSeleccionado === pregunta.respuestaCorrecta;
  const app = document.getElementById('app');

  // Deshabilitar botones y mostrar colores
  const botones = app.querySelectorAll('button');
  botones.forEach((btn, i) => {
    btn.disabled = true;
    btn.style.cursor = 'default';
    if (i === pregunta.respuestaCorrecta) {
      btn.style.borderColor = '#4caf50';
      btn.style.background = '#e8f5e9';
    } else if (i === indiceSeleccionado && !esCorrecta) {
      btn.style.borderColor = '#f44336';
      btn.style.background = '#ffebee';
    }
  });

  // Mostrar explicacion
  const feedback = document.createElement('div');
  feedback.innerHTML = \`
    <div style="margin-top: 16px; padding: 12px; border-radius: 8px;
                background: \${esCorrecta ? '#e8f5e9' : '#fff3e0'};">
      <p style="font-weight: bold; color: \${esCorrecta ? '#2e7d32' : '#e65100'};">
        \${esCorrecta ? 'Correcto!' : 'Incorrecto'}
      </p>
      <p style="color: #555; margin-top: 4px;">\${pregunta.explicacion}</p>
      <button onclick="\${hayMasPreguntas() ? 'siguientePregunta()' : 'terminarQuiz()'}"
        style="margin-top: 8px; padding: 8px 20px; background: #1976d2; color: white;
               border: none; border-radius: 4px; cursor: pointer;">
        \${hayMasPreguntas() ? 'Siguiente' : 'Ver resultados'}
      </button>
    </div>
  \`;
  app.appendChild(feedback);
}
\`\`\`

> **Consejo:** El feedback visual inmediato (colores verde/rojo) mejora mucho la experiencia de aprendizaje del usuario.`,
      order: 2,
    },
    {
      id: "js-24-leccion-03",
      title: "Puntuacion y temporizador",
      content: `## Puntuacion y temporizador

### Seleccionar respuesta y calcular puntuacion

\`\`\`javascript
function seleccionarRespuesta(indice) {
  const pregunta = obtenerPreguntaActual();
  const esCorrecta = indice === pregunta.respuestaCorrecta;

  // Detener temporizador
  detenerTemporizador();

  // Actualizar estado
  if (esCorrecta) {
    estado.puntuacion++;
  }

  estado.respuestas.push({
    preguntaId: pregunta.id,
    respuestaUsuario: indice,
    esCorrecta: esCorrecta,
    tiempoUsado: 30 - estado.tiempoRestante
  });

  // Mostrar feedback
  mostrarFeedback(indice);
}
\`\`\`

### Siguiente pregunta

\`\`\`javascript
function siguientePregunta() {
  estado.preguntaActual++;
  estado.tiempoRestante = 30;
  renderizar();
  iniciarTemporizador();
}
\`\`\`

### Temporizador

\`\`\`javascript
function iniciarTemporizador() {
  estado.tiempoRestante = 30;
  actualizarDisplayTemporizador();

  estado.timerId = setInterval(function() {
    estado.tiempoRestante--;
    actualizarDisplayTemporizador();

    if (estado.tiempoRestante <= 0) {
      detenerTemporizador();
      tiempoAgotado();
    }
  }, 1000);
}

function detenerTemporizador() {
  if (estado.timerId) {
    clearInterval(estado.timerId);
    estado.timerId = null;
  }
}

function actualizarDisplayTemporizador() {
  const el = document.getElementById('temporizador');
  if (el) {
    el.textContent = estado.tiempoRestante;
    // Cambiar color cuando queda poco tiempo
    if (estado.tiempoRestante <= 10) {
      el.style.color = '#f44336';
      el.style.fontWeight = 'bold';
    } else {
      el.style.color = '#666';
      el.style.fontWeight = 'normal';
    }
  }
}

function tiempoAgotado() {
  const pregunta = obtenerPreguntaActual();

  estado.respuestas.push({
    preguntaId: pregunta.id,
    respuestaUsuario: -1, // No respondio
    esCorrecta: false,
    tiempoUsado: 30
  });

  // Mostrar la respuesta correcta
  mostrarFeedback(-1);
}
\`\`\`

### Barra de progreso del temporizador

\`\`\`javascript
// Alternativa visual: barra de progreso en vez de numero
function renderizarTemporizador() {
  const porcentaje = (estado.tiempoRestante / 30) * 100;
  let color = '#4caf50'; // verde
  if (porcentaje < 33) color = '#f44336'; // rojo
  else if (porcentaje < 66) color = '#ff9800'; // naranja

  return \`
    <div style="margin-top: 12px;">
      <div style="height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
        <div style="height: 100%; width: \${porcentaje}%;
                    background: \${color}; border-radius: 4px;
                    transition: width 1s linear;"></div>
      </div>
      <p style="text-align: center; margin-top: 4px; font-size: 14px; color: \${color};">
        \${estado.tiempoRestante}s
      </p>
    </div>
  \`;
}
\`\`\`

> **Nota:** setInterval puede tener un desfase ligero. Para un temporizador muy preciso, usa la diferencia entre Date.now() y el tiempo de inicio.`,
      order: 3,
    },
    {
      id: "js-24-leccion-04",
      title: "Pantalla de resultados y reinicio",
      content: `## Pantalla de resultados y reinicio

### Terminar el Quiz

\`\`\`javascript
function terminarQuiz() {
  detenerTemporizador();
  estado.quizTerminado = true;
  renderizar();
}
\`\`\`

### Calcular estadisticas

\`\`\`javascript
function calcularEstadisticas() {
  const total = preguntas.length;
  const correctas = estado.puntuacion;
  const porcentaje = Math.round((correctas / total) * 100);
  const tiempoPromedio = estado.respuestas.reduce(
    (sum, r) => sum + r.tiempoUsado, 0
  ) / total;

  let mensaje = '';
  let emoji = '';
  if (porcentaje === 100) {
    mensaje = 'Perfecto! Eres un experto!';
    emoji = '🏆';
  } else if (porcentaje >= 70) {
    mensaje = 'Muy bien! Buen dominio del tema.';
    emoji = '⭐';
  } else if (porcentaje >= 50) {
    mensaje = 'Bien! Pero puedes mejorar.';
    emoji = '💪';
  } else {
    mensaje = 'Sigue practicando, tu puedes!';
    emoji = '📚';
  }

  return { total, correctas, porcentaje, tiempoPromedio, mensaje, emoji };
}
\`\`\`

### Renderizar resultados

\`\`\`javascript
function renderizarResultados() {
  const stats = calcularEstadisticas();

  return \`
    <div style="text-align: center; padding: 20px 0;">
      <div style="font-size: 48px; margin-bottom: 8px;">\${stats.emoji}</div>
      <h3 style="font-size: 22px; margin-bottom: 8px;">Quiz Terminado!</h3>
      <p style="color: #666; margin-bottom: 20px;">\${stats.mensaje}</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: #e3f2fd; padding: 16px; border-radius: 8px;">
          <div style="font-size: 28px; font-weight: bold; color: #1976d2;">
            \${stats.correctas}/\${stats.total}
          </div>
          <div style="font-size: 13px; color: #666;">Correctas</div>
        </div>
        <div style="background: #f3e5f5; padding: 16px; border-radius: 8px;">
          <div style="font-size: 28px; font-weight: bold; color: #7b1fa2;">
            \${stats.porcentaje}%
          </div>
          <div style="font-size: 13px; color: #666;">Puntuacion</div>
        </div>
      </div>

      <h4 style="text-align: left; margin-bottom: 8px;">Detalle:</h4>
      \${estado.respuestas.map((resp, i) => {
        const pregunta = preguntas[i];
        return \`
          <div style="display: flex; align-items: center; gap: 8px;
                      padding: 8px; margin: 4px 0; border-radius: 4px;
                      background: \${resp.esCorrecta ? '#e8f5e9' : '#ffebee'};
                      text-align: left; font-size: 14px;">
            <span>\${resp.esCorrecta ? '✓' : '✗'}</span>
            <span style="flex: 1;">\${pregunta.pregunta}</span>
            <span style="color: #999;">\${resp.tiempoUsado}s</span>
          </div>
        \`;
      }).join('')}

      <button onclick="iniciarQuiz()"
        style="margin-top: 20px; padding: 12px 32px; background: #1976d2;
               color: white; border: none; border-radius: 8px;
               font-size: 16px; cursor: pointer;">
        Intentar de nuevo
      </button>
    </div>
  \`;
}
\`\`\`

### Reiniciar Quiz

\`\`\`javascript
function iniciarQuiz() {
  estado = {
    preguntaActual: 0,
    puntuacion: 0,
    respuestas: [],
    quizTerminado: false,
    tiempoRestante: 30,
    timerId: null,
  };
  renderizar();
  iniciarTemporizador();
}

// Iniciar la app
iniciarQuiz();
\`\`\`

> **Felicidades!** Has construido un Quiz interactivo completo. Puedes extenderlo con: categorias de preguntas, niveles de dificultad, tabla de mejores puntuaciones con localStorage, y efectos de animacion.`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-24-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "En la estructura de datos del Quiz, por que es mejor guardar el indice de la respuesta correcta en vez del texto?",
      options: [
        { id: "a", text: "Porque los numeros ocupan menos memoria", isCorrect: false },
        { id: "b", text: "Porque permite comparar facilmente la seleccion del usuario con la correcta", isCorrect: true },
        { id: "c", text: "Porque los textos pueden tener errores de escritura", isCorrect: false },
        { id: "d", text: "No hay diferencia, ambos enfoques son iguales", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en como compararias la respuesta del usuario con la correcta.",
      explanation: "Usar un indice numerico facilita la comparacion (indiceSeleccionado === respuestaCorrecta) y evita problemas de comparacion de strings con tildes o espacios.",
    },
    {
      id: "js-24-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la funcion que verifica si la respuesta del usuario es correcta:",
      codeTemplate: {
        html: "",
        cssPrefix: "function verificarRespuesta(indiceSeleccionado) {\n  const pregunta = preguntas[estado.preguntaActual];\n  return ",
        cssSuffix: ";\n}",
        blanks: ["indiceSeleccionado === pregunta.respuestaCorrecta"],
      },
      validation: { type: "includes", answer: ["indiceSeleccionado", "===", "respuestaCorrecta"] },
      hint: "Compara el indice seleccionado por el usuario con el indice de la respuesta correcta.",
      explanation: "Comparamos directamente el indice que selecciono el usuario con el campo respuestaCorrecta de la pregunta actual usando ===.",
    },
    {
      id: "js-24-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Completa la funcion que calcula el porcentaje de respuestas correctas:",
      codeTemplate: {
        html: "",
        cssPrefix: "function calcularPorcentaje() {\n  const total = preguntas.length;\n  const correctas = estado.puntuacion;\n  return ",
        cssSuffix: ";\n}",
        blanks: ["Math.round((correctas / total) * 100)"],
      },
      validation: { type: "includes", answer: ["correctas", "total", "100"] },
      hint: "Divide correctas entre total, multiplica por 100 y redondea.",
      explanation: "El porcentaje se calcula dividiendo las respuestas correctas entre el total, multiplicando por 100 y redondeando con Math.round para un numero entero limpio.",
    },
    {
      id: "js-24-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 4,
      prompt: "Completa la funcion del temporizador que se ejecuta cada segundo y llama a tiempoAgotado() cuando llega a cero:",
      codeTemplate: {
        html: "",
        cssPrefix: "function iniciarTemporizador() {\n  estado.tiempoRestante = 30;\n  estado.timerId = setInterval(function() {\n    ",
        cssSuffix: "\n    if (estado.tiempoRestante <= 0) {\n      clearInterval(estado.timerId);\n      tiempoAgotado();\n    }\n  }, 1000);\n}",
        blanks: ["estado.tiempoRestante--;"],
      },
      validation: { type: "includes", answer: ["estado.tiempoRestante--"] },
      hint: "Cada segundo necesitas decrementar el tiempo restante.",
      explanation: "Cada 1000ms (1 segundo), decrementamos estado.tiempoRestante. Cuando llega a 0, limpiamos el intervalo y llamamos a tiempoAgotado().",
    },
    {
      id: "js-24-ej-05",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 5,
      prompt: "Por que es importante llamar a clearInterval cuando se selecciona una respuesta?",
      options: [
        { id: "a", text: "Para ahorrar bateria del dispositivo", isCorrect: false },
        { id: "b", text: "Para evitar que el temporizador siga corriendo y cause comportamiento inesperado", isCorrect: true },
        { id: "c", text: "Porque JavaScript lo requiere obligatoriamente", isCorrect: false },
        { id: "d", text: "Para poder usar setInterval de nuevo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Que pasaria si el temporizador sigue corriendo despues de responder?",
      explanation: "Si no detenemos el temporizador, seguira ejecutandose en segundo plano. Podria llegar a 0 y ejecutar tiempoAgotado() mientras el usuario ve el feedback, causando errores.",
    },
    {
      id: "js-24-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt: "Completa la funcion que genera el HTML de las opciones con letras (A, B, C, D) usando String.fromCharCode:",
      codeTemplate: {
        html: "",
        cssPrefix: "function renderizarOpciones(pregunta) {\n  return pregunta.opciones.map((opcion, indice) => {\n    const letra = ",
        cssSuffix: ";\n    return `<button onclick=\"seleccionarRespuesta(${indice})\">${letra}. ${opcion}</button>`;\n  }).join('');\n}",
        blanks: ["String.fromCharCode(65 + indice)"],
      },
      validation: { type: "includes", answer: ["String.fromCharCode", "65", "indice"] },
      hint: "El codigo ASCII de 'A' es 65. A=65, B=66, C=67, D=68.",
      explanation: "String.fromCharCode(65 + indice) convierte el indice en una letra: 65+0='A', 65+1='B', 65+2='C', 65+3='D'. Es una forma elegante de generar etiquetas de opcion.",
    },
  ],
};
