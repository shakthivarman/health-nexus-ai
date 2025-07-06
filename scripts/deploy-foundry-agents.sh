#!/bin/bash

# Azure AI Foundry Agent Deployment Script
# This script deploys the Health Nexus AI agents to Azure AI Foundry

set -e

echo "🚀 Deploying Health Nexus AI Agents to Azure AI Foundry..."

# Configuration
RESOURCE_GROUP="health-nexus-rg"
LOCATION="eastus"
FOUNDRY_WORKSPACE="health-nexus-foundry"
AI_STUDIO_PROJECT="health-nexus-ai"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not found. Please install it first."
    exit 1
fi

# Login check
print_status "Checking Azure CLI login status..."
if ! az account show &> /dev/null; then
    print_warning "Not logged in to Azure. Please login first."
    az login
fi

# Create resource group
print_status "Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION --output table

# Create Azure AI Foundry workspace
print_status "Creating Azure AI Foundry workspace: $FOUNDRY_WORKSPACE"
az ml workspace create \
    --name $FOUNDRY_WORKSPACE \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --display-name "Health Nexus AI Foundry Workspace" \
    --description "Azure AI Foundry workspace for Health Nexus AI agents" \
    --output table

# Create Azure AI Studio project
print_status "Creating Azure AI Studio project: $AI_STUDIO_PROJECT"
az cognitiveservices account create \
    --name $AI_STUDIO_PROJECT \
    --resource-group $RESOURCE_GROUP \
    --kind AIServices \
    --sku S0 \
    --location $LOCATION \
    --output table

# Create Azure OpenAI resource with GPT-4 for agents
print_status "Creating Azure OpenAI resource for agents..."
OPENAI_NAME="health-nexus-openai-agents"
az cognitiveservices account create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind OpenAI \
    --sku S0 \
    --location $LOCATION \
    --output table

# Deploy GPT-4 model for agents
print_status "Deploying GPT-4 model for agents..."
az cognitiveservices account deployment create \
    --name $OPENAI_NAME \
    --resource-group $RESOURCE_GROUP \
    --deployment-name "gpt-4-agents" \
    --model-name "gpt-4" \
    --model-version "0613" \
    --model-format "OpenAI" \
    --scale-type "Standard" \
    --capacity 10 \
    --output table

# Create Computer Vision resource for radiology agent
print_status "Creating Computer Vision resource for radiology agent..."
VISION_NAME="health-nexus-vision"
az cognitiveservices account create \
    --name $VISION_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind ComputerVision \
    --sku S1 \
    --location $LOCATION \
    --output table

# Create Custom Vision resource for pathology agent
print_status "Creating Custom Vision resource for pathology agent..."
CUSTOM_VISION_NAME="health-nexus-customvision"
az cognitiveservices account create \
    --name $CUSTOM_VISION_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind CustomVision.Training \
    --sku S0 \
    --location $LOCATION \
    --output table

# Create Text Analytics resource for genomic and lab agents
print_status "Creating Text Analytics resource..."
TEXT_ANALYTICS_NAME="health-nexus-text"
az cognitiveservices account create \
    --name $TEXT_ANALYTICS_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind TextAnalytics \
    --sku S \
    --location $LOCATION \
    --output table

# Create Application Insights for monitoring
print_status "Creating Application Insights for agent monitoring..."
APP_INSIGHTS_NAME="health-nexus-insights"
az monitor app-insights component create \
    --app $APP_INSIGHTS_NAME \
    --location $LOCATION \
    --resource-group $RESOURCE_GROUP \
    --output table

# Create Azure Functions for agent orchestration
print_status "Creating Azure Functions for agent orchestration..."
FUNCTION_APP_NAME="health-nexus-agents"
STORAGE_ACCOUNT_NAME="healthnexusstorage$(date +%s)"

# Create storage account for functions
az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --output table

# Create function app
az functionapp create \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --storage-account $STORAGE_ACCOUNT_NAME \
    --consumption-plan-location $LOCATION \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --output table

# Get connection strings and keys
print_status "Retrieving connection strings and API keys..."

