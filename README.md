# 💊 FarmaZi - Sistema POS para Farmacia

Sistema de punto de venta rápido y completo para farmacias con control de inventario en tiempo real.

## 🚀 Características

- ⚡ **Venta ultra-rápida** con atajos de teclado
- 🔍 **Búsqueda instantánea** por código o nombre
- 📦 **Control de inventario** automático
- 🧾 **Emisión de comprobantes** (Boleta, Factura, Ticket)
- 👥 **Gestión de clientes** integrada
- 📊 **Reportes en tiempo real**
- ⌨️ **Optimizado para teclado** (F1, F2, ESC)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **Despliegue**: Vercel
- **Tiempo Real**: Supabase Realtime

## 🚀 Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/AnthonyJCSA/farmazi.git
cd farmazi
```

### 2. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar el esquema: `database/supabase-schema.sql`
3. Copiar URL y API Key

### 3. Variables de entorno
```bash
cd frontend
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key
```

### 4. Instalar y ejecutar
```bash
npm install
npm run dev
```

## ⌨️ Atajos de Teclado

- **F1**: Nueva venta (limpiar)
- **F2**: Procesar venta
- **ESC**: Limpiar búsqueda
- **ENTER**: Agregar producto

## 📱 Uso Rápido

1. **Buscar**: Escribir código/nombre → ENTER
2. **Vender**: Producto se agrega automáticamente
3. **Procesar**: F2 → Imprime comprobante
4. **Nueva venta**: F1 → Listo para siguiente cliente

## 🗄️ Base de Datos

### Tablas principales:
- `products` - Productos con stock
- `customers` - Clientes
- `sales` - Ventas
- `sale_items` - Detalle de ventas
- `inventory_movements` - Movimientos

### Vistas automáticas:
- `daily_sales` - Ventas diarias
- `top_products` - Productos más vendidos
- `low_stock_products` - Stock bajo

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel --prod
```

Configurar variables de entorno en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Funcionalidades

### ✅ Implementado
- [x] POS completo con teclado
- [x] Gestión de productos
- [x] Control de stock automático
- [x] Emisión de comprobantes
- [x] Base de datos Supabase
- [x] Búsqueda instantánea

### 🚧 En desarrollo
- [ ] Módulo de inventario completo
- [ ] Reportes avanzados
- [ ] Gestión de proveedores
- [ ] Códigos de barras
- [ ] Notificaciones push

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- 📧 Email: soporte@farmazi.com
- 💬 Issues: [GitHub Issues](https://github.com/AnthonyJCSA/farmazi/issues)
- 📖 Docs: [Documentación](https://farmazi.vercel.app/docs)

---

**Desarrollado con ❤️ para farmacias modernas**