# 📋 DOCUMENTACIÓN TÉCNICA - FarmaZi POS

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Base de Datos**: AWS DynamoDB
- **Autenticación**: AWS Cognito Identity Pool
- **Despliegue**: AWS S3 + CloudFront
- **Tiempo Real**: DynamoDB Streams (futuro)

### Estructura del Proyecto
```
farmazi/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Componente principal POS
│   │   ├── InventoryModule.tsx   # Módulo de inventario
│   │   ├── ReportsModule.tsx     # Módulo de reportes
│   │   └── globals.css           # Estilos globales
│   ├── lib/
│   │   ├── bellafarma-dynamo.ts  # Servicios DynamoDB
│   │   ├── api-client.ts         # Cliente API (fallback)
│   │   └── aws-dynamodb.ts       # Servicio local (fallback)
│   └── types/
├── docs/                         # Documentación
└── out/                         # Build estático
```

## 🗄️ Base de Datos - DynamoDB

### Tablas Principales

#### 1. bellafarma-products
```typescript
{
  id: string,                    // PK: prod_timestamp
  code: string,                  // Código único del producto
  name: string,                  // Nombre del producto
  active_ingredient?: string,    // Principio activo
  brand?: string,               // Marca
  is_generic: boolean,          // Es genérico
  price: number,                // Precio de venta
  cost?: number,                // Costo
  stock: number,                // Stock actual
  min_stock: number,            // Stock mínimo
  category?: string,            // Categoría
  laboratory?: string,          // Laboratorio
  active: boolean,              // Activo/Inactivo
  created_at: string,           // Fecha creación
  updated_at: string,           // Fecha actualización
  deleted_at?: string,          // Fecha eliminación
  deleted_by?: string           // Usuario que eliminó
}
```

#### 2. bellafarma-sales
```typescript
{
  id: string,                    // PK: sale_timestamp
  sale_number: string,           // Número de venta
  customer_id?: string,          // ID cliente
  customer_name?: string,        // Nombre cliente
  user_id: string,              // ID usuario vendedor
  subtotal: number,             // Subtotal
  tax: number,                  // IGV
  discount: number,             // Descuento
  total: number,                // Total
  payment_method: string,       // Método de pago
  receipt_type: string,         // Tipo comprobante
  status: string,               // Estado
  created_at: string,           // Fecha venta
  items: Array<{               // Items vendidos
    product_id: string,
    quantity: number,
    unit_price: number,
    subtotal: number,
    current_stock: number
  }>
}
```

#### 3. bellafarma-inventory-movements
```typescript
{
  id: string,                    // PK: mov_timestamp
  product_id: string,           // ID producto
  movement_type: string,        // SALE, ADJUSTMENT, PURCHASE
  quantity: number,             // Cantidad (+ o -)
  previous_stock?: number,      // Stock anterior
  new_stock: number,           // Stock nuevo
  reason: string,              // Razón del movimiento
  created_at: string           // Fecha movimiento
}
```

#### 4. bellafarma-product-audit
```typescript
{
  id: string,                    // PK: audit_timestamp
  product_id: string,           // ID producto
  product_code: string,         // Código producto
  product_name: string,         // Nombre producto
  action: string,               // CREATE, UPDATE, DELETE
  changes: {                    // Cambios realizados
    previous: object,
    new: object
  },
  user_id: string,             // ID usuario
  user_name: string,           // Nombre usuario
  timestamp: string,           // Fecha auditoría
  reason: string               // Razón del cambio
}
```

#### 5. bellafarma-users
```typescript
{
  id: string,                    // PK: user_id
  username: string,             // Usuario único
  password: string,             // Contraseña (hash en producción)
  name: string,                 // Nombre completo
  email?: string,               // Email
  role: string,                 // ADMINISTRADOR, FARMACEUTICO, VENDEDOR
  active: boolean,              // Activo/Inactivo
  created_at: string,           // Fecha creación
  last_login?: string           // Último login
}
```

### Índices GSI (Global Secondary Index)
- **code-index**: Búsqueda por código de producto
- **username-index**: Búsqueda por username

## 🔧 Servicios y APIs

### BellafarmaDynamoService
Clase principal para operaciones CRUD en DynamoDB:

```typescript
class BellafarmaDynamoService {
  static async create(tableName: string, item: any)
  static async getById(tableName: string, id: string)
  static async getAll(tableName: string, filter?, values?)
  static async update(tableName: string, id: string, updates: any)
  static async delete(tableName: string, id: string)
  static async query(tableName: string, keyName: string, keyValue: string)
  static async searchProducts(searchTerm: string)
}
```

### Servicios Específicos

