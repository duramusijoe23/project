import { useState, useEffect } from 'react';
import { ModelMetrics, ModelPerformanceData, DriftAlert, FeedbackEntry } from '../types/modelMetrics';

export const useModelMetrics = () => {
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    precision: 92.8,
    recall: 95.1,
    f1Score: 93.9,
    latency: 45,
    throughput: 1250,
    confidenceScore: 87.3,
    driftScore: 0.12,
    predictionCount: 15847,
    errorRate: 5.8
  });

  const [performanceHistory, setPerformanceHistory] = useState<ModelPerformanceData[]>([
    { timestamp: '00:00', accuracy: 94.5, latency: 42, throughput: 1200, drift: 0.08, confidence: 89.2, predictions: 1200 },
    { timestamp: '04:00', accuracy: 93.8, latency: 48, throughput: 1180, drift: 0.11, confidence: 86.5, predictions: 1180 },
    { timestamp: '08:00', accuracy: 94.1, latency: 44, throughput: 1300, drift: 0.09, confidence: 88.1, predictions: 1300 },
    { timestamp: '12:00', accuracy: 94.7, latency: 41, throughput: 1350, drift: 0.07, confidence: 90.3, predictions: 1350 },
    { timestamp: '16:00', accuracy: 93.9, latency: 46, throughput: 1220, drift: 0.13, confidence: 85.7, predictions: 1220 },
    { timestamp: '20:00', accuracy: 94.3, latency: 43, throughput: 1280, drift: 0.10, confidence: 87.9, predictions: 1280 },
    { timestamp: '24:00', accuracy: 94.2, latency: 45, throughput: 1250, drift: 0.12, confidence: 87.3, predictions: 1250 },
  ]);

  const [driftAlerts, setDriftAlerts] = useState<DriftAlert[]>([
    {
      id: '1',
      modelName: 'Network Anomaly Detector',
      driftType: 'data',
      severity: 'medium',
      timestamp: '10 min ago',
      description: 'Input data distribution has shifted beyond threshold',
      threshold: 0.15,
      currentValue: 0.18
    },
    {
      id: '2',
      modelName: 'Traffic Predictor',
      driftType: 'concept',
      severity: 'low',
      timestamp: '25 min ago',
      description: 'Model predictions showing slight concept drift',
      threshold: 0.20,
      currentValue: 0.13
    }
  ]);

  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([
    {
      id: '1',
      predictionId: 'pred_001',
      actualValue: 'anomaly',
      predictedValue: 'normal',
      confidence: 0.72,
      timestamp: '5 min ago',
      isCorrect: false,
      userFeedback: 'False negative - missed network intrusion'
    },
    {
      id: '2',
      predictionId: 'pred_002',
      actualValue: 'normal',
      predictedValue: 'normal',
      confidence: 0.94,
      timestamp: '8 min ago',
      isCorrect: true
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time model metrics updates
      setModelMetrics(prev => ({
        ...prev,
        accuracy: Math.max(85, Math.min(99, prev.accuracy + (Math.random() - 0.5) * 2)),
        latency: Math.max(20, prev.latency + (Math.random() - 0.5) * 8),
        throughput: Math.max(800, prev.throughput + (Math.random() - 0.5) * 100),
        confidenceScore: Math.max(70, Math.min(95, prev.confidenceScore + (Math.random() - 0.5) * 3)),
        driftScore: Math.max(0, Math.min(1, prev.driftScore + (Math.random() - 0.5) * 0.05)),
        predictionCount: prev.predictionCount + Math.floor(Math.random() * 50),
        errorRate: Math.max(0, Math.min(15, prev.errorRate + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    modelMetrics,
    performanceHistory,
    driftAlerts,
    feedbackEntries,
    setFeedbackEntries
  };
};