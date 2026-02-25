# 📊 Tracking y Conversiones - Guía de Implementación

## ✅ Implementación Completada

### 1. Google Tag Manager (GTM)
- ✅ GTM instalado en todas las páginas
- ✅ dataLayer configurado
- ✅ Eventos personalizados implementados

### 2. Eventos de Conversión Implementados

#### lead_whatsapp
**Trigger:** Click en cualquier botón de WhatsApp
**Variables:**
- `source`: 'botica', 'bodega', 'home', 'sticky', 'modal'
- `conversion_label`: 'whatsapp_click'

**Ubicaciones:**
- Hero principal (home, botica, bodega)
- Sticky WhatsApp (todas las páginas)
- Modal de demo guiada
- CTAs en secciones

#### view_demo
**Trigger:** Click en "Ver demo"
**Variables:**
- `source`: página de origen
- `conversion_label`: 'demo_view'

#### signup_complete
**Trigger:** Registro completado
**Variables:**
- `business_type`: tipo de negocio
- `conversion_label`: 'signup'

#### scroll_depth
**Trigger:** Scroll en la página
**Milestones:** 25%, 50%, 75%, 100%

#### time_on_page
**Trigger:** Tiempo en página
**Milestones:** 30s, 60s, 120s

#### page_view
**Trigger:** Carga de página
**Variables:**
- `page_path`: ruta de la página
- `page_type`: 'home', 'botica', 'bodega', 'demo'

### 3. Meta Pixel
- ✅ Pixel instalado
- ✅ PageView tracking automático

## 🔧 Configuración Requerida

### Variables de Entorno (.env.local)

```env
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Meta Pixel (opcional)
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX

# Google Ads Conversion IDs (actualizar en src/lib/tracking.ts)
# AW-CONVERSION_ID/CONVERSION_LABEL
# AW-CONVERSION_ID/SIGNUP_LABEL
```

### Pasos de Configuración

#### 1. Google Tag Manager

**Crear cuenta GTM:**
1. Ir a https://tagmanager.google.com
2. Crear cuenta y contenedor
3. Copiar el ID (GTM-XXXXXXX)
4. Agregar a `.env.local`

**Configurar Tags en GTM:**

**Tag 1: Google Ads - WhatsApp Conversion**
- Tipo: Google Ads Conversion Tracking
- Conversion ID: AW-XXXXXXX
- Conversion Label: whatsapp_click
- Trigger: Custom Event = lead_whatsapp

**Tag 2: Google Ads - Signup Conversion**
- Tipo: Google Ads Conversion Tracking
- Conversion ID: AW-XXXXXXX
- Conversion Label: signup
- Trigger: Custom Event = signup_complete

**Tag 3: GA4 - Custom Events**
- Tipo: Google Analytics: GA4 Event
- Event Name: {{Event}}
- Trigger: Custom Event (todos los eventos)

#### 2. Google Analytics 4

**Configurar GA4:**
1. Crear propiedad GA4
2. Copiar Measurement ID (G-XXXXXXXXXX)
3. Agregar en GTM como tag de configuración

**Eventos personalizados en GA4:**
- lead_whatsapp
- view_demo
- signup_complete
- scroll_depth
- time_on_page

#### 3. Google Ads

**Configurar conversiones:**
1. Google Ads > Herramientas > Conversiones
2. Crear conversión "WhatsApp Lead"
   - Categoría: Lead
   - Valor: 10 PEN (ajustar según LTV)
   - Conteo: Todas
3. Crear conversión "Signup"
   - Categoría: Signup
   - Valor: 50 PEN
   - Conteo: Una
4. Copiar IDs de conversión
5. Actualizar en `src/lib/tracking.ts`

## 📊 Audiencias de Remarketing

### Audiencias Recomendadas

#### 1. Visitantes de /botica
**Configuración en GA4:**
- Condición: page_path contiene '/botica'
- Duración: 30 días
- Uso: Remarketing específico para boticas

#### 2. Visitantes de /bodega
**Configuración en GA4:**
- Condición: page_path contiene '/bodega'
- Duración: 30 días
- Uso: Remarketing específico para bodegas

#### 3. Usuarios que hicieron clic en WhatsApp
**Configuración en GA4:**
- Condición: event_name = 'lead_whatsapp'
- Duración: 7 días
- Uso: Remarketing de alta intención

