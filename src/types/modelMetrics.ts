export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latency: number;
  throughput: number;
  confidenceScore: number;
  driftScore: number;
  predictionCount: number;
  errorRate: number;
}

export interface ModelPerformanceData {
  timestamp: string;
  accuracy: number;
  latency: number;
  throughput: number;
  drift: number;
  confidence: number;
  predictions: number;
}

export interface DriftAlert {
  id: string;
  modelName: string;
  driftType: 'data' | 'concept' | 'prediction';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
  threshold: number;
  currentValue: number;
}

export interface FeedbackEntry {
  id: string;
  predictionId: string;
  actualValue: any;
  predictedValue: any;
  confidence: number;
  timestamp: string;
  isCorrect: boolean;
  userFeedback?: string;
}