// Azure AI Services Configuration
export const azureConfig = {
  // Azure OpenAI Configuration
  openai: {
    endpoint: process.env.VITE_AZURE_OPENAI_ENDPOINT || 'https://your-openai-resource.openai.azure.com/',
    apiKey: process.env.VITE_AZURE_OPENAI_API_KEY || '',
    deploymentName: process.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
    apiVersion: '2024-02-01'
  },
  
  // Azure Computer Vision for X-ray analysis
  computerVision: {
    endpoint: process.env.VITE_AZURE_COMPUTER_VISION_ENDPOINT || 'https://your-cv-resource.cognitiveservices.azure.com/',
    subscriptionKey: process.env.VITE_AZURE_COMPUTER_VISION_KEY || ''
  },
  
  // Azure Text Analytics for medical text analysis
  textAnalytics: {
    endpoint: process.env.VITE_AZURE_TEXT_ANALYTICS_ENDPOINT || 'https://your-text-resource.cognitiveservices.azure.com/',
    subscriptionKey: process.env.VITE_AZURE_TEXT_ANALYTICS_KEY || ''
  },
  
  // Azure Custom Vision for pathology analysis
  customVision: {
    endpoint: process.env.VITE_AZURE_CUSTOM_VISION_ENDPOINT || 'https://your-customvision-resource.cognitiveservices.azure.com/',
    predictionKey: process.env.VITE_AZURE_CUSTOM_VISION_KEY || '',
    projectId: process.env.VITE_AZURE_CUSTOM_VISION_PROJECT_ID || '',
    iterationName: process.env.VITE_AZURE_CUSTOM_VISION_ITERATION || 'Iteration1'
  },
  
  // Azure Bot Service for chat interface
  botService: {
    directLineSecret: process.env.VITE_AZURE_BOT_DIRECT_LINE_SECRET || '',
    botId: process.env.VITE_AZURE_BOT_ID || 'health-nexus-bot'
  },
  
  // Azure Functions for real-time processing
  functions: {
    baseUrl: process.env.VITE_AZURE_FUNCTIONS_URL || 'https://your-function-app.azurewebsites.net/api'
  }
};

// Validate configuration
export const validateAzureConfig = () => {
  const requiredConfigs = [
    { name: 'Azure OpenAI Endpoint', value: azureConfig.openai.endpoint },
    { name: 'Azure OpenAI API Key', value: azureConfig.openai.apiKey },
    { name: 'Computer Vision Endpoint', value: azureConfig.computerVision.endpoint },
    { name: 'Computer Vision Key', value: azureConfig.computerVision.subscriptionKey }
  ];
  
  const missing = requiredConfigs.filter(config => !config.value || config.value.includes('your-'));
  
  if (missing.length > 0) {
    console.warn('Missing Azure configuration:', missing.map(c => c.name));
    return false;
  }
  
  return true;
};