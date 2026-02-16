# 👥 GUÍA DE USUARIO - FarmaZi POS

## 🚀 Introducción

FarmaZi es un sistema de punto de venta diseñado específicamente para farmacias, que permite gestionar ventas, inventario y reportes de manera rápida y eficiente.

### Características Principales
- ⚡ Venta ultra-rápida con atajos de teclado
- 🔍 Búsqueda instantánea de productos
- 📦 Control automático de inventario
- 🧾 Emisión de comprobantes
- 📊 Reportes en tiempo real
- 👥 Gestión de usuarios por roles

## 🔐 Inicio de Sesión

### Acceso al Sistema
1. Ingrese a: `https://app.bellafarma`
2. Introduzca su **usuario** y **contraseña**
3. Haga clic en **"Iniciar Sesión"**

### Usuarios de Prueba
- **Admin**: admin / admin123
- **Farmacéutico**: farmaceutico / farm123  
- **Vendedor**: vendedor / vend123

### Roles y Permisos
| Rol | Punto de Venta | Inventario | Reportes |
|-----|----------------|------------|----------|
| **Administrador** | ✅ | ✅ | ✅ |
| **Farmacéutico** | ✅ | ✅ | ✅ |
| **Vendedor** | ✅ | ❌ | ❌ |

## 💰 Punto de Venta (POS)

### Interfaz Principal
El POS está dividido en 3 secciones:
1. **Búsqueda y Productos** (izquierda)
2. **Carrito y Cliente** (derecha)
3. **Atajos de Teclado** (parte superior)

### 🔍 Búsqueda de Productos

#### Métodos de Búsqueda
- **Por código**: Escriba el código exacto (ej: AMX001)
- **Por nombre**: Escriba parte del nombre (ej: "Amoxicilina")
- **Por principio activo**: Busque por componente (ej: "Paracetamol")

#### Proceso de Búsqueda
1. Escriba en el campo de búsqueda
2. Presione **ENTER**
3. Si hay un solo resultado, se agrega automáticamente al carrito
4. Si hay múltiples resultados, seleccione el producto deseado

### 🛒 Gestión del Carrito

#### Agregar Productos
- Haga clic en un producto de la lista
- O use la búsqueda y presione ENTER

#### Modificar Cantidades
- Use los botones **+** y **-** junto a cada producto
- El sistema valida automáticamente el stock disponible

#### Información del Producto
Cada producto muestra:
- **Código** y **nombre**
- **Precio unitario**
- **Stock disponible**
- **Tipo** (genérico o marca)

### 👤 Datos del Cliente

#### Información Opcional
- **DNI/RUC**: Documento del cliente
- **Nombre/Razón Social**: Nombre completo o empresa

#### Tipos de Comprobante
- **BOLETA**: Para personas naturales
- **FACTURA**: Para empresas (requiere RUC)
- **TICKET**: Comprobante simple

### 💳 Métodos de Pago
- **EFECTIVO**: Pago en efectivo
- **TARJETA**: Tarjeta de débito/crédito
- **YAPE**: Pago móvil Yape
- **PLIN**: Pago móvil Plin

### 🖨️ Procesamiento de Venta

#### Pasos para Procesar
1. Verifique los productos en el carrito
2. Complete datos del cliente (opcional)
3. Seleccione tipo de comprobante
4. Elija método de pago
5. Haga clic en **"PROCESAR VENTA"** o presione **F2**

#### Comprobante
- Se genera automáticamente
- Se abre ventana de impresión
- Se guarda en el sistema
- Stock se actualiza automáticamente

### ⌨️ Atajos de Teclado

| Tecla | Función |
|-------|---------|
| **F1** | Nueva venta (limpiar carrito) |
| **F2** | Procesar venta |
| **ESC** | Limpiar búsqueda |
| **ENTER** | Agregar producto encontrado |

## 📦 Gestión de Inventario

*Disponible solo para Administradores y Farmacéuticos*

### Vista General
- **Total de productos** registrados
- **Productos con stock bajo** (alerta)
- **Valor total del inventario**
- **Cantidad de genéricos**

### 🔍 Filtros y Búsqueda
- **Búsqueda**: Por código, nombre o principio activo
- **Categoría**: Filtrar por tipo de medicamento
- **Estado**: Productos activos/inactivos

### ➕ Agregar Producto

#### Información Requerida
- **Código*** (único)
- **Nombre*** del producto
- **Precio de venta***
- **Stock inicial**

#### Información Opcional
- **Principio activo**
- **Marca/Laboratorio**
- **Categoría**
- **Es genérico** (checkbox)

