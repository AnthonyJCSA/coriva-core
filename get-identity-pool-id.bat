@echo off
echo ========================================
echo  OBTENER IDENTITY POOL ID
echo ========================================

echo.
echo Buscando Identity Pool existente...

for /f "tokens=*" %%i in ('aws cognito-identity list-identity-pools --max-results 10 --query "IdentityPools[?IdentityPoolName==`BellafarmaIdentityPool`].IdentityPoolId" --output text --region us-east-1') do set IDENTITY_POOL_ID=%%i

if "%IDENTITY_POOL_ID%"=="" (
    echo ❌ No se encontró Identity Pool. Ejecuta setup-cognito-identity.bat primero
    pause
    exit /b 1
)

echo ✅ Identity Pool encontrado: %IDENTITY_POOL_ID%
echo.
echo 📋 COPIA ESTA CONFIGURACIÓN A .env.local:
echo.
echo NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=%IDENTITY_POOL_ID%
echo NEXT_PUBLIC_AWS_REGION=us-east-1
echo.
echo 📝 Actualizando .env.local automáticamente...

(
echo # AWS DynamoDB Configuration
echo NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=%IDENTITY_POOL_ID%
echo NEXT_PUBLIC_AWS_REGION=us-east-1
echo.
echo # Backup API URL ^(no longer needed^)
echo # NEXT_PUBLIC_API_URL=https://mock-api-url.com
) > .env.local

echo ✅ Archivo .env.local actualizado
echo.
pause