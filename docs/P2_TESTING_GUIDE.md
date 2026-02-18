# 🧪 Guía de Testing - Fase P2

## 🎯 Objetivo
Verificar que todas las funcionalidades de la Fase P2 funcionan correctamente antes del despliegue a producción.

---

## ✅ Checklist de Testing

### 1️⃣ Multi-Currency Support

#### Test 1.1: Detección Automática de Moneda
- [ ] Abrir página de precios
- [ ] Verificar que la moneda detectada es correcta según tu ubicación
- [ ] Verificar que los precios se muestran en la moneda correcta

**Resultado Esperado**: Moneda detectada automáticamente según geolocalización del navegador

#### Test 1.2: Cambio Manual de Moneda
- [ ] Abrir página de precios
- [ ] Cambiar moneda usando el selector
- [ ] Verificar que los precios se actualizan inmediatamente
- [ ] Probar con todas las 8 monedas:
  - [ ] PEN (Soles Peruanos)
  - [ ] USD (US Dollars)
  - [ ] MXN (Pesos Mexicanos)
  - [ ] COP (Pesos Colombianos)
  - [ ] CLP (Pesos Chilenos)
  - [ ] ARS (Pesos Argentinos)
  - [ ] BRL (Reais Brasileños)
  - [ ] EUR (Euros)

**Resultado Esperado**: Precios se actualizan correctamente para cada moneda

#### Test 1.3: Formato de Precios
- [ ] Verificar que el símbolo de moneda es correcto
- [ ] Verificar que los separadores de miles son correctos
- [ ] Verificar que no hay decimales innecesarios

**Resultado Esperado**: Formato de precios correcto para cada moneda

---

### 2️⃣ Internacionalización (i18n)

#### Test 2.1: Detección Automática de Idioma
- [ ] Abrir página de precios
- [ ] Verificar que el idioma detectado es correcto según tu navegador
- [ ] Cambiar idioma del navegador y recargar
- [ ] Verificar que el idioma se actualiza

**Resultado Esperado**: Idioma detectado automáticamente según configuración del navegador

#### Test 2.2: Cambio Manual de Idioma
- [ ] Abrir página de precios
- [ ] Cambiar idioma usando el selector
- [ ] Verificar que todos los textos se traducen:
  - [ ] Título de la página
  - [ ] Subtítulo
  - [ ] Nombres de planes
  - [ ] Descripciones
  - [ ] Botones (CTAs)
  - [ ] Garantía
  - [ ] Toggle mensual/anual

**Resultado Esperado**: Todos los textos se traducen correctamente

#### Test 2.3: Persistencia de Idioma
- [ ] Cambiar idioma
- [ ] Navegar a otra página
- [ ] Regresar a precios
- [ ] Verificar que el idioma se mantiene

**Resultado Esperado**: Idioma persiste durante la sesión

---

### 3️⃣ Analytics Tracking (GA4)

#### Test 3.1: Verificar Instalación
- [ ] Abrir DevTools (F12)
- [ ] Ir a pestaña "Network"
- [ ] Filtrar por "google-analytics"
- [ ] Recargar página
- [ ] Verificar que aparecen requests a GA4

**Resultado Esperado**: Requests a `www.google-analytics.com` y `www.googletagmanager.com`

#### Test 3.2: Eventos de Pricing
- [ ] Abrir página de precios
- [ ] Cambiar idioma → Verificar evento `change_language`
- [ ] Cambiar moneda → Verificar evento `change_currency`
- [ ] Toggle mensual/anual → Verificar evento `toggle_billing`
- [ ] Click en plan → Verificar evento `click_plan`

**Cómo verificar**:
1. Abrir DevTools (F12)
2. Ir a pestaña "Console"
3. Escribir: `dataLayer`
4. Verificar que los eventos aparecen

**Resultado Esperado**: Todos los eventos se registran en `dataLayer`

#### Test 3.3: Eventos de Exit-Intent
- [ ] Abrir landing page
- [ ] Mover mouse fuera de la ventana (arriba)
- [ ] Verificar que aparece popup
- [ ] Verificar evento `exit_intent_shown`
- [ ] Cerrar popup → Verificar evento `exit_intent_closed`
- [ ] Abrir popup nuevamente
- [ ] Click en CTA → Verificar evento `exit_intent_converted`