#### Proceso
1. Haga clic en **"+ Agregar Producto"**
2. Complete el formulario
3. Haga clic en **"Agregar Producto"**
4. El producto aparece inmediatamente en la lista

### ✏️ Editar Producto

#### Campos Editables
- Código del producto
- Nombre
- Precio de venta
- Stock actual
- Principio activo
- Marca/Laboratorio

#### Proceso
1. Haga clic en **"✏️ Editar"** junto al producto
2. Modifique los campos necesarios
3. Haga clic en **"Guardar Cambios"**
4. Los cambios se registran en auditoría

### 🗑️ Eliminar Producto

#### Proceso
1. Haga clic en **"🗑️ Eliminar"** junto al producto
2. Confirme la eliminación
3. El producto se marca como inactivo (no se elimina físicamente)
4. La acción se registra en auditoría

### 📊 Gestión de Stock

#### Ajuste Rápido
- Use los botones **+** y **-** para ajustar stock
- Los cambios se aplican inmediatamente
- Se registra automáticamente el movimiento

#### Alertas de Stock Bajo
- Productos con stock ≤ stock mínimo aparecen en rojo
- Panel de alertas muestra todos los productos con stock bajo

## 📈 Reportes

*Disponible solo para Administradores y Farmacéuticos*

### Ventas del Día
- **Total vendido** en el día
- **Número de transacciones**
- **Método de pago más usado**
- **Productos más vendidos**

### Historial de Ventas
- Lista de todas las ventas
- Filtros por fecha, cliente, usuario
- Detalles de cada venta
- Exportación a Excel/PDF

### Reportes de Inventario
- **Productos con stock bajo**
- **Movimientos de inventario**
- **Valor total del stock**
- **Productos más/menos vendidos**

## 🔧 Configuración

### Impresora
- **Primera venta**: Se configura automáticamente
- **Reconfigurar**: Use el botón "⚙️ Reconfigurar Impresora"
- **Formato**: Optimizado para impresoras térmicas 80mm

### Datos de la Farmacia
Los datos están preconfigurados:
- **Nombre**: BOTICAS BELLAFARMA
- **Dirección**: Av. Perú N°3699, Cdra. 36, S.M.P.
- **RUC**: 10473232583
- **Teléfono**: 962257626

## 🆘 Solución de Problemas

### Problemas Comunes

#### "No se puede agregar más cantidad"
- **Causa**: Stock insuficiente
- **Solución**: Verifique el stock disponible o ajuste en inventario

#### "Error al procesar venta"
- **Causa**: Problema de conexión o datos incompletos
- **Solución**: Verifique conexión a internet y datos del cliente

#### "Producto no encontrado"
- **Causa**: Producto no existe o está inactivo
- **Solución**: Verifique el código o agregue el producto en inventario

#### "No se puede imprimir"
- **Causa**: Impresora no configurada
- **Solución**: Use "Reconfigurar Impresora" y seleccione su impresora

### Recuperación de Datos
- Los datos se guardan automáticamente en la nube
- En caso de error, use el botón "🔄 Recargar Productos"
- Los datos locales se sincronizan automáticamente

## 📱 Uso en Dispositivos Móviles

### Compatibilidad
- **Tablets**: Experiencia completa
- **Smartphones**: Funcionalidad básica de POS
- **Navegadores**: Chrome, Firefox, Safari, Edge

### Recomendaciones
- Use en modo horizontal en tablets
- Para mejor experiencia, use en computadora o tablet
- Mantenga conexión estable a internet

## 🔐 Seguridad y Privacidad

### Datos del Cliente
- Los datos se almacenan de forma segura en AWS
- Solo personal autorizado tiene acceso
- Cumple con normativas de protección de datos

### Auditoría
- Todos los cambios quedan registrados
- Se identifica usuario, fecha y hora de cada acción
- Historial completo de modificaciones

### Respaldos
- Backup automático diario
- Datos replicados en múltiples ubicaciones
- Recuperación point-in-time disponible

## 📞 Soporte Técnico

### Contacto
- **Email**: soporte@farmazi.com
- **Teléfono**: 962257626
- **Horario**: Lunes a Viernes 8:00 AM - 6:00 PM

### Recursos Adicionales
- **Manual técnico**: Para administradores del sistema
- **Videos tutoriales**: Disponibles en el portal
- **FAQ**: Preguntas frecuentes actualizadas

---

**💡 Consejo**: Para mayor eficiencia, use los atajos de teclado y mantenga los códigos de productos organizados y memorizados.