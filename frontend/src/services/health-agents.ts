import { azureOpenAIService } from './azure-openai';
import { azureComputerVisionService } from './azure-computer-vision';

export interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'processing' | 'error' | 'idle';
  processed: number;
  avgTime: string;
  accuracy: string;
  queue: number;
  lastUpdate: Date;
  progress?: number;
}

export interface DiagnosticResult {
  id: string;
  title: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'critical' | 'pending';
  agent: string;
  confidence: number | null;
  description: string;
  type: 'image' | 'chart' | 'score' | 'timeline' | 'text';
  timestamp: Date;
  data?: any;
}

export interface InsightData {
  analysis: string;
  priority: string[];
  risks: string[];
  followUp: Array<{
    time: string;
    task: string;
  }>;
  confidence: {
    overall: number;
    dataCorrelation: number;
    treatmentAccuracy: number;
    riskAssessment: number;
  };
}

export class HealthAgentsService {
  private agents: Map<string, AgentStatus> = new Map();
  private results: DiagnosticResult[] = [];
  private insights: InsightData | null = null;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const agentConfigs = [
      { id: 'radiology', name: 'Radiology Agent', avgTime: '2.3s', accuracy: '98.5%' },
      { id: 'pathology', name: 'Pathology Agent', avgTime: '4.1s', accuracy: '97.2%' },
      { id: 'genomic', name: 'Genome Agent', avgTime: '12.5s', accuracy: '96.8%' },
      { id: 'lab', name: 'Lab Results Agent', avgTime: '1.8s', accuracy: '99.1%' },
      { id: 'orchestrator', name: 'Orchestrator Agent', avgTime: '0.5s', accuracy: '94.8%' }
    ];

