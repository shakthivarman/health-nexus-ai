import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  FileText, 
  Activity,
  Microscope,
  Dna,
  TestTube,
  Network,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Patients', icon: Users, href: '/patients' },
  { name: 'AI Agents', icon: Bot, href: '/ai-agents' },
  { name: 'Reports', icon: FileText, href: '/reports' },
];

const agents = [
  { name: 'Radiology Agent', icon: Activity, status: 'active', color: 'success' },
  { name: 'Pathology Agent', icon: Microscope, status: 'processing', color: 'primary' },
  { name: 'Genome Agent', icon: Dna, status: 'active', color: 'success' },
  { name: 'Lab Results Agent', icon: TestTube, status: 'active', color: 'success' },
  { name: 'Orchestrator Agent', icon: Network, status: 'error', color: 'error' },
];

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const location = useLocation();

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success';
      case 'primary': return 'bg-primary animate-pulse-glow';
      case 'error': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-border-strong transition-all duration-300 z-40",
      isOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-8">
          {/* Main Navigation */}
          <div>
            <h2 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-3">
              Navigation
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11",
                        isActive && "bg-gradient-primary glow-primary text-primary-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI Agents */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setAgentsExpanded(!agentsExpanded)}
              className="w-full justify-between p-0 h-auto mb-3 hover:bg-transparent"
            >
              <h2 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                AI Agents
              </h2>
              <ChevronDown className={cn(
                "h-4 w-4 text-foreground-secondary transition-transform",
                agentsExpanded && "rotate-180"
              )} />
            </Button>
            
            {agentsExpanded && (
              <div className="space-y-1">
                {agents.map((agent) => (
                  <Link key={agent.name} to="/ai-agents">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-11 interactive"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          getStatusColor(agent.color)
                        )} />
                        <agent.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm">{agent.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-strong">
          <div className="glass rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-glow" />
              <span className="text-sm font-medium">System Status</span>
            </div>
            <div className="text-xs text-foreground-secondary">
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};