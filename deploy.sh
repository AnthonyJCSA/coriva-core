#!/bin/bash

echo "🚀 Deploying BOTICAS BELLAFARMA to AWS"
echo "======================================"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Navigate to infrastructure directory
cd aws-infrastructure

# Install CDK dependencies
echo "📦 Installing CDK dependencies..."
npm install

# Install Lambda dependencies
echo "📦 Installing Lambda dependencies..."
cd lambda
npm install
cd ..

# Bootstrap CDK (only needed once per account/region)
echo "🔧 Bootstrapping CDK..."
npx cdk bootstrap

# Deploy infrastructure
echo "🏗️ Deploying infrastructure..."
npx cdk deploy --require-approval never

# Get API Gateway URL
API_URL=$(aws cloudformation describe-stacks --stack-name BellafarmaStack --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name BellafarmaStack --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucket`].OutputValue' --output text)
CLOUDFRONT_URL=$(aws cloudformation describe-stacks --stack-name BellafarmaStack --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' --output text)

echo "📊 Migrating data to DynamoDB..."
node migrate-data.js

# Navigate back to frontend
cd ..

# Update environment variables
echo "🔧 Updating environment variables..."
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=${API_URL}
NEXT_PUBLIC_CLOUDFRONT_URL=https://${CLOUDFRONT_URL}
EOF

# Build frontend for production
echo "🔨 Building frontend..."
npm run build

# Upload to S3
echo "📤 Uploading to S3..."
aws s3 sync out/ s3://${BUCKET_NAME} --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='${BUCKET_NAME}.s3.amazonaws.com'].Id" --output text)
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "======================================"
echo "📱 Website URL: https://${CLOUDFRONT_URL}"
echo "🔗 API URL: ${API_URL}"
echo "🪣 S3 Bucket: ${BUCKET_NAME}"
echo ""
echo "📋 Next steps:"
echo "1. Configure domain bellafarma.com in Route 53"
echo "2. Add SSL certificate for custom domain"
echo "3. Test the application"
echo ""
echo "💰 Estimated monthly cost: $20-45 USD"