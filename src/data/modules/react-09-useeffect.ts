import type { ModuleData } from "@/types";

export const reactUseEffectModule: ModuleData = {
  slug: "react-useeffect",
  title: "useEffect: Efectos Secundarios",
  description:
    "Domina el hook useEffect para manejar efectos secundarios: suscripciones, peticiones de datos, manipulacion del DOM y funciones de limpieza.",
  order: 209,
  category: "react-intermediate",
  icon: "refresh-cw",
  dojo: "react",
  lessons: [
    {
      id: "react09-leccion-01",
      title: "Introduccion a useEffect",
      content: `## useEffect: Efectos Secundarios en React

En React, un **efecto secundario** es cualquier operacion que interactua con el mundo exterior al componente:
- Peticiones HTTP (fetch)
- Suscripciones (WebSockets, eventos del DOM)
- Manipulacion directa del DOM
- Temporizadores (setTimeout, setInterval)

### Sintaxis basica

\`\`\`jsx
useEffect(() => {
  // Codigo del efecto
  document.title = "Nuevo titulo";
}, [dependencias]);
\`\`\`

### Cuando se ejecuta useEffect?

1. **Sin array de dependencias** — se ejecuta en cada render
2. **Array vacio \`[]\`** — solo al montar el componente
3. **Con dependencias \`[a, b]\`** — al montar y cuando cambie \`a\` o \`b\`

> **Regla clave:** useEffect se ejecuta **despues** del render, no durante el render.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

function Contador() {
  const [count, setCount] = useState(0);

  // Se ejecuta cada vez que count cambia
  useEffect(() => {
    document.title = \\\`Clicks: \\\${count}\\\`;
  }, [count]);

  return (
    <div>
      <h3>useEffect basico</h3>
      <p>Has hecho click {count} veces</p>
      <p style={{fontSize: 12, color: '#888'}}>
        Mira el titulo de la pestaña!
      </p>
      <button onClick={() => setCount(count + 1)}>
        Click +1
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Contador />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react09-leccion-02",
      title: "Array de dependencias",
      content: `## El Array de Dependencias

El array de dependencias controla **cuando** se re-ejecuta el efecto.

### Sin dependencias (cada render)
\`\`\`jsx
useEffect(() => {
  console.log("Se ejecuta en CADA render");
});
\`\`\`

### Array vacio (solo al montar)
\`\`\`jsx
useEffect(() => {
  console.log("Solo al montar el componente");
}, []);
\`\`\`

### Con dependencias especificas
\`\`\`jsx
useEffect(() => {
  console.log("Se ejecuta cuando cambia 'query'");
  buscarDatos(query);
}, [query]);
\`\`\`

### Error comun: Loop infinito
\`\`\`jsx
// MAL - loop infinito!
useEffect(() => {
  setCount(count + 1); // Cambia estado -> re-render -> efecto -> ...
}, [count]);
\`\`\`

> **Regla:** Incluye en las dependencias TODAS las variables que uses dentro del efecto.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

function BuscadorUsuario() {
  const [userId, setUserId] = useState(1);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setCargando(true);
    fetch(\\\`https://jsonplaceholder.typicode.com/users/\\\${userId}\\\`)
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        setCargando(false);
      });
  }, [userId]); // Solo se ejecuta cuando userId cambia

  return (
    <div>
      <h3>Buscar Usuario por ID</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        {[1,2,3,4,5].map(id => (
          <button key={id}
            onClick={() => setUserId(id)}
            style={{
              background: userId === id ? '#89b4fa' : '#45475a',
              color: userId === id ? '#1e1e2e' : '#cdd6f4'
            }}>
            {id}
          </button>
        ))}
      </div>
      {cargando ? <p>Cargando...</p> : usuario && (
        <div style={{background:'#313244', padding:12, borderRadius:8}}>
          <p><strong>{usuario.name}</strong></p>
          <p>{usuario.email}</p>
          <p>{usuario.phone}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BuscadorUsuario />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; color: #cdd6f4; background: #1e1e2e; min-height: 200px; } button { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react09-leccion-03",
      title: "Funciones de limpieza (cleanup)",
      content: `## Cleanup en useEffect

Cuando un efecto crea suscripciones, temporizadores o listeners, necesitas **limpiarlos** para evitar memory leaks.

### Sintaxis
\`\`\`jsx
useEffect(() => {
  const intervalo = setInterval(() => {
    console.log("tick");
  }, 1000);

  // Funcion de limpieza
  return () => {
    clearInterval(intervalo);
  };
}, []);
\`\`\`

### Cuando se ejecuta el cleanup?
1. **Antes** de re-ejecutar el efecto (si las dependencias cambian)
2. Cuando el componente se **desmonta**

### Casos de uso comunes
- \`clearInterval\` / \`clearTimeout\`
- \`removeEventListener\`
- Cancelar peticiones fetch con AbortController
- Cerrar conexiones WebSocket

### AbortController para cancelar fetch
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });

  return () => controller.abort();
}, [url]);
\`\`\`

> **Importante:** Siempre limpia lo que crees. Si no, tendras bugs dificiles de encontrar.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

function Reloj() {
  const [hora, setHora] = useState(new Date());
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (!activo) return;

    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);

    // Cleanup: limpiar intervalo
    return () => clearInterval(intervalo);
  }, [activo]);

  return (
    <div>
      <h3>Reloj con Cleanup</h3>
      <p style={{fontSize: 32, fontFamily: 'monospace'}}>
        {hora.toLocaleTimeString()}
      </p>
      <button onClick={() => setActivo(!activo)}>
        {activo ? 'Pausar' : 'Reanudar'}
      </button>
      <p style={{fontSize: 12, color: '#888'}}>
        El intervalo se limpia al pausar o desmontar
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Reloj />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; text-align: center; } button { padding: 8px 20px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react09-leccion-04",
      title: "useEffect vs Event Handlers",
      content: `## Cuando usar useEffect vs Event Handlers

### Event Handlers — para acciones del usuario
\`\`\`jsx
// CORRECTO: responder a un click
function handleSubmit() {
  fetch('/api/submit', { method: 'POST', body: data });
}
\`\`\`

### useEffect — para sincronizar con sistemas externos
\`\`\`jsx
// CORRECTO: sincronizar titulo del documento
useEffect(() => {
  document.title = nombre;
}, [nombre]);
\`\`\`

### Errores comunes

**NO uses useEffect para:**
- Transformar datos para renderizar (hazlo durante el render)
- Manejar eventos del usuario (usa event handlers)
- Resetear estado cuando cambia una prop (usa \`key\`)

\`\`\`jsx
// MAL - innecesario
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// BIEN - calcular durante el render
const fullName = firstName + ' ' + lastName;
\`\`\`

> **Regla de oro:** Si puedes calcular algo durante el render, no necesitas useEffect.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

function Ejemplo() {
  const [items, setItems] = useState(['Manzana', 'Banana', 'Cereza']);
  const [filtro, setFiltro] = useState('');

  // BIEN: calcular durante el render, sin useEffect
  const itemsFiltrados = items.filter(item =>
    item.toLowerCase().includes(filtro.toLowerCase())
  );

  // BIEN: useEffect para sincronizar con el DOM
  useEffect(() => {
    document.title = \\\`\\\${itemsFiltrados.length} frutas\\\`;
  }, [itemsFiltrados.length]);

  // BIEN: event handler para accion del usuario
  const agregarItem = () => {
    const nuevas = ['Durazno', 'Fresa', 'Uva', 'Kiwi', 'Mango'];
    const random = nuevas[Math.floor(Math.random() * nuevas.length)];
    setItems([...items, random]);
  };

  return (
    <div>
      <h3>useEffect vs Event Handlers</h3>
      <input
        placeholder="Filtrar frutas..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{padding:8, marginBottom:8, width:'100%', boxSizing:'border-box'}}
      />
      <ul>
        {itemsFiltrados.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <button onClick={agregarItem}>Agregar fruta aleatoria</button>
      <p style={{fontSize:12, color:'#888'}}>
        Filtro = render. Agregar = event handler. Titulo = useEffect.
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Ejemplo />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } button { padding: 8px 16px; background: #cba6f7; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } input { border: 1px solid #ccc; border-radius: 6px; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react09-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Cuando se ejecuta un useEffect con array de dependencias vacio []?",
      options: [
        { id: "a", text: "En cada render del componente", isCorrect: false },
        { id: "b", text: "Solo cuando el componente se monta (primer render)", isCorrect: true },
        { id: "c", text: "Nunca se ejecuta", isCorrect: false },
        { id: "d", text: "Antes del primer render", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Un array vacio significa: sin dependencias que cambien.",
      explanation: "Con [] el efecto solo se ejecuta una vez, al montar el componente, porque no hay dependencias que puedan cambiar.",
    },
    {
      id: "react09-ej-02",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 2,
      prompt: "Que causa un loop infinito en useEffect?",
      options: [
        { id: "a", text: "Usar async/await dentro del efecto", isCorrect: false },
        { id: "b", text: "Modificar una variable de estado que esta en las dependencias", isCorrect: true },
        { id: "c", text: "No retornar nada del efecto", isCorrect: false },
        { id: "d", text: "Pasar un array vacio de dependencias", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Si el efecto modifica algo que lo vuelve a disparar...",
      explanation: "Si el efecto modifica un estado que esta en su array de dependencias, se crea un ciclo: efecto -> cambio estado -> re-render -> efecto -> ...",
    },
    {
      id: "react09-ej-03",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Completa el hook para que el efecto se ejecute solo cuando cambie 'query':",
      codeTemplate: {
        html: "",
        cssPrefix: "useEffect(() => {\n  fetchData(query);\n}, ",
        cssSuffix: ");",
        blanks: ["[query]"],
      },
      validation: { type: "exact", answer: "[query]" },
      hint: "Las dependencias van en un array.",
      explanation: "Se pasa [query] como array de dependencias para que el efecto solo se re-ejecute cuando el valor de query cambie.",
    },
    {
      id: "react09-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Clasifica cada caso: debe usar useEffect o un event handler?",
      dragItems: [
        { id: "d1", content: "Actualizar titulo del documento", correctZone: "useEffect" },
        { id: "d2", content: "Enviar formulario al servidor", correctZone: "eventHandler" },
        { id: "d3", content: "Suscribirse a WebSocket", correctZone: "useEffect" },
        { id: "d4", content: "Agregar item al carrito al hacer click", correctZone: "eventHandler" },
        { id: "d5", content: "Iniciar temporizador al montar", correctZone: "useEffect" },
        { id: "d6", content: "Navegar a otra pagina al presionar boton", correctZone: "eventHandler" },
      ],
      dropZones: [
        { id: "useEffect", label: "useEffect" },
        { id: "eventHandler", label: "Event Handler" },
      ],
      validation: { type: "exact", answer: { d1: "useEffect", d2: "eventHandler", d3: "useEffect", d4: "eventHandler", d5: "useEffect", d6: "eventHandler" } },
      hint: "useEffect = sincronizar con sistemas externos. Event handler = responder a acciones del usuario.",
      explanation: "useEffect es para sincronizacion con el mundo exterior (DOM, suscripciones). Los event handlers son para responder directamente a interacciones del usuario.",
    },
    {
      id: "react09-ej-05",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Completa la funcion de limpieza para limpiar un intervalo:",
      codeTemplate: {
        html: "",
        cssPrefix: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => ",
        cssSuffix: ";\n}, []);",
        blanks: ["clearInterval(id)"],
      },
      validation: { type: "exact", answer: "clearInterval(id)" },
      hint: "Usa clearInterval para detener el temporizador.",
      explanation: "La funcion de retorno del useEffect es el cleanup. clearInterval(id) detiene el intervalo cuando el componente se desmonta.",
    },
    {
      id: "react09-ej-06",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 6,
      prompt: "Cuando se ejecuta la funcion de cleanup de useEffect?",
      options: [
        { id: "a", text: "Solo al montar el componente", isCorrect: false },
        { id: "b", text: "Antes de cada re-ejecucion del efecto y al desmontar", isCorrect: true },
        { id: "c", text: "Solo al desmontar el componente", isCorrect: false },
        { id: "d", text: "Despues de cada render", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "El cleanup se ejecuta en dos momentos distintos.",
      explanation: "El cleanup se ejecuta antes de que el efecto se re-ejecute (si cambian las dependencias) y tambien cuando el componente se desmonta.",
    },
    {
      id: "react09-ej-07",
      type: "quiz",
      difficulty: 3 ,
      xpReward: 30,
      order: 7,
      prompt: "Cual de estos NO es un buen uso de useEffect?",
      options: [
        { id: "a", text: "Sincronizar el titulo del documento con el estado", isCorrect: false },
        { id: "b", text: "Calcular un valor derivado del estado para mostrarlo", isCorrect: true },
        { id: "c", text: "Suscribirse a un evento del navegador", isCorrect: false },
        { id: "d", text: "Hacer fetch de datos al montar el componente", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Si puedes calcularlo durante el render, no necesitas useEffect.",
      explanation: "Calcular valores derivados no necesita useEffect. Se puede hacer directamente en el cuerpo del componente durante el render.",
    },
    {
      id: "react09-ej-08",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 8,
      prompt: "Completa para cancelar una peticion fetch con AbortController en el cleanup:",
      codeTemplate: {
        html: "",
        cssPrefix: "useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n  return () => controller.",
        cssSuffix: ";\n}, [url]);",
        blanks: ["abort()"],
      },
      validation: { type: "exact", answer: "abort()" },
      hint: "El metodo para cancelar una peticion en AbortController.",
      explanation: "controller.abort() cancela la peticion fetch. Es importante hacerlo en el cleanup para evitar actualizar estado en componentes desmontados.",
    },
  ],
};
