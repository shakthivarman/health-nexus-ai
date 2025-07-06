// Azure AI Foundry Configuration
export const azureFoundryConfig = {
  // Azure AI Foundry Hub Configuration
  foundry: {
    subscriptionId: process.env.VITE_AZURE_SUBSCRIPTION_ID || '',
    resourceGroupName: process.env.VITE_AZURE_RESOURCE_GROUP || 'health-nexus-rg',
    workspaceName: process.env.VITE_AZURE_FOUNDRY_WORKSPACE || 'health-nexus-foundry',
    endpoint: process.env.VITE_AZURE_FOUNDRY_ENDPOINT || 'https://health-nexus-foundry.api.azureml.ms',
    apiKey: process.env.VITE_AZURE_FOUNDRY_API_KEY || '',
    region: process.env.VITE_AZURE_REGION || 'eastus'
  },

  // Azure AI Studio Project Configuration
  aiStudio: {
    projectName: process.env.VITE_AZURE_AI_STUDIO_PROJECT || 'health-nexus-ai',
    projectId: process.env.VITE_AZURE_AI_STUDIO_PROJECT_ID || '',
    endpoint: process.env.VITE_AZURE_AI_STUDIO_ENDPOINT || '',
    deploymentName: process.env.VITE_AZURE_AI_STUDIO_DEPLOYMENT || 'gpt-4-agents'
  },

  // Agent Service Configuration
  agentService: {
    baseUrl: process.env.VITE_AZURE_AGENT_SERVICE_URL || 'https://health-nexus-agents.azurewebsites.net',
    apiVersion: '2024-04-01-preview',
    maxConcurrentAgents: 10,
    agentTimeout: 120000, // 2 minutes
    retryAttempts: 3
  },

  // Orchestration Configuration
  orchestration: {
    orchestratorName: 'health-nexus-orchestrator',
    workflowEngine: 'semantic-kernel',
    plannerType: 'sequential',
    maxPlanSteps: 20,
    parallelExecution: true
  },

  // Monitoring and Telemetry
  monitoring: {
    applicationInsights: {
      connectionString: process.env.VITE_APP_INSIGHTS_CONNECTION_STRING || '',
      instrumentationKey: process.env.VITE_APP_INSIGHTS_INSTRUMENTATION_KEY || ''
    },
    telemetryEnabled: true,
    metricsEnabled: true,
    loggingLevel: 'INFO'
  },

  // Agent Definitions
  agentDefinitions: {
    radiologyAgent: {
      name: 'radiology-agent',
      description: 'Specialized agent for analyzing medical imaging including X-rays, CT scans, and MRIs',
      skills: ['image-analysis', 'medical-interpretation', 'report-generation'],
      models: ['gpt-4-vision', 'azure-cv'],
      maxConcurrency: 3
    },
    pathologyAgent: {
      name: 'pathology-agent', 
      description: 'Expert agent for analyzing tissue samples and pathology reports',
      skills: ['microscopy-analysis', 'tissue-interpretation', 'diagnosis-support'],
      models: ['gpt-4', 'custom-vision'],
      maxConcurrency: 2
    },
    genomicAgent: {
      name: 'genomic-agent',
      description: 'Genomics specialist for analyzing genetic variants and hereditary patterns',
      skills: ['variant-analysis', 'risk-assessment', 'genetic-counseling'],
      models: ['gpt-4', 'text-analytics'],
      maxConcurrency: 2
    },
    labResultsAgent: {
      name: 'lab-results-agent',
      description: 'Laboratory specialist for analyzing blood work and lab test results',
      skills: ['lab-interpretation', 'trend-analysis', 'reference-comparison'],
      models: ['gpt-4', 'text-analytics'],
      maxConcurrency: 5
    },
    orchestratorAgent: {
      name: 'orchestrator-agent',
      description: 'Master orchestrator that synthesizes findings from all medical agents',
      skills: ['synthesis', 'clinical-reasoning', 'treatment-planning'],
      models: ['gpt-4'],
      maxConcurrency: 1
    }
  }
};

// Validate Azure AI Foundry configuration
export const validateFoundryConfig = () => {
  const requiredConfigs = [
    { name: 'Azure Subscription ID', value: azureFoundryConfig.foundry.subscriptionId },
    { name: 'Azure Foundry Workspace', value: azureFoundryConfig.foundry.workspaceName },
    { name: 'Azure Foundry Endpoint', value: azureFoundryConfig.foundry.endpoint },
    { name: 'Azure AI Studio Project', value: azureFoundryConfig.aiStudio.projectName }
  ];
  
  const missing = requiredConfigs.filter(config => !config.value || config.value.includes('your-'));
  
  if (missing.length > 0) {
    console.warn('Missing Azure AI Foundry configuration:', missing.map(c => c.name));
    return false;
  }
  
  return true;
};

// Agent capabilities and tools registry
export const agentCapabilities = {
  radiologyAgent: {
    tools: [
      'azure-computer-vision',
      'medical-image-analyzer',
      'dicom-processor',
      'report-generator'
    ],
    integrations: [
      'azure-openai-gpt4-vision',
      'azure-computer-vision-v4',
      'azure-form-recognizer'
    ]
  },
  pathologyAgent: {
    tools: [
      'azure-custom-vision',
      'microscopy-analyzer',
      'tissue-classifier',
      'pathology-reporter'
    ],
    integrations: [
      'azure-openai-gpt4',
      'azure-custom-vision-v3',
      'azure-cognitive-search'
    ]
  },
  genomicAgent: {
    tools: [
      'variant-interpreter',
      'risk-calculator',
      'hereditary-analyzer',
      'genetic-reporter'
    ],
    integrations: [
      'azure-openai-gpt4',
      'azure-text-analytics',
      'azure-cognitive-search'
    ]
  },
  labResultsAgent: {
    tools: [
      'lab-value-analyzer',
      'trend-detector',
      'reference-checker',
      'lab-reporter'
    ],
    integrations: [
      'azure-openai-gpt4',
      'azure-text-analytics',
      'azure-data-explorer'
    ]
  },
  orchestratorAgent: {
    tools: [
      'semantic-kernel-planner',
      'clinical-synthesizer',
      'treatment-planner',
      'insight-generator'
    ],
    integrations: [
      'azure-openai-gpt4',
      'all-health-agents',
      'azure-cognitive-search'
    ]
  }
};