import { azureConfig } from './azure-config';

interface ComputerVisionAnalysis {
  description: {
    captions: Array<{
      text: string;
      confidence: number;
    }>;
  };
  objects: Array<{
    objectProperty: string;
    confidence: number;
    rectangle: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }>;
  tags: Array<{
    name: string;
    confidence: number;
  }>;
}

interface MedicalImageAnalysis {
  findings: string[];
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  description: string;
}

export class AzureComputerVisionService {
  private endpoint: string;
  private subscriptionKey: string;

  constructor() {
    this.endpoint = azureConfig.computerVision.endpoint;
    this.subscriptionKey = azureConfig.computerVision.subscriptionKey;
  }

  async analyzeImage(imageUrl: string): Promise<ComputerVisionAnalysis> {
    try {
      const url = `${this.endpoint}vision/v3.2/analyze?visualFeatures=Description,Objects,Tags&details=Landmarks&language=en`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
        body: JSON.stringify({
          url: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Computer Vision API error: ${response.status} ${response.statusText}`);
      }

      const data: ComputerVisionAnalysis = await response.json();
      return data;
    } catch (error) {
      console.error('Computer Vision Service Error:', error);
      throw error;
    }
  }

  async analyzeImageFromFile(file: File): Promise<ComputerVisionAnalysis> {
    try {
      const url = `${this.endpoint}vision/v3.2/analyze?visualFeatures=Description,Objects,Tags&details=Landmarks&language=en`;
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Computer Vision API error: ${response.status} ${response.statusText}`);
      }

      const data: ComputerVisionAnalysis = await response.json();
      return data;
    } catch (error) {
      console.error('Computer Vision Service Error:', error);
      throw error;
    }
  }

  // Specialized method for medical image analysis
  async analyzeMedicalImage(imageUrl: string, imageType: 'xray' | 'ct' | 'mri' | 'ultrasound'): Promise<MedicalImageAnalysis> {
    try {
      const analysis = await this.analyzeImage(imageUrl);
      
      // Process the analysis results through a medical lens
      const medicalAnalysis = this.interpretMedicalFindings(analysis, imageType);
      
      return medicalAnalysis;
    } catch (error) {
      console.error('Medical Image Analysis Error:', error);
      throw error;
    }
  }

  private interpretMedicalFindings(analysis: ComputerVisionAnalysis, imageType: string): MedicalImageAnalysis {
    const medicalKeywords = {
      xray: ['chest', 'lung', 'rib', 'heart', 'spine', 'bone', 'fracture', 'pneumonia', 'opacity'],
      ct: ['brain', 'abdomen', 'contrast', 'mass', 'lesion', 'hemorrhage', 'tumor'],
      mri: ['brain', 'spine', 'joint', 'muscle', 'ligament', 'disc', 'inflammation'],
      ultrasound: ['organ', 'vessel', 'fluid', 'mass', 'echogenic', 'hypoechoic']
    };

    const findings: string[] = [];
    let totalConfidence = 0;
    let confidenceCount = 0;

    // Analyze captions for medical relevance
    analysis.description.captions.forEach(caption => {
      const relevantKeywords = medicalKeywords[imageType as keyof typeof medicalKeywords] || [];
      const hasRelevantKeywords = relevantKeywords.some(keyword => 
        caption.text.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (hasRelevantKeywords) {
        findings.push(`Image shows: ${caption.text}`);
        totalConfidence += caption.confidence;
        confidenceCount++;
      }
    });

    // Analyze tags for abnormalities
    analysis.tags.forEach(tag => {
      if (tag.confidence > 0.7) {
        const abnormalityKeywords = ['abnormal', 'lesion', 'mass', 'fracture', 'inflammation', 'infection'];
        const isAbnormal = abnormalityKeywords.some(keyword => 
          tag.name.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (isAbnormal) {
          findings.push(`Detected abnormality: ${tag.name} (${(tag.confidence * 100).toFixed(1)}% confidence)`);
          totalConfidence += tag.confidence;
          confidenceCount++;
        }
      }
    });

    // Calculate average confidence
    const avgConfidence = confidenceCount > 0 ? (totalConfidence / confidenceCount) : 0.5;

    // Determine severity based on findings and confidence
    let severity: 'normal' | 'mild' | 'moderate' | 'severe' = 'normal';
    if (findings.length > 0) {
      if (avgConfidence > 0.8) severity = 'severe';
      else if (avgConfidence > 0.6) severity = 'moderate';
      else severity = 'mild';
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(findings, severity, imageType);

    return {
      findings: findings.length > 0 ? findings : [`${imageType.toUpperCase()} analysis completed - no significant abnormalities detected`],
      confidence: Math.round(avgConfidence * 100),
      severity,
      recommendations,
      description: `${imageType.toUpperCase()} image analysis using Azure Computer Vision. ${findings.length} findings detected.`
    };
  }

  private generateRecommendations(findings: string[], severity: string, imageType: string): string[] {
    const recommendations: string[] = [];

    if (severity === 'normal') {
      recommendations.push('Continue routine monitoring');
      recommendations.push('Follow standard care protocols');
    } else {
      recommendations.push('Consult with radiologist for detailed interpretation');
      
      if (severity === 'severe') {
        recommendations.push('Consider urgent clinical correlation');
        recommendations.push('Schedule immediate follow-up');
      } else if (severity === 'moderate') {
        recommendations.push('Schedule follow-up within 1-2 weeks');
        recommendations.push('Consider additional imaging if clinically indicated');
      } else {
        recommendations.push('Monitor symptoms and schedule routine follow-up');
      }
    }

    // Add image-type specific recommendations
    if (imageType === 'xray' && findings.some(f => f.includes('lung'))) {
      recommendations.push('Consider pulmonary function tests if indicated');
    }

    return recommendations;
  }
}

// Export singleton instance
export const azureComputerVisionService = new AzureComputerVisionService();