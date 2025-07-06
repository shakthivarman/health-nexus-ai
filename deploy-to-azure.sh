#!/bin/bash

# Health Nexus AI - Azure App Service Deployment Script
# This script deploys the Health Nexus AI application to Azure App Service

set -e

echo "🚀 Starting Health Nexus AI deployment to Azure App Service..."

# Configuration
RESOURCE_GROUP="ODL-Infosys-Hack-1775376-09"
APP_SERVICE_PLAN="health-nexus-ai-plan"
APP_NAME="health-nexus-ai-app"
LOCATION="East US"
RUNTIME="NODE|18-lts"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install Azure CLI first."
    exit 1
fi

# Login to Azure (if not already logged in)
echo "🔐 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please log in to Azure:"
    az login
fi

# Use existing resource group
echo "📦 Using existing resource group: $RESOURCE_GROUP"

# Create App Service Plan
echo "📋 Creating App Service Plan: $APP_SERVICE_PLAN"
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux

# Create Web App
echo "🌐 Creating Web App: $APP_NAME"
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --name $APP_NAME \
    --runtime "$RUNTIME" \
    --deployment-local-git

# Configure startup command
echo "⚙️ Configuring startup command..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --startup-file "node server.js"

# Set environment variables
echo "🔧 Setting environment variables..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
    NODE_ENV=production \
    PORT=8080 \
    WEBSITE_NODE_DEFAULT_VERSION=18-lts

# Deploy the application
echo "🚀 Deploying application..."
# Build the application first
npm run build

# Deploy using ZIP deployment
echo "📤 Creating deployment package..."
zip -r deploy.zip . -x "node_modules/*" ".git/*" "*.log" "*.tmp"

az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --src deploy.zip

# Clean up
rm -f deploy.zip

# Get the application URL
APP_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME --query defaultHostName -o tsv)

echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Application URL: https://$APP_URL"
echo "📊 You can monitor the application in the Azure Portal"
echo ""
echo "🔍 To view logs, run:"
echo "   az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""
echo "🎉 Health Nexus AI with Azure Foundry agents is now live!"