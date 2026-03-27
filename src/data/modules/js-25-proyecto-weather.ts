import type { ModuleData } from "@/types";

export const jsProyectoWeatherModule: ModuleData = {
  slug: "js-proyecto-weather",
  title: "Proyecto: App del Clima",
  description:
    "Construye una aplicacion del clima completa: consulta APIs, maneja input del usuario, muestra datos dinamicamente, gestiona estados de carga y error, y practica async/await.",
  order: 125,
  category: "js-projects",
  icon: "cloud",
  dojo: "js",
  lessons: [
    {
      id: "js-25-leccion-01",
      title: "Estructura de la app y la API del clima",
      content: `## Proyecto Weather: Estructura y API

### Que vamos a construir?

Una app del clima que:
- Permite buscar el clima por ciudad
- Muestra temperatura, descripcion, humedad y viento
- Tiene estados de carga y error
- Muestra iconos segun el clima
- Guarda la ultima busqueda

### La API que usaremos

Usaremos una **API simulada** para practicar sin necesitar una API key. En una app real, usarias OpenWeatherMap, WeatherAPI, etc.

\`\`\`javascript
// Simulacion de API del clima
function simularAPI(ciudad) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ciudades = {
        'madrid': {
          ciudad: 'Madrid', pais: 'ES',
          temperatura: 22, sensacion: 20,
          descripcion: 'Cielo despejado',
          icono: '☀️', humedad: 45, viento: 12,
        },
        'mexico': {
          ciudad: 'Ciudad de Mexico', pais: 'MX',
          temperatura: 18, sensacion: 17,
          descripcion: 'Parcialmente nublado',
          icono: '⛅', humedad: 65, viento: 8,
        },
        'buenos aires': {
          ciudad: 'Buenos Aires', pais: 'AR',
          temperatura: 15, sensacion: 13,
          descripcion: 'Lluvia ligera',
          icono: '🌧️', humedad: 80, viento: 20,
        },
        'bogota': {
          ciudad: 'Bogota', pais: 'CO',
          temperatura: 14, sensacion: 12,
          descripcion: 'Nublado',
          icono: '☁️', humedad: 75, viento: 15,
        },
        'lima': {
          ciudad: 'Lima', pais: 'PE',
          temperatura: 20, sensacion: 19,
          descripcion: 'Niebla',
          icono: '🌫️', humedad: 88, viento: 6,
        },
      };

      const resultado = ciudades[ciudad.toLowerCase()];
      if (resultado) {
        resolve(resultado);
      } else {
        reject(new Error(\`Ciudad "\${ciudad}" no encontrada\`));
      }
    }, 800); // Simular latencia de red
  });
}
\`\`\`

### Estado de la aplicacion

\`\`\`javascript
let estado = {
  clima: null,       // Datos del clima actual
  cargando: false,   // Esta cargando?
  error: null,       // Mensaje de error
  ultimaBusqueda: '', // Ultima ciudad buscada
};
\`\`\`

### Estructura HTML base

\`\`\`html
<div id="app" style="font-family: system-ui; max-width: 400px;
                     margin: 0 auto; padding: 20px;">
  <h2 style="text-align: center; margin-bottom: 16px;">
    Clima App
  </h2>
  <div id="contenido"></div>
</div>
\`\`\`

> **Nota:** En una app real, reemplazarias simularAPI() por fetch() a una API como OpenWeatherMap. La estructura de la app seria la misma.`,
      order: 1,
    },
    {
      id: "js-25-leccion-02",
      title: "Busqueda y estados de carga",
      content: `## Busqueda y estados de carga

### Funcion de busqueda con async/await

\`\`\`javascript
async function buscarClima(ciudad) {
  // Validar input
  if (!ciudad.trim()) {
    estado.error = 'Por favor ingresa una ciudad';
    renderizar();
    return;
  }

  // Iniciar estado de carga
  estado.cargando = true;
  estado.error = null;
  renderizar();

  try {
    const datos = await simularAPI(ciudad);
    estado.clima = datos;
    estado.ultimaBusqueda = ciudad;
    estado.error = null;

    // Guardar ultima busqueda
    localStorage.setItem('ultimaCiudad', ciudad);
  } catch (error) {
    estado.clima = null;
    estado.error = error.message;
  } finally {
    estado.cargando = false;
    renderizar();
  }
}
\`\`\`

### Renderizar estado de carga

\`\`\`javascript
function renderizarCargando() {
  return \`
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 40px; animation: spin 1s linear infinite;">⏳</div>
      <p style="color: #666; margin-top: 12px;">Buscando clima...</p>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    </div>
  \`;
}
\`\`\`

### Renderizar estado de error

\`\`\`javascript
function renderizarError() {
  return \`
    <div style="text-align: center; padding: 20px; background: #ffebee;
                border-radius: 8px; margin-top: 12px;">
      <div style="font-size: 32px;">😕</div>
      <p style="color: #c62828; font-weight: bold; margin: 8px 0;">
        \${estado.error}
      </p>
      <p style="color: #666; font-size: 14px;">
        Intenta con: Madrid, Mexico, Buenos Aires, Bogota o Lima
      </p>
    </div>
  \`;
}
\`\`\`

### Renderizar formulario de busqueda

\`\`\`javascript
function renderizarBuscador() {
  return \`
    <form id="form-buscar" style="display: flex; gap: 8px;">
      <input type="text" id="input-ciudad"
        placeholder="Buscar ciudad..."
        value="\${estado.ultimaBusqueda}"
        style="flex: 1; padding: 10px 14px; border: 2px solid #ddd;
               border-radius: 8px; font-size: 15px; outline: none;"
        onfocus="this.style.borderColor='#1976d2'"
        onblur="this.style.borderColor='#ddd'"
      >
      <button type="submit"
        style="padding: 10px 20px; background: #1976d2; color: white;
               border: none; border-radius: 8px; cursor: pointer;
               font-size: 15px;"
        \${estado.cargando ? 'disabled' : ''}>
        🔍
      </button>
    </form>
  \`;
}
\`\`\`

### Conectar el formulario

\`\`\`javascript
function conectarEventos() {
  const form = document.getElementById('form-buscar');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const ciudad = document.getElementById('input-ciudad').value;
      buscarClima(ciudad);
    });
  }
}
\`\`\`

> **Patron clave:** La funcion buscarClima maneja 3 estados: cargando (true al inicio), exito (datos recibidos) y error (catch). Renderizamos despues de cada cambio de estado.`,
      order: 2,
    },
    {
      id: "js-25-leccion-03",
      title: "Mostrando datos del clima",
      content: `## Mostrando datos del clima

### Renderizar tarjeta del clima

\`\`\`javascript
function renderizarClima() {
  const c = estado.clima;
  if (!c) return '';

  return \`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px; padding: 24px; color: white; margin-top: 16px;">

      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <h3 style="font-size: 20px; margin: 0;">
            \${c.ciudad}
          </h3>
          <p style="opacity: 0.8; margin: 4px 0;">\${c.pais}</p>
        </div>
        <div style="font-size: 48px;">\${c.icono}</div>
      </div>

      <div style="margin: 16px 0;">
        <div style="font-size: 48px; font-weight: bold;">
          \${c.temperatura}°C
        </div>
        <p style="opacity: 0.9; margin: 4px 0;">
          Sensacion: \${c.sensacion}°C
        </p>
        <p style="font-size: 16px; text-transform: capitalize;">
          \${c.descripcion}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr;
                  gap: 12px; margin-top: 16px; padding-top: 16px;
                  border-top: 1px solid rgba(255,255,255,0.3);">
        <div>
          <p style="opacity: 0.7; font-size: 13px; margin: 0;">Humedad</p>
          <p style="font-size: 18px; font-weight: bold; margin: 4px 0;">
            💧 \${c.humedad}%
          </p>
        </div>
        <div>
          <p style="opacity: 0.7; font-size: 13px; margin: 0;">Viento</p>
          <p style="font-size: 18px; font-weight: bold; margin: 4px 0;">
            💨 \${c.viento} km/h
          </p>
        </div>
      </div>
    </div>
  \`;
}
\`\`\`

### Renderizado principal completo

\`\`\`javascript
function renderizar() {
  const app = document.getElementById('app');

  let contenido = renderizarBuscador();

  if (estado.cargando) {
    contenido += renderizarCargando();
  } else if (estado.error) {
    contenido += renderizarError();
  } else if (estado.clima) {
    contenido += renderizarClima();
  } else {
    contenido += \`
      <div style="text-align: center; padding: 40px; color: #999;">
        <div style="font-size: 48px; margin-bottom: 12px;">🌤️</div>
        <p>Busca una ciudad para ver el clima</p>
      </div>
    \`;
  }

  app.innerHTML = contenido;
  conectarEventos();
}
\`\`\`

### Ciudades sugeridas

\`\`\`javascript
function renderizarSugerencias() {
  const ciudades = ['Madrid', 'Mexico', 'Buenos Aires', 'Bogota', 'Lima'];

  return \`
    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;">
      \${ciudades.map(ciudad => \`
        <button onclick="buscarClima('\${ciudad}')"
          style="padding: 4px 12px; background: #f5f5f5; border: 1px solid #ddd;
                 border-radius: 16px; cursor: pointer; font-size: 13px;
                 color: #555;">
          \${ciudad}
        </button>
      \`).join('')}
    </div>
  \`;
}
\`\`\`

> **Consejo de diseno:** Los gradientes y bordes redondeados dan un aspecto moderno a la tarjeta. Los iconos emoji son una forma rapida de agregar visuales sin imagenes.`,
      order: 3,
    },
    {
      id: "js-25-leccion-04",
      title: "Funcionalidades avanzadas y app completa",
      content: `## Funcionalidades avanzadas y app completa

### Cargar ultima busqueda al iniciar

\`\`\`javascript
function inicializarApp() {
  const ultimaCiudad = localStorage.getItem('ultimaCiudad');
  if (ultimaCiudad) {
    estado.ultimaBusqueda = ultimaCiudad;
    buscarClima(ultimaCiudad);
  } else {
    renderizar();
  }
}
\`\`\`

### Historial de busquedas

\`\`\`javascript
function agregarAlHistorial(ciudad) {
  let historial = JSON.parse(localStorage.getItem('historialClima') || '[]');

  // Evitar duplicados
  historial = historial.filter(c => c.toLowerCase() !== ciudad.toLowerCase());

  // Agregar al inicio
  historial.unshift(ciudad);

  // Limitar a 5 entradas
  historial = historial.slice(0, 5);

  localStorage.setItem('historialClima', JSON.stringify(historial));
}

function renderizarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historialClima') || '[]');
  if (historial.length === 0) return '';

  return \`
    <div style="margin-top: 12px;">
      <p style="font-size: 13px; color: #999; margin-bottom: 6px;">Recientes:</p>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        \${historial.map(ciudad => \`
          <button onclick="buscarClima('\${ciudad}')"
            style="padding: 4px 12px; background: #e3f2fd; border: none;
                   border-radius: 16px; cursor: pointer; font-size: 13px;
                   color: #1976d2;">
            \${ciudad}
          </button>
        \`).join('')}
      </div>
    </div>
  \`;
}
\`\`\`

### App completa

\`\`\`javascript
// === Estado ===
let estado = {
  clima: null,
  cargando: false,
  error: null,
  ultimaBusqueda: '',
};

// === API simulada ===
function simularAPI(ciudad) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ciudades = {
        'madrid': { ciudad: 'Madrid', pais: 'ES', temperatura: 22,
          sensacion: 20, descripcion: 'Cielo despejado', icono: '☀️',
          humedad: 45, viento: 12 },
        'mexico': { ciudad: 'Ciudad de Mexico', pais: 'MX', temperatura: 18,
          sensacion: 17, descripcion: 'Parcialmente nublado', icono: '⛅',
          humedad: 65, viento: 8 },
        'buenos aires': { ciudad: 'Buenos Aires', pais: 'AR', temperatura: 15,
          sensacion: 13, descripcion: 'Lluvia ligera', icono: '🌧️',
          humedad: 80, viento: 20 },
        'bogota': { ciudad: 'Bogota', pais: 'CO', temperatura: 14,
          sensacion: 12, descripcion: 'Nublado', icono: '☁️',
          humedad: 75, viento: 15 },
        'lima': { ciudad: 'Lima', pais: 'PE', temperatura: 20,
          sensacion: 19, descripcion: 'Niebla', icono: '🌫️',
          humedad: 88, viento: 6 },
      };
      const r = ciudades[ciudad.toLowerCase()];
      r ? resolve(r) : reject(new Error(\`Ciudad "\${ciudad}" no encontrada\`));
    }, 800);
  });
}

// === Logica ===
async function buscarClima(ciudad) {
  if (!ciudad.trim()) {
    estado.error = 'Por favor ingresa una ciudad';
    renderizar();
    return;
  }

  estado.cargando = true;
  estado.error = null;
  renderizar();

  try {
    const datos = await simularAPI(ciudad);
    estado.clima = datos;
    estado.ultimaBusqueda = ciudad;
    estado.error = null;
    agregarAlHistorial(datos.ciudad);
    localStorage.setItem('ultimaCiudad', ciudad);
  } catch (error) {
    estado.clima = null;
    estado.error = error.message;
  } finally {
    estado.cargando = false;
    renderizar();
  }
}

// === Renderizado ===
// (renderizarBuscador, renderizarCargando, renderizarError,
//  renderizarClima, renderizar, conectarEventos)

// === Inicio ===
inicializarApp();
\`\`\`

### Con una API real (OpenWeatherMap)

\`\`\`javascript
// Reemplazar simularAPI por:
async function obtenerClima(ciudad) {
  const API_KEY = 'tu-api-key';
  const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${ciudad}&units=metric&lang=es&appid=\${API_KEY}\`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Ciudad no encontrada');
  }

  const data = await response.json();
  return {
    ciudad: data.name,
    pais: data.sys.country,
    temperatura: Math.round(data.main.temp),
    sensacion: Math.round(data.main.feels_like),
    descripcion: data.weather[0].description,
    icono: data.weather[0].icon,
    humedad: data.main.humidity,
    viento: Math.round(data.wind.speed * 3.6),
  };
}
\`\`\`

> **Proyecto completo!** Has aprendido a: comunicarte con APIs, manejar estados (carga/error/exito), renderizar datos dinamicos y persistir con localStorage. Estas listo para construir cualquier app front-end!`,
      order: 4,
    },
  ],
  exercises: [
    {
      id: "js-25-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "Cuales son los 3 estados principales que maneja la app del clima?",
      options: [
        { id: "a", text: "Inicio, medio, final", isCorrect: false },
        { id: "b", text: "Cargando, exito (datos), error", isCorrect: true },
        { id: "c", text: "GET, POST, DELETE", isCorrect: false },
        { id: "d", text: "HTML, CSS, JavaScript", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Piensa en que puede pasar cuando haces una peticion a una API.",
      explanation: "Toda app que consume APIs maneja 3 estados: cargando (esperando respuesta), exito (datos recibidos) y error (algo fallo). Cada estado requiere una UI diferente.",
    },
    {
      id: "js-25-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa la funcion async que busca el clima y maneja los 3 estados:",
      codeTemplate: {
        html: "",
        cssPrefix: "async function buscarClima(ciudad) {\n  estado.cargando = true;\n  estado.error = null;\n  renderizar();\n\n  ",
        cssSuffix: " {\n    const datos = await simularAPI(ciudad);\n    estado.clima = datos;\n  } catch (error) {\n    estado.error = error.message;\n  } finally {\n    estado.cargando = false;\n    renderizar();\n  }\n}",
        blanks: ["try"],
      },
      validation: { type: "includes", answer: ["try"] },
      hint: "Que estructura usamos para manejar errores en funciones async?",
      explanation: "try/catch/finally es el patron estandar para manejar errores en funciones async. try contiene el codigo que puede fallar, catch maneja el error y finally siempre se ejecuta.",
    },
    {
      id: "js-25-ej-03",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 3,
      prompt: "Completa la funcion de renderizado condicional que muestra diferente contenido segun el estado:",
      codeTemplate: {
        html: "",
        cssPrefix: "function renderizar() {\n  const app = document.getElementById('app');\n  let contenido = renderizarBuscador();\n\n  if (estado.cargando) {\n    contenido += renderizarCargando();\n  } else if (",
        cssSuffix: ") {\n    contenido += renderizarError();\n  } else if (estado.clima) {\n    contenido += renderizarClima();\n  }\n\n  app.innerHTML = contenido;\n  conectarEventos();\n}",
        blanks: ["estado.error"],
      },
      validation: { type: "includes", answer: ["estado.error"] },
      hint: "Que propiedad del estado indica que hay un error?",
      explanation: "Verificamos estado.error para saber si hay un mensaje de error. El orden importa: primero cargando, luego error, luego datos. Asi el estado de carga tiene prioridad.",
    },
    {
      id: "js-25-ej-04",
      type: "quiz",
      difficulty: 2,
      xpReward: 15,
      order: 4,
      prompt: "Por que usamos finally en la funcion buscarClima para poner cargando = false?",
      options: [
        { id: "a", text: "Porque es mas rapido que ponerlo en try y catch", isCorrect: false },
        { id: "b", text: "Porque finally se ejecuta siempre, garantizando que el loading se desactive tanto en exito como en error", isCorrect: true },
        { id: "c", text: "Porque catch no se ejecuta si hay error", isCorrect: false },
        { id: "d", text: "No es necesario, es solo por estilo de codigo", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Que pasaria si solo ponemos cargando = false en el try y hay un error?",
      explanation: "finally garantiza que cargando se ponga en false sin importar si la peticion fue exitosa o fallo. Sin finally, tendriamos que duplicar cargando = false en try y catch.",
    },
    {
      id: "js-25-ej-05",
      type: "code-completion",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Completa la funcion que guarda el historial de busquedas en localStorage sin duplicados y con maximo 5 entradas:",
      codeTemplate: {
        html: "",
        cssPrefix: "function agregarAlHistorial(ciudad) {\n  let historial = JSON.parse(localStorage.getItem('historial') || '[]');\n  historial = historial.filter(c => c.toLowerCase() !== ciudad.toLowerCase());\n  ",
        cssSuffix: "\n  historial = historial.slice(0, 5);\n  localStorage.setItem('historial', JSON.stringify(historial));\n}",
        blanks: ["historial.unshift(ciudad);"],
      },
      validation: { type: "includes", answer: ["unshift", "ciudad"] },
      hint: "Que metodo de array agrega un elemento al INICIO?",
      explanation: "unshift() agrega al inicio del array, poniendo la busqueda mas reciente primero. Luego slice(0, 5) limita a las 5 mas recientes.",
    },
    {
      id: "js-25-ej-06",
      type: "code-completion",
      difficulty: 3,
      xpReward: 25,
      order: 6,
      prompt: "Completa la funcion que transforma los datos de una API real (OpenWeatherMap) al formato que usa nuestra app:",
      codeTemplate: {
        html: "",
        cssPrefix: "function transformarDatos(data) {\n  return {\n    ciudad: data.name,\n    pais: data.sys.country,\n    temperatura: ",
        cssSuffix: ",\n    descripcion: data.weather[0].description,\n    humedad: data.main.humidity,\n    viento: Math.round(data.wind.speed * 3.6),\n  };\n}",
        blanks: ["Math.round(data.main.temp)"],
      },
      validation: { type: "includes", answer: ["Math.round", "data.main.temp"] },
      hint: "La temperatura viene con decimales, necesitas redondearla.",
      explanation: "Math.round(data.main.temp) redondea la temperatura a un entero. Transformar los datos de la API a un formato propio desacopla tu app de la estructura de una API especifica.",
    },
  ],
};
