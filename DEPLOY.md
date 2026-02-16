# 🚀 Guía de Despliegue en Vercel

## Pasos para Desplegar Coriva Core en Vercel

### 1. Preparar el Repositorio
```bash
git add .
git commit -m "chore: preparar para despliegue en Vercel"
git push origin main
```

### 2. Desplegar en Vercel

#### Opción A: Desde la Web de Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Click en "Add New Project"
4. Importa el repositorio: `AnthonyJCSA/coriva-core`
5. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click en "Deploy"

#### Opción B: Desde la CLI de Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

### 3. Configuración (Opcional)
No se requieren variables de entorno para la versión demo.

### 4. Acceder a tu Demo
Vercel te dará una URL como:
```
https://coriva-core.vercel.app
```

## ✅ Características del Demo

- ✅ Sistema Multi-Tenant completo
- ✅ Onboarding wizard de 3 pasos
- ✅ POS con cálculo correcto de IGV
- ✅ Importación Excel/CSV
- ✅ Gestión de clientes
- ✅ Control de caja
- ✅ Usuarios y roles
- ✅ Notificaciones en tiempo real
- ✅ Exportaciones Excel/CSV
- ✅ Soporte WhatsApp integrado

## 🔐 Credenciales de Demo

**Usuario existente:**
- Usuario: `demo`
- Contraseña: `demo123`

**O crear nuevo negocio:**
- Click en "¿Nuevo negocio? Regístrate aquí →"
- Completa el wizard de 3 pasos

## 📝 Notas Importantes

- El demo usa LocalStorage para persistencia de datos
- Los datos se guardan en el navegador del usuario
- No hay base de datos externa en esta versión
- Ideal para mostrar funcionalidades a clientes potenciales

## 🔄 Actualizaciones

Para actualizar el demo después de cambios:
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Vercel desplegará automáticamente los cambios.

## 🆘 Soporte

Si tienes problemas con el despliegue:
- Revisa los logs en el dashboard de Vercel
- Verifica que `npm run build` funcione localmente
- Contacta: soporte@coriva.com
