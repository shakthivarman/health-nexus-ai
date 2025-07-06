import { azureConfig } from './azure-config';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AzureOpenAIService {
  private endpoint: string;
  private apiKey: string;
  private deploymentName: string;
  private apiVersion: string;

  constructor() {
    this.endpoint = azureConfig.openai.endpoint;
    this.apiKey = azureConfig.openai.apiKey;
    this.deploymentName = azureConfig.openai.deploymentName;
    this.apiVersion = azureConfig.openai.apiVersion;
  }

  async generateCompletion(
    messages: OpenAIMessage[],
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<string> {
    try {
      const url = `${this.endpoint}openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Azure OpenAI Service Error:', error);
      throw error;
    }
  }

  // Medical text analysis prompt templates
  static getSystemPrompts() {
    return {
      radiologyAgent: `You are a specialized radiology AI assistant. Analyze medical imaging reports and provide insights about:
        - Anatomical findings
        - Pathological abnormalities
        - Severity assessment
        - Follow-up recommendations
        Always provide confidence levels and highlight any critical findings.`,
      
      pathologyAgent: `You are a pathology AI assistant. Analyze tissue samples and laboratory results:
        - Cellular morphology
        - Tissue architecture
        - Diagnostic conclusions
        - Staging information
        Provide detailed pathological assessments with confidence scores.`,
      
      genomicAgent: `You are a genomics AI assistant. Analyze genetic data and provide:
        - Variant interpretation
        - Risk assessment
        - Hereditary patterns
        - Therapeutic implications
        Focus on clinically actionable findings.`,
      
      labAgent: `You are a laboratory results AI assistant. Analyze blood panels and lab tests:
        - Reference range comparisons
        - Trend analysis
        - Clinical correlations
        - Diagnostic suggestions
        Highlight abnormal values and their clinical significance.`,
      
      orchestratorAgent: `You are the orchestrator AI that synthesizes findings from multiple medical AI agents:
        - Integrate findings from radiology, pathology, genomics, and lab results
        - Provide comprehensive diagnostic impressions
        - Suggest treatment plans
        - Prioritize follow-up actions
        Focus on patient safety and evidence-based recommendations.`
    };
  }

  // Specialized methods for each agent type
  async analyzeRadiologyReport(reportText: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: AzureOpenAIService.getSystemPrompts().radiologyAgent },
      { role: 'user', content: `Analyze this radiology report: ${reportText}` }
    ];
    
    return this.generateCompletion(messages, 0.3, 800);
  }

  async analyzePathologyReport(reportText: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: AzureOpenAIService.getSystemPrompts().pathologyAgent },
      { role: 'user', content: `Analyze this pathology report: ${reportText}` }
    ];
    
    return this.generateCompletion(messages, 0.3, 800);
  }

  async analyzeGenomicData(genomicData: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: AzureOpenAIService.getSystemPrompts().genomicAgent },
      { role: 'user', content: `Analyze this genomic data: ${genomicData}` }
    ];
    
    return this.generateCompletion(messages, 0.3, 800);
  }

  async analyzeLabResults(labData: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: AzureOpenAIService.getSystemPrompts().labAgent },
      { role: 'user', content: `Analyze these lab results: ${labData}` }
    ];
    
    return this.generateCompletion(messages, 0.3, 800);
  }

  async orchestrateFindings(findings: {
    radiology?: string;
    pathology?: string;
    genomic?: string;
    lab?: string;
  }): Promise<string> {
    const findingsText = Object.entries(findings)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key.toUpperCase()} FINDINGS:\n${value}`)
      .join('\n\n');

    const messages: OpenAIMessage[] = [
      { role: 'system', content: AzureOpenAIService.getSystemPrompts().orchestratorAgent },
      { role: 'user', content: `Synthesize these medical findings and provide a comprehensive assessment:\n\n${findingsText}` }
    ];
    
    return this.generateCompletion(messages, 0.4, 1200);
  }

  async generateChatResponse(userMessage: string, conversationHistory: OpenAIMessage[] = []): Promise<string> {
    const systemMessage: OpenAIMessage = {
      role: 'system',
      content: `You are a helpful medical AI assistant for the Health Nexus AI system. 
        You can help healthcare professionals understand diagnostic results, explain medical terminology, 
        and provide general medical information. Always remind users to consult with healthcare providers 
        for medical decisions. Be precise, helpful, and maintain a professional tone.`
    };

    const messages: OpenAIMessage[] = [
      systemMessage,
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    return this.generateCompletion(messages, 0.7, 800);
  }
}

// Export singleton instance
export const azureOpenAIService = new AzureOpenAIService();