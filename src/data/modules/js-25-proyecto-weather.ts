import type { ModuleData } from "@/types";

export const jsProyectoWeatherModule: ModuleData = {
  slug: "js-proyecto-weather",
  title: "Proyecto: App del Clima",
  description:
    "Construye una aplicacion del clima que consume una API real: fetch, async/await y renderizado dinamico.",
  order: 125,
  category: "js-projects",
  icon: "CloudSun",
  dojo: "js",
  lessons: [
    {
      id: "js25-leccion-01",
      title: "Consumir una API del clima",
      content: `## Proyecto: Weather App

Vamos a construir una app que muestre el clima de cualquier ciudad usando una API publica.

### APIs publicas de clima

Usaremos **wttr.in**, una API gratuita que no requiere API key:

\`\`\`
https://wttr.in/Madrid?format=j1
\`\`\`

### Estructura de los datos

La API devuelve un objeto con:
- Temperatura actual
- Descripcion del clima
- Humedad
- Velocidad del viento
- Pronostico por dias

### Pasos del proyecto
1. Crear la interfaz (input + boton + area de resultados)
2. Hacer la peticion con fetch
3. Procesar la respuesta JSON
4. Renderizar los datos en el DOM
5. Manejar errores (ciudad no encontrada, sin conexion)

### Patron MVC simplificado
- **Model:** los datos del clima
- **View:** el HTML que se renderiza
- **Controller:** las funciones que conectan datos con vista

> Este proyecto integra fetch, async/await, DOM, eventos y manejo de errores.`,
      codeExample: {
        html: '<div id="weather-app">\n  <h3>Clima App</h3>\n  <div class="search">\n    <input id="city-input" placeholder="Nombre de la ciudad..." />\n    <button id="buscar">Buscar</button>\n  </div>\n  <div id="weather-result"></div>\n</div>',
        css: '#weather-app { max-width: 400px; } .search { display: flex; gap: 4px; margin-bottom: 12px; } #city-input { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #buscar { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; } #weather-result { padding: 16px; background: #313244; border-radius: 8px; color: #cdd6f4; min-height: 60px; } .weather-icon { font-size: 40px; } .temp { font-size: 32px; font-weight: bold; color: #f9e2af; } .detail { font-size: 13px; color: #a6adc8; margin: 2px 0; }',
        js: `var resultado = document.getElementById("weather-result");

async function buscarClima(ciudad) {
  resultado.innerHTML = '<p style="color:#a6adc8;">Buscando clima de ' + ciudad + '...</p>';

  try {
    var response = await fetch("https://wttr.in/" + encodeURIComponent(ciudad) + "?format=j1");
    if (!response.ok) throw new Error("Ciudad no encontrada");
    var data = await response.json();
    mostrarClima(data, ciudad);
  } catch (error) {
    resultado.innerHTML = '<p style="color:#f38ba8;">Error: ' + error.message + '</p>';
  }
}

function mostrarClima(data, ciudad) {
  var current = data.current_condition[0];
  var temp = current.temp_C;
  var desc = current.lang_es && current.lang_es[0] ? current.lang_es[0].value : current.weatherDesc[0].value;
  var humedad = current.humidity;
  var viento = current.windspeedKmph;
  var sensacion = current.FeelsLikeC;

  resultado.innerHTML =
    '<div style="text-align:center;">' +
    '<p style="font-size:14px;color:#89b4fa;">' + ciudad + '</p>' +
    '<p class="temp">' + temp + ' C</p>' +
    '<p style="color:#cdd6f4;">' + desc + '</p>' +
    '<div style="margin-top:8px;">' +
    '<p class="detail">Sensacion termica: ' + sensacion + ' C</p>' +
    '<p class="detail">Humedad: ' + humedad + '%</p>' +
    '<p class="detail">Viento: ' + viento + ' km/h</p>' +
    '</div></div>';
}

document.getElementById("buscar").addEventListener("click", function() {
  var ciudad = document.getElementById("city-input").value.trim();
  if (ciudad) buscarClima(ciudad);
});

document.getElementById("city-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") document.getElementById("buscar").click();
});

// Mostrar clima inicial
buscarClima("Madrid");`,
        editable: true,
      },
      order: 1,
    },
    {
      id: "js25-leccion-02",
      title: "Pronostico y mejoras visuales",
      content: `## Pronostico extendido

La API de wttr.in tambien proporciona pronostico para los proximos dias:

\`\`\`javascript
const forecast = data.weather; // array de dias
forecast.forEach(function(dia) {
  dia.date       // "2024-01-15"
  dia.maxtempC   // temperatura maxima
  dia.mintempC   // temperatura minima
});
\`\`\`

### Mejoras visuales

1. **Iconos del clima:** Usar emojis o iconos segun la condicion
2. **Colores de temperatura:** Azul para frio, amarillo para templado, rojo para calor
3. **Gradientes de fondo:** Cambiar segun la hora o el clima
4. **Animaciones:** Transiciones suaves al cargar datos

### Funcion para icono del clima
\`\`\`javascript
function getIcono(codigo) {
  const iconos = {
    "sunny": "☀️",
    "cloudy": "☁️",
    "rain": "🌧️",
    "snow": "❄️"
  };
  return iconos[codigo] || "🌤️";
}
\`\`\`

### Manejo de estados de carga

Siempre muestra al usuario que esta pasando:
- **Cargando:** skeleton o spinner
- **Exito:** datos del clima
- **Error:** mensaje descriptivo

> **UX:** Muestra un estado de carga mientras fetch trabaja. Nunca dejes la UI sin feedback.`,
      codeExample: {
        html: '<div id="wapp2">\n  <div class="search">\n    <input id="city2" placeholder="Ciudad..." value="Buenos Aires" />\n    <button id="buscar2">Ver pronostico</button>\n  </div>\n  <div id="forecast"></div>\n</div>',
        css: '#wapp2 { max-width: 450px; } .search { display: flex; gap: 4px; margin-bottom: 12px; } #city2 { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #buscar2 { padding: 8px 12px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; } #forecast { display: flex; flex-direction: column; gap: 6px; } .dia-card { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #313244; border-radius: 8px; } .dia-fecha { font-size: 13px; color: #89b4fa; } .dia-desc { font-size: 12px; color: #a6adc8; } .dia-temps { text-align: right; } .dia-max { color: #f9e2af; font-weight: bold; } .dia-min { color: #89b4fa; font-size: 13px; }',
        js: `var forecast = document.getElementById("forecast");

function getIconoClima(desc) {
  desc = desc.toLowerCase();
  if (desc.indexOf("sun") > -1 || desc.indexOf("clear") > -1) return "* ";
  if (desc.indexOf("cloud") > -1 || desc.indexOf("overcast") > -1) return "~ ";
  if (desc.indexOf("rain") > -1 || desc.indexOf("drizzle") > -1) return "// ";
  if (desc.indexOf("snow") > -1) return "** ";
  if (desc.indexOf("thunder") > -1) return "! ";
  return ". ";
}

async function verPronostico(ciudad) {
  forecast.innerHTML = '<p style="color:#a6adc8;text-align:center;">Cargando pronostico...</p>';

  try {
    var res = await fetch("https://wttr.in/" + encodeURIComponent(ciudad) + "?format=j1");
    if (!res.ok) throw new Error("No se encontro la ciudad");
    var data = await res.json();

    var html = '<p style="text-align:center;color:#cdd6f4;margin-bottom:8px;">Pronostico para <strong>' + ciudad + '</strong></p>';
    var dias = data.weather || [];

    dias.forEach(function(dia) {
      var desc = dia.hourly && dia.hourly[4] ? dia.hourly[4].weatherDesc[0].value : "N/A";
      var icono = getIconoClima(desc);
      html += '<div class="dia-card">' +
        '<div><span class="dia-fecha">' + icono + dia.date + '</span><br/><span class="dia-desc">' + desc + '</span></div>' +
        '<div class="dia-temps"><span class="dia-max">' + dia.maxtempC + ' C</span><br/><span class="dia-min">' + dia.mintempC + ' C</span></div>' +
        '</div>';
    });

    forecast.innerHTML = html;
  } catch (err) {
    forecast.innerHTML = '<p style="color:#f38ba8;text-align:center;">Error: ' + err.message + '</p>';
  }
}

document.getElementById("buscar2").addEventListener("click", function() {
  var c = document.getElementById("city2").value.trim();
  if (c) verPronostico(c);
});

verPronostico("Buenos Aires");`,
        editable: true,
      },
      order: 2,
    },
    {
      id: "js25-leccion-03",
      title: "Geolocalizacion y cache",
      content: `## Funcionalidades avanzadas

### Geolocalizacion del navegador

Detecta la ubicacion del usuario automaticamente:

\`\`\`javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      buscarClimaPorCoordenadas(lat, lon);
    },
    function(error) {
      console.error("Error de geolocalizacion:", error);
    }
  );
}
\`\`\`

### Cache de resultados

Evita peticiones repetidas guardando resultados temporalmente:

\`\`\`javascript
const cache = {};
async function buscarConCache(ciudad) {
  const cacheKey = ciudad.toLowerCase();
  if (cache[cacheKey]) {
    return cache[cacheKey]; // usar cache
  }
  const datos = await fetchClima(ciudad);
  cache[cacheKey] = datos;
  setTimeout(function() {
    delete cache[cacheKey];
  }, 300000); // expira en 5 min
  return datos;
}
\`\`\`

### Conceptos aplicados
- **fetch + async/await** para consumir APIs
- **DOM manipulation** para renderizar resultados
- **Eventos** para busqueda y teclado
- **Manejo de errores** para peticiones fallidas
- **localStorage** para ciudades favoritas
- **Geolocalizacion API** del navegador

> Este proyecto demuestra como construir una aplicacion real que consume datos externos y los presenta al usuario.`,
      codeExample: {
        html: '<div id="wapp3">\n  <h3>Clima - Ciudades Favoritas</h3>\n  <div class="search">\n    <input id="city3" placeholder="Ciudad..." />\n    <button id="add-fav">Agregar favorita</button>\n  </div>\n  <div id="favs"></div>\n  <div id="weather3"></div>\n</div>',
        css: '#wapp3 { max-width: 450px; } .search { display: flex; gap: 4px; margin-bottom: 8px; } #city3 { flex: 1; padding: 8px; border: 1px solid #45475a; border-radius: 4px; background: #313244; color: #cdd6f4; } #add-fav { padding: 8px 12px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; font-size: 13px; } #favs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; } .fav-btn { padding: 4px 10px; background: #313244; color: #89b4fa; border: 1px solid #45475a; border-radius: 20px; cursor: pointer; font-size: 12px; } .fav-btn:hover { background: #45475a; } .fav-btn .remove { color: #f38ba8; margin-left: 4px; } #weather3 { padding: 16px; background: #313244; border-radius: 8px; color: #cdd6f4; min-height: 40px; text-align: center; }',
        js: `var FAV_KEY = "dojo_weather_favs";
var weather3 = document.getElementById("weather3");

function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch(e) { return []; }
}

function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function renderFavs() {
  var favs = getFavs();
  var container = document.getElementById("favs");
  container.innerHTML = "";
  favs.forEach(function(ciudad) {
    var btn = document.createElement("button");
    btn.className = "fav-btn";
    btn.innerHTML = ciudad + ' <span class="remove">x</span>';
    btn.addEventListener("click", function(e) {
      if (e.target.classList.contains("remove")) {
        var f = getFavs().filter(function(c) { return c !== ciudad; });
        saveFavs(f);
        renderFavs();
      } else {
        buscar3(ciudad);
      }
    });
    container.appendChild(btn);
  });
}

async function buscar3(ciudad) {
  weather3.innerHTML = '<p style="color:#a6adc8;">Buscando...</p>';
  try {
    var res = await fetch("https://wttr.in/" + encodeURIComponent(ciudad) + "?format=j1");
    if (!res.ok) throw new Error("Ciudad no encontrada");
    var data = await res.json();
    var c = data.current_condition[0];
    var desc = c.lang_es && c.lang_es[0] ? c.lang_es[0].value : c.weatherDesc[0].value;
    weather3.innerHTML =
      '<p style="color:#89b4fa;font-size:14px;">' + ciudad + '</p>' +
      '<p style="font-size:28px;font-weight:bold;color:#f9e2af;">' + c.temp_C + ' C</p>' +
      '<p>' + desc + '</p>' +
      '<p style="font-size:12px;color:#a6adc8;">Humedad: ' + c.humidity + '% | Viento: ' + c.windspeedKmph + ' km/h</p>';
  } catch(e) {
    weather3.innerHTML = '<p style="color:#f38ba8;">' + e.message + '</p>';
  }
}

document.getElementById("add-fav").addEventListener("click", function() {
  var ciudad = document.getElementById("city3").value.trim();
  if (!ciudad) return;
  var favs = getFavs();
  if (favs.indexOf(ciudad) === -1) {
    favs.push(ciudad);
    saveFavs(favs);
    renderFavs();
  }
  buscar3(ciudad);
  document.getElementById("city3").value = "";
});

renderFavs();
weather3.innerHTML = '<p style="color:#a6adc8;">Agrega una ciudad favorita o busca el clima.</p>';`,
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "js25-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Que funcion se usa para codificar caracteres especiales en una URL?",
      options: [
        { id: "a", text: "encodeURL()", isCorrect: false },
        { id: "b", text: "encodeURIComponent()", isCorrect: true },
        { id: "c", text: "escape()", isCorrect: false },
        { id: "d", text: "formatURL()", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Codifica componentes de una URI.",
      explanation: "encodeURIComponent() codifica caracteres especiales como espacios y acentos para que sean seguros en una URL.",
    },
    {
      id: "js25-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que API del navegador permite obtener la ubicacion geografica del usuario?",
      options: [
        { id: "a", text: "navigator.location", isCorrect: false },
        { id: "b", text: "navigator.geolocation", isCorrect: true },
        { id: "c", text: "window.position", isCorrect: false },
        { id: "d", text: "document.location", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "geo + location = geolocalizacion.",
      explanation: "navigator.geolocation proporciona acceso a la ubicacion geografica del dispositivo del usuario.",
    },
    {
      id: "js25-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Por que es buena practica implementar cache para peticiones a APIs?",
      options: [
        { id: "a", text: "Para hacer el codigo mas complejo", isCorrect: false },
        { id: "b", text: "Para evitar peticiones repetidas y mejorar rendimiento", isCorrect: true },
        { id: "c", text: "Porque las APIs lo requieren", isCorrect: false },
        { id: "d", text: "Para que funcione sin internet", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Reducir peticiones innecesarias beneficia al usuario y al servidor.",
      explanation: "El cache evita peticiones repetidas, mejorando el rendimiento y reduciendo la carga en el servidor de la API.",
    },
    {
      id: "js25-ej-04",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Completa para hacer una peticion GET con fetch y esperar la respuesta:",
      codeTemplate: {
        html: "",
        cssPrefix: "const response = ",
        cssSuffix: " fetch(url);",
        blanks: ["await"],
      },
      validation: { type: "exact", answer: "await" },
      hint: "La palabra clave que pausa la ejecucion hasta que la Promise se resuelva.",
      explanation: "await pausa la ejecucion de la funcion async hasta que fetch() complete la peticion.",
    },
    {
      id: "js25-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Que patron de arquitectura separa datos, vista y logica de control?",
      options: [
        { id: "a", text: "Singleton", isCorrect: false },
        { id: "b", text: "Observer", isCorrect: false },
        { id: "c", text: "MVC (Model-View-Controller)", isCorrect: true },
        { id: "d", text: "Factory", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Model (datos), View (vista), Controller (control).",
      explanation: "MVC separa la aplicacion en Model (datos), View (interfaz) y Controller (logica que los conecta).",
    },
    {
      id: "js25-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Que deberias mostrar al usuario mientras una peticion fetch esta en progreso?",
      options: [
        { id: "a", text: "Nada, dejarlo en blanco", isCorrect: false },
        { id: "b", text: "Un indicador de carga (spinner o skeleton)", isCorrect: true },
        { id: "c", text: "Un mensaje de error", isCorrect: false },
        { id: "d", text: "Los datos anteriores", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El usuario necesita saber que algo esta pasando.",
      explanation: "Mostrar un indicador de carga informa al usuario que la aplicacion esta trabajando. Nunca dejes la UI sin feedback.",
    },
  ],
};
