#!/bin/bash

# Health Nexus AI - Infosys Hackathon Deployment
# Resource Group: ODL-Infosys-Hack-1775376-09

set -e

echo "🚀 Deploying Health Nexus AI for Infosys Hackathon..."

# Configuration
RESOURCE_GROUP="ODL-Infosys-Hack-1775376-09"
LOCATION="eastus"
SUBSCRIPTION_ID="4fde3c7c-5d10-431f-8910-4e5fc619e5e4"

# Unique names for hackathon
TIMESTAMP=$(date +%s)
OPENAI_NAME="infosys-health-openai-${TIMESTAMP}"
VISION_NAME="infosys-health-vision-${TIMESTAMP}"
TEXT_NAME="infosys-health-text-${TIMESTAMP}"
FOUNDRY_NAME="infosys-health-foundry-${TIMESTAMP}"
FUNCTION_NAME="infosys-health-agents-${TIMESTAMP}"
STORAGE_NAME="infosyshealthstore${TIMESTAMP}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Create Azure OpenAI resource
print_status "Creating Azure OpenAI resource: $OPENAI_NAME"
az cognitiveservices account create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind OpenAI \
    --sku S0 \
    --location $LOCATION \
    --yes \
    --output table

# 2. Deploy GPT-4 model
print_status "Deploying GPT-4 model..."
az cognitiveservices account deployment create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --deployment-name "gpt-4-health" \
    --model-name "gpt-4" \
    --model-version "turbo-2024-04-09" \
    --model-format "OpenAI" \
    --sku-capacity 10 \
    --sku-name "Standard" \
    --output table

# 3. Create Computer Vision resource
print_status "Creating Computer Vision resource: $VISION_NAME"
az cognitiveservices account create \
    --name $VISION_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind ComputerVision \
    --sku S1 \
    --location $LOCATION \
    --yes \
    --output table

# 4. Create Text Analytics resource
print_status "Creating Text Analytics resource: $TEXT_NAME"
az cognitiveservices account create \
    --name $TEXT_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind TextAnalytics \
    --sku S \
    --location $LOCATION \
    --yes \
    --output table

# 5. Create storage account for Azure Functions
print_status "Creating storage account: $STORAGE_NAME"
az storage account create \
    --name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --output table

# 6. Create Azure Functions app
print_status "Creating Azure Functions app: $FUNCTION_NAME"
az functionapp create \
    --name $FUNCTION_NAME \
    --resource-group $RESOURCE_GROUP \
    --storage-account $STORAGE_NAME \
    --consumption-plan-location $LOCATION \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --output table

# 7. Get all the connection strings and keys
print_status "Retrieving connection strings and API keys..."

OPENAI_ENDPOINT=$(az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
OPENAI_KEY=$(az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

VISION_ENDPOINT=$(az cognitiveservices account show --name $VISION_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
VISION_KEY=$(az cognitiveservices account keys list --name $VISION_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

TEXT_ENDPOINT=$(az cognitiveservices account show --name $TEXT_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
TEXT_KEY=$(az cognitiveservices account keys list --name $TEXT_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

FUNCTION_URL="https://${FUNCTION_NAME}.azurewebsites.net"

# 8. Create .env file with all configuration
print_status "Creating .env configuration file..."
cat > .env << EOF
# Infosys Hackathon - Health Nexus AI Configuration
# Resource Group: $RESOURCE_GROUP

# Azure OpenAI Configuration
VITE_AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT
VITE_AZURE_OPENAI_API_KEY=$OPENAI_KEY
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4-health

# Azure Computer Vision Configuration
VITE_AZURE_COMPUTER_VISION_ENDPOINT=$VISION_ENDPOINT
VITE_AZURE_COMPUTER_VISION_KEY=$VISION_KEY

# Azure Text Analytics Configuration
VITE_AZURE_TEXT_ANALYTICS_ENDPOINT=$TEXT_ENDPOINT
VITE_AZURE_TEXT_ANALYTICS_KEY=$TEXT_KEY

# Azure AI Foundry Configuration
VITE_AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID
VITE_AZURE_RESOURCE_GROUP=$RESOURCE_GROUP
VITE_AZURE_FOUNDRY_WORKSPACE=$FOUNDRY_NAME
VITE_AZURE_FOUNDRY_ENDPOINT=https://$FOUNDRY_NAME.api.azureml.ms
VITE_AZURE_REGION=$LOCATION

# Azure Agent Service Configuration
VITE_AZURE_AGENT_SERVICE_URL=$FUNCTION_URL

# Application Settings
VITE_MODE=production
VITE_DEMO_MODE=false
VITE_HACKATHON_MODE=true
VITE_HACKATHON_TEAM=Infosys-Health-Nexus

# Generated at: $(date)
EOF

print_success "Environment configuration created!"

# 9. Display summary
echo ""
print_success "🎉 Infosys Hackathon deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Azure OpenAI: $OPENAI_NAME"
echo "  Computer Vision: $VISION_NAME"
echo "  Text Analytics: $TEXT_NAME"
echo "  Function App: $FUNCTION_NAME"
echo ""
echo "🔧 Next Steps:"
echo "  1. Your .env file has been created with all credentials"
echo "  2. Start the application: npm run dev"
echo "  3. Open http://localhost:3000"
echo "  4. Test all agents using the demo buttons"
echo ""
echo "💰 Estimated Cost: $20-50 for hackathon duration"
echo ""
print_success "Your Health Nexus AI is ready for the Infosys Hackathon! 🚀"
echo ""
echo "🏆 Demo Tips:"
echo "  - Show the Azure AI Foundry Dashboard first"
echo "  - Run the 'Full Demo' to impress judges"
echo "  - Highlight real-time agent monitoring"
echo "  - Emphasize production-ready architecture"