OPENAI_ENDPOINT=$(az cognitiveservices account show --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
OPENAI_KEY=$(az cognitiveservices account keys list --name $OPENAI_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

VISION_ENDPOINT=$(az cognitiveservices account show --name $VISION_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
VISION_KEY=$(az cognitiveservices account keys list --name $VISION_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

CUSTOM_VISION_ENDPOINT=$(az cognitiveservices account show --name $CUSTOM_VISION_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
CUSTOM_VISION_KEY=$(az cognitiveservices account keys list --name $CUSTOM_VISION_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

TEXT_ENDPOINT=$(az cognitiveservices account show --name $TEXT_ANALYTICS_NAME --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
TEXT_KEY=$(az cognitiveservices account keys list --name $TEXT_ANALYTICS_NAME --resource-group $RESOURCE_GROUP --query "key1" -o tsv)

FOUNDRY_ENDPOINT="https://${FOUNDRY_WORKSPACE}.api.azureml.ms"
FUNCTION_URL="https://${FUNCTION_APP_NAME}.azurewebsites.net"

APP_INSIGHTS_KEY=$(az monitor app-insights component show --app $APP_INSIGHTS_NAME --resource-group $RESOURCE_GROUP --query "instrumentationKey" -o tsv)
APP_INSIGHTS_CONNECTION=$(az monitor app-insights component show --app $APP_INSIGHTS_NAME --resource-group $RESOURCE_GROUP --query "connectionString" -o tsv)

# Create .env file with all configuration
print_status "Creating .env configuration file..."
cat > .env << EOF
# Azure OpenAI Configuration
VITE_AZURE_OPENAI_ENDPOINT=$OPENAI_ENDPOINT
VITE_AZURE_OPENAI_API_KEY=$OPENAI_KEY
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4-agents

# Azure Computer Vision Configuration
VITE_AZURE_COMPUTER_VISION_ENDPOINT=$VISION_ENDPOINT
VITE_AZURE_COMPUTER_VISION_KEY=$VISION_KEY

# Azure Text Analytics Configuration
VITE_AZURE_TEXT_ANALYTICS_ENDPOINT=$TEXT_ENDPOINT
VITE_AZURE_TEXT_ANALYTICS_KEY=$TEXT_KEY

# Azure Custom Vision Configuration
VITE_AZURE_CUSTOM_VISION_ENDPOINT=$CUSTOM_VISION_ENDPOINT
VITE_AZURE_CUSTOM_VISION_KEY=$CUSTOM_VISION_KEY
VITE_AZURE_CUSTOM_VISION_PROJECT_ID=your-project-id-after-training
VITE_AZURE_CUSTOM_VISION_ITERATION=Iteration1

# Azure AI Foundry Configuration
VITE_AZURE_SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)
VITE_AZURE_RESOURCE_GROUP=$RESOURCE_GROUP
VITE_AZURE_FOUNDRY_WORKSPACE=$FOUNDRY_WORKSPACE
VITE_AZURE_FOUNDRY_ENDPOINT=$FOUNDRY_ENDPOINT
VITE_AZURE_FOUNDRY_API_KEY=your-foundry-api-key
VITE_AZURE_REGION=$LOCATION

# Azure AI Studio Configuration
VITE_AZURE_AI_STUDIO_PROJECT=$AI_STUDIO_PROJECT
VITE_AZURE_AI_STUDIO_PROJECT_ID=$(az cognitiveservices account show --name $AI_STUDIO_PROJECT --resource-group $RESOURCE_GROUP --query "id" -o tsv)
VITE_AZURE_AI_STUDIO_ENDPOINT=$(az cognitiveservices account show --name $AI_STUDIO_PROJECT --resource-group $RESOURCE_GROUP --query "properties.endpoint" -o tsv)
VITE_AZURE_AI_STUDIO_DEPLOYMENT=gpt-4-agents

# Azure Agent Service Configuration
VITE_AZURE_AGENT_SERVICE_URL=$FUNCTION_URL

# Azure Application Insights Configuration
VITE_APP_INSIGHTS_CONNECTION_STRING=$APP_INSIGHTS_CONNECTION
VITE_APP_INSIGHTS_INSTRUMENTATION_KEY=$APP_INSIGHTS_KEY
EOF

print_success "Environment configuration created in .env file"

# Create agent definition files for Azure AI Foundry
print_status "Creating agent definition files..."
mkdir -p agents

# Radiology Agent Definition
cat > agents/radiology-agent.json << EOF
{
  "name": "radiology-agent",
  "description": "Specialized agent for analyzing medical imaging including X-rays, CT scans, and MRIs",
  "instructions": "You are a specialist radiology AI agent. Analyze medical images with high precision, identify anatomical structures, detect abnormalities, and provide detailed clinical insights with confidence scores.",
  "model": "gpt-4-agents",
  "tools": [
    {
      "type": "code_interpreter"
    },
    {
      "type": "function",
      "function": {
        "name": "analyze_medical_image",
        "description": "Analyze medical images using Azure Computer Vision",
        "parameters": {
          "type": "object",
          "properties": {
            "image_url": {"type": "string"},
            "image_type": {"type": "string", "enum": ["xray", "ct", "mri", "ultrasound"]}
          },
          "required": ["image_url", "image_type"]
        }
      }
    }
  ],
  "metadata": {
    "specialty": "Radiology",
    "maxConcurrency": 3,
    "estimatedCostPerExecution": 0.05
  }
}
EOF

# Lab Results Agent Definition
cat > agents/lab-results-agent.json << EOF
{
  "name": "lab-results-agent",
  "description": "Laboratory specialist for analyzing blood work and lab test results",
  "instructions": "You are a laboratory medicine expert AI agent. Interpret lab results in clinical context, identify patterns, flag abnormal values, and provide actionable insights.",
  "model": "gpt-4-agents",
  "tools": [
    {
      "type": "code_interpreter"
    },
    {
      "type": "function",
      "function": {
        "name": "analyze_lab_results",
        "description": "Analyze laboratory test results and provide clinical interpretation",
        "parameters": {
          "type": "object",
          "properties": {
            "test_type": {"type": "string"},
            "values": {"type": "array"},
            "patient_demographics": {"type": "object"}
          },
          "required": ["test_type", "values"]
        }
      }
    }
  ],
  "metadata": {
    "specialty": "Laboratory Medicine",
    "maxConcurrency": 5,
    "estimatedCostPerExecution": 0.03
  }
}
EOF

# Genomic Agent Definition
cat > agents/genomic-agent.json << EOF
{
  "name": "genomic-agent",
  "description": "Genomics specialist for analyzing genetic variants and hereditary patterns",
  "instructions": "You are a genomics specialist AI agent. Analyze genetic variants, assess risk, interpret hereditary patterns, and provide personalized recommendations based on genomic data.",
  "model": "gpt-4-agents",
  "tools": [
    {
      "type": "code_interpreter"
    },
    {
      "type": "function",
      "function": {
        "name": "analyze_genetic_variants",
        "description": "Analyze genetic variants and provide risk assessment",
        "parameters": {
          "type": "object",
          "properties": {
            "variants": {"type": "array"},
            "gene_panel": {"type": "string"},
            "family_history": {"type": "string"}
          },
          "required": ["variants"]
        }
      }
    }
  ],
  "metadata": {
    "specialty": "Genomics",
    "maxConcurrency": 2,
    "estimatedCostPerExecution": 0.04
  }
}
EOF

# Pathology Agent Definition
cat > agents/pathology-agent.json << EOF
{
  "name": "pathology-agent",
  "description": "Expert agent for analyzing tissue samples and pathology reports",
  "instructions": "You are a pathology expert AI agent. Examine tissue samples, analyze microscopy findings, provide diagnostic interpretations, and suggest additional tests when needed.",
  "model": "gpt-4-agents",
  "tools": [
    {
      "type": "code_interpreter"
    },
    {
      "type": "function",
      "function": {
        "name": "analyze_pathology_sample",
        "description": "Analyze pathology samples and provide diagnostic interpretation",
        "parameters": {
          "type": "object",
          "properties": {
            "sample_type": {"type": "string"},
            "findings": {"type": "string"},
            "staining": {"type": "string"},
            "microscopy_notes": {"type": "string"}
          },
          "required": ["sample_type", "findings"]
        }
      }
    }
  ],
  "metadata": {
    "specialty": "Pathology",
    "maxConcurrency": 2,
    "estimatedCostPerExecution": 0.04
  }
}
EOF

# Orchestrator Agent Definition
cat > agents/orchestrator-agent.json << EOF
{
  "name": "orchestrator-agent",
  "description": "Master orchestrator that synthesizes findings from all medical agents",
  "instructions": "You are the master orchestrator AI agent. Synthesize findings from radiology, pathology, genomics, and laboratory agents. Provide comprehensive patient insights, treatment recommendations, and care coordination.",
  "model": "gpt-4-agents",
  "tools": [
    {
      "type": "code_interpreter"
    },
    {
      "type": "function",
      "function": {
        "name": "synthesize_medical_findings",
        "description": "Synthesize findings from multiple medical agents",
        "parameters": {
          "type": "object",
          "properties": {
            "radiology_findings": {"type": "object"},
            "lab_findings": {"type": "object"},
            "genomic_findings": {"type": "object"},
            "pathology_findings": {"type": "object"},
            "patient_info": {"type": "object"}
          },
          "required": ["patient_info"]
        }
      }
    }
  ],
  "metadata": {
    "specialty": "Clinical Decision Support",
    "maxConcurrency": 1,
    "estimatedCostPerExecution": 0.08
  }
}
EOF

print_success "Agent definition files created in ./agents/ directory"

# Display summary
print_success "🎉 Azure AI Foundry deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Azure AI Foundry Workspace: $FOUNDRY_WORKSPACE"
echo "  Azure AI Studio Project: $AI_STUDIO_PROJECT"
echo "  Function App: $FUNCTION_APP_NAME"
echo ""
echo "🔧 Next Steps:"
echo "  1. Review the generated .env file"
echo "  2. Train Custom Vision models for pathology (optional)"
echo "  3. Deploy agent definitions to Azure AI Foundry"
echo "  4. Test the application: npm run dev"
echo ""
echo "💰 Estimated Monthly Cost: $200-500 (depending on usage)"
echo ""
print_warning "Important: Update the Custom Vision project ID after training models"
print_warning "Important: Some services may take a few minutes to become fully available"

echo ""
print_success "Your Health Nexus AI system is ready for the hackathon! 🚀"