# 🚀 Coriva Core - Sistema POS Multi-Tenant SaaS

Plataforma de punto de venta adaptable para cualquier tipo de negocio: tiendas, ferreterías, farmacias, barberías, peluquerías y más.

## 🎯 ¿Qué es Coriva Core?

Sistema POS moderno y flexible que se adapta a las necesidades de cualquier negocio pequeño o grande. Cada negocio tiene su propio espacio aislado con configuración personalizada.

## 🚀 Características

- 🏢 **Multi-Tenant**: Múltiples negocios en una sola plataforma
- 🎯 **Onboarding Rápido**: Wizard de 3 pasos (45 minutos)
- ⚡ **Venta ultra-rápida** con atajos de teclado
- 🔍 **Búsqueda inteligente** de productos
- 📦 **Control de inventario** en tiempo real
- 👥 **Gestión de clientes** con historial de compras
- 🧾 **Comprobantes personalizables** por negocio
- 💵 **Control de caja** con apertura/cierre
- 📊 **Reportes y analytics**
- 🎨 **Personalización** completa por negocio
- ⚙️ **Configuración** de negocio (logo, colores, impuestos)
- 💬 **Soporte WhatsApp** integrado
- 👤 **Roles y permisos** (Admin/Manager/Vendedor)
- 📤 **Exportaciones** Excel/CSV
- 🔔 **Notificaciones** en tiempo real
- ⌨️ **Optimizado para teclado** (F1, F2, ESC)
- 📥 **Importación Excel/CSV** de productos
- 🌍 **Multi-currency** (8 monedas)
- 🌐 **i18n** (ES/EN)
- 📈 **Analytics GA4** integrado

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Plataforma**: Lovable (Demo)
- **Base de Datos**: Local Storage (Demo)

## 🚀 Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/coriva/coriva-core.git
cd coriva-core
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Acceder al sistema
```
http://localhost:3000
```

**Demo Credentials:**
- Usuario: `demo`
- Contraseña: `demo123`

**O crea tu negocio:**
- Click en "¿Nuevo negocio? Regístrate aquí →"
- Completa el wizard de 3 pasos
- Importa productos desde Excel/CSV

## 🏢 Tipos de Negocio Soportados

- 💊 **Farmacias**: Control de medicamentos y recetas
- 🔧 **Ferreterías**: Gestión de herramientas y materiales
- 👕 **Tiendas de Ropa**: Inventario por tallas y colores
- ✂️ **Barberías/Peluquerías**: Servicios y productos
- 🍔 **Restaurantes**: Menú y comandas
- 📚 **Librerías**: Catálogo de libros
- 🎮 **Tiendas de Tecnología**: Electrónicos y gadgets
- 🛒 **Minimarkets**: Productos de consumo

## 🎯 Onboarding Rápido (45 minutos)

### Paso 1: Datos del Negocio (10 min)
- Nombre y tipo de negocio
- RUC, dirección, teléfono
- Información fiscal

### Paso 2: Productos Iniciales (30 min)
- **Opción A**: Importar Excel/CSV
  - Descarga plantilla: `/public/productos-ejemplo.csv`
  - Formato: `codigo,nombre,precio,stock`
- **Opción B**: Agregar manualmente
  - Formulario rápido
  - Agregar uno por uno

### Paso 3: Usuario Administrador (5 min)
- Crear cuenta principal
- Acceso inmediato al sistema

¡Listo para vender! 🚀

## 📋 Módulos del Sistema

### 💰 Punto de Venta (POS)
- Búsqueda rápida de productos
- Carrito con validación de stock
- Múltiples métodos de pago
- Comprobantes (Boleta/Factura/Ticket)
- Atajos de teclado (F1, F2, ESC)

### 💵 Caja
- Apertura con monto inicial
- Seguimiento de ventas en tiempo real
- Cierre con cálculo de diferencias
- Control de efectivo

### 📦 Inventario
- CRUD completo de productos
- Ajuste de stock (+/-)
- Alertas de stock bajo
- Búsqueda y filtros
- Importación masiva Excel/CSV
- Exportación a Excel

### 📈 Reportes
- Ventas por período
- Anulación de ventas
- Devolución automática de stock
- Analytics básicos
- Métodos de pago
- Exportación a Excel

### 👥 Clientes
- Base de datos de clientes
- Historial de compras
- Búsqueda rápida
- Datos de contacto
- Exportación a Excel

