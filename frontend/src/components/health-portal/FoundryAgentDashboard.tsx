import { useState, useEffect } from "react";
import { Activity, Brain, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { foundryOrchestrator, type AgentMonitoring, type OrchestratedAnalysis } from "@/services/foundry-orchestrator";
import { cn } from "@/lib/utils";

export const FoundryAgentDashboard = () => {
  const [agentStatus, setAgentStatus] = useState<AgentMonitoring[]>([]);
  const [activeWorkflows, setActiveWorkflows] = useState<OrchestratedAnalysis[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isAutoScaling, setIsAutoScaling] = useState(true);

  useEffect(() => {
    const updateDashboard = () => {
      setAgentStatus(foundryOrchestrator.getAgentStatus());
      setActiveWorkflows(foundryOrchestrator.getActiveWorkflows());
      setPerformanceMetrics(foundryOrchestrator.getPerformanceMetrics());
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAutoScaling) {
      const autoScaleInterval = setInterval(() => {
        foundryOrchestrator.autoScale();
      }, 30000); // Auto-scale every 30 seconds

      return () => clearInterval(autoScaleInterval);
    }
  }, [isAutoScaling]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-success';
      case 'busy': return 'text-primary';
      case 'error': return 'text-error';
      case 'maintenance': return 'text-warning';
      default: return 'text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <CheckCircle2 className="h-4 w-4" />;
      case 'busy': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const runComprehensiveDemo = async () => {
    try {
      const mockHealthData = {
        patientInfo: {
          id: 'patient-demo-001',
          age: 45,
          sex: 'Female',
          medicalHistory: ['Hypertension', 'Type 2 Diabetes']
        },
        labResults: {
          testType: 'Complete Blood Count',
          values: [
            { parameter: 'WBC', value: 15000, unit: '/μL', referenceRange: '4,500-11,000' },
            { parameter: 'RBC', value: 4.2, unit: 'M/μL', referenceRange: '4.2-5.4' },
            { parameter: 'Hemoglobin', value: 12.5, unit: 'g/dL', referenceRange: '12.0-15.5' }
          ]
        },
        genomicData: {
          variants: ['BRCA1 c.5266dupC', 'APOE ε4/ε3'],
          genePanel: 'Hereditary Cancer Panel',
          familyHistory: 'Maternal grandmother with breast cancer',
          ethnicity: 'European'
        },
        pathologyData: {
          sampleType: 'Lung Biopsy',
          findings: 'Tissue shows adenocarcinoma with glandular pattern',
          staining: 'H&E, TTF-1 positive',
          microscopyNotes: 'Moderate nuclear pleomorphism present'
        }
      };

      await foundryOrchestrator.orchestrateHealthAnalysis(mockHealthData);
    } catch (error) {
      console.error('Demo failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient-primary">
              Azure AI Foundry Agent Dashboard
            </h2>
            <p className="text-foreground-secondary">
              Advanced agent orchestration and monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={isAutoScaling ? "default" : "outline"} 
            className={cn("glass", isAutoScaling && "bg-gradient-primary")}
          >
            Auto-Scaling {isAutoScaling ? "ON" : "OFF"}
          </Badge>
          <Button
            onClick={() => setIsAutoScaling(!isAutoScaling)}
            variant="outline"
            size="sm"
            className="glass"
          >
            <Zap className="h-4 w-4 mr-2" />
            Toggle Auto-Scale
          </Button>
          <Button
            onClick={runComprehensiveDemo}
            className="bg-gradient-primary glow-primary"
          >
            <Target className="h-4 w-4 mr-2" />
            Run Full Demo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Agent Status Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agentStatus.map((agent) => (
              <Card key={agent.agentId} className="card-glass p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full animate-glow", 
                        agent.status === 'idle' ? 'bg-success' :
                        agent.status === 'busy' ? 'bg-primary' :
                        agent.status === 'error' ? 'bg-error' : 'bg-warning'
                      )} />
                      <h3 className="text-lg font-semibold capitalize">
                        {agent.agentName.replace('-', ' ')}
                      </h3>
                    </div>
                    <div className={cn("flex items-center gap-1", getStatusColor(agent.status))}>
                      {getStatusIcon(agent.status)}
                      <span className="text-sm capitalize">{agent.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="text-xs text-foreground-secondary">Health Score</div>
                      <div className={cn("text-2xl font-bold", getHealthScoreColor(agent.healthScore))}>
                        {agent.healthScore}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-foreground-secondary">Current Load</div>
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(agent.currentLoad * 100)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-foreground-secondary">Success Rate</div>
                      <div className="text-2xl font-bold text-secondary">
                        {agent.successRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-foreground-secondary">Avg Response</div>
                      <div className="text-2xl font-bold text-accent">
                        {agent.averageResponseTime.toFixed(0)}ms
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Health Score</span>
                      <span>{agent.healthScore}%</span>
                    </div>
                    <Progress value={agent.healthScore} className="h-2" />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-foreground-secondary">
                    <span>Executions: {agent.totalExecutions}</span>
                    <span>Errors: {agent.errorCount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          {activeWorkflows.length === 0 ? (
            <Card className="card-glass p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Active Workflows</h3>
              <p className="text-foreground-secondary mb-4">
                Start a comprehensive analysis to see workflow orchestration in action
              </p>
              <Button onClick={runComprehensiveDemo} className="bg-gradient-primary glow-primary">
                Start Demo Workflow
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activeWorkflows.map((workflow) => (
                <Card key={workflow.workflowId} className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Patient Analysis: {workflow.patientId}
                      </h3>
                      <p className="text-sm text-foreground-secondary">
                        Workflow ID: {workflow.workflowId}
                      </p>
                    </div>
                    <Badge 
                      variant={workflow.status === 'completed' ? 'default' : 'outline'}
                      className={cn(
                        workflow.status === 'analyzing' && 'bg-gradient-primary animate-pulse',
                        workflow.status === 'completed' && 'bg-gradient-success',
                        workflow.status === 'failed' && 'bg-gradient-error'
                      )}
                    >
                      {workflow.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {(workflow.executionMetrics.totalTimeMs / 1000).toFixed(1)}s
                      </div>
                      <div className="text-sm text-foreground-secondary">Total Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {workflow.executionMetrics.tokensUsed.toLocaleString()}
                      </div>
                      <div className="text-sm text-foreground-secondary">Tokens Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        ${workflow.executionMetrics.cost.toFixed(3)}
                      </div>
                      <div className="text-sm text-foreground-secondary">Estimated Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {(workflow.synthesis.confidence.overall * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-foreground-secondary">Confidence</div>
                    </div>
                  </div>

                  {workflow.status === 'completed' && (
                    <div className="space-y-4">
                      <div className="glass rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Clinical Impression</h4>
                        <p className="text-sm text-foreground-secondary">
                          {workflow.synthesis.clinicalImpression}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Priority Actions
                          </h4>
                          <ul className="space-y-1">
                            {workflow.synthesis.priorityActions.map((action, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="glass rounded-lg p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Follow-up Plan
                          </h4>
                          <ul className="space-y-1">
                            {workflow.synthesis.followUpPlan.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                  item.priority === 'high' ? 'bg-error' :
                                  item.priority === 'medium' ? 'bg-warning' : 'bg-success'
                                )} />
                                <span className="font-medium">{item.timeframe}:</span>
                                {item.action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {performanceMetrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="card-glass p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Avg Workflow Time</h3>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {(performanceMetrics.averageWorkflowTime / 1000).toFixed(1)}s
                  </div>
                </Card>

                <Card className="card-glass p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="font-semibold">Success Rate</h3>
                  </div>
                  <div className="text-3xl font-bold text-success">
                    {performanceMetrics.successRate.toFixed(1)}%
                  </div>
                </Card>

                <Card className="card-glass p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Total Workflows</h3>
                  </div>
                  <div className="text-3xl font-bold text-accent">
                    {performanceMetrics.totalWorkflows}
                  </div>
                </Card>

                <Card className="card-glass p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold">Total Cost</h3>
                  </div>
                  <div className="text-3xl font-bold text-secondary">
                    ${performanceMetrics.costAnalysis.totalCost.toFixed(2)}
                  </div>
                </Card>
              </div>

              <Card className="card-glass p-6">
                <h3 className="text-lg font-semibold mb-4">Agent Utilization</h3>
                <div className="space-y-4">
                  {Object.entries(performanceMetrics.agentUtilization).map(([agentName, utilization]) => (
                    <div key={agentName} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{agentName.replace('-', ' ')}</span>
                        <span>{Math.round((utilization as number) * 100)}%</span>
                      </div>
                      <Progress value={(utilization as number) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};