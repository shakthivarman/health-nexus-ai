# 🚀 Azure AI Services Setup Guide for Health Nexus AI

This guide will help you set up all the Azure AI services needed for the Health Nexus AI hackathon project.

## 🎯 Overview

The Health Nexus AI system uses the following Azure AI services:
- **Azure OpenAI Service** - Core AI reasoning for all health agents
- **Azure Computer Vision** - Medical image analysis (X-rays, CT scans)
- **Azure Text Analytics** - Medical text processing and sentiment analysis
- **Azure Custom Vision** - Specialized pathology image analysis
- **Azure Bot Service** - Intelligent chat interface
- **Azure Functions** - Real-time processing and orchestration

## 📋 Prerequisites

1. **Azure Subscription** - You need an active Azure subscription
2. **Azure CLI** - Install from [Azure CLI Installation Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
3. **Node.js** - Version 18 or higher
4. **Git** - For cloning the repository

## 🔧 Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd health-nexus-ai-view-main
npm install
```

### 2. Create Azure Resources

#### 2.1 Azure OpenAI Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name health-nexus-rg --location eastus

# Create Azure OpenAI resource
az cognitiveservices account create \
  --name health-nexus-openai \
  --resource-group health-nexus-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Deploy GPT-4 model
az cognitiveservices account deployment create \
  --name health-nexus-openai \
  --resource-group health-nexus-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --scale-type Standard
```

#### 2.2 Azure Computer Vision

```bash
# Create Computer Vision resource
az cognitiveservices account create \
  --name health-nexus-vision \
  --resource-group health-nexus-rg \
  --kind ComputerVision \
  --sku S1 \
  --location eastus
```

#### 2.3 Azure Text Analytics

```bash
# Create Text Analytics resource
az cognitiveservices account create \
  --name health-nexus-text \
  --resource-group health-nexus-rg \
  --kind TextAnalytics \
  --sku S \
  --location eastus
```

#### 2.4 Azure Custom Vision

```bash
# Create Custom Vision resource
az cognitiveservices account create \
  --name health-nexus-customvision \
  --resource-group health-nexus-rg \
  --kind CustomVision.Training \
  --sku S0 \
  --location eastus
```

### 3. Get API Keys and Endpoints

```bash
# Get Azure OpenAI details
az cognitiveservices account show --name health-nexus-openai --resource-group health-nexus-rg --query "properties.endpoint" -o tsv
az cognitiveservices account keys list --name health-nexus-openai --resource-group health-nexus-rg --query "key1" -o tsv

# Get Computer Vision details
az cognitiveservices account show --name health-nexus-vision --resource-group health-nexus-rg --query "properties.endpoint" -o tsv
az cognitiveservices account keys list --name health-nexus-vision --resource-group health-nexus-rg --query "key1" -o tsv

# Get Text Analytics details
az cognitiveservices account show --name health-nexus-text --resource-group health-nexus-rg --query "properties.endpoint" -o tsv
az cognitiveservices account keys list --name health-nexus-text --resource-group health-nexus-rg --query "key1" -o tsv

# Get Custom Vision details
az cognitiveservices account show --name health-nexus-customvision --resource-group health-nexus-rg --query "properties.endpoint" -o tsv
az cognitiveservices account keys list --name health-nexus-customvision --resource-group health-nexus-rg --query "key1" -o tsv
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your Azure service details:

```env
# Azure OpenAI Configuration
VITE_AZURE_OPENAI_ENDPOINT=https://health-nexus-openai.openai.azure.com/
VITE_AZURE_OPENAI_API_KEY=your-azure-openai-api-key
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4

# Azure Computer Vision Configuration
VITE_AZURE_COMPUTER_VISION_ENDPOINT=https://health-nexus-vision.cognitiveservices.azure.com/
VITE_AZURE_COMPUTER_VISION_KEY=your-computer-vision-key

# Azure Text Analytics Configuration
VITE_AZURE_TEXT_ANALYTICS_ENDPOINT=https://health-nexus-text.cognitiveservices.azure.com/
VITE_AZURE_TEXT_ANALYTICS_KEY=your-text-analytics-key

# Azure Custom Vision Configuration
VITE_AZURE_CUSTOM_VISION_ENDPOINT=https://health-nexus-customvision.cognitiveservices.azure.com/
VITE_AZURE_CUSTOM_VISION_KEY=your-custom-vision-key
VITE_AZURE_CUSTOM_VISION_PROJECT_ID=your-project-id
VITE_AZURE_CUSTOM_VISION_ITERATION=Iteration1
```

### 5. Test the Setup

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# Click on the agent demo buttons to test Azure AI integration
```

## 🎨 Hackathon Demo Features

### 1. **Radiology Agent Demo**
- Upload medical images (X-rays, CT scans)
- Uses Azure Computer Vision for initial analysis
- Uses Azure OpenAI for medical interpretation
- Provides confidence scores and recommendations

### 2. **Lab Results Agent Demo**
- Process blood work and lab test results
- Uses Azure OpenAI for clinical interpretation
- Highlights abnormal values and trends
- Generates actionable insights

### 3. **Genomic Agent Demo**
- Analyze genetic variants and mutations
- Uses Azure OpenAI for risk assessment
- Provides hereditary pattern analysis
- Generates personalized recommendations

### 4. **Pathology Agent Demo**
- Process tissue sample analysis
- Uses Azure Custom Vision for microscopy
- Uses Azure OpenAI for pathological interpretation
- Provides detailed diagnostic insights

### 5. **Orchestrator Agent Demo**
- Synthesizes findings from all agents
- Uses Azure OpenAI for comprehensive analysis
- Provides treatment recommendations
- Generates follow-up plans

### 6. **AI Chat Interface**
- Real-time conversation with medical AI
- Uses Azure OpenAI for contextual responses
- Maintains conversation history
- Provides medical explanations and guidance

## 🏆 Hackathon Winning Tips

### 1. **Demo Preparation**
- Prepare sample medical data (anonymized)
- Test all agents before the presentation
- Have backup mock data in case of connectivity issues
- Practice the demo flow multiple times

### 2. **Key Differentiators**
- **Multi-modal AI**: Combines text, images, and structured data
- **Real-time Processing**: Instant AI insights
- **Medical Accuracy**: Specialized prompts for healthcare
- **Comprehensive Analysis**: Full patient picture
- **Azure Integration**: Showcases Azure AI capabilities

### 3. **Presentation Focus**
- Emphasize AI orchestration across multiple domains
- Show real-time processing capabilities
- Highlight medical accuracy and confidence scores
- Demonstrate practical healthcare applications
- Showcase Azure AI service integration

### 4. **Technical Highlights**
- **Azure OpenAI**: Advanced reasoning for medical analysis
- **Computer Vision**: Medical image interpretation
- **Multi-agent Architecture**: Specialized AI agents
- **Real-time Processing**: Instant insights
- **Scalable Design**: Production-ready architecture

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Add your domain to Azure resource CORS settings
2. **API Key Issues**: Double-check environment variables
3. **Rate Limiting**: Implement retry logic for production
4. **Image Upload**: Ensure proper file types and sizes

### Performance Optimization

1. **Caching**: Implement result caching for repeated analyses
2. **Batch Processing**: Process multiple items together
3. **Async Operations**: Use Promise.all for parallel processing
4. **Error Handling**: Graceful degradation with mock data

## 📊 Cost Estimation

For a hackathon demo (24-48 hours):
- Azure OpenAI: $20-50
- Computer Vision: $5-10
- Text Analytics: $3-5
- Custom Vision: $2-5
- Total: ~$30-70

## 🎯 Next Steps

1. **Deploy to Azure**: Use Azure Static Web Apps for hosting
2. **Add Authentication**: Implement Azure AD for security
3. **Scale Services**: Use Azure Functions for backend processing
4. **Add Monitoring**: Use Azure Application Insights
5. **Implement HIPAA Compliance**: Add encryption and audit logs

## 📚 Resources

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [Azure Computer Vision Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/)
- [Azure Text Analytics Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/)
- [Azure Custom Vision Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/)
- [Healthcare AI Best Practices](https://docs.microsoft.com/en-us/azure/architecture/industries/healthcare/)

## 🚀 Good Luck!

Your Health Nexus AI system is now ready to showcase the power of Azure AI services in healthcare! 

Remember to:
- ✅ Test all agents before the demo
- ✅ Prepare compelling use cases
- ✅ Highlight the Azure AI integration
- ✅ Show real-time processing capabilities
- ✅ Emphasize practical healthcare applications

**Let's win this hackathon! 🏆**