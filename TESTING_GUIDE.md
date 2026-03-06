# 🧪 Script de Prueba - Integración Supabase

## Verificar que todo funciona

### 1. Abrir Console del Navegador (F12)

### 2. Ejecutar estos comandos uno por uno:

```javascript
// Test 1: Verificar que Supabase está conectado
console.log('🔍 Test 1: Verificar conexión Supabase')
const { supabase } = await import('./src/lib/supabase')
const { data, error } = await supabase.from('corivacore_products').select('count')
console.log('✅ Supabase conectado:', !error)

// Test 2: Verificar migración de productos
console.log('🔍 Test 2: Productos en localStorage')
const localProducts = JSON.parse(localStorage.getItem('coriva_products') || '[]')
console.log(`📦 Productos en localStorage: ${localProducts.length}`)

// Test 3: Verificar productos en Supabase
console.log('🔍 Test 3: Productos en Supabase')
const orgId = '1' // Cambiar por tu org_id
const { productService } = await import('./src/lib/services')
const supabaseProducts = await productService.getAll(orgId)
console.log(`📦 Productos en Supabase: ${supabaseProducts.length}`)

// Test 4: Crear venta de prueba
console.log('🔍 Test 4: Crear venta de prueba')
const { saleService } = await import('./src/lib/services')
const testSale = await saleService.create(orgId, {
  customerName: 'Cliente Test',
  receiptType: 'BOLETA',
  paymentMethod: 'EFECTIVO',
  subtotal: 100,
  tax: 18,
  total: 118,
  items: [
    {
      id: supabaseProducts[0].id,
      code: supabaseProducts[0].code,
      name: supabaseProducts[0].name,
      quantity: 1,
      price: 100
    }
  ]
})
console.log('✅ Venta creada:', testSale.sale_number)

// Test 5: Verificar stock actualizado
const updatedProduct = await productService.getAll(orgId)
console.log('📦 Stock actualizado:', updatedProduct[0].stock)
```

## Verificación en Supabase Dashboard

### 1. Ir a Supabase > Table Editor

### 2. Verificar tablas:

**corivacore_products**
```sql
SELECT * FROM corivacore_products WHERE org_id = 'tu-org-id';
```
Debe mostrar los productos migrados

**corivacore_sales**
```sql
SELECT * FROM corivacore_sales WHERE org_id = 'tu-org-id' ORDER BY created_at DESC LIMIT 5;
```
Debe mostrar las ventas

**corivacore_sale_items**
```sql
SELECT * FROM corivacore_sale_items WHERE sale_id IN (
  SELECT id FROM corivacore_sales WHERE org_id = 'tu-org-id'
);
```
Debe mostrar los items de las ventas

**corivacore_cash_movements**
```sql
SELECT * FROM corivacore_cash_movements WHERE org_id = 'tu-org-id' ORDER BY created_at DESC;
```
Debe mostrar los movimientos de caja

## Flujo de Prueba Manual

### 1. Login
- Usuario: `demo`
- Contraseña: `demo123`

### 2. Esperar Sincronización
- Debe aparecer modal "🔄 Sincronizando datos..."
- Esperar a que termine

### 3. Verificar Productos
- Ir a módulo "📦 Inventario"
- Verificar que aparecen los productos

### 4. Hacer una Venta
- Ir a "💰 Punto de Venta"
- Agregar productos al carrito
- Procesar venta (F2)
- Debe mostrar: "✅ Venta exitosa! ... 💾 Guardado en Supabase"

### 5. Verificar en Supabase
- Ir a Supabase Dashboard
- Table Editor > corivacore_sales
- Debe aparecer la venta recién creada

## Checklist de Verificación

- [ ] Tablas creadas en Supabase (5 tablas)
- [ ] Función decrement_product_stock creada
- [ ] Login exitoso
- [ ] Modal de sincronización aparece
- [ ] Productos migrados a Supabase
- [ ] Venta se guarda en Supabase
- [ ] Stock se actualiza automáticamente
- [ ] Movimiento de caja registrado
- [ ] Console sin errores

## Errores Comunes

### "relation does not exist"
**Solución:** Ejecutar el SQL en Supabase

### "RLS policy violation"
**Solución:** Verificar que las políticas RLS están en modo permisivo

### "Cannot read properties of undefined"
**Solución:** Verificar que currentOrg tiene un id válido

### Productos no se migran
**Solución:** 
```javascript
// Forzar migración manual
const { syncService } = await import('./src/lib/services')
await syncService.syncProducts('tu-org-id')
```

## Logs Esperados en Console

```
🔄 Inicializando Supabase para org: 1
✅ Sincronización completa
💾 Guardando venta en Supabase...
✅ Venta guardada en Supabase: V-20250120-0001
```

## Siguiente Paso

Una vez verificado que todo funciona:
1. Commit y push
2. Deploy a producción
3. Probar con negocio real
4. Monitorear Supabase Dashboard

---

**Tiempo estimado:** 10 minutos
**Resultado:** MVP funcionando con persistencia real
