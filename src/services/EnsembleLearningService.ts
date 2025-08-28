import { ModelMetrics, ModelPerformanceData } from '../types/modelMetrics';

export interface EnsemblePrediction {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  contributingModels: string[];
  featureImportance: Map<string, number>;
  explanation: string;
}

export interface ModelPrediction {
  modelName: string;
  prediction: number;
  confidence: number;
  features: string[];
}

export interface NetworkData {
  trafficVolume: number;
  packetSize: number;
  protocol: string;
  sourceIP: string;
  destinationIP: string;
  port: number;
  flags: string[];
  timestamp: number;
}

export class EnsembleLearningService {
  private models: Map<string, AIModel> = new Map();
  private votingWeights: Map<string, number> = new Map();
  private featureScaler: FeatureScaler;

  constructor() {
    this.initializeModels();
    this.featureScaler = new FeatureScaler();
  }

  private initializeModels() {
    // Initialize ensemble models with different algorithms
    this.models.set('xgboost', new XGBoostModel());
    this.models.set('randomForest', new RandomForestModel());
    this.models.set('neuralNetwork', new NeuralNetworkModel());
    this.models.set('isolationForest', new IsolationForestModel());

    // Set voting weights based on historical performance
    this.votingWeights.set('xgboost', 0.35);
    this.votingWeights.set('randomForest', 0.25);
    this.votingWeights.set('neuralNetwork', 0.25);
    this.votingWeights.set('isolationForest', 0.15);
  }

  async predictThreatLevel(input: NetworkData): Promise<EnsemblePrediction> {
    try {
      const scaledFeatures = this.featureScaler.scale(input);
      const predictions = await this.getAllPredictions(scaledFeatures);
      const ensembleResult = this.weightedVoting(predictions);
      const featureImportance = this.calculateFeatureImportance(predictions);
      
      return {
        threatLevel: this.mapToThreatLevel(ensembleResult.score),
        confidence: ensembleResult.confidence,
        contributingModels: ensembleResult.models,
        featureImportance,
        explanation: this.generateExplanation(ensembleResult, featureImportance)
      };
    } catch (error) {
      console.error('Ensemble prediction error:', error);
      throw new Error('Failed to generate ensemble prediction');
    }
  }

  private async getAllPredictions(features: number[]): Promise<ModelPrediction[]> {
    const predictions: ModelPrediction[] = [];
    
    for (const [modelName, model] of this.models) {
      const prediction = await model.predict(features);
      predictions.push({
        modelName,
        prediction: prediction.score,
        confidence: prediction.confidence,
        features: model.getFeatureNames()
      });
    }
    
    return predictions;
  }

  private weightedVoting(predictions: ModelPrediction[]): { score: number; confidence: number; models: string[] } {
    let weightedScore = 0;
    let totalConfidence = 0;
    const contributingModels: string[] = [];

    predictions.forEach(pred => {
      const weight = this.votingWeights.get(pred.modelName) || 0;
      weightedScore += pred.prediction * weight * pred.confidence;
      totalConfidence += weight * pred.confidence;
      contributingModels.push(pred.modelName);
    });

    return {
      score: weightedScore / totalConfidence,
      confidence: totalConfidence,
      models: contributingModels
    };
  }

  private calculateFeatureImportance(predictions: ModelPrediction[]): Map<string, number> {
    const importanceMap = new Map<string, number>();
    
    predictions.forEach(pred => {
      const weight = this.votingWeights.get(pred.modelName) || 0;
      pred.features.forEach(feature => {
        const current = importanceMap.get(feature) || 0;
        importanceMap.set(feature, current + (weight * pred.confidence));
      });
    });

    return importanceMap;
  }

  private mapToThreatLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 0.3) return 'low';
    if (score < 0.6) return 'medium';
    if (score < 0.8) return 'high';
    return 'critical';
  }

  private generateExplanation(result: any, featureImportance: Map<string, number>): string {
    const topFeatures = Array.from(featureImportance.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return `Ensemble prediction based on ${result.models.length} models. 
            Primary contributing factors: ${topFeatures.map(f => f[0]).join(', ')}. 
            Overall confidence: ${(result.confidence * 100).toFixed(1)}%`;
  }

  async updateModelWeights(modelName: string, newWeight: number): Promise<void> {
    if (newWeight < 0 || newWeight > 1) {
      throw new Error('Weight must be between 0 and 1');
    }
    this.votingWeights.set(modelName, newWeight);
  }

  getModelPerformance(): Map<string, ModelMetrics> {
    const performance = new Map<string, ModelMetrics>();
    
    for (const [modelName, model] of this.models) {
      performance.set(modelName, model.getPerformance());
    }
    
    return performance;
  }
}

