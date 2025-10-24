# 🎨 Guía de UI/UX - FarmaZi

## Principios de Diseño

### 1. Simplicidad y Claridad
- **Interfaz limpia**: Espacios en blanco generosos, tipografía legible
- **Navegación intuitiva**: Máximo 3 clics para cualquier acción
- **Iconografía consistente**: Heroicons para uniformidad visual

### 2. Accesibilidad
- **Contraste**: Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Tamaños**: Botones mínimo 44px, texto mínimo 16px
- **Teclado**: Navegación completa sin mouse
- **Screen readers**: Etiquetas ARIA apropiadas

### 3. Responsive Design
- **Mobile First**: Diseño optimizado para móviles primero
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Touch targets**: Mínimo 44px para elementos táctiles

## Sistema de Colores

### Paleta Principal
```css
/* Primarios */
--primary-50: #f0f9ff;
--primary-500: #0ea5e9;  /* Azul farmacia */
--primary-600: #0284c7;
--primary-900: #0c4a6e;

/* Semánticos */
--success-500: #22c55e;  /* Verde éxito */
--warning-500: #f59e0b;  /* Amarillo alerta */
--danger-500: #ef4444;   /* Rojo error */

/* Neutros */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

### Uso de Colores
- **Primario**: Acciones principales, enlaces, elementos activos
- **Verde**: Confirmaciones, ventas exitosas, stock disponible
- **Amarillo**: Advertencias, productos por vencer, stock bajo
- **Rojo**: Errores, eliminaciones, productos vencidos
- **Gris**: Texto secundario, bordes, fondos neutros

## Tipografía

### Jerarquía
```css
/* Títulos */
h1: 2.25rem (36px) - font-bold
h2: 1.875rem (30px) - font-bold
h3: 1.5rem (24px) - font-semibold
h4: 1.25rem (20px) - font-semibold

/* Cuerpo */
body: 1rem (16px) - font-normal
small: 0.875rem (14px) - font-normal
caption: 0.75rem (12px) - font-medium
```

### Fuente
- **Principal**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif
- **Características**: Legible, moderna, optimizada para pantallas

## Componentes Base

### Botones
```tsx
// Primario - Acciones principales
<button className="btn-primary">
  Procesar Venta
</button>

// Secundario - Acciones secundarias
<button className="btn-secondary">
  Cancelar
</button>

// Éxito - Confirmaciones
<button className="btn-success">
  Guardar Producto
</button>

// Peligro - Eliminaciones
<button className="btn-danger">
  Eliminar Cliente
</button>
```

### Cards
```tsx
// Card básica
<div className="card p-6">
  <h3 className="font-semibold mb-2">Título</h3>
  <p className="text-gray-600">Contenido</p>
</div>

// Card con hover
<div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
  Contenido interactivo
</div>
```

### Formularios
```tsx
// Input estándar
<div>
  <label className="label">Nombre del Producto</label>
  <input className="input" placeholder="Ej: Paracetamol 500mg" />
</div>

// Select
<select className="input">
  <option>Seleccionar categoría</option>
  <option>Analgésicos</option>
</select>
```

## Layouts Específicos

### 1. Dashboard Principal
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + Usuario + Notificaciones                 │
├─────────────┬───────────────────────────────────────────┤
│ Sidebar     │ Contenido Principal                       │
│ - Dashboard │ ┌─────────┬─────────┬─────────┬─────────┐ │
│ - POS       │ │ Ventas  │ Stock   │ Clientes│ Alertas │ │
│ - Productos │ │ Hoy     │ Total   │ Nuevos  │ Vencer  │ │
│ - Clientes  │ └─────────┴─────────┴─────────┴─────────┘ │
│ - Reportes  │                                           │
│ - Config    │ Gráficos y métricas principales           │
└─────────────┴───────────────────────────────────────────┘
```

### 2. Punto de Venta (POS)
```
┌─────────────────────────────────────┬─────────────────────┐
│ Búsqueda de Productos               │ Carrito de Compras  │
│ ┌─────────────────────────────────┐ │ ┌─────────────────┐ │
│ │ [🔍] Buscar por nombre/código   │ │ │ Producto 1      │ │
│ └─────────────────────────────────┘ │ │ Cantidad: 2     │ │
│                                     │ │ ₡5.00           │ │
│ Grid de Productos:                  │ ├─────────────────┤ │
│ ┌─────────┬─────────┬─────────┐    │ │ Producto 2      │ │
│ │ Prod A  │ Prod B  │ Prod C  │    │ │ Cantidad: 1     │ │
│ │ ₡2.50   │ ₡3.20   │ ₡8.90   │    │ │ ₡3.20           │ │
│ │ [+Add]  │ [+Add]  │ [+Add]  │    │ └─────────────────┘ │
│ └─────────┴─────────┴─────────┘    │                     │
│                                     │ Total: ₡8.20        │
│                                     │ [💳] Procesar Venta │
└─────────────────────────────────────┴─────────────────────┘
```

