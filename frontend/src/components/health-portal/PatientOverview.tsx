import { useState } from "react";
import { User, Calendar, Clock, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'radiology', label: 'Radiology', active: false },
  { id: 'pathology', label: 'Pathology', active: false },
  { id: 'genomics', label: 'Genomics', active: false },
  { id: 'lab', label: 'Lab Results', active: false },
  { id: 'timeline', label: 'Timeline', active: false },
];

export const PatientOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card className="card-glass p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl bg-gradient-secondary glow-secondary flex items-center justify-center">
              <span className="text-2xl font-bold text-background">JD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-background rounded-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gradient-primary">John Doe</h2>
            <div className="flex flex-wrap items-center gap-4 text-foreground-secondary">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>ID: P-2024-1234</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Age: 45, Male</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Admitted: Jan 15, 2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 glass">
            <Plus className="h-4 w-4" />
            Request Analysis
          </Button>
          <Button className="gap-2 bg-gradient-primary glow-primary">
            <Shield className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-strong mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "py-3 px-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
                  Current Condition
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Respiratory Status</span>
                    <span className="text-warning">Elevated</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Inflammatory Markers</span>
                    <span className="text-error">Critical</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Genetic Risk</span>
                    <span className="text-success">Normal</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
                  Vital Signs (Last 24h)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98.6°F</div>
                    <div className="text-sm text-foreground-secondary">Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">120/80</div>
                    <div className="text-sm text-foreground-secondary">Blood Pressure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">22</div>
                    <div className="text-sm text-foreground-secondary">Resp. Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">95%</div>
                    <div className="text-sm text-foreground-secondary">SpO2</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-glow" />
                    <div>
                      <div className="text-sm font-medium">Blood Sample Analyzed</div>
                      <div className="text-xs text-foreground-secondary">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                    <div>
                      <div className="text-sm font-medium">Chest X-Ray Completed</div>
                      <div className="text-xs text-foreground-secondary">4 hours ago</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    <div>
                      <div className="text-sm font-medium">Admission Processed</div>
                      <div className="text-xs text-foreground-secondary">1 day ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gradient-primary">
                  Risk Factors
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm">Age {'>'}40</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm">Previous respiratory issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm">No genetic predisposition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};