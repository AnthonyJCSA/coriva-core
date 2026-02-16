# Implementación DynamoDB - Caja y Anulación de Ventas

## 📦 Tablas DynamoDB

### bellafarma-cash-sessions
Gestión de sesiones de caja (apertura/cierre)

**Estructura:**
```json
{
  "id": "cash_1234567890",
  "user_id": "user_123",
  "user_name": "Juan Pérez",
  "opening_amount": 100.00,
  "opening_date": "2024-01-15T08:00:00-05:00",
  "closing_amount": 1250.50,
  "closing_date": "2024-01-15T18:00:00-05:00",
  "status": "ABIERTA|CERRADA",
  "total_sales": 1150.50,
  "difference": 0.00,
  "createdAt": "2024-01-15T08:00:00-05:00",
  "updatedAt": "2024-01-15T18:00:00-05:00"
}
```

**Índices:**
- `status-index`: Buscar sesiones por estado (ABIERTA/CERRADA)

### bellafarma-sales (Actualizada)
Ventas con soporte para anulación

**Campos adicionales:**
```json
{
  "status": "COMPLETED|CANCELLED",
  "cancelled_at": "2024-01-15T10:30:00-05:00",
  "cancelled_by": "user_123",
  "cancelled_by_name": "Admin",
  "cancellation_reason": "Error en precio"
}
```

## 🚀 Instalación

### 1. Crear tablas DynamoDB
```bash
# En PowerShell
.\setup-cash-tables.bat

# Si la tabla ya existe, verás:
# "Table already exists: bellafarma-cash-sessions" - Esto es normal
```

### 2. Configurar permisos IAM
Agregar a la política de Cognito Identity Pool:
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:UpdateItem",
    "dynamodb:Query",
    "dynamodb:Scan"
  ],
  "Resource": [
    "arn:aws:dynamodb:us-east-1:*:table/bellafarma-cash-sessions",
    "arn:aws:dynamodb:us-east-1:*:table/bellafarma-cash-sessions/index/*",
    "arn:aws:dynamodb:us-east-1:*:table/bellafarma-sales"
  ]
}
```

## 📋 Funcionalidades

### Módulo de Caja (CashRegisterModule)

**Apertura de Caja:**
- Registra monto inicial
- Usuario y fecha/hora (Perú UTC-5)
- Estado: ABIERTA
- Guarda en DynamoDB

**Cierre de Caja:**
- Registra monto final
- Calcula diferencia automática
- Actualiza estado a CERRADA
- Persiste en DynamoDB

**Características:**
- ✅ Conexión a DynamoDB
- ✅ Zona horaria Perú (UTC-5)
- ✅ Validación de montos
- ✅ Cálculo automático de diferencias
- ✅ Historial persistente

### Módulo de Anulación (SalesCancellationModule)

**Anular Venta:**
- Busca ventas completadas
- Requiere motivo obligatorio
- Restaura stock automáticamente
- Registra usuario y fecha de anulación

**Características:**
- ✅ Búsqueda por número o cliente
- ✅ Restauración automática de stock
- ✅ Auditoría completa
- ✅ Motivo obligatorio
- ✅ Zona horaria Perú

## 🔧 Uso

### Integrar en la aplicación

```tsx
import CashRegisterModule from '@/app/CashRegisterModule'
import SalesCancellationModule from '@/app/SalesCancellationModule'

// En tu componente principal
<CashRegisterModule currentUser={currentUser} />
<SalesCancellationModule currentUser={currentUser} />
```

## 📊 Flujo de Datos

### Apertura de Caja
```
Usuario → Ingresa monto → DynamoDB.create() → Sesión ABIERTA
```

### Cierre de Caja
```
Usuario → Ingresa monto real → Calcula diferencia → DynamoDB.update() → Sesión CERRADA
```

### Anulación de Venta
```
Usuario → Selecciona venta → Ingresa motivo → 
  1. DynamoDB.update(sale, status=CANCELLED)
  2. Restaurar stock de productos
  3. Registrar auditoría
```

## ⚠️ Consideraciones

1. **Zona Horaria**: Todas las fechas usan UTC-5 (Perú)
2. **Stock**: Se restaura automáticamente al anular
3. **Auditoría**: Se registra usuario y motivo de anulación
4. **Validaciones**: Montos deben ser >= 0
5. **Estado**: Solo se pueden anular ventas COMPLETED

## 🔐 Seguridad

- Requiere autenticación de usuario
- Registra quién realiza cada operación
- Motivo obligatorio para anulaciones
- Auditoría completa de cambios

## 📈 Mejoras Futuras

- [ ] Reportes de caja por usuario
- [ ] Alertas de diferencias grandes
- [ ] Límite de tiempo para anulaciones
- [ ] Aprobación de supervisor para anulaciones
- [ ] Dashboard de caja en tiempo real