### 👤 Usuarios
- CRUD de usuarios
- Roles: Admin, Manager, Vendedor
- Control de acceso por rol
- Activar/desactivar usuarios

### ⚙️ Configuración
- Datos del negocio
- Logo y colores personalizados
- Configuración de impuestos
- Pie de comprobante
- Soporte WhatsApp integrado

### 🔔 Notificaciones
- Alertas de stock bajo
- Productos sin stock
- Resumen de ventas diarias
- Panel de notificaciones en tiempo real

## 🔐 Roles y Permisos

### 👑 Administrador
- Acceso total al sistema
- Gestión de usuarios
- Configuración del negocio
- Todos los módulos

### 👔 Manager
- POS y ventas
- Caja (apertura/cierre)
- Inventario (consulta y edición)
- Reportes
- Clientes

### 🛒 Vendedor
- Solo POS
- Registro de clientes
- Sin acceso a reportes ni configuración

## ⌨️ Atajos de Teclado

- **F1**: Nueva venta (limpiar)
- **F2**: Procesar venta
- **ESC**: Limpiar búsqueda
- **ENTER**: Agregar producto

## 🗄️ Arquitectura Multi-Tenant

### Modelo de Datos:
```
Organizations (Negocios)
  ├── Users (Usuarios del negocio)
  ├── Products (Productos/Servicios)
  ├── Customers (Clientes finales)
  ├── Sales (Ventas)
  └── Settings (Configuración personalizada)
```

### Características:
- **Aislamiento total** entre negocios
- **Configuración independiente** por organización
- **Datos seguros** y separados
- **Escalabilidad** horizontal

## 🚀 Despliegue

### Lovable (Demo)
El proyecto está optimizado para desplegarse en Lovable.

### Producción (Futuro)
- Vercel / Netlify para frontend
- Supabase / PostgreSQL para base de datos
- AWS S3 para archivos estáticos

## 📊 Funcionalidades

### ✅ Versión Demo (COMPLETA)
- [x] Sistema multi-tenant
- [x] **Onboarding wizard (3 pasos)**
- [x] POS completo con teclado
- [x] Gestión de productos genéricos
- [x] **Importación Excel/CSV**
- [x] Control de stock automático
- [x] Emisión de comprobantes
- [x] Búsqueda inteligente
- [x] **Gestión de clientes**
- [x] **Control de caja**
- [x] Reportes básicos
- [x] **Configuración de negocio**
- [x] **Soporte WhatsApp integrado**
- [x] **Gestión de usuarios**
- [x] **Roles y permisos** (Admin/Manager/Vendedor)
- [x] **Exportaciones Excel/CSV**
- [x] **Notificaciones** (Stock bajo, ventas)
- [x] **Multi-currency** (8 monedas: PEN, USD, MXN, COP, CLP, ARS, BRL, EUR)
- [x] **i18n completo** (ES/EN)
- [x] **Analytics GA4** con tracking de eventos
- [x] **Exit-intent popup** optimizado
- [x] **Página de precios** mejorada

### 🚧 Roadmap
- [x] **Fase P2 - Escala Global** (ver [FASE_P2_COMPLETA.md](FASE_P2_COMPLETA.md))
- [ ] Base de datos real (Supabase)
- [ ] Planes y billing (Lite/Pro/Premium)
- [ ] Multi-sucursal
- [ ] Proveedores y compras
- [ ] Códigos de barras
- [ ] App móvil
- [ ] API pública
- [ ] Integraciones avanzadas

## 💼 Casos de Uso

### Farmacia
- Control de medicamentos con principios activos
- Gestión de recetas médicas
- Alertas de vencimiento

### Ferretería
- Inventario por categorías (herramientas, materiales)
- Control de medidas y presentaciones
- Gestión de proveedores

### Barbería/Peluquería
- Servicios y productos
- Agenda de citas (futuro)
- Historial de clientes

### Tienda de Ropa
- Inventario por tallas y colores
- Temporadas y colecciones
- Promociones y descuentos

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- 📧 Email: soporte@coriva.com
- 💬 WhatsApp: +51 962 257 626
- 💬 Issues: [GitHub Issues](https://github.com/coriva/coriva-core/issues)
- 📖 Docs: [Documentación](https://docs.coriva.com)

---

**Desarrollado con ❤️ para negocios modernos**