**Resultado Esperado**: Todos los eventos se registran correctamente

#### Test 3.4: Verificar en GA4 Real-Time
- [ ] Ir a Google Analytics
- [ ] Click en "Informes" → "Tiempo real"
- [ ] Realizar acciones en el sitio
- [ ] Verificar que aparecen en tiempo real

**Resultado Esperado**: Eventos aparecen en GA4 en tiempo real

---

### 4️⃣ Exit-Intent Popup

#### Test 4.1: Trigger por Mouse Exit
- [ ] Abrir landing page
- [ ] Mover mouse fuera de la ventana (arriba)
- [ ] Verificar que aparece popup
- [ ] Verificar animación suave

**Resultado Esperado**: Popup aparece con animación

#### Test 4.2: Trigger por Scroll
- [ ] Abrir landing page
- [ ] Hacer scroll hasta 70% de la página
- [ ] Verificar que aparece popup

**Resultado Esperado**: Popup aparece al llegar a 70% de scroll

#### Test 4.3: No Molestar (LocalStorage)
- [ ] Abrir landing page
- [ ] Activar popup (mouse exit o scroll)
- [ ] Cerrar popup
- [ ] Recargar página
- [ ] Intentar activar popup nuevamente
- [ ] Verificar que NO aparece

**Resultado Esperado**: Popup no aparece si ya se mostró

#### Test 4.4: Re-aparición después de 7 días
- [ ] Abrir DevTools (F12)
- [ ] Ir a "Application" → "Local Storage"
- [ ] Buscar `coriva_exit_shown`
- [ ] Cambiar valor a fecha de hace 8 días
- [ ] Recargar página
- [ ] Intentar activar popup
- [ ] Verificar que SÍ aparece

**Resultado Esperado**: Popup re-aparece después de 7 días

#### Test 4.5: Contenido del Popup
- [ ] Verificar título: "¡Espera!"
- [ ] Verificar oferta: "50% OFF"
- [ ] Verificar badges: "Sin tarjeta", "Cancela cuando quieras"
- [ ] Verificar CTA: "Crear mi cuenta gratis →"
- [ ] Verificar texto de rechazo

**Resultado Esperado**: Todo el contenido es correcto

---

### 5️⃣ Página de Precios Mejorada

#### Test 5.1: Layout y Diseño
- [ ] Verificar header sticky
- [ ] Verificar logo y nombre
- [ ] Verificar selectores de idioma y moneda
- [ ] Verificar botón CTA en header
- [ ] Verificar sección hero
- [ ] Verificar toggle mensual/anual
- [ ] Verificar 3 planes (Starter, Pro, Premium)
- [ ] Verificar footer con WhatsApp

**Resultado Esperado**: Layout completo y responsive

#### Test 5.2: Toggle Mensual/Anual
- [ ] Click en "Mensual"
- [ ] Verificar precios mensuales
- [ ] Click en "Anual"
- [ ] Verificar precios anuales
- [ ] Verificar badge "Ahorra 60%"
- [ ] Verificar precios tachados (originales)

**Resultado Esperado**: Precios se actualizan correctamente

#### Test 5.3: Badges y Destacados
- [ ] Verificar badge "🔥 Más Popular" en plan Pro
- [ ] Verificar badge "60% OFF" en plan Pro (anual)
- [ ] Verificar badge "20% OFF" en plan Premium (anual)
- [ ] Verificar borde destacado en plan Pro

**Resultado Esperado**: Badges y destacados correctos

#### Test 5.4: CTAs
- [ ] Click en "Empezar gratis" (Starter)
- [ ] Verificar redirección a /registro
- [ ] Click en "Prueba 30 días gratis" (Pro)
- [ ] Verificar redirección a /registro
- [ ] Click en "Hablar con ventas" (Premium)
- [ ] Verificar redirección a /registro

**Resultado Esperado**: Todos los CTAs funcionan

#### Test 5.5: WhatsApp
- [ ] Scroll hasta el final
- [ ] Click en "Hablar con ventas por WhatsApp"
- [ ] Verificar que abre WhatsApp
- [ ] Verificar número correcto

**Resultado Esperado**: WhatsApp se abre correctamente

---

### 6️⃣ Responsive Design

