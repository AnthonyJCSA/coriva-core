@echo off
echo ========================================
echo CONFIGURANDO TABLAS DYNAMODB - CAJA Y ANULACION
echo ========================================
echo.

REM Tabla de Sesiones de Caja
echo Creando tabla: bellafarma-cash-sessions...
aws dynamodb create-table ^
    --table-name bellafarma-cash-sessions ^
    --attribute-definitions ^
        AttributeName=id,AttributeType=S ^
        AttributeName=status,AttributeType=S ^
    --key-schema ^
        AttributeName=id,KeyType=HASH ^
    --global-secondary-indexes ^
        "IndexName=status-index,KeySchema=[{AttributeName=status,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" ^
    --provisioned-throughput ^
        ReadCapacityUnits=5,WriteCapacityUnits=5 ^
    --region us-east-1

if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear la tabla bellafarma-cash-sessions
) else (
    echo OK: Tabla bellafarma-cash-sessions creada exitosamente
)

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
echo.
echo Tablas creadas:
echo - bellafarma-cash-sessions (con indice status-index)
echo.
echo NOTA: La tabla bellafarma-sales ya existe y se usa para anulaciones
echo.
pause
