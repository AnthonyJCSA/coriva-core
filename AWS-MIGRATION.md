# 🚀 BOTICAS BELLAFARMA - Migración a AWS

## 📋 Resumen de la Migración

Migración completa del sistema FarmaZi de Supabase a AWS con arquitectura serverless económica.

### 🏗️ Arquitectura AWS

- **Frontend**: S3 + CloudFront
- **Base de Datos**: DynamoDB (6 tablas)
- **Backend**: Lambda + API Gateway
- **Dominio**: Route 53 (bellafarma.com)
- **Tiempo Real**: DynamoDB Streams

### 💰 Costo Estimado: $20-45/mes

## 🚀 Despliegue Rápido

### Prerrequisitos
```bash
# Verificar AWS CLI configurado
aws sts get-caller-identity

# Instalar dependencias
npm install
```

### Opción 1: Despliegue Automático (Windows)
```bash
deploy.bat
```

### Opción 2: Despliegue Manual

1. **Desplegar Infraestructura**
```bash
cd aws-infrastructure
npm install
npx cdk bootstrap
npx cdk deploy
```

2. **Migrar Datos**
```bash
node migrate-data.js
```

3. **Construir y Subir Frontend**
```bash
cd ..
npm run build
aws s3 sync out/ s3://app.bellafarma --delete
```

## 📊 Tablas DynamoDB

| Tabla | Descripción | Índices |
|-------|-------------|---------|
| `bellafarma-users` | Usuarios del sistema | username-index |
| `bellafarma-products` | Productos farmacéuticos | code-index |
| `bellafarma-customers` | Clientes | - |
| `bellafarma-sales` | Ventas | - |
| `bellafarma-sale-items` | Detalle de ventas | sale-id-index |
| `bellafarma-inventory-movements` | Movimientos inventario | - |

## 🔧 APIs Disponibles

### Autenticación
- `POST /auth` - Login de usuarios

### Productos
- `GET /products` - Listar productos
- `GET /products/search?q=term` - Búsqueda inteligente
- `POST /products` - Crear producto
- `PUT /products` - Actualizar producto

### Ventas
- `GET /sales` - Listar ventas
- `POST /sales` - Crear venta (actualiza inventario automáticamente)

## 🎯 Funcionalidades Migradas

### ✅ Completado
- [x] Sistema POS completo
- [x] Búsqueda inteligente de productos
- [x] Control de inventario automático
- [x] Gestión de usuarios y roles
- [x] Emisión de comprobantes
- [x] Reportes básicos
- [x] Tiempo real con DynamoDB Streams

### 🔄 Cambios Principales

1. **Base de Datos**: PostgreSQL → DynamoDB
2. **Backend**: Supabase Edge Functions → AWS Lambda
3. **Frontend**: Vercel → S3 + CloudFront
4. **Tiempo Real**: Supabase Realtime → DynamoDB Streams
5. **Autenticación**: Supabase Auth → Lambda personalizado

## 🛠️ Configuración de Dominio

### 1. Registrar Dominio
```bash
# En Route 53 o registrar externamente
bellafarma.com
```

### 2. Configurar SSL
```bash
# Solicitar certificado en ACM (us-east-1)
aws acm request-certificate --domain-name bellafarma.com --domain-name *.bellafarma.com
```

### 3. Actualizar CloudFront
- Agregar dominio personalizado
- Configurar certificado SSL
- Actualizar Route 53 records

## 📱 URLs del Sistema

- **Desarrollo**: http://localhost:3000
- **Producción**: https://[cloudfront-url].cloudfront.net
- **Dominio Final**: https://bellafarma.com (después de configurar)

## 🔐 Usuarios Demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | ADMINISTRADOR |
| farmaceutico | farm123 | FARMACEUTICO |
| vendedor | vend123 | VENDEDOR |

## 📊 Monitoreo y Logs

- **CloudWatch**: Logs de Lambda functions
- **X-Ray**: Trazabilidad de requests
- **DynamoDB Metrics**: Uso de tablas
- **CloudFront Metrics**: Tráfico web

## 🆘 Troubleshooting

### Error: "Table does not exist"
```bash
# Verificar que las tablas se crearon
aws dynamodb list-tables

# Re-ejecutar migración
node aws-infrastructure/migrate-data.js
```

### Error: "API Gateway not found"
```bash
# Verificar deployment de CDK
cd aws-infrastructure
npx cdk diff
npx cdk deploy
```

### Error: "S3 bucket access denied"
```bash
# Verificar permisos del bucket
aws s3api get-bucket-policy --bucket app.bellafarma
```

## 📞 Soporte

- **Documentación**: Este README
- **Logs**: CloudWatch Logs
- **Monitoreo**: AWS Console

---

**🎉 ¡Migración completada exitosamente!**
**Costo reducido de ~$50/mes (Supabase Pro) a ~$25/mes (AWS)**