#### Test 6.1: Desktop (1920x1080)
- [ ] Abrir en pantalla grande
- [ ] Verificar que todo se ve bien
- [ ] Verificar espaciado correcto
- [ ] Verificar que no hay overflow

**Resultado Esperado**: Diseño perfecto en desktop

#### Test 6.2: Tablet (768x1024)
- [ ] Abrir en tablet o usar DevTools
- [ ] Verificar que el grid se adapta
- [ ] Verificar que los selectores son accesibles
- [ ] Verificar que el popup se ve bien

**Resultado Esperado**: Diseño adaptado a tablet

#### Test 6.3: Mobile (375x667)
- [ ] Abrir en móvil o usar DevTools
- [ ] Verificar que los planes se apilan
- [ ] Verificar que los selectores funcionan
- [ ] Verificar que el popup es responsive
- [ ] Verificar que los botones son táctiles

**Resultado Esperado**: Diseño perfecto en móvil

---

### 7️⃣ Performance

#### Test 7.1: Lighthouse Score
- [ ] Abrir DevTools (F12)
- [ ] Ir a pestaña "Lighthouse"
- [ ] Seleccionar "Desktop"
- [ ] Click en "Generate report"
- [ ] Verificar scores:
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

**Resultado Esperado**: Todos los scores > 90

#### Test 7.2: Tiempo de Carga
- [ ] Abrir DevTools (F12)
- [ ] Ir a pestaña "Network"
- [ ] Recargar página (Ctrl+Shift+R)
- [ ] Verificar tiempo de carga total < 3s
- [ ] Verificar First Contentful Paint < 1.5s
- [ ] Verificar Largest Contentful Paint < 2.5s

**Resultado Esperado**: Tiempos de carga óptimos

---

### 8️⃣ Integración

#### Test 8.1: Variables de Entorno
- [ ] Verificar que `NEXT_PUBLIC_GA_ID` está configurado
- [ ] Verificar que `NEXT_PUBLIC_APP_URL` está configurado
- [ ] Verificar que `NEXT_PUBLIC_WHATSAPP_NUMBER` está configurado

**Resultado Esperado**: Todas las variables configuradas

#### Test 8.2: Build de Producción
```bash
npm run build
```
- [ ] Verificar que no hay errores
- [ ] Verificar que no hay warnings críticos
- [ ] Verificar tamaño del bundle < 500KB

**Resultado Esperado**: Build exitoso sin errores

#### Test 8.3: Modo Producción Local
```bash
npm run build
npm run start
```
- [ ] Abrir http://localhost:3000
- [ ] Verificar que todo funciona igual
- [ ] Verificar que Analytics funciona
- [ ] Verificar que no hay errores en consola

**Resultado Esperado**: Todo funciona en modo producción

---

## 🐛 Bugs Conocidos

### Bug 1: [Ninguno reportado]
**Descripción**: N/A  
**Severidad**: N/A  
**Workaround**: N/A  
**Estado**: N/A

---

## 📊 Reporte de Testing

### Resumen
- **Total Tests**: 50+
- **Tests Pasados**: ___
- **Tests Fallados**: ___
- **Tests Pendientes**: ___

### Cobertura
- [ ] Multi-Currency: 100%
- [ ] i18n: 100%
- [ ] Analytics: 100%
- [ ] Exit-Intent: 100%
- [ ] Pricing Page: 100%
- [ ] Responsive: 100%
- [ ] Performance: 100%
- [ ] Integración: 100%

### Dispositivos Testeados
- [ ] Chrome Desktop (Windows)
- [ ] Chrome Desktop (Mac)
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Edge Desktop

### Navegadores Testeados
- [ ] Chrome 120+
- [ ] Firefox 120+
- [ ] Safari 17+
- [ ] Edge 120+

---

## ✅ Aprobación de Testing

### Tester
- **Nombre**: _______________
- **Fecha**: _______________
- **Firma**: _______________

### Aprobación
- [ ] Todos los tests críticos pasados
- [ ] No hay bugs bloqueantes
- [ ] Performance aceptable
- [ ] Listo para producción

---

**Testing Completado** ✅  
**Próximo Paso**: Deploy a Producción

---

**Desarrollado con ❤️ para calidad garantizada**
