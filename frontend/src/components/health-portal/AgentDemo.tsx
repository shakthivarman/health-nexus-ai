import { useState } from "react";
import { Upload, Play, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { healthAgentsService } from "@/services/health-agents";
import { cn } from "@/lib/utils";

export const AgentDemo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoResults, setDemoResults] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const runRadiologyDemo = async () => {
    setActiveDemo('radiology');
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing with progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create a dummy image file for demo
      const dummyImageFile = new File(['dummy'], 'chest-xray.jpg', { type: 'image/jpeg' });
      
      const result = await healthAgentsService.analyzeRadiologyImage(dummyImageFile, 'xray');
      
      setProgress(100);
      setDemoResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Radiology demo error:', error);
    } finally {
      setIsProcessing(false);
      setActiveDemo(null);
    }
  };

  const runLabDemo = async () => {
    setActiveDemo('lab');
    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 150);

      const labData = {
        testType: 'Complete Blood Count (CBC)',
        patientAge: 45,
        patientSex: 'Female',
        values: [
          { parameter: 'WBC', value: 15000, unit: '/μL', referenceRange: '4,500-11,000' },
          { parameter: 'RBC', value: 4.2, unit: 'M/μL', referenceRange: '4.2-5.4' },
          { parameter: 'Hemoglobin', value: 12.5, unit: 'g/dL', referenceRange: '12.0-15.5' },
          { parameter: 'Hematocrit', value: 38, unit: '%', referenceRange: '36-46' },
          { parameter: 'Platelets', value: 350, unit: 'K/μL', referenceRange: '150-450' }
        ]
      };

      const result = await healthAgentsService.analyzeLabResults(labData);
      
      setProgress(100);
      setDemoResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Lab demo error:', error);
    } finally {
      setIsProcessing(false);
      setActiveDemo(null);
    }
  };

  const runGenomicDemo = async () => {
    setActiveDemo('genomic');
    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 8;
        });
      }, 400);

      const genomicData = {
        variants: ['BRCA1 c.5266dupC', 'APOE ε4/ε3', 'CYP2D6 *1/*4'],
        genePanel: 'Hereditary Cancer Panel',
        familyHistory: 'Maternal grandmother with breast cancer at age 55',
        ethnicity: 'European'
      };

      const result = await healthAgentsService.analyzeGenomicData(genomicData);
      
      setProgress(100);
      setDemoResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Genomic demo error:', error);
    } finally {
      setIsProcessing(false);
      setActiveDemo(null);
    }
  };

  const runPathologyDemo = async () => {
    setActiveDemo('pathology');
    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 12;
        });
      }, 300);

      const pathologyData = {
        sampleType: 'Lung Biopsy',
        findings: 'Tissue shows infiltrating adenocarcinoma with glandular pattern',
        staining: 'H&E, TTF-1 positive, CK7 positive',
        microscopyNotes: 'Moderate nuclear pleomorphism, mitotic activity present'
      };

      const result = await healthAgentsService.analyzePathologyData(pathologyData);
      
      setProgress(100);
      setDemoResults(prev => [...prev, result]);
    } catch (error) {
      console.error('Pathology demo error:', error);
    } finally {
      setIsProcessing(false);
      setActiveDemo(null);
    }
  };

  const runOrchestrationDemo = async () => {
    setActiveDemo('orchestrator');
    setIsProcessing(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 18;
        });
      }, 200);

      const insights = await healthAgentsService.orchestrateFindings();
      
      setProgress(100);
      setDemoResults(prev => [...prev, { 
        id: `orchestrator-${Date.now()}`, 
        type: 'insights', 
        data: insights,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Orchestration demo error:', error);
    } finally {
      setIsProcessing(false);
      setActiveDemo(null);
    }
  };

  const clearResults = () => {
    setDemoResults([]);
    healthAgentsService.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gradient-primary">
          🚀 Azure AI Agents Demo
        </h3>
        <Button 
          onClick={clearResults}
          variant="outline"
          size="sm"
          className="glass"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Results
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Radiology Agent Demo */}
        <Card className="card-glass p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm">🫁</span>
              </div>
              <h4 className="font-semibold">Radiology Agent</h4>
            </div>
            <p className="text-sm text-foreground-secondary">
              Analyze chest X-ray using Azure Computer Vision + OpenAI
            </p>
            <Button 
              onClick={runRadiologyDemo}
              disabled={isProcessing}
              className="w-full bg-gradient-primary glow-primary"
            >
              <Play className="h-4 w-4 mr-2" />
              Analyze X-Ray
            </Button>
          </div>
        </Card>

        {/* Lab Agent Demo */}
        <Card className="card-glass p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground text-sm">🧪</span>
              </div>
              <h4 className="font-semibold">Lab Results Agent</h4>
            </div>
            <p className="text-sm text-foreground-secondary">
              Analyze blood work using Azure OpenAI
            </p>
            <Button 
              onClick={runLabDemo}
              disabled={isProcessing}
              className="w-full bg-gradient-secondary glow-secondary"
            >
              <Play className="h-4 w-4 mr-2" />
              Analyze CBC
            </Button>
          </div>
        </Card>

        {/* Genomic Agent Demo */}
        <Card className="card-glass p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground text-sm">🧬</span>
              </div>
              <h4 className="font-semibold">Genomic Agent</h4>
            </div>
            <p className="text-sm text-foreground-secondary">
              Analyze genetic variants using Azure OpenAI
            </p>
            <Button 
              onClick={runGenomicDemo}
              disabled={isProcessing}
              className="w-full bg-gradient-accent glow-accent"
            >
              <Play className="h-4 w-4 mr-2" />
              Analyze DNA
            </Button>
          </div>
        </Card>

        {/* Pathology Agent Demo */}
        <Card className="card-glass p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
                <span className="text-warning-foreground text-sm">🔬</span>
              </div>
              <h4 className="font-semibold">Pathology Agent</h4>
            </div>
            <p className="text-sm text-foreground-secondary">
              Analyze tissue samples using Azure OpenAI
            </p>
            <Button 
              onClick={runPathologyDemo}
              disabled={isProcessing}
              className="w-full bg-gradient-warning glow-warning"
            >
              <Play className="h-4 w-4 mr-2" />
              Analyze Biopsy
            </Button>
          </div>
        </Card>

        {/* Orchestrator Demo */}
        <Card className="card-glass p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
                <span className="text-success-foreground text-sm">🧠</span>
              </div>
              <h4 className="font-semibold">Orchestrator</h4>
            </div>
            <p className="text-sm text-foreground-secondary">
              Synthesize all findings using Azure OpenAI
            </p>
            <Button 
              onClick={runOrchestrationDemo}
              disabled={isProcessing || demoResults.length === 0}
              className="w-full bg-gradient-success glow-success"
            >
              <Play className="h-4 w-4 mr-2" />
              Orchestrate
            </Button>
          </div>
        </Card>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="card-glass p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-primary-foreground text-sm">⚡</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Processing {activeDemo} analysis...
                </span>
                <span className="text-sm text-foreground-secondary">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </Card>
      )}

      {/* Demo Results */}
      {demoResults.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gradient-primary">
            ✨ Demo Results
          </h4>
          <div className="grid gap-4">
            {demoResults.map((result, index) => (
              <Card key={index} className="card-glass p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold">
                        {result.title || 'Orchestrator Analysis'}
                      </h5>
                      {result.confidence && (
                        <Badge variant="outline" className="glass">
                          {result.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground-secondary mb-2">
                      {result.description || (result.data ? 'Analysis completed successfully' : 'Processing complete')}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                      <span>Agent: {result.agent || 'Orchestrator'}</span>
                      <span>•</span>
                      <span>
                        {result.timestamp ? result.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Notice */}
      <Card className="card-glass p-4 border-l-4 border-warning">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
            <span className="text-warning-foreground text-sm">⚠️</span>
          </div>
          <div>
            <h5 className="font-semibold text-warning mb-1">Azure Configuration Required</h5>
            <p className="text-sm text-foreground-secondary">
              To use the full Azure AI capabilities, configure your Azure OpenAI and Computer Vision 
              endpoints in your environment variables. The demo will work with mock data if services are unavailable.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};