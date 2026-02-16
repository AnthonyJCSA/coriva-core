@echo off
echo ========================================
echo  DESPLIEGUE COMPLETO FARMAZI AWS
echo ========================================

echo.
echo 🔧 Paso 1: Verificar AWS CLI
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI no configurado. Ejecuta 'aws configure' primero.
    exit /b 1
)
echo ✅ AWS CLI configurado

echo.
echo 🗄️ Paso 2: Crear tablas DynamoDB
call setup-dynamodb-tables.bat

echo.
echo 🔐 Paso 3: Configurar Cognito Identity Pool
call setup-cognito-identity.bat

echo.
echo 📦 Paso 4: Instalar dependencias AWS SDK
copy package-aws.json package.json
npm install

echo.
echo 🌱 Paso 5: Poblar datos iniciales
node -e "
const { bellafarmaProductService, bellafarmaAuthService } = require('./src/lib/bellafarma-dynamo.ts');

const products = [
  { code: 'AMX001', name: 'Amoxidal 500mg', active_ingredient: 'Amoxicilina', brand: 'Amoxidal', is_generic: false, price: 25.50, stock: 50, min_stock: 10, category: 'Antibióticos', laboratory: 'AC Farma' },
  { code: 'AMX002', name: 'Amoxicilina Genérica 500mg', active_ingredient: 'Amoxicilina', brand: 'Genérico', is_generic: true, price: 15.80, stock: 80, min_stock: 15, category: 'Antibióticos', laboratory: 'Nacionales' },
  { code: 'PAR001', name: 'Panadol 500mg', active_ingredient: 'Paracetamol', brand: 'Panadol', is_generic: false, price: 8.50, stock: 100, min_stock: 20, category: 'Analgésicos', laboratory: 'GSK' },
  { code: 'PAR002', name: 'Paracetamol Genérico 500mg', active_ingredient: 'Paracetamol', brand: 'Genérico', is_generic: true, price: 4.20, stock: 150, min_stock: 25, category: 'Analgésicos', laboratory: 'Nacionales' }
];

async function seedData() {
  console.log('Poblando productos...');
  for (const product of products) {
    try {
      await bellafarmaProductService.createProduct(product);
      console.log('✅ Producto creado:', product.name);
    } catch (error) {
      console.log('⚠️ Producto ya existe:', product.name);
    }
  }
  console.log('✅ Datos iniciales poblados');
}

seedData().catch(console.error);
"

echo.
echo 🚀 Paso 6: Construir aplicación
npm run build

echo.
echo 🎉 DESPLIEGUE COMPLETADO!
echo ========================================
echo.
echo 📋 CONFIGURACIÓN FINAL:
echo 1. Actualiza .env.local con el IDENTITY_POOL_ID generado
echo 2. Ejecuta 'npm run dev' para probar localmente
echo 3. Para producción, sube a Vercel o S3
echo.
echo 💰 COSTO MENSUAL ESTIMADO: $5-15 USD
echo   - DynamoDB: $0-5 (25GB gratis)
echo   - Cognito: $0-3 (50,000 MAU gratis)  
echo   - Vercel: $0-7 (Hobby gratis, Pro $20)
echo.
echo 🔗 URLs importantes:
echo   - AWS Console: https://console.aws.amazon.com
echo   - DynamoDB: https://console.aws.amazon.com/dynamodb
echo   - Cognito: https://console.aws.amazon.com/cognito
echo.
pause