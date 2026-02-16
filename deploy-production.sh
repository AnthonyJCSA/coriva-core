#!/bin/bash

# Script de Despliegue a Producción - FarmaZi POS
# Uso: ./deploy-production.sh [dominio]

DOMAIN=${1:-farmazi.com}
BUCKET_NAME=$DOMAIN
CLOUDFRONT_DISTRIBUTION_ID="E1234567890ABC"  # Reemplazar con ID real

echo "🚀 Desplegando FarmaZi POS a producción..."
echo "📍 Dominio: $DOMAIN"
echo "🪣 Bucket: $BUCKET_NAME"

# 1. Build del proyecto
echo "📦 Construyendo proyecto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

# 2. Sincronizar con S3
echo "☁️ Subiendo archivos a S3..."
aws s3 sync out/ s3://$BUCKET_NAME --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync out/ s3://$BUCKET_NAME --delete --cache-control "max-age=0, no-cache, no-store, must-revalidate" --include "*.html"

if [ $? -ne 0 ]; then
    echo "❌ Error subiendo a S3"
    exit 1
fi

# 3. Invalidar caché de CloudFront
echo "🔄 Invalidando caché de CloudFront..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

if [ $? -ne 0 ]; then
    echo "⚠️ Error invalidando caché (no crítico)"
fi

# 4. Verificar despliegue
echo "✅ Despliegue completado!"
echo "🌐 URL: https://$DOMAIN"
echo "🕐 El DNS puede tardar hasta 48 horas en propagarse"

# 5. Verificar SSL
echo "🔒 Verificando SSL..."
curl -I https://$DOMAIN 2>/dev/null | head -n 1

echo "🎉 ¡FarmaZi POS está en producción!"