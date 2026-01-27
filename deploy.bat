@echo off
echo 🚀 Deploying BOTICAS BELLAFARMA to AWS
echo ======================================

REM Check if AWS CLI is configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI not configured. Please run 'aws configure' first.
    exit /b 1
)

echo ✅ AWS CLI configured

REM Navigate to infrastructure directory
cd aws-infrastructure

REM Install CDK dependencies
echo 📦 Installing CDK dependencies...
npm install

REM Install Lambda dependencies
echo 📦 Installing Lambda dependencies...
cd lambda
npm install
cd ..

REM Bootstrap CDK (only needed once per account/region)
echo 🔧 Bootstrapping CDK...
npx cdk bootstrap

REM Deploy infrastructure
echo 🏗️ Deploying infrastructure...
npx cdk deploy --require-approval never

REM Get outputs from CloudFormation
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name BellafarmaStack --query "Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue" --output text') do set API_URL=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name BellafarmaStack --query "Stacks[0].Outputs[?OutputKey==`WebsiteBucket`].OutputValue" --output text') do set BUCKET_NAME=%%i
for /f "tokens=*" %%i in ('aws cloudformation describe-stacks --stack-name BellafarmaStack --query "Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue" --output text') do set CLOUDFRONT_URL=%%i

echo 📊 Migrating data to DynamoDB...
node migrate-data.js

REM Navigate back to frontend
cd ..

REM Update environment variables
echo 🔧 Updating environment variables...
echo NEXT_PUBLIC_API_URL=%API_URL% > .env.local
echo NEXT_PUBLIC_CLOUDFRONT_URL=https://%CLOUDFRONT_URL% >> .env.local

REM Build frontend for production
echo 🔨 Building frontend...
npm run build

REM Upload to S3
echo 📤 Uploading to S3...
aws s3 sync out/ s3://%BUCKET_NAME% --delete

REM Invalidate CloudFront cache
for /f "tokens=*" %%i in ('aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='%BUCKET_NAME%.s3.amazonaws.com'].Id" --output text') do set DISTRIBUTION_ID=%%i
if not "%DISTRIBUTION_ID%"=="" (
    echo 🔄 Invalidating CloudFront cache...
    aws cloudfront create-invalidation --distribution-id %DISTRIBUTION_ID% --paths "/*"
)

echo.
echo 🎉 Deployment completed successfully!
echo ======================================
echo 📱 Website URL: https://%CLOUDFRONT_URL%
echo 🔗 API URL: %API_URL%
echo 🪣 S3 Bucket: %BUCKET_NAME%
echo.
echo 📋 Next steps:
echo 1. Configure domain bellafarma.com in Route 53
echo 2. Add SSL certificate for custom domain
echo 3. Test the application
echo.
echo 💰 Estimated monthly cost: $20-45 USD

pause