import { useState, useEffect } from "react";
import { Header } from "@/components/health-portal/Header";
import { Sidebar } from "@/components/health-portal/Sidebar";
import { AgentStatusGrid } from "@/components/health-portal/AgentStatusGrid";
import { PatientOverview } from "@/components/health-portal/PatientOverview";
import { DiagnosticResults } from "@/components/health-portal/DiagnosticResults";
import { AIInsights } from "@/components/health-portal/AIInsights";
import { ChatInterface } from "@/components/health-portal/ChatInterface";
import { FloatingParticles } from "@/components/health-portal/FloatingParticles";
import { AgentDemo } from "@/components/health-portal/AgentDemo";
import { FoundryAgentDashboard } from "@/components/health-portal/FoundryAgentDashboard";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

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
            <AgentStatusGrid />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PatientOverview />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <DiagnosticResults />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <AIInsights />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <FoundryAgentDashboard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <AgentDemo />
          </div>
        </main>
      </div>

      <ChatInterface isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default Index;