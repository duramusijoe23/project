export interface ThreatAlert {
  id: string;
  type: 'intrusion' | 'ddos' | 'anomaly' | 'malware' | 'data_exfiltration' | 'brute_force' | 'port_scan';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  sourceIP: string;
  targetIP?: string;
  timestamp: string;
  confidence: number;
  riskScore: number;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affectedAssets: string[];
  mitigationActions: string[];
  evidenceData: {
    packetCount: number;
    byteCount: number;
    duration: number;
    protocols: string[];
    ports: number[];
  };
}

export interface BehaviorProfile {
  entityId: string;
  entityType: 'ip' | 'user' | 'device' | 'application';
  entityName: string;
  baselineMetrics: {
    avgBandwidth: number;
    avgConnections: number;
    commonPorts: number[];
    commonProtocols: string[];
    typicalHours: number[];
    geographicPattern: string[];
  };
  currentMetrics: {
    bandwidth: number;
    connections: number;
    activePorts: number[];
    protocols: string[];
    currentHour: number;
    location: string;
  };
  anomalyScore: number;
  lastUpdated: string;
  isAIEntity: boolean;
}

export interface MLModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'intrusion_detection' | 'ddos_detection' | 'behavior_analysis';
  status: 'active' | 'training' | 'updating' | 'offline';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  trainingDataSize: number;
  detectionRate: number;
  falsePositiveRate: number;
  threatsCaught: number;
  isAIOptimized: boolean;
}

export interface SecurityMetrics {
  totalThreats: number;
  activeThreats: number;
  resolvedThreats: number;
  falsePositives: number;
  threatsByType: Record<string, number>;
  threatsBySeverity: Record<string, number>;
  detectionAccuracy: number;
  responseTime: number; // average in minutes
  aiProtectedAssets: number;
  behaviorProfiles: BehaviorProfile[];
  mlModels: MLModel[];
  recentAlerts: ThreatAlert[];
}

export interface NetworkAnomaly {
  id: string;
  type: 'traffic_spike' | 'unusual_protocol' | 'off_hours_activity' | 'geographic_anomaly' | 'ai_model_anomaly';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: string;
  affectedEntities: string[];
  baselineDeviation: number;
  isAIRelated: boolean;
}

export interface ThreatIntelligence {
  id: string;
  threatType: string;
  indicators: string[];
  severity: string;
  description: string;
  source: string;
  lastUpdated: string;
  isActive: boolean;
}