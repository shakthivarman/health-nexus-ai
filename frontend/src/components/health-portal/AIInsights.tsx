import { CheckCircle, AlertTriangle, Calendar, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const insights = {
  analysis: "Based on the collective analysis from all agents, the patient shows signs of a respiratory infection with elevated inflammatory markers. The chest X-ray findings correlate with the blood panel results. Immediate antibiotic therapy recommended.",
  priority: [
    "Start IV antibiotics",
    "Monitor WBC levels",
    "Repeat chest X-ray in 48h"
  ],
  risks: [
    "Age > 40",
    "Previous respiratory issues", 
    "No genetic predisposition"
  ],
  followUp: [
    { time: "Tomorrow", task: "Blood retest" },
    { time: "48h", task: "Chest X-ray" },
    { time: "1 week", task: "Full panel" }
  ]
};

export const AIInsights = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gradient-primary">
          AI-Generated Insights & Recommendations
        </h2>
        <div className="data-flow h-1 flex-1" />
      </div>

      <div className="space-y-6">
        {/* Main Analysis */}
        <Card className="card-glass p-6 border-l-4 border-primary glow-primary">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary mt-1">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-semibold text-gradient-primary">
                🔍 Orchestrator Analysis
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                {insights.analysis}
              </p>
              <div className="flex gap-3">
                <Button className="bg-gradient-primary glow-primary">
                  Accept Recommendation
                </Button>
                <Button variant="outline" className="glass">
                  Request Second Opinion
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Priority Actions */}
          <Card className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-success">Priority Actions</h3>
            </div>
            <ul className="space-y-3">
              {insights.priority.map((action, index) => (
                <li key={index} className="flex items-center gap-3 py-2 border-b border-border-strong last:border-b-0">
                  <div className="w-2 h-2 bg-success rounded-full animate-glow" />
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Risk Factors */}
          <Card className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-warning">Risk Factors</h3>
            </div>
            <ul className="space-y-3">
              {insights.risks.map((risk, index) => (
                <li key={index} className="flex items-center gap-3 py-2 border-b border-border-strong last:border-b-0">
                  <div className={`w-2 h-2 rounded-full ${
                    risk.includes('No') ? 'bg-success' : 'bg-warning'
                  }`} />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Follow-up Schedule */}
          <Card className="card-glass p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Follow-up Schedule</h3>
            </div>
            <ul className="space-y-3">
              {insights.followUp.map((item, index) => (
                <li key={index} className="flex items-center gap-3 py-2 border-b border-border-strong last:border-b-0">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.time}</div>
                    <div className="text-xs text-foreground-secondary">{item.task}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Confidence Metrics */}
        <Card className="card-glass p-6">
          <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
            AI Confidence Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">94.8%</div>
              <div className="text-sm text-foreground-secondary">Overall Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">98.5%</div>
              <div className="text-sm text-foreground-secondary">Data Correlation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">92.1%</div>
              <div className="text-sm text-foreground-secondary">Treatment Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1">96.7%</div>
              <div className="text-sm text-foreground-secondary">Risk Assessment</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};