@echo off
echo ========================================
echo  CREAR TABLAS DYNAMODB - FARMAZI
echo ========================================

echo.
echo Creando tabla: bellafarma-products
aws dynamodb create-table ^
    --table-name bellafarma-products ^
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=code,AttributeType=S ^
    --key-schema AttributeName=id,KeyType=HASH ^
    --global-secondary-indexes IndexName=code-index,KeySchema=[{AttributeName=code,KeyType=HASH}],Projection={ProjectionType=ALL} ^
    --billing-mode PAY_PER_REQUEST ^
    --region us-east-1

echo.
echo Creando tabla: bellafarma-sales
aws dynamodb create-table ^
    --table-name bellafarma-sales ^
    --attribute-definitions AttributeName=id,AttributeType=S ^
    --key-schema AttributeName=id,KeyType=HASH ^
    --billing-mode PAY_PER_REQUEST ^
    --region us-east-1

echo.
echo Creando tabla: bellafarma-customers
aws dynamodb create-table ^
    --table-name bellafarma-customers ^
    --attribute-definitions AttributeName=id,AttributeType=S ^
    --key-schema AttributeName=id,KeyType=HASH ^
    --billing-mode PAY_PER_REQUEST ^
    --region us-east-1

echo.
echo Creando tabla: bellafarma-users
aws dynamodb create-table ^
    --table-name bellafarma-users ^
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=username,AttributeType=S ^
    --key-schema AttributeName=id,KeyType=HASH ^
    --global-secondary-indexes IndexName=username-index,KeySchema=[{AttributeName=username,KeyType=HASH}],Projection={ProjectionType=ALL} ^
    --billing-mode PAY_PER_REQUEST ^
    --region us-east-1

echo.
echo Creando tabla: bellafarma-inventory-movements
aws dynamodb create-table ^
    --table-name bellafarma-inventory-movements ^
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=product_id,AttributeType=S ^
    --key-schema AttributeName=id,KeyType=HASH ^
    --global-secondary-indexes IndexName=product-index,KeySchema=[{AttributeName=product_id,KeyType=HASH}],Projection={ProjectionType=ALL} ^
    --billing-mode PAY_PER_REQUEST ^
    --region us-east-1

echo.
echo ✅ Tablas DynamoDB creadas!
echo 💰 Costo: GRATIS (hasta 25GB y 25 RCU/WCU)
echo.
echo Siguiente paso: Ejecutar setup-cognito-identity.bat
pause