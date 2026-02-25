# 🚀 Configuración Rápida de GTM - Coriva Core

## ✅ GTM ID Instalado: GTM-M3B3KGCQ

## 📋 Pasos Siguientes (15 minutos)

### 1. Configurar Tags en GTM

Ir a: https://tagmanager.google.com/

#### Tag 1: Google Ads - WhatsApp Lead
```
Tipo: Google Ads Conversion Tracking
Nombre: Ads - WhatsApp Lead
Conversion ID: AW-XXXXXXX (tu ID de Google Ads)
Conversion Label: (copiar de Google Ads)
Trigger: Custom Event
  - Event name equals lead_whatsapp
```

#### Tag 2: Google Ads - Signup
```
Tipo: Google Ads Conversion Tracking
Nombre: Ads - Signup Complete
Conversion ID: AW-XXXXXXX
Conversion Label: (copiar de Google Ads)
Trigger: Custom Event
  - Event name equals signup_complete
```

#### Tag 3: GA4 Configuration (opcional)
```
Tipo: Google Analytics: GA4 Configuration
Nombre: GA4 Config
Measurement ID: G-XXXXXXXXXX (tu ID de GA4)
Trigger: All Pages
```

#### Tag 4: GA4 Events
```
Tipo: Google Analytics: GA4 Event
Nombre: GA4 - All Events
Configuration Tag: GA4 Config
Event Name: {{Event}}
Trigger: Custom Event
  - Event name matches RegEx: .*
```

### 2. Crear Triggers

#### Trigger 1: WhatsApp Click
```
Nombre: CE - lead_whatsapp
Tipo: Custom Event
Event name: lead_whatsapp
```

#### Trigger 2: Signup Complete
```
Nombre: CE - signup_complete
Tipo: Custom Event
Event name: signup_complete
```

#### Trigger 3: All Custom Events
```
Nombre: CE - All Events
Tipo: Custom Event
Event name: .* (RegEx)
```

### 3. Crear Variables (opcional)

#### Variable 1: Event Source
```
Nombre: DL - Event Source
Tipo: Data Layer Variable
Data Layer Variable Name: source
```

#### Variable 2: Business Type
```
Nombre: DL - Business Type
Tipo: Data Layer Variable
Data Layer Variable Name: business_type
```

### 4. Publicar Contenedor

1. Click en "Submit" (arriba derecha)
2. Nombre de versión: "Initial Setup - Conversions"
3. Descripción: "WhatsApp leads y signup tracking"
4. Click en "Publish"

## 🧪 Testing (5 minutos)

### Modo Preview

1. En GTM, click en "Preview"
2. Ingresar URL: https://coriva-core.vercel.app/botica
3. Click en "Connect"

### Test 1: WhatsApp Click
1. En la página /botica, click en cualquier botón WhatsApp
2. En GTM Preview, verificar:
   - Evento: `lead_whatsapp`
   - Variable `source`: `botica`
3. ✅ Tag de Google Ads debe dispararse

### Test 2: Scroll Tracking
1. Hacer scroll hasta 75%
2. Verificar evento: `scroll_depth`
3. Variable `scroll_percentage`: `75`

### Test 3: Time on Page
1. Esperar 30 segundos
2. Verificar evento: `time_on_page`
3. Variable `time_seconds`: `30`

## 📊 Eventos Disponibles

| Evento | Descripción | Variables |
|--------|-------------|-----------|
| `lead_whatsapp` | Click en WhatsApp | source, conversion_label |
| `view_demo` | Click en demo | source |
| `signup_complete` | Registro completado | business_type |
| `scroll_depth` | Scroll en página | scroll_percentage |
| `time_on_page` | Tiempo en página | time_seconds |
| `page_view` | Vista de página | page_path, page_type |
| `modal_open` | Modal abierto | modal_type, source |
| `cta_click` | Click en CTA | cta_text, cta_location, destination |

## 🎯 Conversiones en Google Ads

### Crear Conversión: WhatsApp Lead

1. Google Ads > Herramientas > Conversiones
2. Click en "+" Nueva conversión
3. Seleccionar "Sitio web"
4. Configuración:
   - Categoría: **Lead**
   - Nombre: **WhatsApp Lead - Coriva**
   - Valor: **10 PEN** (ajustar según tu LTV)
   - Conteo: **Todas**
   - Ventana de conversión: **30 días**
5. Método de seguimiento: **Usar Google Tag Manager**
6. Copiar el **Conversion ID** y **Conversion Label**
7. Pegar en Tag de GTM

### Crear Conversión: Signup

1. Repetir pasos anteriores
2. Configuración:
   - Categoría: **Signup**
   - Nombre: **Signup Complete - Coriva**
   - Valor: **50 PEN**
   - Conteo: **Una**
3. Copiar IDs y pegar en GTM

## 🔍 Verificar que Funciona

### En Google Ads (24-48 horas después)
1. Ir a Conversiones
2. Verificar que aparecen conversiones
3. Estado debe ser "Registrando conversiones"

### En GA4 (inmediato)
1. Ir a Realtime
2. Hacer test en la página
3. Ver eventos en tiempo real

### En GTM
1. Workspace > Tags
2. Verificar que tags se disparan en Preview

## ⚠️ Troubleshooting

**Problema:** Eventos no aparecen en GTM Preview
- Solución: Verificar que .env.local tiene GTM-M3B3KGCQ
- Solución: Hacer rebuild: `npm run build`

**Problema:** Conversiones no aparecen en Google Ads
- Solución: Esperar 24-48 horas
- Solución: Verificar Conversion ID y Label correctos
- Solución: Verificar que tag se dispara en GTM Preview

**Problema:** GA4 no recibe eventos
- Solución: Verificar Measurement ID correcto
- Solución: Verificar que GA4 Config tag se dispara en todas las páginas

## 📞 Soporte

Si necesitas ayuda:
1. Verificar GTM Preview mode
2. Verificar console del navegador (F12)
3. Verificar que dataLayer existe: `console.log(window.dataLayer)`

---

**GTM ID:** GTM-M3B3KGCQ  
**Status:** ✅ Instalado y listo para configurar
