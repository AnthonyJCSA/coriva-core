# 🚀 Setup Supabase para Coriva Core

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa:
   - **Name**: coriva-core
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige la más cercana
5. Click "Create new project" (tarda 1-2 minutos)

## Paso 2: Ejecutar Script SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (menú izquierdo)
2. Click en "New query"
3. Copia TODO el contenido de `database/SETUP_SUPABASE.sql`
4. Pégalo en el editor
5. Click en **RUN** (o presiona Ctrl+Enter)
6. Verifica que aparezca "Success. No rows returned"

## Paso 3: Obtener Credenciales

1. Ve a **Settings** → **API** (menú izquierdo)
2. Copia estos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Paso 4: Configurar Variables en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en tu proyecto "coriva-core"
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Click "Save"
6. Ve a **Deployments**
7. Click en los 3 puntos del último deployment → **Redeploy**

## Paso 5: Verificar

1. Espera que termine el deployment (1-2 minutos)
2. Abre tu app en Vercel
3. Inicia sesión con:
   - Usuario: `demo`
   - Contraseña: `demo123`
4. El sistema ahora usará Supabase ✅

## 🔍 Verificar Tablas Creadas

En Supabase, ve a **Table Editor** y deberías ver:
- ✅ corivacore_products
- ✅ corivacore_customers
- ✅ corivacore_sales
- ✅ corivacore_sale_items
- ✅ corivacore_cash_movements

## ⚠️ Troubleshooting

### Error 400 Bad Request
- Verifica que ejecutaste el SQL completo
- Verifica que las tablas existen en Table Editor

### Error de autenticación
- Verifica que copiaste correctamente la ANON KEY
- Verifica que la URL no tenga espacios al final

### No se guardan datos
- Verifica que las políticas RLS estén habilitadas
- Ve a Authentication → Policies y verifica "Enable all"
