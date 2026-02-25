# Landing Page para Boticas - Coriva Core

## 📍 Ruta
`/botica`

## 🎯 Objetivo
Convertir tráfico frío de Google Ads en leads por WhatsApp y registros.

## 🎨 Estructura de la Landing

### 1. Hero Principal
- **H1**: "Sistema para boticas que te ayuda a vender más y no perder dinero"
- **Subtítulo**: "Controla tus ventas, stock y deudas sin cuaderno ni Excel. Desde S/49 al mes."
- **CTA Principal**: Botón a WhatsApp con mensaje precargado
- **CTA Secundario**: Ver demo
- **Trust Badges**: Implementación gratis, Soporte en Perú, Desde S/49/mes

### 2. Problemas Reales
6 problemas específicos de boticas en Perú:
- Pérdida de dinero por mala caja
- Falta de stock de medicamentos
- Ventas mal anotadas en cuaderno
- Deudas de clientes que no pagan
- Cierre de caja lento (1 hora)
- No saber cuánto se gana

### 3. Beneficios Prácticos
6 beneficios claros y medibles:
- Cierra tu caja en 1 minuto
- Sabe cuánto ganas hoy
- No te quedes sin stock
- Controla las deudas
- Vende más rápido
- Desde tu celular

### 4. Demo Visual
Simulación de interfaz de venta con:
- Búsqueda de medicamentos
- Carrito de compra
- Métodos de pago (Efectivo, Tarjeta, Yape)
- Proceso en 3 pasos

### 5. Testimonios
3 testimonios de dueños de boticas en Lima:
- San Juan de Lurigancho
- Villa El Salvador
- Los Olivos

### 6. Comparación
Antes vs Después (sin mencionar competidores):
- Cierre de caja
- Control de ventas
- Stock
- Deudas
- Automatización
- Reportes

### 7. Oferta con Urgencia
- Implementación gratis (valor S/ 300)
- S/ 49/mes (antes S/ 99)
- Solo para las primeras 50 boticas
- Incluye 8 beneficios listados

### 8. CTA Final
- Botón principal a WhatsApp
- Botón secundario a demo
- Información de contacto (teléfono y email)

## 📱 WhatsApp Integration

### Mensaje Precargado
```
Hola, tengo una botica y quiero digitalizar mi negocio con Coriva Core.
```

### Número de WhatsApp
+51 913 916 967

### Ubicaciones de CTA a WhatsApp
1. Hero principal (arriba del fold)
2. Después de problemas
3. Después de comparación
4. En oferta de urgencia
5. CTA final

## 🔍 SEO On-Page

### Meta Tags
```html
<title>Sistema para Boticas en Perú | Coriva Core</title>
<meta name="description" content="Sistema para boticas que controla ventas, stock y caja. Empieza hoy desde S/49 al mes. Soporte en Perú.">
<meta name="keywords" content="sistema para botica, software para boticas, control de stock farmacia, programa para botica en Perú, sistema pos farmacia, software farmacia peru">
```

### Palabras Clave Objetivo
- sistema para botica (primaria)
- software para boticas
- control de stock farmacia
- programa para botica en Perú
- sistema pos farmacia
- software farmacia peru

### Estructura de Headings
- **H1**: Sistema para boticas que te ayuda a vender más y no perder dinero
- **H2**: ¿Te pasa esto en tu botica?
- **H2**: Qué ganas con Coriva Core
- **H2**: Así de fácil es usar Coriva Core
- **H2**: Boticas que ya usan Coriva Core
- **H2**: Antes vs Después de Coriva Core
- **H2**: Oferta especial para boticas
- **H2**: Empieza a digitalizar tu botica hoy

### Schema Markup
Implementado JSON-LD para SoftwareApplication con:
- Nombre del producto
- Categoría
- Precio
- Descripción

## 🚀 Optimización para Google Ads

### Performance
- Componentes optimizados con lazy loading
- Imágenes optimizadas (usar WebP cuando sea posible)
- CSS crítico inline
- Fuentes optimizadas

### Above the Fold
- CTA visible sin scroll
- Propuesta de valor clara
- Trust badges visibles
- Botón de WhatsApp destacado

### Mobile First
- Diseño responsive
- Botones grandes para touch
- Texto legible sin zoom
- CTA fácil de presionar

## 📊 Tracking Recomendado

### Google Ads Conversion Tracking
1. Click en botón WhatsApp
2. Click en "Ver demo"
3. Scroll hasta oferta
4. Tiempo en página > 30 segundos

### Google Analytics Events
```javascript
// Click WhatsApp
gtag('event', 'click_whatsapp', {
  'page_location': '/botica',
  'cta_position': 'hero|problemas|comparacion|oferta|final'
});

// Click Demo
gtag('event', 'click_demo', {
  'page_location': '/botica'
});
```

## 🎨 Paleta de Colores

### Colores Principales
- Verde primario: `from-green-600 to-emerald-600`
- Verde hover: `from-green-700 to-emerald-700`
- Fondo claro: `from-green-50 to-emerald-50`

### Colores de Estado
- Alerta/Urgencia: `from-red-500 to-orange-500`
- Problema: `from-red-50 to-orange-50`
- Éxito: `border-green-300`

## 📝 Copywriting Guidelines

### ✅ Usar
- Lenguaje simple y directo
- Problemas específicos y reales
- Beneficios medibles
- Números concretos (S/49, 1 minuto, 50 boticas)
- Verbos de acción (controla, cierra, sabe)

### ❌ Evitar
- Términos técnicos (IA, SaaS, API)
- Palabras complejas (predictivo, analytics)
- Jerga empresarial
- Promesas vagas
- Mencionar competidores

## 🔄 A/B Testing Sugerido

### Variantes a Probar
1. **Hero Headline**
   - A: "Sistema para boticas que te ayuda a vender más y no perder dinero"
   - B: "Deja de perder dinero en tu botica. Controla todo desde tu celular"

2. **CTA Principal**
   - A: "Quiero el sistema para mi botica"
   - B: "Hablar con un asesor ahora"

3. **Precio**
   - A: "Desde S/49 al mes"
   - B: "Solo S/49 al mes (antes S/99)"

## 📞 Información de Contacto

- **WhatsApp**: +51 913 916 967
- **Email**: soporte@corivape.com
- **Horario**: Lunes a Sábado, 9am - 6pm

## 🚀 Próximos Pasos

1. Implementar Google Ads conversion tracking
2. Configurar Google Analytics 4 events
3. Crear variantes para A/B testing
4. Optimizar imágenes a WebP
5. Implementar lazy loading en componentes
6. Agregar testimonios reales con fotos
7. Crear video demo corto (30 segundos)
8. Implementar chat en vivo como alternativa a WhatsApp

## 📈 KPIs a Monitorear

- Tasa de conversión a WhatsApp
- Tiempo promedio en página
- Tasa de rebote
- Scroll depth
- Clicks en CTA por posición
- Conversión móvil vs desktop
- Costo por lead (CPL)
- Tasa de conversión de lead a cliente

---

**Última actualización**: Enero 2025