#### 4. Usuarios que vieron demo y no convirtieron
**Configuración en GA4:**
- Condición: event_name = 'view_demo' AND NOT event_name = 'signup_complete'
- Duración: 14 días
- Uso: Remarketing de recuperación

#### 5. Scroll profundo sin conversión
**Configuración en GA4:**
- Condición: scroll_percentage >= 75 AND NOT event_name = 'lead_whatsapp'
- Duración: 7 días
- Uso: Usuarios interesados pero no convertidos

## ✅ Checklist de Validación

### Pre-Lanzamiento

- [ ] GTM ID configurado en `.env.local`
- [ ] GTM publicado en producción
- [ ] Conversiones de Google Ads creadas
- [ ] IDs de conversión actualizados en código
- [ ] GA4 configurado y conectado a GTM
- [ ] Eventos personalizados visibles en GA4 (modo debug)
- [ ] Meta Pixel instalado (opcional)
- [ ] Audiencias de remarketing creadas

### Testing

**Test 1: WhatsApp Click**
1. Abrir /botica
2. Click en botón WhatsApp
3. Verificar en GTM Preview: evento `lead_whatsapp` con source='botica'
4. Verificar en GA4 Realtime: evento aparece

**Test 2: Scroll Tracking**
1. Abrir /bodega
2. Hacer scroll hasta 75%
3. Verificar en GTM Preview: evento `scroll_depth` con scroll_percentage=75

**Test 3: Time on Page**
1. Abrir cualquier landing
2. Esperar 30 segundos
3. Verificar en GTM Preview: evento `time_on_page` con time_seconds=30

**Test 4: Modal Demo**
1. Abrir home
2. Click en "Ver cómo funciona"
3. Verificar modal abierto
4. Click en "Hablar por WhatsApp"
5. Verificar evento `lead_whatsapp` con source='modal'

### Post-Lanzamiento (24-48 horas)

- [ ] Conversiones aparecen en Google Ads
- [ ] Eventos aparecen en GA4
- [ ] Audiencias empiezan a poblarse
- [ ] Remarketing tags funcionando
- [ ] No hay errores en GTM

## 🎯 Estructura de Campaña Recomendada

### Campaña 1: Search - Boticas
**Keywords:**
- sistema para botica
- software para boticas
- control de stock farmacia
- programa para botica peru

**Landing:** /botica  
**Conversión principal:** lead_whatsapp

### Campaña 2: Search - Bodegas
**Keywords:**
- sistema para bodega
- programa para bodega
- control de ventas tienda
- sistema pos bodega

**Landing:** /bodega  
**Conversión principal:** lead_whatsapp

### Campaña 3: Display - Remarketing
**Audiencias:**
- Visitantes /botica (últimos 30 días)
- Visitantes /bodega (últimos 30 días)
- WhatsApp click sin signup (últimos 7 días)

**Landing:** Según audiencia  
**Conversión:** signup_complete

## 📈 KPIs a Monitorear

### Métricas de Conversión
- CTR de anuncios
- Tasa de conversión a WhatsApp
- Costo por lead (CPL)
- Tasa de conversión a signup
- Costo por adquisición (CPA)

### Métricas de Engagement
- Tiempo promedio en página
- Scroll depth promedio
- Bounce rate por landing
- Páginas por sesión

### Métricas de Remarketing
- Tamaño de audiencias
- CTR de remarketing
- Conversión de remarketing vs cold traffic

## 🔍 Debugging

### GTM Preview Mode
1. Abrir GTM
2. Click en "Preview"
3. Ingresar URL: https://coriva-core.vercel.app
4. Navegar y verificar eventos

### GA4 DebugView
1. Abrir GA4
2. Configure > DebugView
3. Navegar con GTM Preview activo
4. Ver eventos en tiempo real

### Chrome DevTools
```javascript
// Ver dataLayer
console.log(window.dataLayer)

// Simular evento
window.dataLayer.push({
  event: 'lead_whatsapp',
  source: 'test'
})
```

## 📞 Soporte

Si hay problemas con el tracking:
1. Verificar GTM ID en `.env.local`
2. Verificar que GTM esté publicado
3. Usar GTM Preview para debugging
4. Verificar console de navegador por errores

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0
