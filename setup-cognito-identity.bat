@echo off
echo ========================================
echo  CONFIGURAR COGNITO IDENTITY POOL
echo ========================================

echo.
echo Creando Identity Pool para acceso sin autenticación...

REM Crear Identity Pool
for /f "tokens=*" %%i in ('aws cognito-identity create-identity-pool --identity-pool-name "BellafarmaIdentityPool" --allow-unauthenticated-identities --query "IdentityPoolId" --output text --region us-east-1') do set IDENTITY_POOL_ID=%%i

echo ✅ Identity Pool creado: %IDENTITY_POOL_ID%

REM Crear rol IAM para usuarios no autenticados
aws iam create-role ^
    --role-name Cognito_BellafarmaUnauth_Role ^
    --assume-role-policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Federated\":\"cognito-identity.amazonaws.com\"},\"Action\":\"sts:AssumeRoleWithWebIdentity\",\"Condition\":{\"StringEquals\":{\"cognito-identity.amazonaws.com:aud\":\"%IDENTITY_POOL_ID%\"},\"ForAnyValue:StringLike\":{\"cognito-identity.amazonaws.com:amr\":\"unauthenticated\"}}}]}"

REM Crear política para DynamoDB
aws iam put-role-policy ^
    --role-name Cognito_BellafarmaUnauth_Role ^
    --policy-name BellafarmaDynamoDBPolicy ^
    --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"dynamodb:GetItem\",\"dynamodb:PutItem\",\"dynamodb:UpdateItem\",\"dynamodb:DeleteItem\",\"dynamodb:Query\",\"dynamodb:Scan\"],\"Resource\":[\"arn:aws:dynamodb:us-east-1:*:table/bellafarma-*\",\"arn:aws:dynamodb:us-east-1:*:table/bellafarma-*/index/*\"]}]}"

REM Obtener ARN del rol
for /f "tokens=*" %%i in ('aws iam get-role --role-name Cognito_BellafarmaUnauth_Role --query "Role.Arn" --output text') do set ROLE_ARN=%%i

echo ✅ Rol IAM creado: %ROLE_ARN%

REM Asignar rol al Identity Pool
aws cognito-identity set-identity-pool-roles ^
    --identity-pool-id %IDENTITY_POOL_ID% ^
    --roles unauthenticated=%ROLE_ARN% ^
    --region us-east-1

echo.
echo ✅ Configuración completada!
echo.
echo 📋 CONFIGURACIÓN PARA .env.local:
echo NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=%IDENTITY_POOL_ID%
echo NEXT_PUBLIC_AWS_REGION=us-east-1
echo.
echo 💰 Costo mensual estimado: $5-15 USD
echo.
pause