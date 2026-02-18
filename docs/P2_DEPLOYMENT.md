# 🚀 Plan de Deployment - Fase P2

## 🎯 Objetivo
Desplegar Coriva Core con todas las funcionalidades de Fase P2 a producción en Vercel.

---

## 📋 Pre-Deployment Checklist

### Código
- [x] Todas las funcionalidades implementadas
- [x] Tests manuales completados
- [x] No hay errores en consola
- [x] Build local exitoso
- [x] Documentación actualizada

### Configuración
- [ ] Variables de entorno preparadas
- [ ] Google Analytics 4 configurado
- [ ] Dominio configurado (opcional)
- [ ] DNS configurado (opcional)

---

## 🚀 Paso 1: Preparar Variables de Entorno

### 1.1 Crear archivo .env.local
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=https://coriva-core.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=51913916967

# Supabase (si aplica)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 1.2 Verificar Build Local
```bash
npm run build
npm run start
```

---

## 🚀 Paso 2: Deploy a Vercel

### 2.1 Opción A: Deploy desde GitHub

#### Conectar Repositorio
1. Ir a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importar repositorio de GitHub
4. Seleccionar `coriva-core`

#### Configurar Proyecto
- **Framework**: Next.js
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: .next

#### Agregar Variables de Entorno
1. Ir a "Environment Variables"
2. Agregar cada variable:
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Seleccionar: Production, Preview, Development

#### Deploy
1. Click en "Deploy"
2. Esperar 2-3 minutos
3. Verificar que el deploy es exitoso

### 2.2 Opción B: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🚀 Paso 3: Configurar Google Analytics

### 3.1 Crear Propiedad GA4
1. Ir a [analytics.google.com](https://analytics.google.com)
2. Crear cuenta y propiedad
3. Copiar Measurement ID (G-XXXXXXXXXX)

### 3.2 Agregar a Vercel
1. Ir a proyecto en Vercel
2. Settings → Environment Variables
3. Agregar `NEXT_PUBLIC_GA_ID`
4. Re-deploy

---

## 🚀 Paso 4: Verificación Post-Deploy

### 4.1 Verificar Sitio
- [ ] Abrir URL de producción
- [ ] Verificar que carga correctamente
- [ ] Verificar que no hay errores 404
- [ ] Verificar que no hay errores en consola

### 4.2 Verificar Funcionalidades
- [ ] Multi-currency funciona
- [ ] i18n funciona
- [ ] Exit-intent popup funciona
- [ ] Página de precios funciona
- [ ] WhatsApp funciona

### 4.3 Verificar Analytics
- [ ] Abrir GA4 Real-Time
- [ ] Navegar en el sitio
- [ ] Verificar que aparecen eventos
- [ ] Verificar que se registran pageviews

---

## 🚀 Paso 5: Configurar Dominio (Opcional)

### 5.1 Agregar Dominio en Vercel
1. Ir a Settings → Domains
2. Agregar dominio: `coriva.com`
3. Copiar registros DNS

### 5.2 Configurar DNS
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 Verificar
- Esperar propagación (5-30 min)
- Verificar en [dnschecker.org](https://dnschecker.org)

---

## 📊 Monitoreo Post-Deploy

### Día 1
- [ ] Verificar errores en Vercel
- [ ] Verificar Analytics en tiempo real
- [ ] Verificar conversiones
- [ ] Monitorear performance

### Semana 1
- [ ] Revisar métricas diarias
- [ ] Identificar problemas
- [ ] Optimizar según datos
- [ ] A/B testing inicial

---

## ✅ Deployment Completado

**URL Producción**: https://coriva-core.vercel.app  
**Fecha Deploy**: _______________  
**Versión**: Fase P2 v1.0.0  
**Status**: ✅ Exitoso

---

**Desarrollado con ❤️ para producción**
