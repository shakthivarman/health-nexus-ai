import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const diagnosticResults = [
  {
    title: "Chest X-Ray Analysis",
    severity: "moderate",
    agent: "Radiology Agent",
    confidence: 92,
    description: "Mild opacity detected in lower right lobe. Follow-up recommended in 3 months.",
    type: "image"
  },
  {
    title: "Blood Panel Results", 
    severity: "critical",
    agent: "Lab Results Agent",
    confidence: 98,
    description: "Elevated WBC count (15,000/μL) and CRP levels indicating possible infection.",
    type: "chart",
    values: [
      { label: "WBC", value: 15000, unit: "/μL", status: "high" },
      { label: "CRP", value: 12.5, unit: "mg/L", status: "high" },
      { label: "RBC", value: 4.2, unit: "M/μL", status: "normal" },
      { label: "HGB", value: 13.8, unit: "g/dL", status: "normal" }
    ]
  },
  {
    title: "Genetic Risk Assessment",
    severity: "normal", 
    agent: "Genome Agent",
    confidence: 95,
    description: "No significant genetic markers detected. Standard population risk.",
    type: "score",
    score: 2.3,
    scoreLabel: "Cardiovascular Risk Score"
  },
  {
    title: "Pathology Summary",
    severity: "pending",
    agent: "Pathology Agent", 
    confidence: null,
    description: "Sample processing in progress. Results expected in 2 hours.",
    type: "timeline",
    timeline: [
      { time: "10:30 AM", title: "Sample Collected", status: "completed" },
      { time: "11:45 AM", title: "Analysis Started", status: "completed" },
      { time: "2:00 PM", title: "Results Expected", status: "pending" }
    ]
  }
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <Badge className="bg-error text-white">Critical</Badge>;
    case 'moderate':
      return <Badge className="bg-warning text-background">Moderate</Badge>;
    case 'normal':
      return <Badge className="bg-success text-white">Normal</Badge>;
    case 'pending':
      return <Badge className="bg-muted text-foreground">Pending</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};

const getValueStatus = (status: string) => {
  switch (status) {
    case 'high':
      return 'text-error';
    case 'low':
      return 'text-warning';
    case 'normal':
      return 'text-success';
    default:
      return 'text-foreground';
  }
};

export const DiagnosticResults = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gradient-primary">
          Diagnostic Results
        </h2>
        <div className="data-flow h-1 flex-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {diagnosticResults.map((result, index) => (
          <Card key={index} className="card-glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{result.title}</h3>
              {getSeverityBadge(result.severity)}
            </div>

            <div className="min-h-[200px] glass rounded-lg p-4 relative overflow-hidden">
              {result.type === 'image' && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg mx-auto glow-primary flex items-center justify-center">
                      <div className="text-primary-foreground text-2xl">🫁</div>
                    </div>
                    <div className="text-sm text-foreground-secondary">X-Ray Visualization</div>
                  </div>
                </div>
              )}

              {result.type === 'chart' && result.values && (
                <div className="space-y-3">
                  {result.values.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{value.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getValueStatus(value.status)}`}>
                          {value.value} {value.unit}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          value.status === 'high' ? 'bg-error animate-glow' :
                          value.status === 'low' ? 'bg-warning' : 'bg-success'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.type === 'score' && result.score && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-success mb-2">
                      {result.score}%
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      {result.scoreLabel}
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'timeline' && result.timeline && (
                <div className="space-y-4">
                  {result.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-success' :
                        item.status === 'pending' ? 'bg-primary animate-pulse-glow' : 'bg-muted'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="text-xs text-foreground-secondary">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-foreground-secondary">
                {result.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="glass">
                    {result.agent}
                  </Badge>
                </div>
                {result.confidence && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground-secondary">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={result.confidence} className="w-20 h-2" />
                      <span className="text-sm font-medium">{result.confidence}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};