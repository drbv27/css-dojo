import type { ModuleData } from "@/types";

export const reactProyectoEcommerceModule: ModuleData = {
  slug: "react-proyecto-ecommerce",
  title: "Proyecto: E-Commerce",
  description:
    "Construye una pagina de productos e-commerce con React: lista de productos desde API, carrito de compras con Context, gestion de cantidad y layout responsive.",
  order: 220,
  category: "react-projects",
  icon: "shopping-cart",
  dojo: "react",
  lessons: [
    {
      id: "react20-leccion-01",
      title: "Lista de productos y fetch de datos",
      content: `## Proyecto: E-Commerce con React

Vamos a construir una pagina de productos con carrito de compras.

### Funcionalidades
1. Lista de productos cargada desde una API
2. Filtro por categoria y busqueda
3. Carrito de compras con Context
4. Agregar/remover items y manejar cantidades
5. Calculo de total
6. Layout responsive

### Arquitectura
\`\`\`
App
├── Header (logo + carrito icon con contador)
├── ProductFilters (busqueda + categorias)
├── ProductGrid
│   └── ProductCard (imagen, precio, boton agregar)
├── Cart (sidebar/modal del carrito)
│   └── CartItem (item con cantidad +/-)
└── CartProvider (Context con estado del carrito)
\`\`\`

### Cargando productos
\`\`\`jsx
function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      });
  }, []);

  return { productos, loading };
}
\`\`\`

> **Tip:** Separa la logica de datos (hooks) de la presentacion (componentes) desde el inicio.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useEffect } = React;

// Datos simulados (en produccion: fetch desde API)
const productosData = [
  { id: 1, nombre: 'Camiseta React', precio: 29.99, categoria: 'ropa', imagen: '👕' },
  { id: 2, nombre: 'Taza JavaScript', precio: 14.99, categoria: 'accesorios', imagen: '☕' },
  { id: 3, nombre: 'Libro CSS Mastery', precio: 39.99, categoria: 'libros', imagen: '📘' },
  { id: 4, nombre: 'Sticker Pack Dev', precio: 9.99, categoria: 'accesorios', imagen: '🏷️' },
  { id: 5, nombre: 'Hoodie TypeScript', precio: 49.99, categoria: 'ropa', imagen: '🧥' },
  { id: 6, nombre: 'Libro React Pro', precio: 44.99, categoria: 'libros', imagen: '📕' },
  { id: 7, nombre: 'Gorra Node.js', precio: 19.99, categoria: 'ropa', imagen: '🧢' },
  { id: 8, nombre: 'Mousepad Code', precio: 12.99, categoria: 'accesorios', imagen: '🖱️' },
];

// Custom Hook: useProductos
function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular fetch
    setTimeout(() => {
      setProductos(productosData);
      setLoading(false);
    }, 800);
  }, []);

  return { productos, loading };
}

function ProductCard({ producto, onAgregar }) {
  return (
    <div style={{border:'1px solid #eee', borderRadius:8, padding:12, textAlign:'center', background:'white'}}>
      <div style={{fontSize:40, margin:8}}>{producto.imagen}</div>
      <h4 style={{margin:'4px 0', fontSize:14}}>{producto.nombre}</h4>
      <p style={{fontSize:12, color:'#888', margin:2}}>{producto.categoria}</p>
      <p style={{fontWeight:700, color:'#2e7d32', fontSize:18}}>\${producto.precio}</p>
      <button onClick={() => onAgregar(producto)}
        style={{width:'100%', padding:8, background:'#89b4fa', color:'#1e1e2e', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600}}>
        Agregar al carrito
      </button>
    </div>
  );
}

function App() {
  const { productos, loading } = useProductos();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [agregados, setAgregados] = useState([]);

  const categorias = ['todas', ...new Set(productos.map(p => p.categoria))];

  const filtrados = productos
    .filter(p => categoria === 'todas' || p.categoria === categoria)
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const agregar = (producto) => {
    setAgregados(prev => [...prev, producto.nombre]);
    setTimeout(() => setAgregados(prev => prev.slice(1)), 2000);
  };

  if (loading) return <div style={{textAlign:'center', padding:40}}>Cargando productos...</div>;

  return (
    <div>
      <h3>Tienda Dev Dojo</h3>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar productos..."
        style={{width:'100%', padding:10, marginBottom:8, borderRadius:6, border:'1px solid #ddd', boxSizing:'border-box'}} />
      <div style={{display:'flex', gap:4, marginBottom:12}}>
        {categorias.map(cat => (
          <button key={cat} onClick={() => setCategoria(cat)}
            style={{padding:'4px 12px', background: categoria === cat ? '#89b4fa' : '#f0f0f0', color: categoria === cat ? '#1e1e2e' : '#555', border:'none', borderRadius:4, cursor:'pointer', fontSize:12}}>
            {cat}
          </button>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:12}}>
        {filtrados.map(p => <ProductCard key={p.id} producto={p} onAgregar={agregar} />)}
      </div>
      {filtrados.length === 0 && <p style={{textAlign:'center', color:'#888'}}>No se encontraron productos.</p>}
      {agregados.length > 0 && (
        <div style={{position:'fixed', bottom:16, right:16, background:'#a6e3a1', color:'#1e1e2e', padding:12, borderRadius:8, fontSize:13}}>
          {agregados[agregados.length - 1]} agregado al carrito!
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 600px; background: #fafafa; min-height: 300px; }',
        editable: true,
      },
      order: 1,
    },
    {
      id: "react20-leccion-02",
      title: "Carrito de compras con Context",
      content: `## Carrito de Compras con Context

### CartContext
\`\`\`jsx
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (producto) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) {
        return prev.map(i =>
          i.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) { removeItem(id); return; }
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad } : i)
    );
  };

  const total = items.reduce(
    (sum, i) => sum + i.precio * i.cantidad, 0
  );

  const totalItems = items.reduce(
    (sum, i) => sum + i.cantidad, 0
  );

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity,
      total, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}
\`\`\`

### Logica del carrito
- **Agregar:** Si ya existe, incrementar cantidad; si no, agregar con cantidad 1
- **Eliminar:** Filtrar el item del array
- **Actualizar cantidad:** Si llega a 0, eliminar automaticamente
- **Total:** Sumar precio * cantidad de cada item

> **Patron:** El Context del carrito provee tanto los datos como las acciones para modificarlos.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext } = React;

// Cart Context
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (producto) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id);
      if (existe) return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() { return useContext(CartContext); }

const productos = [
  { id: 1, nombre: 'Camiseta React', precio: 29.99, imagen: '👕' },
  { id: 2, nombre: 'Taza JS', precio: 14.99, imagen: '☕' },
  { id: 3, nombre: 'Libro CSS', precio: 39.99, imagen: '📘' },
  { id: 4, nombre: 'Stickers', precio: 9.99, imagen: '🏷️' },
];

function Header() {
  const { totalItems, total } = useCart();
  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:8, background:'#1e1e2e', color:'#cdd6f4', borderRadius:8, marginBottom:12}}>
      <strong>Dev Shop</strong>
      <span>🛒 {totalItems} items (\${total.toFixed(2)})</span>
    </div>
  );
}

function ProductGrid() {
  const { addItem } = useCart();
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16}}>
      {productos.map(p => (
        <div key={p.id} style={{border:'1px solid #eee', borderRadius:8, padding:10, textAlign:'center', background:'white'}}>
          <span style={{fontSize:28}}>{p.imagen}</span>
          <p style={{margin:4, fontSize:13, fontWeight:600}}>{p.nombre}</p>
          <p style={{color:'#2e7d32', fontWeight:700}}>\${p.precio}</p>
          <button onClick={() => addItem(p)} style={{width:'100%', padding:6, background:'#89b4fa', color:'#1e1e2e', border:'none', borderRadius:4, cursor:'pointer', fontSize:12}}>
            Agregar
          </button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();

  if (items.length === 0) return <p style={{textAlign:'center', color:'#888'}}>Carrito vacio</p>;

  return (
    <div style={{background:'#f5f5f5', padding:12, borderRadius:8}}>
      <h4 style={{margin:'0 0 8px'}}>Carrito</h4>
      {items.map(item => (
        <div key={item.id} style={{display:'flex', alignItems:'center', gap:6, padding:6, margin:2, background:'white', borderRadius:4}}>
          <span>{item.imagen}</span>
          <span style={{flex:1, fontSize:13}}>{item.nombre}</span>
          <div style={{display:'flex', alignItems:'center', gap:4}}>
            <button onClick={() => updateQty(item.id, item.cantidad - 1)} style={{width:24, height:24, padding:0, background:'#e0e0e0', border:'none', borderRadius:4, cursor:'pointer'}}>-</button>
            <span style={{minWidth:20, textAlign:'center', fontSize:13}}>{item.cantidad}</span>
            <button onClick={() => updateQty(item.id, item.cantidad + 1)} style={{width:24, height:24, padding:0, background:'#e0e0e0', border:'none', borderRadius:4, cursor:'pointer'}}>+</button>
          </div>
          <span style={{fontSize:13, fontWeight:600, minWidth:50, textAlign:'right'}}>\${(item.precio * item.cantidad).toFixed(2)}</span>
          <button onClick={() => removeItem(item.id)} style={{background:'#f38ba8', color:'white', border:'none', borderRadius:4, padding:'2px 6px', cursor:'pointer', fontSize:11}}>X</button>
        </div>
      ))}
      <div style={{display:'flex', justifyContent:'space-between', marginTop:8, padding:'8px 0', borderTop:'2px solid #ddd'}}>
        <strong>Total: \${total.toFixed(2)}</strong>
        <button onClick={clearCart} style={{background:'#cba6f7', color:'#1e1e2e', border:'none', borderRadius:4, padding:'4px 12px', cursor:'pointer', fontSize:12}}>Vaciar</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Header />
      <ProductGrid />
      <Cart />
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 400px; background: #fafafa; }',
        editable: true,
      },
      order: 2,
    },
    {
      id: "react20-leccion-03",
      title: "Gestion de cantidades y totales",
      content: `## Logica Avanzada del Carrito

### Agregar con logica inteligente
\`\`\`jsx
const addItem = (producto) => {
  setItems(prev => {
    const existe = prev.find(i => i.id === producto.id);
    if (existe) {
      // Ya existe: incrementar cantidad
      return prev.map(i =>
        i.id === producto.id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      );
    }
    // Nuevo: agregar con cantidad 1
    return [...prev, { ...producto, cantidad: 1 }];
  });
};
\`\`\`

### Calculos derivados
\`\`\`jsx
// Total de items
const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

// Subtotal
const subtotal = items.reduce(
  (sum, item) => sum + item.precio * item.cantidad, 0
);

// Con descuento
const descuento = subtotal > 100 ? subtotal * 0.1 : 0;
const total = subtotal - descuento;

// Impuestos
const iva = total * 0.16;
const totalConIVA = total + iva;
\`\`\`

### Notificaciones de carrito
\`\`\`jsx
const [notificacion, setNotificacion] = useState(null);

const addItem = (producto) => {
  // ... logica de agregar
  setNotificacion(\\\`\\\${producto.nombre} agregado!\\\`);
  setTimeout(() => setNotificacion(null), 2000);
};
\`\`\`

### Badge del carrito en el header
\`\`\`jsx
function CartBadge() {
  const { totalItems } = useCart();
  return (
    <div style={{ position: 'relative' }}>
      🛒
      {totalItems > 0 && (
        <span className="badge">{totalItems}</span>
      )}
    </div>
  );
}
\`\`\`

> **Patron:** Calcula totales y descuentos como valores derivados, no como estado.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useMemo } = React;

function CarritoAvanzado() {
  const [items, setItems] = useState([
    { id: 1, nombre: 'Camiseta React', precio: 29.99, cantidad: 2, imagen: '👕' },
    { id: 2, nombre: 'Libro CSS', precio: 39.99, cantidad: 1, imagen: '📘' },
    { id: 3, nombre: 'Taza JS', precio: 14.99, cantidad: 3, imagen: '☕' },
  ]);

  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(false);

  const updateQty = (id, qty) => {
    if (qty <= 0) { setItems(prev => prev.filter(i => i.id !== id)); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: qty } : i));
  };

  // Valores derivados (no estado!)
  const calculos = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
    const envio = subtotal > 50 ? 0 : 5.99;
    const descuento = descuentoAplicado ? subtotal * 0.15 : 0;
    const iva = (subtotal - descuento) * 0.16;
    const total = subtotal - descuento + envio + iva;
    return { subtotal, totalItems, envio, descuento, iva, total };
  }, [items, descuentoAplicado]);

  const aplicarDescuento = () => {
    if (codigoDescuento.toUpperCase() === 'DOJO15') {
      setDescuentoAplicado(true);
    }
  };

  return (
    <div>
      <h3>Carrito de Compras Avanzado</h3>

      {items.map(item => (
        <div key={item.id} style={{display:'flex', alignItems:'center', gap:8, padding:10, margin:4, background:'white', borderRadius:8, border:'1px solid #eee'}}>
          <span style={{fontSize:28}}>{item.imagen}</span>
          <div style={{flex:1}}>
            <p style={{margin:0, fontWeight:600, fontSize:14}}>{item.nombre}</p>
            <p style={{margin:0, fontSize:13, color:'#2e7d32'}}>\${item.precio} c/u</p>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <button onClick={() => updateQty(item.id, item.cantidad - 1)}
              style={{width:28, height:28, background:'#f0f0f0', border:'none', borderRadius:'50%', cursor:'pointer', fontSize:16}}>-</button>
            <span style={{minWidth:24, textAlign:'center', fontWeight:600}}>{item.cantidad}</span>
            <button onClick={() => updateQty(item.id, item.cantidad + 1)}
              style={{width:28, height:28, background:'#f0f0f0', border:'none', borderRadius:'50%', cursor:'pointer', fontSize:16}}>+</button>
          </div>
          <span style={{fontWeight:700, minWidth:60, textAlign:'right'}}>\${(item.precio * item.cantidad).toFixed(2)}</span>
        </div>
      ))}

      {!descuentoAplicado && (
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <input value={codigoDescuento} onChange={e => setCodigoDescuento(e.target.value)}
            placeholder="Codigo descuento" style={{flex:1, padding:8, borderRadius:4, border:'1px solid #ddd'}} />
          <button onClick={aplicarDescuento} style={{background:'#cba6f7'}}>Aplicar</button>
        </div>
      )}
      {descuentoAplicado && <p style={{color:'#4caf50', fontSize:13}}>Descuento DOJO15 aplicado! (-15%)</p>}

      <div style={{marginTop:16, padding:12, background:'#f5f5f5', borderRadius:8}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:13, margin:'4px 0'}}>
          <span>Subtotal ({calculos.totalItems} items)</span>
          <span>\${calculos.subtotal.toFixed(2)}</span>
        </div>
        {calculos.descuento > 0 && (
          <div style={{display:'flex', justifyContent:'space-between', fontSize:13, margin:'4px 0', color:'#4caf50'}}>
            <span>Descuento (15%)</span>
            <span>-\${calculos.descuento.toFixed(2)}</span>
          </div>
        )}
        <div style={{display:'flex', justifyContent:'space-between', fontSize:13, margin:'4px 0'}}>
          <span>Envio {calculos.envio === 0 ? '(GRATIS!)' : ''}</span>
          <span>\${calculos.envio.toFixed(2)}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:13, margin:'4px 0', color:'#888'}}>
          <span>IVA (16%)</span>
          <span>\${calculos.iva.toFixed(2)}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700, margin:'8px 0', paddingTop:8, borderTop:'2px solid #ddd'}}>
          <span>Total</span>
          <span>\${calculos.total.toFixed(2)}</span>
        </div>
        <button style={{width:'100%', padding:12, background:'#a6e3a1', color:'#1e1e2e', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:14}}>
          Pagar ahora
        </button>
      </div>
      <p style={{fontSize:11, color:'#aaa', textAlign:'center', marginTop:4}}>Prueba el codigo: DOJO15</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CarritoAvanzado />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 420px; background: #fafafa; } button { padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; }',
        editable: true,
      },
      order: 3,
    },
    {
      id: "react20-leccion-04",
      title: "Layout responsive y mejores practicas",
      content: `## Layout Responsive y Produccion

### Grid responsive para productos
\`\`\`css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
\`\`\`

### Mejores practicas para e-commerce en React

**1. Separacion de datos y UI:**
\`\`\`jsx
// hook: useProducts.js
function useProducts(categoria) {
  const [products, setProducts] = useState([]);
  // fetch logic...
  return { products, loading, error };
}

// hook: useCart.js (Context)
function useCart() { return useContext(CartContext); }
\`\`\`

**2. Optimistic updates en el carrito:**
\`\`\`jsx
const addToCart = (product) => {
  // Actualizar UI inmediatamente
  dispatch({ type: 'ADD', payload: product });
  // Sincronizar con servidor en background
  api.syncCart(product).catch(() => {
    dispatch({ type: 'REVERT', payload: product.id });
  });
};
\`\`\`

**3. Manejo de imagenes:**
\`\`\`jsx
<img
  src={product.image}
  alt={product.name}
  loading="lazy"           // Lazy loading nativo
  width={200} height={200} // Evitar layout shift
/>
\`\`\`

**4. Accesibilidad:**
- Botones con texto descriptivo ("Agregar Camiseta al carrito")
- Anunciar cambios del carrito a lectores de pantalla
- Navegacion con teclado en la grilla de productos

**5. Performance:**
- React.memo en ProductCard (se renderizan muchas)
- useMemo para filtros y totales
- Lazy load para paginas de detalle

> **Recuerda:** Un buen e-commerce es rapido, accesible y funciona en cualquier dispositivo.`,
      codeExample: {
        html: `<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const { useState, useContext, createContext, useMemo, memo } = React;

// === CART CONTEXT ===
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = (p) => {
    setItems(prev => {
      const e = prev.find(i => i.id === p.id);
      if (e) return prev.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...p, cantidad: 1 }];
    });
  };
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, q) => { if (q <= 0) removeItem(id); else setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad: q } : i)); };
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const count = items.reduce((s, i) => s + i.cantidad, 0);
  return <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total, count }}>{children}</CartContext.Provider>;
}

function useCart() { return useContext(CartContext); }

// === COMPONENTS ===
const productos = [
  { id: 1, nombre: 'Camiseta React', precio: 29.99, cat: 'ropa', img: '👕', rating: 4.5 },
  { id: 2, nombre: 'Taza JavaScript', precio: 14.99, cat: 'accesorios', img: '☕', rating: 4.8 },
  { id: 3, nombre: 'Libro CSS Pro', precio: 39.99, cat: 'libros', img: '📘', rating: 4.2 },
  { id: 4, nombre: 'Sticker Pack', precio: 9.99, cat: 'accesorios', img: '🏷️', rating: 4.9 },
  { id: 5, nombre: 'Hoodie TS', precio: 49.99, cat: 'ropa', img: '🧥', rating: 4.7 },
  { id: 6, nombre: 'Libro React', precio: 44.99, cat: 'libros', img: '📕', rating: 4.6 },
];

const ProductCard = memo(function ProductCard({ producto }) {
  const { addItem } = useCart();
  return (
    <div style={{border:'1px solid #eee', borderRadius:12, padding:12, textAlign:'center', background:'white', transition:'transform 0.2s'}}>
      <div style={{fontSize:36, margin:4}}>{producto.img}</div>
      <h4 style={{margin:4, fontSize:13}}>{producto.nombre}</h4>
      <p style={{fontSize:11, color:'#888', margin:2}}>{'⭐'.repeat(Math.floor(producto.rating))} {producto.rating}</p>
      <p style={{fontWeight:700, color:'#2e7d32', fontSize:16, margin:4}}>\${producto.precio}</p>
      <button onClick={() => addItem(producto)}
        aria-label={\\\`Agregar \\\${producto.nombre} al carrito\\\`}
        style={{width:'100%', padding:8, background:'#89b4fa', color:'#1e1e2e', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:12}}>
        Agregar al carrito
      </button>
    </div>
  );
});

function Header() {
  const { count, total } = useCart();
  return (
    <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:10, background:'linear-gradient(135deg, #1e1e2e, #313244)', color:'#cdd6f4', borderRadius:10, marginBottom:12}}>
      <h3 style={{margin:0, fontSize:16}}>🛍️ Dev Shop</h3>
      <div style={{position:'relative', cursor:'pointer'}}>
        <span style={{fontSize:20}}>🛒</span>
        {count > 0 && (
          <span style={{position:'absolute', top:-8, right:-8, background:'#f38ba8', color:'white', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700}}>
            {count}
          </span>
        )}
      </div>
    </header>
  );
}

function MiniCart() {
  const { items, updateQty, total, count } = useCart();
  if (count === 0) return null;
  return (
    <div style={{background:'white', border:'1px solid #eee', borderRadius:10, padding:12, marginTop:12}}>
      <h4 style={{margin:'0 0 8px'}}>Carrito ({count})</h4>
      {items.map(i => (
        <div key={i.id} style={{display:'flex', alignItems:'center', gap:6, padding:4, fontSize:13}}>
          <span>{i.img}</span>
          <span style={{flex:1}}>{i.nombre}</span>
          <button onClick={() => updateQty(i.id, i.cantidad - 1)} style={{width:22, height:22, padding:0, background:'#f0f0f0', border:'none', borderRadius:4, cursor:'pointer'}}>-</button>
          <span style={{minWidth:16, textAlign:'center'}}>{i.cantidad}</span>
          <button onClick={() => updateQty(i.id, i.cantidad + 1)} style={{width:22, height:22, padding:0, background:'#f0f0f0', border:'none', borderRadius:4, cursor:'pointer'}}>+</button>
          <span style={{fontWeight:600, minWidth:45, textAlign:'right'}}>\${(i.precio * i.cantidad).toFixed(2)}</span>
        </div>
      ))}
      <div style={{borderTop:'2px solid #eee', marginTop:8, paddingTop:8, display:'flex', justifyContent:'space-between', fontWeight:700}}>
        <span>Total:</span><span>\${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function App() {
  const [busqueda, setBusqueda] = useState('');
  const filtrados = useMemo(() =>
    productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())),
    [busqueda]
  );

  return (
    <CartProvider>
      <Header />
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar..." style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd', boxSizing:'border-box', marginBottom:12}} />
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:10}}>
        {filtrados.map(p => <ProductCard key={p.id} producto={p} />)}
      </div>
      <MiniCart />
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>`,
        css: '#root { font-family: system-ui; padding: 16px; max-width: 500px; background: #f5f5f5; min-height: 400px; }',
        editable: true,
      },
      order: 4,
    },
  ],
  exercises: [
    {
      id: "react20-ej-01",
      type: "quiz",
      difficulty: 1 ,
      xpReward: 10,
      order: 1,
      prompt: "Por que Context es ideal para el carrito de compras?",
      options: [
        { id: "a", text: "Porque es mas rapido que useState", isCorrect: false },
        { id: "b", text: "Porque muchos componentes (header, lista, checkout) necesitan acceder al carrito", isCorrect: true },
        { id: "c", text: "Porque localStorage no funciona con React", isCorrect: false },
        { id: "d", text: "Porque Context es obligatorio en e-commerce", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Multiples componentes en diferentes niveles necesitan los mismos datos.",
      explanation: "El carrito se usa en el header (badge), en la lista de productos (agregar), en el carrito (ver/editar) y en checkout (pagar). Context evita prop drilling.",
    },
    {
      id: "react20-ej-02",
      type: "code-completion",
      difficulty: 2 ,
      xpReward: 20,
      order: 2,
      prompt: "Completa para calcular el total del carrito:",
      codeTemplate: {
        html: "",
        cssPrefix: "const total = items.",
        cssSuffix: "((sum, item) => sum + item.precio * item.cantidad, 0);",
        blanks: ["reduce"],
      },
      validation: { type: "exact", answer: "reduce" },
      hint: "Es el metodo de array que acumula un valor.",
      explanation: "reduce() recorre el array acumulando la suma de precio * cantidad de cada item, empezando desde 0.",
    },
    {
      id: "react20-ej-03",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 3,
      prompt: "Que debe pasar al agregar un producto que ya esta en el carrito?",
      options: [
        { id: "a", text: "Agregar un duplicado al array", isCorrect: false },
        { id: "b", text: "Incrementar la cantidad del item existente", isCorrect: true },
        { id: "c", text: "Ignorar la accion", isCorrect: false },
        { id: "d", text: "Reemplazar el item anterior", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "No queremos items duplicados en el carrito.",
      explanation: "Si el producto ya existe, se incrementa su cantidad. Si es nuevo, se agrega con cantidad 1. Esto evita duplicados y permite manejar cantidades.",
    },
    {
      id: "react20-ej-04",
      type: "drag-drop",
      difficulty: 2 ,
      xpReward: 20,
      order: 4,
      prompt: "Asocia cada componente con su responsabilidad:",
      dragItems: [
        { id: "d1", content: "CartProvider", correctZone: "estado" },
        { id: "d2", content: "ProductCard", correctZone: "mostrar" },
        { id: "d3", content: "Header", correctZone: "badge" },
        { id: "d4", content: "CartItem", correctZone: "cantidad" },
      ],
      dropZones: [
        { id: "estado", label: "Manejar estado global del carrito" },
        { id: "mostrar", label: "Mostrar producto y boton agregar" },
        { id: "badge", label: "Mostrar contador de items" },
        { id: "cantidad", label: "Modificar cantidad de un item" },
      ],
      validation: { type: "exact", answer: { d1: "estado", d2: "mostrar", d3: "badge", d4: "cantidad" } },
      hint: "Cada componente tiene una sola responsabilidad.",
      explanation: "CartProvider maneja el estado, ProductCard muestra productos, Header muestra el badge del carrito, y CartItem permite editar cantidades.",
    },
    {
      id: "react20-ej-05",
      type: "quiz",
      difficulty: 2 ,
      xpReward: 20,
      order: 5,
      prompt: "Por que los totales del carrito deben ser valores derivados y no estado?",
      options: [
        { id: "a", text: "Porque React no permite setState para numeros", isCorrect: false },
        { id: "b", text: "Porque se calculan a partir de items, y tener dos fuentes de verdad causa bugs", isCorrect: true },
        { id: "c", text: "Porque useMemo es mas rapido que useState", isCorrect: false },
        { id: "d", text: "Porque los totales no cambian", isCorrect: false },
      ],
      validation: { type: "exact", answer: "b" },
      hint: "Una sola fuente de verdad.",
      explanation: "Si el total fuera estado separado, podria desincronizarse de los items. Calcularlo como valor derivado garantiza que siempre sea correcto.",
    },
    {
      id: "react20-ej-06",
      type: "code-completion",
      difficulty: 3 ,
      xpReward: 30,
      order: 6,
      prompt: "Completa la CSS Grid para un layout responsive de productos:",
      codeTemplate: {
        html: "",
        cssPrefix: "display: grid;\ngrid-template-columns: repeat(",
        cssSuffix: ", minmax(200px, 1fr));\ngap: 16px;",
        blanks: ["auto-fill"],
      },
      validation: { type: "exact", answer: "auto-fill" },
      hint: "Es el valor de CSS Grid que crea tantas columnas como quepan.",
      explanation: "auto-fill crea automaticamente tantas columnas como quepan en el espacio disponible, con un minimo de 200px. Esto hace el grid responsive sin media queries.",
    },
  ],
};
