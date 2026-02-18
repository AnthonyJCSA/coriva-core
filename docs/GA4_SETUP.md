# 📊 Guía de Configuración - Google Analytics 4 (GA4)

## 🎯 Objetivo
Configurar Google Analytics 4 para trackear eventos y conversiones en Coriva Core.

---

## 📋 Paso 1: Crear Cuenta de Google Analytics

### 1.1 Acceder a Google Analytics
1. Ir a [analytics.google.com](https://analytics.google.com)
2. Iniciar sesión con tu cuenta de Google
3. Click en **"Empezar a medir"**

### 1.2 Configurar Cuenta
- **Nombre de la cuenta**: Coriva Core
- **Compartir datos**: Seleccionar opciones recomendadas
- Click en **"Siguiente"**

### 1.3 Configurar Propiedad
- **Nombre de la propiedad**: Coriva Core Production
- **Zona horaria**: (GMT-5) Lima, Perú
- **Moneda**: Soles peruanos (PEN)
- Click en **"Siguiente"**

### 1.4 Información del Negocio
- **Sector**: Software y tecnología
- **Tamaño de la empresa**: Pequeña (1-10 empleados)
- **Uso previsto**: Medir el rendimiento del sitio web
- Click en **"Crear"**

---

## 📋 Paso 2: Configurar Flujo de Datos Web

### 2.1 Crear Flujo de Datos
1. Seleccionar **"Web"**
2. Configurar:
   - **URL del sitio web**: `https://coriva-core.vercel.app`
   - **Nombre del flujo**: Coriva Core Web
   - **Medición mejorada**: Activar (recomendado)
3. Click en **"Crear flujo"**

### 2.2 Copiar Measurement ID
- Aparecerá un ID como: `G-XXXXXXXXXX`
- **Copiar este ID** (lo necesitarás en el siguiente paso)

---

## 📋 Paso 3: Configurar Variables de Entorno

### 3.1 Archivo Local (.env.local)
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Reemplaza G-XXXXXXXXXX con tu Measurement ID real
```

### 3.2 Vercel (Producción)
1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Seleccionar proyecto **coriva-core**
3. Ir a **Settings** → **Environment Variables**
4. Agregar variable:
   - **Key**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`
   - **Environment**: Production, Preview, Development
5. Click en **"Save"**
6. **Re-deploy** el proyecto

---

## 📋 Paso 4: Verificar Instalación

### 4.1 Verificar en Tiempo Real
1. Ir a Google Analytics
2. Click en **"Informes"** → **"Tiempo real"**
3. Abrir tu sitio web en otra pestaña
4. Deberías ver tu visita en tiempo real

### 4.2 Verificar con Google Tag Assistant
1. Instalar extensión: [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Abrir tu sitio web
3. Click en la extensión
4. Verificar que aparece **Google Analytics 4**

---

## 📋 Paso 5: Configurar Eventos Personalizados

### 5.1 Eventos Implementados
Los siguientes eventos ya están implementados en el código:

#### Eventos de Pricing
- `change_language` - Usuario cambia idioma
- `change_currency` - Usuario cambia moneda
- `toggle_billing` - Usuario cambia entre mensual/anual
- `click_plan` - Usuario hace click en un plan

#### Eventos de Exit-Intent
- `exit_intent_shown` - Popup mostrado
- `exit_intent_closed` - Usuario cierra popup
- `exit_intent_converted` - Usuario hace click en CTA

#### Eventos de Conversión
- `click_whatsapp` - Usuario hace click en WhatsApp
- `sign_up` - Usuario se registra (futuro)
- `purchase` - Usuario realiza compra (futuro)

### 5.2 Ver Eventos en GA4
1. Ir a **"Informes"** → **"Eventos"**
2. Esperar 24-48 horas para ver datos
3. Los eventos aparecerán automáticamente

---

## 📋 Paso 6: Configurar Conversiones

### 6.1 Marcar Eventos como Conversiones
1. Ir a **"Configurar"** → **"Eventos"**
2. Buscar evento: `exit_intent_converted`
3. Toggle **"Marcar como conversión"**
4. Repetir para:
   - `click_plan`
   - `click_whatsapp`
   - `sign_up` (cuando esté implementado)

### 6.2 Configurar Objetivos de Conversión
1. Ir a **"Configurar"** → **"Conversiones"**
2. Verificar que los eventos marcados aparecen
3. Configurar valores de conversión (opcional)

---

## 📋 Paso 7: Crear Informes Personalizados

### 7.1 Informe de Conversión por País
1. Ir a **"Explorar"** → **"Crear exploración"**
2. Configurar:
   - **Dimensiones**: País, Ciudad
   - **Métricas**: Conversiones, Tasa de conversión
   - **Filtros**: Ninguno
3. Guardar como: "Conversiones por País"

### 7.2 Informe de Precios
1. Crear nueva exploración
2. Configurar:
   - **Dimensiones**: Evento, Etiqueta del evento
   - **Métricas**: Recuento de eventos
   - **Filtros**: Eventos que contienen "click_plan"
3. Guardar como: "Análisis de Precios"

### 7.3 Informe de Exit-Intent
1. Crear nueva exploración
2. Configurar:
   - **Dimensiones**: Evento
   - **Métricas**: Recuento de eventos
   - **Filtros**: Eventos que contienen "exit_intent"
3. Guardar como: "Análisis Exit-Intent"

---

## 📋 Paso 8: Configurar Alertas

### 8.1 Alerta de Caída de Conversiones
1. Ir a **"Configurar"** → **"Alertas personalizadas"**
2. Click en **"Crear alerta"**
3. Configurar:
   - **Nombre**: Caída de conversiones
   - **Condición**: Conversiones < 5 por día
   - **Frecuencia**: Diaria
   - **Notificación**: Email
4. Guardar

### 8.2 Alerta de Pico de Tráfico
1. Crear nueva alerta
2. Configurar:
   - **Nombre**: Pico de tráfico
   - **Condición**: Usuarios activos > 100
   - **Frecuencia**: Tiempo real
   - **Notificación**: Email
3. Guardar

---

## 📊 Métricas Clave a Monitorear

### Conversión
- **Tasa de conversión general**: > 2%
- **Conversión desde exit-intent**: > 5%
- **Conversión por país**: Comparar países

### Engagement
- **Tiempo promedio en página**: > 2 minutos
- **Páginas por sesión**: > 3
- **Tasa de rebote**: < 60%

### Adquisición
- **Fuentes de tráfico**: Orgánico, Directo, Social
- **Canales más efectivos**: Identificar mejores canales
- **Costo por conversión**: Calcular ROI

---

## 🔧 Troubleshooting

### Problema: No aparecen eventos
**Solución**:
1. Verificar que `NEXT_PUBLIC_GA_ID` está configurado
2. Verificar en consola del navegador (F12)
3. Esperar 24-48 horas para ver datos
4. Verificar en "Tiempo real" primero

### Problema: Eventos duplicados
**Solución**:
1. Verificar que Analytics solo está en `layout.tsx`
2. No incluir Analytics en múltiples lugares
3. Verificar que no hay otros scripts de GA4

### Problema: Conversiones no se registran
**Solución**:
1. Verificar que eventos están marcados como conversión
2. Verificar que el código de tracking está correcto
3. Testear eventos en "Tiempo real"

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Google Analytics 4 Docs](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267735)

### Herramientas
- [Google Tag Assistant](https://tagassistant.google.com/)
- [GA4 Event Builder](https://ga-dev-tools.web.app/ga4/event-builder/)
- [Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### Tutoriales
- [GA4 Setup Guide](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- [Custom Events in GA4](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- [Conversion Tracking](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Google Analytics creada
- [ ] Propiedad GA4 configurada
- [ ] Flujo de datos web creado
- [ ] Measurement ID copiado
- [ ] Variable de entorno configurada (local)
- [ ] Variable de entorno configurada (Vercel)
- [ ] Proyecto re-deployado
- [ ] Verificación en tiempo real exitosa
- [ ] Eventos personalizados verificados
- [ ] Conversiones configuradas
- [ ] Informes personalizados creados
- [ ] Alertas configuradas
- [ ] Dashboard de monitoreo listo

---

**Configuración completada** ✅  
**Próximo paso**: Monitorear métricas y optimizar conversiones

---

**Desarrollado con ❤️ para data-driven decisions**
