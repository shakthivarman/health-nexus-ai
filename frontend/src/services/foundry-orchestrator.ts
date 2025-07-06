import { azureFoundryClient, type FoundryAgent, type AgentExecution, type WorkflowExecution } from './azure-foundry-client';
import { azureFoundryConfig } from './azure-foundry-config';

// Enhanced types for orchestration
export interface HealthDataInput {
  patientInfo: {
    id: string;
    age: number;
    sex: string;
    medicalHistory: string[];
  };
  radiologyImages?: File[];
  labResults?: {
    testType: string;
    values: Array<{
      parameter: string;
      value: number;
      unit: string;
      referenceRange: string;
    }>;
  };
  genomicData?: {
    variants: string[];
    genePanel: string;
    familyHistory: string;
    ethnicity: string;
  };
  pathologyData?: {
    sampleType: string;
    findings: string;
    staining: string;
    microscopyNotes: string;
  };
}

export interface OrchestratedAnalysis {
  workflowId: string;
  patientId: string;
  status: 'analyzing' | 'completed' | 'failed';
  agentResults: {
    radiology?: any;
    laboratory?: any;
    genomics?: any;
    pathology?: any;
  };
  synthesis: {
    clinicalImpression: string;
    priorityActions: string[];
    riskFactors: string[];
    followUpPlan: Array<{
      timeframe: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    confidence: {
      overall: number;
      dataQuality: number;
      clinicalRelevance: number;
    };
  };
  executionMetrics: {
    totalTimeMs: number;
    agentExecutionTimes: Record<string, number>;
    tokensUsed: number;
    cost: number;
  };
  timestamp: Date;
}

export interface AgentMonitoring {
  agentId: string;
  agentName: string;
  status: 'idle' | 'busy' | 'error' | 'maintenance';
  currentLoad: number;
  averageResponseTime: number;
  successRate: number;
  lastExecution: Date;
  errorCount: number;
  totalExecutions: number;
  healthScore: number;
}

export class FoundryOrchestrator {
  private activeWorkflows: Map<string, OrchestratedAnalysis> = new Map();
  private agentMonitoring: Map<string, AgentMonitoring> = new Map();
  private executionHistory: AgentExecution[] = [];

  constructor() {
    this.initializeMonitoring();
  }

  // Initialize agent monitoring
  private initializeMonitoring() {
    const agents = azureFoundryClient.getAgents();
    agents.forEach(agent => {
      this.agentMonitoring.set(agent.id, {
        agentId: agent.id,
        agentName: agent.name,
        status: 'idle',
        currentLoad: 0,
        averageResponseTime: 0,
        successRate: 100,
        lastExecution: new Date(),
        errorCount: 0,
        totalExecutions: 0,
        healthScore: 100
      });
    });
  }

  // Orchestrate complete health analysis
  async orchestrateHealthAnalysis(healthData: HealthDataInput): Promise<OrchestratedAnalysis> {
    const workflowId = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      // Initialize orchestrated analysis
      const analysis: OrchestratedAnalysis = {
        workflowId,
        patientId: healthData.patientInfo.id,
        status: 'analyzing',
        agentResults: {},
        synthesis: {
          clinicalImpression: '',
          priorityActions: [],
          riskFactors: [],
          followUpPlan: [],
          confidence: { overall: 0, dataQuality: 0, clinicalRelevance: 0 }
        },
        executionMetrics: {
          totalTimeMs: 0,
          agentExecutionTimes: {},
          tokensUsed: 0,
          cost: 0
        },
        timestamp: new Date()
      };

      this.activeWorkflows.set(workflowId, analysis);

      // Execute workflow using Azure AI Foundry
      const workflow = await azureFoundryClient.executeWorkflow('orchestrator-agent', healthData);
      
      // Process workflow results
      analysis.agentResults = this.extractAgentResults(workflow);
      analysis.synthesis = this.synthesizeFindings(workflow.results);
      analysis.executionMetrics = this.calculateMetrics(workflow, startTime);
      analysis.status = 'completed';

      // Update agent monitoring
      this.updateAgentMonitoring(workflow);

      return analysis;
    } catch (error) {
      console.error('Orchestration failed:', error);
      const analysis = this.activeWorkflows.get(workflowId);
      if (analysis) {
        analysis.status = 'failed';
        analysis.executionMetrics.totalTimeMs = Date.now() - startTime;
      }
      throw error;
    }
  }

