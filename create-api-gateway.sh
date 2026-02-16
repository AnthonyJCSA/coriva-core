#!/bin/bash

echo "🚀 Creando API Gateway para BOTICAS BELLAFARMA"

# Crear API Gateway REST API
API_ID=$(aws apigateway create-rest-api \
  --name "bellafarma-api" \
  --description "API para BOTICAS BELLAFARMA - Integración directa DynamoDB" \
  --query 'id' --output text)

echo "✅ API Gateway creado: $API_ID"

# Obtener root resource ID
ROOT_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --query 'items[0].id' --output text)

# Crear recurso /products
PRODUCTS_RESOURCE_ID=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part "products" \
  --query 'id' --output text)

# Crear recurso /sales  
SALES_RESOURCE_ID=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part "sales" \
  --query 'id' --output text)

# Crear recurso /auth
AUTH_RESOURCE_ID=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_ID \
  --path-part "auth" \
  --query 'id' --output text)

echo "✅ Recursos creados: products, sales, auth"

# Crear rol IAM para API Gateway
aws iam create-role \
  --role-name APIGatewayDynamoDBRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "apigateway.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Adjuntar política DynamoDB
aws iam attach-role-policy \
  --role-name APIGatewayDynamoDBRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

echo "✅ Rol IAM creado y configurado"

# Obtener ARN del rol
ROLE_ARN="arn:aws:iam::039968205639:role/APIGatewayDynamoDBRole"

echo "🔧 Configurando métodos API..."

# GET /products - Listar productos
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTS_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTS_RESOURCE_ID \
  --http-method GET \
  --type AWS \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:dynamodb:action/Scan" \
  --credentials $ROLE_ARN \
  --request-templates '{
    "application/json": "{
      \"TableName\": \"bellafarma-products\",
      \"FilterExpression\": \"active = :active\",
      \"ExpressionAttributeValues\": {
        \":active\": {\"BOOL\": true}
      }
    }"
  }'

# POST /products - Crear producto
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTS_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PRODUCTS_RESOURCE_ID \
  --http-method POST \
  --type AWS \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:dynamodb:action/PutItem" \
  --credentials $ROLE_ARN

# POST /sales - Crear venta
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $SALES_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $SALES_RESOURCE_ID \
  --http-method POST \
  --type AWS \
  --integration-http-method POST \
  --uri "arn:aws:apigateway:us-east-1:dynamodb:action/PutItem" \
  --credentials $ROLE_ARN

echo "✅ Métodos API configurados"

# Configurar CORS para todos los recursos
for RESOURCE_ID in $PRODUCTS_RESOURCE_ID $SALES_RESOURCE_ID $AUTH_RESOURCE_ID; do
  aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE

  aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --integration-responses '[{
      "statusCode": "200",
      "responseParameters": {
        "method.response.header.Access-Control-Allow-Headers": "'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'",
        "method.response.header.Access-Control-Allow-Methods": "'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'",
        "method.response.header.Access-Control-Allow-Origin": "'"'"'*'"'"'"
      }
    }]'

  aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters '{
      "method.response.header.Access-Control-Allow-Headers": false,
      "method.response.header.Access-Control-Allow-Methods": false,
      "method.response.header.Access-Control-Allow-Origin": false
    }'
done

echo "✅ CORS configurado"

# Desplegar API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

echo "🎉 API Gateway desplegado exitosamente!"
echo "📡 URL de la API: https://$API_ID.execute-api.us-east-1.amazonaws.com/prod"

# Guardar URL en archivo
echo "https://$API_ID.execute-api.us-east-1.amazonaws.com/prod" > api-url.txt

echo "✅ URL guardada en api-url.txt"