### 3. Gestión de Productos
```
┌─────────────────────────────────────────────────────────┐
│ [+ Nuevo Producto] [📤 Importar] [📊 Reportes]         │
├─────────────────────────────────────────────────────────┤
│ Filtros: [Categoría ▼] [Laboratorio ▼] [🔍 Buscar]    │
├─────────────────────────────────────────────────────────┤
│ Tabla de Productos:                                     │
│ ┌────────┬──────────────┬─────────┬─────────┬─────────┐ │
│ │ Código │ Nombre       │ Stock   │ Precio  │ Acciones│ │
│ ├────────┼──────────────┼─────────┼─────────┼─────────┤ │
│ │ P001   │ Paracetamol  │ 100 ✅  │ ₡2.50   │ [✏️][🗑️] │ │
│ │ P002   │ Ibuprofeno   │ 5 ⚠️    │ ₡3.20   │ [✏️][🗑️] │ │
│ │ P003   │ Amoxicilina  │ 0 ❌    │ ₡8.90   │ [✏️][🗑️] │ │
│ └────────┴──────────────┴─────────┴─────────┴─────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Estados Visuales

### Indicadores de Stock
```tsx
// Stock normal (verde)
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
  Stock: 100
</span>

// Stock bajo (amarillo)
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
  Stock Bajo: 5
</span>

// Sin stock (rojo)
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
  Agotado
</span>
```

### Estados de Productos
- **Disponible**: Borde verde, icono ✅
- **Por vencer**: Borde amarillo, icono ⚠️
- **Vencido**: Borde rojo, icono ❌, deshabilitado
- **Controlado**: Icono 🔒, requiere permisos especiales

## Animaciones y Transiciones

### Micro-interacciones
```css
/* Hover en botones */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading states */
.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slide in notifications */
.notification-enter {
  transform: translateX(100%);
  opacity: 0;
}

.notification-enter-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 0.3s ease-out;
}
```

### Feedback Visual
- **Éxito**: Toast verde con icono ✅
- **Error**: Toast rojo con icono ❌
- **Carga**: Spinner azul con texto descriptivo
- **Confirmación**: Modal con botones claros

## Patrones de Interacción

### Flujo de Venta (3 clics máximo)
1. **Buscar producto** → Escribir en buscador o escanear código
2. **Agregar al carrito** → Click en botón "Agregar"
3. **Procesar venta** → Click en "Procesar Venta"

### Gestión de Inventario
1. **Vista rápida** → Hover sobre producto muestra detalles
2. **Edición inline** → Click en campo para editar directamente
3. **Acciones masivas** → Checkboxes para selección múltiple

### Navegación
- **Breadcrumbs** para ubicación actual
- **Tabs** para secciones relacionadas
- **Sidebar** siempre visible en desktop
- **Bottom navigation** en móvil

## Responsive Breakpoints

### Mobile (< 768px)
- Sidebar se convierte en drawer
- Cards en columna única
- Botones de ancho completo
- Texto más grande para legibilidad

### Tablet (768px - 1024px)
- Grid de 2 columnas para productos
- Sidebar colapsible
- Formularios en 2 columnas

### Desktop (> 1024px)
- Layout completo con sidebar fijo
- Grid de 3-4 columnas
- Hover states activos
- Tooltips informativos

## Accesibilidad (WCAG 2.1 AA)

### Contraste
- Texto normal: 4.5:1 mínimo
- Texto grande: 3:1 mínimo
- Elementos gráficos: 3:1 mínimo

### Navegación por Teclado
```tsx
// Focus visible
.focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Saltar al contenido principal
</a>
```

### Screen Readers
```tsx
// Labels descriptivos
<button aria-label="Eliminar producto Paracetamol">
  <TrashIcon />
</button>

// Estados dinámicos
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

## Testing de Usabilidad

### Métricas Clave
- **Time to Task**: < 30 segundos para venta básica
- **Error Rate**: < 5% en flujos principales
- **User Satisfaction**: > 4.5/5 en encuestas
- **Task Success**: > 95% en tareas críticas

### Escenarios de Prueba
1. **Vendedor nuevo**: Procesar primera venta en < 2 minutos
2. **Farmacéutico**: Dispensar receta controlada
3. **Administrador**: Generar reporte mensual
4. **Cliente móvil**: Consultar disponibilidad de producto