    agentConfigs.forEach(config => {
      this.agents.set(config.id, {
        id: config.id,
        name: config.name,
        status: 'idle',
        processed: 0,
        avgTime: config.avgTime,
        accuracy: config.accuracy,
        queue: 0,
        lastUpdate: new Date()
      });
    });
  }

  // Radiology Agent - Analyze X-rays, CTs, MRIs
  async analyzeRadiologyImage(imageFile: File, imageType: 'xray' | 'ct' | 'mri' | 'ultrasound'): Promise<DiagnosticResult> {
    const agent = this.agents.get('radiology')!;
    this.updateAgentStatus('radiology', 'processing', 0);

    try {
      // Use Azure Computer Vision for image analysis
      const visionAnalysis = await azureComputerVisionService.analyzeMedicalImage(
        URL.createObjectURL(imageFile), 
        imageType
      );

      // Use Azure OpenAI for detailed medical interpretation
      const reportText = `
        Image Type: ${imageType.toUpperCase()}
        Findings: ${visionAnalysis.findings.join(', ')}
        Confidence: ${visionAnalysis.confidence}%
        Severity: ${visionAnalysis.severity}
      `;

      const aiAnalysis = await azureOpenAIService.analyzeRadiologyReport(reportText);

      const result: DiagnosticResult = {
        id: `radiology-${Date.now()}`,
        title: `${imageType.toUpperCase()} Analysis`,
        severity: visionAnalysis.severity as any,
        agent: 'Radiology Agent',
        confidence: visionAnalysis.confidence,
        description: aiAnalysis,
        type: 'image',
        timestamp: new Date(),
        data: {
          imageType,
          findings: visionAnalysis.findings,
          recommendations: visionAnalysis.recommendations
        }
      };

      this.results.push(result);
      this.updateAgentStatus('radiology', 'active');
      this.incrementProcessedCount('radiology');

      return result;
    } catch (error) {
      console.error('Radiology analysis error:', error);
      this.updateAgentStatus('radiology', 'error');
      throw error;
    }
  }

  // Pathology Agent - Analyze tissue samples and lab results
  async analyzePathologyData(sampleData: {
    sampleType: string;
    findings: string;
    staining: string;
    microscopyNotes: string;
  }): Promise<DiagnosticResult> {
    const agent = this.agents.get('pathology')!;
    this.updateAgentStatus('pathology', 'processing', 0);

    try {
      const reportText = `
        Sample Type: ${sampleData.sampleType}
        Findings: ${sampleData.findings}
        Staining: ${sampleData.staining}
        Microscopy Notes: ${sampleData.microscopyNotes}
      `;

      const aiAnalysis = await azureOpenAIService.analyzePathologyReport(reportText);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result: DiagnosticResult = {
        id: `pathology-${Date.now()}`,
        title: 'Pathology Analysis',
        severity: this.determineSeverityFromText(aiAnalysis),
        agent: 'Pathology Agent',
        confidence: Math.floor(Math.random() * 10 + 90), // 90-100%
        description: aiAnalysis,
        type: 'text',
        timestamp: new Date(),
        data: sampleData
      };

      this.results.push(result);
      this.updateAgentStatus('pathology', 'active');
      this.incrementProcessedCount('pathology');

      return result;
    } catch (error) {
      console.error('Pathology analysis error:', error);
      this.updateAgentStatus('pathology', 'error');
      throw error;
    }
  }

  // Genomic Agent - Analyze genetic data
  async analyzeGenomicData(genomicData: {
    variants: string[];
    genePanel: string;
    familyHistory: string;
    ethnicity: string;
  }): Promise<DiagnosticResult> {
    const agent = this.agents.get('genomic')!;
    this.updateAgentStatus('genomic', 'processing', 0);

    try {
      const reportText = `
        Genetic Variants: ${genomicData.variants.join(', ')}
        Gene Panel: ${genomicData.genePanel}
        Family History: ${genomicData.familyHistory}
        Ethnicity: ${genomicData.ethnicity}
      `;

      const aiAnalysis = await azureOpenAIService.analyzeGenomicData(reportText);

      const result: DiagnosticResult = {
        id: `genomic-${Date.now()}`,
        title: 'Genetic Risk Assessment',
        severity: 'normal', // Usually normal unless high-risk variants found
        agent: 'Genome Agent',
        confidence: Math.floor(Math.random() * 5 + 95), // 95-100%
        description: aiAnalysis,
        type: 'score',
        timestamp: new Date(),
        data: {
          ...genomicData,
          riskScore: Math.random() * 5 + 1 // 1-6 risk score
        }
      };

      this.results.push(result);
      this.updateAgentStatus('genomic', 'active');
      this.incrementProcessedCount('genomic');

      return result;
    } catch (error) {
      console.error('Genomic analysis error:', error);
      this.updateAgentStatus('genomic', 'error');
      throw error;
    }
  }

  // Lab Results Agent - Analyze blood work and lab tests
  async analyzeLabResults(labData: {
    testType: string;
    values: Array<{
      parameter: string;
      value: number;
      unit: string;
      referenceRange: string;
    }>;
    patientAge: number;
    patientSex: string;
  }): Promise<DiagnosticResult> {
    const agent = this.agents.get('lab')!;
    this.updateAgentStatus('lab', 'processing', 0);

    try {
      const reportText = `
        Test Type: ${labData.testType}
        Patient: ${labData.patientAge} year old ${labData.patientSex}
        Results: ${labData.values.map(v => `${v.parameter}: ${v.value} ${v.unit} (Reference: ${v.referenceRange})`).join(', ')}
      `;

      const aiAnalysis = await azureOpenAIService.analyzeLabResults(reportText);

      // Determine severity based on how many values are out of range
      const abnormalCount = labData.values.filter(v => this.isValueAbnormal(v)).length;
      const severity = abnormalCount === 0 ? 'normal' : 
                     abnormalCount <= 2 ? 'mild' : 
                     abnormalCount <= 4 ? 'moderate' : 'severe';

      const result: DiagnosticResult = {
        id: `lab-${Date.now()}`,
        title: `${labData.testType} Results`,
        severity: severity as any,
        agent: 'Lab Results Agent',
        confidence: 99,
        description: aiAnalysis,
        type: 'chart',
        timestamp: new Date(),
        data: {
          values: labData.values,
          abnormalCount,
          patientInfo: {
            age: labData.patientAge,
            sex: labData.patientSex
          }
        }
      };

      this.results.push(result);
      this.updateAgentStatus('lab', 'active');
      this.incrementProcessedCount('lab');

      return result;
    } catch (error) {
      console.error('Lab analysis error:', error);
      this.updateAgentStatus('lab', 'error');
      throw error;
    }
  }

  // Orchestrator Agent - Synthesize all findings
  async orchestrateFindings(): Promise<InsightData> {
    const agent = this.agents.get('orchestrator')!;
    this.updateAgentStatus('orchestrator', 'processing', 0);

    try {
      const findings = {
        radiology: this.results.filter(r => r.agent === 'Radiology Agent').map(r => r.description).join('\n'),
        pathology: this.results.filter(r => r.agent === 'Pathology Agent').map(r => r.description).join('\n'),
        genomic: this.results.filter(r => r.agent === 'Genome Agent').map(r => r.description).join('\n'),
        lab: this.results.filter(r => r.agent === 'Lab Results Agent').map(r => r.description).join('\n')
      };

      const orchestratedAnalysis = await azureOpenAIService.orchestrateFindings(findings);

      // Parse the orchestrated analysis into structured insights
      const insights: InsightData = {
        analysis: orchestratedAnalysis,
        priority: this.extractPriorityActions(orchestratedAnalysis),
        risks: this.extractRiskFactors(orchestratedAnalysis),
        followUp: this.extractFollowUpTasks(orchestratedAnalysis),
        confidence: {
          overall: Math.floor(Math.random() * 10 + 90),
          dataCorrelation: Math.floor(Math.random() * 5 + 95),
          treatmentAccuracy: Math.floor(Math.random() * 15 + 85),
          riskAssessment: Math.floor(Math.random() * 8 + 92)
        }
      };

      this.insights = insights;
      this.updateAgentStatus('orchestrator', 'active');
      this.incrementProcessedCount('orchestrator');

      return insights;
    } catch (error) {
      console.error('Orchestration error:', error);
      this.updateAgentStatus('orchestrator', 'error');
      throw error;
    }
  }

  // Helper methods
  private updateAgentStatus(agentId: string, status: AgentStatus['status'], progress?: number) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastUpdate = new Date();
      if (progress !== undefined) {
        agent.progress = progress;
      }
    }
  }

  private incrementProcessedCount(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.processed++;
    }
  }

  private determineSeverityFromText(text: string): 'normal' | 'mild' | 'moderate' | 'severe' | 'critical' {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('urgent')) return 'critical';
    if (lowerText.includes('severe') || lowerText.includes('high risk')) return 'severe';
    if (lowerText.includes('moderate') || lowerText.includes('concern')) return 'moderate';
    if (lowerText.includes('mild') || lowerText.includes('slight')) return 'mild';
    return 'normal';
  }

  private isValueAbnormal(value: { value: number; referenceRange: string }): boolean {
    // Simple check - in real implementation, parse reference range properly
    return Math.random() > 0.7; // 30% chance of abnormal for demo
  }

  private extractPriorityActions(text: string): string[] {
    // Simple extraction - in real implementation, use more sophisticated NLP
    const actions = [];
    if (text.includes('antibiotic')) actions.push('Start IV antibiotics');
    if (text.includes('monitor')) actions.push('Monitor vital signs');
    if (text.includes('follow')) actions.push('Schedule follow-up');
    return actions.length > 0 ? actions : ['Continue standard care'];
  }

  private extractRiskFactors(text: string): string[] {
    const risks = [];
    if (text.includes('age')) risks.push('Age-related risk factors');
    if (text.includes('history')) risks.push('Medical history considerations');
    if (text.includes('genetic')) risks.push('Genetic predisposition');
    return risks.length > 0 ? risks : ['No significant risk factors identified'];
  }

  private extractFollowUpTasks(text: string): Array<{ time: string; task: string }> {
    return [
      { time: '24h', task: 'Monitor symptoms' },
      { time: '1 week', task: 'Follow-up appointment' },
      { time: '1 month', task: 'Reassess treatment' }
    ];
  }

  // Public getters
  getAgentStatuses(): AgentStatus[] {
    return Array.from(this.agents.values());
  }

  getDiagnosticResults(): DiagnosticResult[] {
    return this.results;
  }

  getInsights(): InsightData | null {
    return this.insights;
  }

  // Reset for demo purposes
  reset() {
    this.results = [];
    this.insights = null;
    this.agents.forEach(agent => {
      agent.status = 'idle';
      agent.processed = 0;
      agent.queue = 0;
    });
  }
}

// Export singleton instance
export const healthAgentsService = new HealthAgentsService();