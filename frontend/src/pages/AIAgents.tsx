import { useState } from "react";
import { Header } from "@/components/health-portal/Header";
import { Sidebar } from "@/components/health-portal/Sidebar";
import { FloatingParticles } from "@/components/health-portal/FloatingParticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Microscope, 
  Dna, 
  TestTube, 
  Network, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Clock
} from "lucide-react";

const agents = [
  {
    id: 'radiology',
    name: 'Radiology Agent',
    icon: Activity,
    status: 'active',
    color: 'success',
    description: 'AI-powered medical imaging analysis and diagnosis',
    accuracy: 97.2,
    tasksCompleted: 1847,
    avgProcessingTime: '2.3s',
    capabilities: ['X-Ray Analysis', 'CT Scan Interpretation', 'MRI Processing']
  },
  {
    id: 'pathology',
    name: 'Pathology Agent',
    icon: Microscope,
    status: 'processing',
    color: 'primary',
    description: 'Automated tissue and cell analysis for disease detection',
    accuracy: 95.8,
    tasksCompleted: 923,
    avgProcessingTime: '4.7s',
    capabilities: ['Biopsy Analysis', 'Cancer Detection', 'Cellular Morphology']
  },
  {
    id: 'genome',
    name: 'Genome Agent',
    icon: Dna,
    status: 'active',
    color: 'success',
    description: 'Genetic analysis and personalized medicine recommendations',
    accuracy: 99.1,
    tasksCompleted: 567,
    avgProcessingTime: '12.4s',
    capabilities: ['Gene Sequencing', 'Mutation Detection', 'Drug Interactions']
  },
  {
    id: 'lab',
    name: 'Lab Results Agent',
    icon: TestTube,
    status: 'active',
    color: 'success',
    description: 'Comprehensive laboratory data analysis and interpretation',
    accuracy: 98.7,
    tasksCompleted: 2341,
    avgProcessingTime: '1.8s',
    capabilities: ['Blood Work Analysis', 'Biomarker Detection', 'Trend Analysis']
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    icon: Network,
    status: 'error',
    color: 'error',
    description: 'Coordinates all AI agents and manages workflow optimization',
    accuracy: 94.3,
    tasksCompleted: 156,
    avgProcessingTime: '5.1s',
    capabilities: ['Workflow Management', 'Agent Coordination', 'Priority Scheduling']
  }
];

const AIAgents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success text-success-foreground';
      case 'primary': return 'bg-primary text-primary-foreground animate-pulse';
      case 'error': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingParticles />
      
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-80' : 'ml-0'
        } mt-16 p-8 space-y-8`}>
          
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
              AI Agent Management
            </h1>

            <Tabs value={selectedAgent.id} onValueChange={(value) => {
              const agent = agents.find(a => a.id === value);
              if (agent) setSelectedAgent(agent);
            }} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 glass">
                {agents.map((agent) => (
                  <TabsTrigger 
                    key={agent.id} 
                    value={agent.id}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
                  >
                    <agent.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{agent.name.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {agents.map((agent) => (
                <TabsContent key={agent.id} value={agent.id}>
                  <div className="grid gap-6">
                    {/* Agent Overview */}
                    <Card className="glass border-border-strong">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gradient-primary/10">
                              <agent.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl">{agent.name}</CardTitle>
                              <p className="text-foreground-secondary">{agent.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(agent.color)}>
                              {getStatusText(agent.status)}
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                              {agent.status === 'active' ? (
                                <Button variant="outline" size="sm">
                                  <Pause className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Accuracy</span>
                            </div>
                            <div className="text-2xl font-bold text-primary">{agent.accuracy}%</div>
                            <Progress value={agent.accuracy} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Tasks Completed</span>
                            </div>
                            <div className="text-2xl font-bold text-primary">{agent.tasksCompleted.toLocaleString()}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">Avg Processing Time</span>
                            </div>
                            <div className="text-2xl font-bold text-primary">{agent.avgProcessingTime}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Capabilities */}
                    <Card className="glass border-border-strong">
                      <CardHeader>
                        <CardTitle>Capabilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {agent.capabilities.map((capability, index) => (
                            <div key={index} className="p-4 rounded-lg bg-gradient-subtle border border-border">
                              <div className="font-medium">{capability}</div>
                              <div className="text-sm text-foreground-secondary mt-1">
                                Active and optimized
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="glass border-border-strong">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-subtle">
                            <div className="w-2 h-2 bg-success rounded-full animate-glow" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Analysis completed successfully</div>
                              <div className="text-xs text-foreground-secondary">2 minutes ago</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-subtle">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Processing new task batch</div>
                              <div className="text-xs text-foreground-secondary">5 minutes ago</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-gradient-subtle">
                            <div className="w-2 h-2 bg-success rounded-full" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Model optimization completed</div>
                              <div className="text-xs text-foreground-secondary">1 hour ago</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAgents;