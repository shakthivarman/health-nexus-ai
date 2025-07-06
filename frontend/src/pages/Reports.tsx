import { useState } from "react";
import { Header } from "@/components/health-portal/Header";
import { Sidebar } from "@/components/health-portal/Sidebar";
import { FloatingParticles } from "@/components/health-portal/FloatingParticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity,
  BarChart3,
  PieChart,
  Filter
} from "lucide-react";

const reportTypes = [
  {
    id: 'diagnostic',
    name: 'Diagnostic Reports',
    description: 'Comprehensive patient diagnostic summaries',
    count: 847,
    recent: '2 hours ago'
  },
  {
    id: 'performance',
    name: 'AI Performance',
    description: 'Agent accuracy and efficiency metrics',
    count: 234,
    recent: '1 hour ago'
  },
  {
    id: 'analytics',
    name: 'System Analytics',
    description: 'Usage patterns and system health data',
    count: 156,
    recent: '30 minutes ago'
  }
];

const recentReports = [
  {
    id: 1,
    title: "Monthly Diagnostic Summary",
    type: "Diagnostic",
    generated: "2024-01-20",
    size: "2.4 MB",
    status: "Ready"
  },
  {
    id: 2,
    title: "AI Agent Performance Analysis",
    type: "Performance",
    generated: "2024-01-19",
    size: "1.8 MB",
    status: "Ready"
  },
  {
    id: 3,
    title: "Patient Outcome Trends",
    type: "Analytics",
    generated: "2024-01-18",
    size: "3.1 MB",
    status: "Processing"
  },
  {
    id: 4,
    title: "Weekly System Health Report",
    type: "Analytics",
    generated: "2024-01-17",
    size: "1.2 MB",
    status: "Ready"
  }
];

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-success text-success-foreground';
      case 'Processing': return 'bg-primary text-primary-foreground animate-pulse';
      case 'Error': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-gradient-primary glow-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 glass">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportTypes.map((type) => (
                      <Card key={type.id} className="glass border-border-strong interactive">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{type.name}</CardTitle>
                            <div className="p-2 rounded-lg bg-gradient-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-primary">{type.count}</div>
                            <p className="text-sm text-foreground-secondary">{type.description}</p>
                            <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                              <Calendar className="w-3 h-3" />
                              Last updated: {type.recent}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Reports */}
                  <Card className="glass border-border-strong">
                    <CardHeader>
                      <CardTitle>Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-subtle border border-border">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-gradient-primary/10">
                                <FileText className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{report.title}</div>
                                <div className="text-sm text-foreground-secondary">
                                  {report.type} • {report.size} • Generated {report.generated}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                              {report.status === 'Ready' && (
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="diagnostic">
                <Card className="glass border-border-strong">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Diagnostic Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <PieChart className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Diagnostic Analytics</h3>
                      <p className="text-foreground-secondary mb-6">
                        Comprehensive diagnostic reports and patient outcome analysis
                      </p>
                      <Button className="bg-gradient-primary glow-primary">
                        View Diagnostic Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance">
                <Card className="glass border-border-strong">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      AI Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                      <p className="text-foreground-secondary mb-6">
                        AI agent performance, accuracy metrics, and optimization insights
                      </p>
                      <Button className="bg-gradient-primary glow-primary">
                        View Performance Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="glass border-border-strong">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      System Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">System Insights</h3>
                      <p className="text-foreground-secondary mb-6">
                        Usage patterns, system health, and operational analytics
                      </p>
                      <Button className="bg-gradient-primary glow-primary">
                        View Analytics Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;