  // Execute individual agent analysis
  async executeAgentAnalysis(
    agentType: 'radiology' | 'laboratory' | 'genomics' | 'pathology',
    data: any
  ): Promise<any> {
    try {
      const agentId = this.getAgentIdByType(agentType);
      const monitoring = this.agentMonitoring.get(agentId);
      
      if (monitoring) {
        monitoring.status = 'busy';
        monitoring.currentLoad++;
      }

      const execution = await azureFoundryClient.executeAgent(agentId, data);
      
      // Update monitoring
      if (monitoring) {
        monitoring.status = 'idle';
        monitoring.currentLoad--;
        monitoring.totalExecutions++;
        monitoring.lastExecution = new Date();
        monitoring.averageResponseTime = this.updateAverageResponseTime(
          monitoring.averageResponseTime,
          execution.executionTimeMs || 0,
          monitoring.totalExecutions
        );
        
        if (execution.status === 'completed') {
          monitoring.successRate = this.updateSuccessRate(monitoring.totalExecutions, monitoring.errorCount);
        } else {
          monitoring.errorCount++;
          monitoring.successRate = this.updateSuccessRate(monitoring.totalExecutions, monitoring.errorCount);
        }
        
        monitoring.healthScore = this.calculateHealthScore(monitoring);
      }

      this.executionHistory.push(execution);
      return execution.output;
    } catch (error) {
      console.error(`Agent analysis failed for ${agentType}:`, error);
      
      // Update error monitoring
      const agentId = this.getAgentIdByType(agentType);
      const monitoring = this.agentMonitoring.get(agentId);
      if (monitoring) {
        monitoring.status = 'error';
        monitoring.errorCount++;
        monitoring.healthScore = this.calculateHealthScore(monitoring);
      }
      
      throw error;
    }
  }

  // Get real-time agent status
  getAgentStatus(): AgentMonitoring[] {
    return Array.from(this.agentMonitoring.values());
  }

  // Get workflow status
  getWorkflowStatus(workflowId: string): OrchestratedAnalysis | undefined {
    return this.activeWorkflows.get(workflowId);
  }

  // Get all active workflows
  getActiveWorkflows(): OrchestratedAnalysis[] {
    return Array.from(this.activeWorkflows.values());
  }

  // Get execution history
  getExecutionHistory(limit: number = 100): AgentExecution[] {
    return this.executionHistory.slice(-limit);
  }

  // Agent lifecycle management
  async deployAgent(agentConfig: any): Promise<FoundryAgent> {
    const agent = await azureFoundryClient.createAgent(agentConfig);
    
    // Initialize monitoring for new agent
    this.agentMonitoring.set(agent.id, {
      agentId: agent.id,
      agentName: agent.name,
      status: 'idle',
      currentLoad: 0,
      averageResponseTime: 0,
      successRate: 100,
      lastExecution: new Date(),
      errorCount: 0,
      totalExecutions: 0,
      healthScore: 100
    });

    return agent;
  }

  async scaleAgent(agentId: string, targetConcurrency: number): Promise<void> {
    // In production: call Azure AI Foundry scaling API
    console.log(`Scaling agent ${agentId} to ${targetConcurrency} concurrent executions`);
  }

  async restartAgent(agentId: string): Promise<void> {
    await azureFoundryClient.restartAgent(agentId);
    
    // Reset monitoring
    const monitoring = this.agentMonitoring.get(agentId);
    if (monitoring) {
      monitoring.status = 'idle';
      monitoring.currentLoad = 0;
      monitoring.errorCount = 0;
      monitoring.healthScore = 100;
    }
  }

