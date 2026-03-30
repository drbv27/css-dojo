import type { ModuleData } from "@/types";

export const reactFormulariosModule: ModuleData = {
  slug: "react-formularios",
  title: "Formularios en React",
  description:
    "Maneja formularios con componentes controlados y no controlados, validacion, multiples inputs y mejores practicas.",
  order: 211,
  category: "react-intermediate",
  icon: "file-input",
  dojo: "react",
  lessons: [
    {
      id: "react11-leccion-01",
      title: "Componentes controlados",
      content: `## Formularios Controlados en React

En un **componente controlado**, React controla el valor del input a traves del estado.

### Patron basico
\`\`\`jsx
function Formulario() {
  const [nombre, setNombre] = useState('');

  return (
    <input
      value={nombre}
      onChange={e => setNombre(e.target.value)}
    />
  );
}
\`\`\`

### Por que controlados?
- **Una sola fuente de verdad** (el estado de React)
- Puedes **validar** y **transformar** el valor en cada cambio
- Facil de **resetear** el formulario
- El valor siempre esta disponible sin consultar el DOM

### Manejo de multiples inputs
\`\`\`jsx
const [form, setForm] = useState({ nombre: '', email: '' });

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

<input name="nombre" value={form.nombre} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />
\`\`\`

> **Tip:** Usa el atributo \`name\` del input como clave dinamica para manejar muchos campos con un solo handler.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

function FormularioRegistro() {
  const [form, setForm] = useState({
    nombre: '', email: '', password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Datos: ' + JSON.stringify(form, null, 2));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro (Controlado)</h3>
      <div style={{marginBottom:8}}>
        <label>Nombre:</label><br/>
        <input name="nombre" value={form.nombre}
          onChange={handleChange} placeholder="Tu nombre" />
      </div>
      <div style={{marginBottom:8}}>
        <label>Email:</label><br/>
        <input name="email" type="email" value={form.email}
          onChange={handleChange} placeholder="tu@email.com" />
      </div>
      <div style={{marginBottom:8}}>
        <label>Password:</label><br/>
        <input name="password" type="password" value={form.password}
          onChange={handleChange} placeholder="********" />
      </div>
      <button type="submit">Registrar</button>
      <pre style={{fontSize:12, background:'#f0f0f0', padding:8, marginTop:8, borderRadius:4}}>
        {JSON.stringify(form, null, 2)}
      </pre>
    </form>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FormularioRegistro />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; margin-top: 4px; } button { padding: 8px 20px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; } label { font-weight: 600; font-size: 14px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react11-leccion-02",
      title: "Componentes no controlados y useRef",
      content: `## Componentes No Controlados

En un componente **no controlado**, el DOM maneja el valor del input. Usamos useRef para leer el valor cuando lo necesitamos.

### Patron basico
\`\`\`jsx
function Formulario() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="valor inicial" />
      <button type="submit">Enviar</button>
    </form>
  );
}
\`\`\`

### defaultValue vs value
- \`value\` = controlado por React (necesita onChange)
- \`defaultValue\` = valor inicial, luego el DOM lo maneja

### Cuando usar no controlados?
- Formularios simples donde no necesitas validar en tiempo real
- Integracion con librerias externas
- Inputs de tipo file (siempre son no controlados)

\`\`\`jsx
// El input file siempre es no controlado
const fileRef = useRef(null);
<input type="file" ref={fileRef} />
\`\`\`

### Textarea y Select en React
\`\`\`jsx
// Textarea usa value, no children
<textarea value={texto} onChange={e => setTexto(e.target.value)} />

// Select usa value en el select, no selected en option
<select value={opcion} onChange={e => setOpcion(e.target.value)}>
  <option value="a">Opcion A</option>
  <option value="b">Opcion B</option>
</select>
\`\`\`

> **Recomendacion:** Prefiere componentes controlados. Usa no controlados solo cuando sea necesario.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useRef, useState } = React;

function FormNoControlado() {
  const nombreRef = useRef(null);
  const comentarioRef = useRef(null);
  const categoriaRef = useRef(null);
  const [resultado, setResultado] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultado({
      nombre: nombreRef.current.value,
      comentario: comentarioRef.current.value,
      categoria: categoriaRef.current.value,
    });
  };

  return (
    <div>
      <h3>Formulario No Controlado</h3>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:8}}>
          <label>Nombre:</label><br/>
          <input ref={nombreRef} defaultValue="Diego" />
        </div>
        <div style={{marginBottom:8}}>
          <label>Categoria:</label><br/>
          <select ref={categoriaRef} defaultValue="react">
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="js">JavaScript</option>
            <option value="react">React</option>
          </select>
        </div>
        <div style={{marginBottom:8}}>
          <label>Comentario:</label><br/>
          <textarea ref={comentarioRef} defaultValue="Me encanta React!" rows={3} />
        </div>
        <button type="submit">Enviar</button>
      </form>
      {resultado && (
        <pre style={{background:'#e8f5e9', padding:8, borderRadius:4, marginTop:8}}>
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FormNoControlado />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } input, textarea, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; margin-top: 4px; } button { padding: 8px 20px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; } label { font-weight: 600; font-size: 14px; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react11-leccion-03",
      title: "Validacion de formularios",
      content: `## Validacion de Formularios en React

### Validacion en tiempo real
\`\`\`jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
  const valor = e.target.value;
  setEmail(valor);
  if (!valor.includes('@')) {
    setError('Email invalido');
  } else {
    setError('');
  }
};
\`\`\`

### Validacion al enviar
\`\`\`jsx
const handleSubmit = (e) => {
  e.preventDefault();
  const errores = {};
  if (!form.nombre) errores.nombre = 'Requerido';
  if (!form.email.includes('@')) errores.email = 'Email invalido';

  if (Object.keys(errores).length > 0) {
    setErrores(errores);
    return;
  }
  // Enviar datos...
};
\`\`\`

### Librerias de formularios
Para formularios complejos, considera usar:
- **React Hook Form** — minimo re-renders, excelente performance
- **Formik** — popular, muchas integraciones
- **Zod + react-hook-form** — validacion con tipos TypeScript

\`\`\`jsx
// Ejemplo conceptual con React Hook Form
import { useForm } from 'react-hook-form';

function MiForm() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nombre', { required: true })} />
      {errors.nombre && <span>Campo requerido</span>}
    </form>
  );
}
\`\`\`

> **Tip:** Para 1-3 campos, validacion manual esta bien. Para formularios complejos, usa una libreria.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState } = React;

function FormConValidacion() {
  const [form, setForm] = useState({ nombre: '', email: '', edad: '' });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (form.nombre.length > 0 && form.nombre.length < 2)
      errs.nombre = 'Minimo 2 caracteres';
    if (!form.email.includes('@')) errs.email = 'Email invalido';
    if (!form.edad || form.edad < 1 || form.edad > 120)
      errs.edad = 'Edad debe estar entre 1 y 120';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }
    setEnviado(true);
    setErrores({});
  };

  const estiloError = { color: '#f38ba8', fontSize: 12, marginTop: 2 };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Formulario con Validacion</h3>
      <div style={{marginBottom:10}}>
        <input name="nombre" value={form.nombre} onChange={handleChange}
          placeholder="Nombre" style={{borderColor: errores.nombre ? '#f38ba8' : '#ccc'}} />
        {errores.nombre && <p style={estiloError}>{errores.nombre}</p>}
      </div>
      <div style={{marginBottom:10}}>
        <input name="email" value={form.email} onChange={handleChange}
          placeholder="Email" style={{borderColor: errores.email ? '#f38ba8' : '#ccc'}} />
        {errores.email && <p style={estiloError}>{errores.email}</p>}
      </div>
      <div style={{marginBottom:10}}>
        <input name="edad" type="number" value={form.edad} onChange={handleChange}
          placeholder="Edad" style={{borderColor: errores.edad ? '#f38ba8' : '#ccc'}} />
        {errores.edad && <p style={estiloError}>{errores.edad}</p>}
      </div>
      <button type="submit">Enviar</button>
      {enviado && <p style={{color:'#a6e3a1', marginTop:8}}>Formulario enviado correctamente!</p>}
    </form>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FormConValidacion />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; } input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; } button { padding: 8px 20px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; } p { margin: 0; }',
        editable: true,
      },
      order: 3,
    },
  ],
  exercises: [
    {
      id: "react11-ej-01",
      type: "quiz",
      difficulty: 1,
      xpReward: 10,
      order: 1,
      prompt: "En un componente controlado, quien controla el valor del input?",
      options: [
        { id: "a", text: "El DOM del navegador", isCorrect: false },
        { id: "b", text: "El estado de React", isCorrect: true },
        { id: "c", text: "El usuario directamente", isCorrect: false },
        { id: "d", text: "Una libreria externa", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "En controlado, React es la fuente de verdad.",
      explanation: "En un componente controlado, el valor del input viene del estado de React (via prop value) y se actualiza con onChange + setState.",
    },
    {
      id: "react11-ej-02",
      type: "code-completion",
      difficulty: 1,
      xpReward: 15,
      order: 2,
      prompt: "Completa el evento para prevenir el envio por defecto del formulario:",
      codeTemplate: {
        html: "",
        cssPrefix: "const handleSubmit = (e) => {\n  e.",
        cssSuffix: ";\n  // procesar datos...\n};",
        blanks: ["preventDefault()"],
      },
      validation: { type: "exact", answer: "preventDefault()" },
      hint: "Es un metodo del evento que evita el comportamiento por defecto.",
      explanation: "e.preventDefault() evita que el formulario se envie de forma tradicional (recargando la pagina) para manejarlo con JavaScript.",
    },
    {
      id: "react11-ej-03",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 3,
      prompt: "Que atributo se usa en un componente NO controlado para establecer un valor inicial?",
      options: [
        { id: "a", text: "value", isCorrect: false },
        { id: "b", text: "initialValue", isCorrect: false },
        { id: "c", text: "defaultValue", isCorrect: true },
        { id: "d", text: "startValue", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "default = por defecto.",
      explanation: "defaultValue establece el valor inicial del input sin controlarlo. El DOM maneja los cambios posteriores.",
    },
    {
      id: "react11-ej-04",
      type: "code-completion",
      difficulty: 2,
      xpReward: 15,
      order: 4,
      prompt: "Completa para manejar multiples inputs con un solo handler usando name dinamico:",
      codeTemplate: {
        html: "",
        cssPrefix: "const handleChange = (e) => {\n  setForm({\n    ...form,\n    [e.target.",
        cssSuffix: "]: e.target.value\n  });\n};",
        blanks: ["name"],
      },
      validation: { type: "exact", answer: "name" },
      hint: "Es el atributo HTML que identifica al input.",
      explanation: "Usando [e.target.name] como clave dinamica, un solo handler puede actualizar cualquier campo del formulario basandose en el atributo name del input.",
    },
    {
      id: "react11-ej-05",
      type: "drag-drop",
      difficulty: 2,
      xpReward: 20,
      order: 5,
      prompt: "Clasifica: componente controlado o no controlado?",
      dragItems: [
        { id: "d1", content: "Usa value + onChange", correctZone: "controlado" },
        { id: "d2", content: "Usa ref para leer valor", correctZone: "noControlado" },
        { id: "d3", content: "Usa defaultValue", correctZone: "noControlado" },
        { id: "d4", content: "Estado de React es la fuente de verdad", correctZone: "controlado" },
        { id: "d5", content: "Input type='file'", correctZone: "noControlado" },
        { id: "d6", content: "Validacion en tiempo real facil", correctZone: "controlado" },
      ],
      dropZones: [
        { id: "controlado", label: "Controlado" },
        { id: "noControlado", label: "No Controlado" },
      ],
      validation: { type: "exact", answer: { d1: "controlado", d2: "noControlado", d3: "noControlado", d4: "controlado", d5: "noControlado", d6: "controlado" } },
      hint: "Controlado = React maneja el valor. No controlado = el DOM maneja el valor.",
      explanation: "Controlados usan value+onChange con estado React. No controlados usan ref y defaultValue, dejando que el DOM maneje el valor.",
    },
    {
      id: "react11-ej-06",
      type: "quiz",
      difficulty: 2,
      xpReward: 10,
      order: 6,
      prompt: "Como se maneja un textarea en React?",
      options: [
        { id: "a", text: "Con contenido entre las etiquetas <textarea>texto</textarea>", isCorrect: false },
        { id: "b", text: "Con el atributo value, igual que un input", isCorrect: true },
        { id: "c", text: "Con innerHTML", isCorrect: false },
        { id: "d", text: "No se puede usar textarea en React", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "React unifica el manejo de todos los elementos de formulario.",
      explanation: "En React, textarea usa el atributo value (no children) para manejar su contenido, de la misma forma que un input.",
    },
    {
      id: "react11-ej-07",
      type: "quiz",
      difficulty: 3,
      xpReward: 15,
      order: 7,
      prompt: "Que libreria de formularios React es conocida por minimizar los re-renders?",
      options: [
        { id: "a", text: "Formik", isCorrect: false },
        { id: "b", text: "Redux Form", isCorrect: false },
        { id: "c", text: "React Hook Form", isCorrect: true },
        { id: "d", text: "Final Form", isCorrect: false },
      ],
      validation: { type: "exact", answer: "c" },
      hint: "Su nombre incluye 'Hook' y 'Form'.",
      explanation: "React Hook Form esta disenada para minimizar re-renders usando refs internamente, ofreciendo excelente rendimiento en formularios complejos.",
    },
    {
      id: "react11-ej-08",
      type: "code-completion",
      difficulty: 3,
      xpReward: 20,
      order: 8,
      prompt: "Completa la validacion para verificar que el email contiene '@':",
      codeTemplate: {
        html: "",
        cssPrefix: "const validar = () => {\n  const errores = {};\n  if (!email.",
        cssSuffix: "('@')) errores.email = 'Email invalido';\n  return errores;\n};",
        blanks: ["includes"],
      },
      validation: { type: "exact", answer: "includes" },
      hint: "Es un metodo de string que verifica si contiene un substring.",
      explanation: "El metodo .includes() de String verifica si una cadena contiene el substring especificado, retornando true o false.",
    },
  ],
};