// Base AI Model Interface
interface AIModel {
  predict(features: number[]): Promise<{ score: number; confidence: number }>;
  getFeatureNames(): string[];
  getPerformance(): ModelMetrics;
}

// Individual Model Implementations
class XGBoostModel implements AIModel {
  async predict(features: number[]): Promise<{ score: number; confidence: number }> {
    // Simulate XGBoost prediction
    const score = Math.tanh(features.reduce((sum, val) => sum + val, 0) / features.length);
    const confidence = 0.85 + Math.random() * 0.15;
    return { score: Math.abs(score), confidence };
  }

  getFeatureNames(): string[] {
    return ['traffic_volume', 'packet_size', 'port_frequency', 'protocol_anomaly'];
  }

  getPerformance(): ModelMetrics {
    return {
      accuracy: 95.8,
      precision: 94.2,
      recall: 96.1,
      f1Score: 95.1,
      latency: 35,
      throughput: 1400,
      confidenceScore: 89.5,
      driftScore: 0.08,
      predictionCount: 15847,
      errorRate: 4.2
    };
  }
}

class RandomForestModel implements AIModel {
  async predict(features: number[]): Promise<{ score: number; confidence: number }> {
    // Simulate Random Forest prediction
    const score = features.reduce((sum, val) => sum + val * Math.random(), 0) / features.length;
    const confidence = 0.80 + Math.random() * 0.20;
    return { score: Math.min(1, score), confidence };
  }

  getFeatureNames(): string[] {
    return ['source_ip_reputation', 'destination_ip_reputation', 'time_based_patterns', 'flow_characteristics'];
  }

  getPerformance(): ModelMetrics {
    return {
      accuracy: 93.5,
      precision: 91.8,
      recall: 94.2,
      f1Score: 93.0,
      latency: 42,
      throughput: 1200,
      confidenceScore: 85.2,
      driftScore: 0.11,
      predictionCount: 15847,
      errorRate: 6.5
    };
  }
}

class NeuralNetworkModel implements AIModel {
  async predict(features: number[]): Promise<{ score: number; confidence: number }> {
    // Simulate Neural Network prediction
    const score = Math.sigmoid(features.reduce((sum, val) => sum + val * 0.5, 0));
    const confidence = 0.88 + Math.random() * 0.12;
    return { score, confidence };
  }

  getFeatureNames(): string[] {
    return ['behavioral_patterns', 'anomaly_scores', 'historical_baselines', 'contextual_features'];
  }

  getPerformance(): ModelMetrics {
    return {
      accuracy: 94.8,
      precision: 93.5,
      recall: 95.2,
      f1Score: 94.3,
      latency: 38,
      throughput: 1350,
      confidenceScore: 88.7,
      driftScore: 0.09,
      predictionCount: 15847,
      errorRate: 5.2
    };
  }
}

class IsolationForestModel implements AIModel {
  async predict(features: number[]): Promise<{ score: number; confidence: number }> {
    // Simulate Isolation Forest anomaly detection
    const anomalyScore = Math.abs(features.reduce((sum, val) => sum + val, 0) - features.length * 0.5);
    const score = Math.min(1, anomalyScore / features.length);
    const confidence = 0.82 + Math.random() * 0.18;
    return { score, confidence };
  }

  getFeatureNames(): string[] {
    return ['isolation_score', 'anomaly_distance', 'cluster_separation', 'outlier_detection'];
  }

  getPerformance(): ModelMetrics {
    return {
      accuracy: 92.1,
      precision: 90.5,
      recall: 93.8,
      f1Score: 92.1,
      latency: 55,
      throughput: 1100,
      confidenceScore: 82.3,
      driftScore: 0.15,
      predictionCount: 15847,
      errorRate: 7.9
    };
  }
}

// Feature scaling utility
class FeatureScaler {
  private means: number[] = [];
  private stds: number[] = [];

  constructor() {
    // Initialize with typical network data ranges
    this.means = [1000, 500, 80, 0.5];
    this.stds = [500, 200, 40, 0.2];
  }

  scale(input: NetworkData): number[] {
    const features = [
      input.trafficVolume,
      input.packetSize,
      input.port,
      input.timestamp % 86400 / 86400 // Time of day normalized
    ];

    return features.map((val, idx) => (val - this.means[idx]) / this.stds[idx]);
  }
}

// Math utilities
const MathUtils = {
  sigmoid: (x: number): number => 1 / (1 + Math.exp(-x)),
  tanh: (x: number): number => Math.tanh(x)
};
