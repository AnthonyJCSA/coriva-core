# 🔧 Configuración de Variables de Entorno en Vercel

## Variables Requeridas

En Vercel, ve a: **Settings → Environment Variables**

Agrega estas variables (IMPORTANTE: usa el prefijo `NEXT_PUBLIC_`):

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## ⚠️ IMPORTANTE

1. **NO uses** `VITE_SUPABASE_URL` - Next.js no reconoce ese prefijo
2. **USA** `NEXT_PUBLIC_SUPABASE_URL` - Este prefijo es para Next.js
3. Después de agregar las variables, haz **Redeploy** del proyecto

## Cómo obtener las credenciales de Supabase

1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verificar

Después de configurar y redesplegar, abre la consola (F12) y deberías ver:
```
🔧 Supabase Config: { url: '✅ Configured', key: '✅ Configured' }
```