#### bellafarmaProductService
```typescript
{
  getAll(): Promise<Product[]>
  searchIntelligent(term: string): Promise<Product[]>
  updateStock(id: string, newStock: number): Promise<void>
  decreaseStock(id: string, quantity: number, reason?: string): Promise<number>
  createProduct(product: any): Promise<Product>
  updateProduct(product: any, userId: string, userName: string): Promise<Product>
  deleteProduct(id: string, userId: string, userName: string): Promise<boolean>
}
```

#### bellafarmaSaleService
```typescript
{
  create(saleData: any): Promise<Sale>
  getAll(): Promise<Sale[]>
}
```

#### bellafarmaAuthService
```typescript
{
  login(username: string, password: string): Promise<User | null>
}
```

## 🔐 Seguridad

### Autenticación
- AWS Cognito Identity Pool para acceso anónimo a DynamoDB
- Validación de roles en frontend
- Sesiones locales con localStorage

### Autorización por Roles
```typescript
ADMINISTRADOR: {
  - Acceso completo al sistema
  - Gestión de usuarios
  - Reportes avanzados
  - Auditoría completa
}

FARMACEUTICO: {
  - Punto de venta
  - Gestión de inventario
  - Reportes básicos
  - Auditoría de productos
}

VENDEDOR: {
  - Solo punto de venta
  - Consulta de productos
  - Sin acceso a inventario
}
```

### Auditoría
- Registro completo de cambios en productos
- Tracking de usuario y timestamp
- Movimientos de inventario detallados
- Logs de ventas con trazabilidad

## 🚀 Despliegue

### Configuración AWS
```bash
# Variables de entorno requeridas
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:xxx
NEXT_PUBLIC_AWS_REGION=us-east-1
```

### Build y Deploy
```bash
npm run build
aws s3 sync out/ s3://app.bellafarma --delete
```

### Estructura S3
```
s3://app.bellafarma/
├── index.html
├── _next/static/
└── assets/
```

## 📊 Flujos de Datos

### Flujo de Venta
1. Usuario busca producto → `searchIntelligent()`
2. Agrega al carrito → Validación de stock local
3. Procesa venta → `saleService.create()`
4. Actualiza stock → `decreaseStock()` con auditoría
5. Genera comprobante → Impresión local

### Flujo de Inventario
1. Carga productos → `getAll()`
2. Edita producto → `updateProduct()` con auditoría
3. Actualiza stock → `updateStock()` con movimiento
4. Elimina producto → Soft delete con auditoría

## 🔄 Manejo de Estados

### Estados Principales
```typescript
// Estado global del POS
const [products, setProducts] = useState<Product[]>([])
const [cart, setCart] = useState<CartItem[]>([])
const [sales, setSales] = useState<Sale[]>([])
const [currentUser, setCurrentUser] = useState<User | null>(null)

// Estados de UI
const [loading, setLoading] = useState(false)
const [activeModule, setActiveModule] = useState('pos')
```

### Sincronización
- Estado local + DynamoDB
- Recarga automática después de operaciones
- Fallback a localStorage en caso de error

## 🐛 Manejo de Errores

### Estrategia de Fallback
1. **DynamoDB** → Operación principal
2. **localStorage** → Backup local
3. **Mock Data** → Datos de prueba

### Logging
```typescript
console.log('Debug info:', data)
console.error('Error:', error)
// Logs visibles en consola del navegador
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Componentes Adaptativos
- Grid responsivo para productos
- Modales adaptables
- Navegación colapsable

## ⚡ Performance

### Optimizaciones
- Lazy loading de módulos
- Paginación en listas grandes
- Debounce en búsquedas
- Caché local con localStorage

### Métricas
- First Load JS: ~149 kB
- Tiempo de carga: < 2s
- Búsqueda: < 500ms

## 🔧 Mantenimiento

### Logs de Auditoría
```sql
-- Consultar cambios de precios
SELECT * FROM bellafarma-product-audit 
WHERE action = 'UPDATE' 
AND changes.new.price != changes.previous.price

-- Movimientos de stock
SELECT * FROM bellafarma-inventory-movements 
WHERE movement_type = 'SALE'
ORDER BY created_at DESC
```

### Backup y Recuperación
- Export DynamoDB → S3
- Backup diario automático
- Restore point-in-time disponible

## 📈 Escalabilidad

### Límites Actuales
- DynamoDB: 40,000 RCU/WCU
- S3: Ilimitado
- Cognito: 50,000 usuarios

### Futuras Mejoras
- DynamoDB Streams para tiempo real
- Lambda functions para procesamiento
- API Gateway para endpoints seguros
- CloudWatch para monitoreo