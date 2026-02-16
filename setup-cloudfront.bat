@echo off
echo ========================================
echo  CONFIGURAR CLOUDFRONT PARA FARMAZI
echo ========================================

echo.
echo Creando distribución CloudFront...

REM Crear distribución CloudFront
for /f "tokens=*" %%i in ('aws cloudfront create-distribution --distribution-config "{\"CallerReference\":\"%DATE%-%TIME%\",\"Origins\":{\"Quantity\":1,\"Items\":[{\"Id\":\"S3-app.bellafarma\",\"DomainName\":\"app.bellafarma.s3-website-us-east-1.amazonaws.com\",\"CustomOriginConfig\":{\"HTTPPort\":80,\"HTTPSPort\":443,\"OriginProtocolPolicy\":\"http-only\"}}]},\"DefaultCacheBehavior\":{\"TargetOriginId\":\"S3-app.bellafarma\",\"ViewerProtocolPolicy\":\"redirect-to-https\",\"TrustedSigners\":{\"Enabled\":false,\"Quantity\":0},\"ForwardedValues\":{\"QueryString\":false,\"Cookies\":{\"Forward\":\"none\"}}},\"Comment\":\"FarmaZi BOTICAS BELLAFARMA\",\"Enabled\":true}" --query "Distribution.DomainName" --output text') do set CLOUDFRONT_DOMAIN=%%i

echo ✅ CloudFront creado: %CLOUDFRONT_DOMAIN%

echo.
echo 🌐 URLs disponibles:
echo   - S3 directo: http://app.bellafarma.s3-website-us-east-1.amazonaws.com
echo   - CloudFront: https://%CLOUDFRONT_DOMAIN%
echo.
echo ⏳ CloudFront tardará 15-20 minutos en estar disponible
echo.
echo 📋 Guardando configuración...
echo CLOUDFRONT_DOMAIN=%CLOUDFRONT_DOMAIN% > cloudfront-config.txt

echo.
echo ✅ Configuración completada!
pause