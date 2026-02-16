# Setup completo FarmaZi AWS
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETO FARMAZI AWS" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n🔧 Paso 1: Crear tablas DynamoDB" -ForegroundColor Yellow
& .\setup-dynamodb-tables.bat

Write-Host "`n🔐 Paso 2: Configurar Cognito Identity Pool" -ForegroundColor Yellow
& .\setup-cognito-identity.bat

Write-Host "`n📋 Paso 3: Obtener Identity Pool ID" -ForegroundColor Yellow
& .\get-identity-pool-id.bat

Write-Host "`n📦 Paso 4: Instalar dependencias" -ForegroundColor Yellow
Copy-Item "package-aws.json" "package.json" -Force
npm install

Write-Host "`n✅ Setup completado!" -ForegroundColor Green
Write-Host "Ejecuta: npm run dev" -ForegroundColor Cyan