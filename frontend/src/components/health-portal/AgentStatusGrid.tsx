import { useState, useEffect } from "react";
import { Activity, Clock, Target, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { healthAgentsService, type AgentStatus } from "@/services/health-agents";

interface AgentStats {
  processed: number;
  avgTime: string;
  accuracy: string;
  queue: number;
  status: 'active' | 'processing' | 'error';
  progress?: number;
}

const agentData: Record<string, AgentStats> = {
  "Radiology Agent": {
    processed: 1247,
    avgTime: "2.3s",
    accuracy: "98.5%",
    queue: 3,
    status: "active"
  },
  "Pathology Agent": {
    processed: 892,
    avgTime: "4.1s", 
    accuracy: "97.2%",
    queue: 7,
    status: "processing",
    progress: 65
  },
  "Genome Agent": {
    processed: 423,
    avgTime: "12.5s",
    accuracy: "96.8%", 
    queue: 1,
    status: "active"
  },
  "Lab Results Agent": {
    processed: 2341,
    avgTime: "1.8s",
    accuracy: "99.1%",
    queue: 12,
    status: "active"
  },
  "Orchestrator Agent": {
    processed: 156,
    avgTime: "0.5s",
    accuracy: "94.8%",
    queue: 2,
    status: "error"
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return 'status-active';
    case 'processing': 
      return 'status-processing';
    case 'error':
      return 'status-error';
    default:
      return '';
  }
};

const getStatusDot = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success animate-glow';
    case 'processing':
      return 'bg-primary animate-pulse-glow';
    case 'error':
      return 'bg-error animate-glow';
    default:
      return 'bg-muted';
  }
};

export const AgentStatusGrid = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [processingProgress, setProcessingProgress] = useState(65);

  useEffect(() => {
    // Load initial agent data
    const loadAgents = () => {
      const agentStatuses = healthAgentsService.getAgentStatuses();
      setAgents(agentStatuses);
    };

    loadAgents();
    
    // Update agent statuses every 5 seconds
    const statusInterval = setInterval(loadAgents, 5000);
    
    // Animate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gradient-primary">
          AI Agent Status Overview
        </h2>
        <div className="data-flow h-1 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className={cn(
            "card-agent relative overflow-hidden",
            getStatusStyle(agent.status)
          )}>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", getStatusDot(agent.status))} />
                  <span className="text-sm text-foreground-secondary capitalize">
                    {agent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-foreground-secondary text-sm">
                    <Activity className="h-3 w-3" />
                    <span>Processed</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {agent.processed.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-foreground-secondary text-sm">
                    <Clock className="h-3 w-3" />
                    <span>Avg. Time</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {agent.avgTime}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-foreground-secondary text-sm">
                    <Target className="h-3 w-3" />
                    <span>Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-secondary">
                    {agent.accuracy}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-foreground-secondary text-sm">
                    <ListTodo className="h-3 w-3" />
                    <span>Queue</span>
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {agent.queue}
                  </div>
                </div>
              </div>

              {agent.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing</span>
                    <span>{agent.progress || processingProgress}%</span>
                  </div>
                  <Progress value={agent.progress || processingProgress} className="h-2" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};