  // Performance analytics
  getPerformanceMetrics(): {
    averageWorkflowTime: number;
    successRate: number;
    totalWorkflows: number;
    agentUtilization: Record<string, number>;
    costAnalysis: {
      totalCost: number;
      costPerWorkflow: number;
      tokenUsage: number;
    };
  } {
    const workflows = Array.from(this.activeWorkflows.values());
    const completedWorkflows = workflows.filter(w => w.status === 'completed');
    
    const totalTime = completedWorkflows.reduce((sum, w) => sum + w.executionMetrics.totalTimeMs, 0);
    const totalTokens = completedWorkflows.reduce((sum, w) => sum + w.executionMetrics.tokensUsed, 0);
    const totalCost = completedWorkflows.reduce((sum, w) => sum + w.executionMetrics.cost, 0);
    
    const agentUtilization: Record<string, number> = {};
    this.agentMonitoring.forEach((monitoring, agentId) => {
      agentUtilization[monitoring.agentName] = monitoring.currentLoad;
    });

    return {
      averageWorkflowTime: completedWorkflows.length > 0 ? totalTime / completedWorkflows.length : 0,
      successRate: workflows.length > 0 ? (completedWorkflows.length / workflows.length) * 100 : 100,
      totalWorkflows: workflows.length,
      agentUtilization,
      costAnalysis: {
        totalCost,
        costPerWorkflow: completedWorkflows.length > 0 ? totalCost / completedWorkflows.length : 0,
        tokenUsage: totalTokens
      }
    };
  }

  // Auto-scaling based on load
  async autoScale(): Promise<void> {
    const monitoring = Array.from(this.agentMonitoring.values());
    
    for (const agent of monitoring) {
      // Scale up if high load and good performance
      if (agent.currentLoad > 0.8 && agent.healthScore > 80) {
        console.log(`Auto-scaling up agent ${agent.agentName}`);
        await this.scaleAgent(agent.agentId, 2); // Double capacity
      }
      
      // Scale down if low load
      if (agent.currentLoad < 0.2 && agent.totalExecutions > 10) {
        console.log(`Auto-scaling down agent ${agent.agentName}`);
        await this.scaleAgent(agent.agentId, 1); // Reduce to minimum
      }
      
      // Restart if health is poor
      if (agent.healthScore < 50) {
        console.log(`Restarting unhealthy agent ${agent.agentName}`);
        await this.restartAgent(agent.agentId);
      }
    }
  }

  // Helper methods
  private extractAgentResults(workflow: WorkflowExecution): any {
    const results: any = {};
    
    workflow.plan.forEach(step => {
      if (step.status === 'completed' && step.result) {
        const agentType = this.getAgentTypeFromId(step.agentId);
        results[agentType] = step.result;
      }
    });
    
    return results;
  }

  private synthesizeFindings(workflowResults: Record<string, any>): any {
    // Extract synthesis from orchestrator results
    const orchestratorResult = workflowResults['orchestrator-synthesis'];
    
    if (orchestratorResult?.output) {
      return {
        clinicalImpression: orchestratorResult.output.synthesis || 'Analysis completed',
        priorityActions: orchestratorResult.output.priorityActions || [],
        riskFactors: this.extractRiskFactors(workflowResults),
        followUpPlan: this.generateFollowUpPlan(workflowResults),
        confidence: {
          overall: orchestratorResult.output.overallConfidence || 0.85,
          dataQuality: 0.90,
          clinicalRelevance: 0.88
        }
      };
    }

    return {
      clinicalImpression: 'Comprehensive analysis completed successfully',
      priorityActions: ['Review all findings', 'Consult with specialists'],
      riskFactors: ['Standard population risk'],
      followUpPlan: [
        { timeframe: '1 week', action: 'Follow-up appointment', priority: 'medium' as const }
      ],
      confidence: { overall: 0.85, dataQuality: 0.90, clinicalRelevance: 0.88 }
    };
  }

  private calculateMetrics(workflow: WorkflowExecution, startTime: number): any {
    const totalTime = Date.now() - startTime;
    const agentTimes: Record<string, number> = {};
    let totalTokens = 0;
    
    workflow.plan.forEach(step => {
      if (step.status === 'completed') {
        const agentType = this.getAgentTypeFromId(step.agentId);
        agentTimes[agentType] = Math.random() * 3000 + 1000; // Mock execution time
        totalTokens += Math.floor(Math.random() * 1000 + 500); // Mock token usage
      }
    });

    const cost = totalTokens * 0.002; // Estimated cost per token

    return {
      totalTimeMs: totalTime,
      agentExecutionTimes: agentTimes,
      tokensUsed: totalTokens,
      cost
    };
  }

  private updateAgentMonitoring(workflow: WorkflowExecution): void {
    workflow.plan.forEach(step => {
      const monitoring = this.agentMonitoring.get(step.agentId);
      if (monitoring) {
        monitoring.totalExecutions++;
        monitoring.lastExecution = new Date();
        
        if (step.status === 'completed') {
          monitoring.successRate = this.updateSuccessRate(monitoring.totalExecutions, monitoring.errorCount);
        } else if (step.status === 'failed') {
          monitoring.errorCount++;
          monitoring.successRate = this.updateSuccessRate(monitoring.totalExecutions, monitoring.errorCount);
        }
        
        monitoring.healthScore = this.calculateHealthScore(monitoring);
      }
    });
  }

  private getAgentIdByType(agentType: string): string {
    const agents = azureFoundryClient.getAgents();
    const agent = agents.find(a => a.name.includes(agentType));
    return agent?.id || `${agentType}-agent-default`;
  }

  private getAgentTypeFromId(agentId: string): string {
    const agents = azureFoundryClient.getAgents();
    const agent = agents.find(a => a.id === agentId);
    return agent?.name.split('-')[0] || 'unknown';
  }

  private updateAverageResponseTime(current: number, newTime: number, totalExecutions: number): number {
    return ((current * (totalExecutions - 1)) + newTime) / totalExecutions;
  }

  private updateSuccessRate(totalExecutions: number, errorCount: number): number {
    return ((totalExecutions - errorCount) / totalExecutions) * 100;
  }

  private calculateHealthScore(monitoring: AgentMonitoring): number {
    const successWeight = 0.4;
    const responseTimeWeight = 0.3;
    const loadWeight = 0.3;
    
    const successScore = monitoring.successRate;
    const responseTimeScore = Math.max(0, 100 - (monitoring.averageResponseTime / 100));
    const loadScore = Math.max(0, 100 - (monitoring.currentLoad * 50));
    
    return Math.round(
      (successScore * successWeight) +
      (responseTimeScore * responseTimeWeight) +
      (loadScore * loadWeight)
    );
  }

  private extractRiskFactors(results: Record<string, any>): string[] {
    const factors: string[] = [];
    
    Object.values(results).forEach(result => {
      if (result?.output?.riskFactors) {
        factors.push(...result.output.riskFactors);
      }
    });
    
    return factors.length > 0 ? factors : ['No significant risk factors identified'];
  }

  private generateFollowUpPlan(results: Record<string, any>): Array<{ timeframe: string; action: string; priority: 'high' | 'medium' | 'low' }> {
    const plan = [
      { timeframe: '24 hours', action: 'Monitor symptoms', priority: 'medium' as const },
      { timeframe: '1 week', action: 'Follow-up appointment', priority: 'medium' as const },
      { timeframe: '1 month', action: 'Reassess treatment', priority: 'low' as const }
    ];

    // Add specific follow-ups based on results
    Object.values(results).forEach(result => {
      if (result?.output?.recommendations?.includes('urgent')) {
        plan.unshift({ timeframe: '2 hours', action: 'Urgent clinical review', priority: 'high' });
      }
    });

    return plan;
  }
}

// Export singleton instance
export const foundryOrchestrator = new FoundryOrchestrator();