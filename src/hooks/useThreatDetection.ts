import { useState, useEffect } from 'react';
import { SecurityMetrics, ThreatAlert, BehaviorProfile, MLModel, NetworkAnomaly } from '../types/threatDetection';

export const useThreatDetection = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalThreats: 1247,
    activeThreats: 8,
    resolvedThreats: 1239,
    falsePositives: 23,
    threatsByType: {
      'intrusion': 342,
      'ddos': 156,
      'anomaly': 489,
      'malware': 89,
      'data_exfiltration': 67,
      'brute_force': 78,
      'port_scan': 26
    },
    threatsBySeverity: {
      'critical': 45,
      'high': 234,
      'medium': 567,
      'low': 401
    },
    detectionAccuracy: 94.7,
    responseTime: 2.3,
    aiProtectedAssets: 15,
    behaviorProfiles: [
      {
        entityId: '192.168.1.105',
        entityType: 'ip',
        entityName: 'ai-inference-01',
        baselineMetrics: {
          avgBandwidth: 850,
          avgConnections: 245,
          commonPorts: [8080, 9090, 443],
          commonProtocols: ['AI_MODEL', 'TCP', 'HTTPS'],
          typicalHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          geographicPattern: ['Data Center A']
        },
        currentMetrics: {
          bandwidth: 856,
          connections: 247,
          activePorts: [8080, 9090, 443],
          protocols: ['AI_MODEL', 'TCP'],
          currentHour: 14,
          location: 'Data Center A'
        },
        anomalyScore: 0.12,
        lastUpdated: '2 min ago',
        isAIEntity: true
      },
      {
        entityId: '192.168.1.50',
        entityType: 'ip',
        entityName: 'web-server-01',
        baselineMetrics: {
          avgBandwidth: 420,
          avgConnections: 900,
          commonPorts: [80, 443],
          commonProtocols: ['HTTP', 'HTTPS'],
          typicalHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
          geographicPattern: ['DMZ']
        },
        currentMetrics: {
          bandwidth: 425,
          connections: 934,
          activePorts: [80, 443],
          protocols: ['HTTPS', 'HTTP'],
          currentHour: 14,
          location: 'DMZ'
        },
        anomalyScore: 0.08,
        lastUpdated: '1 min ago',
        isAIEntity: false
      }
    ],
    mlModels: [
      {
        id: 'model_001',
        name: 'Deep Packet Inspection AI',
        type: 'intrusion_detection',
        status: 'active',
        accuracy: 96.2,
        precision: 94.8,
        recall: 97.1,
        f1Score: 95.9,
        lastTrained: '2 days ago',
        trainingDataSize: 2500000,
        detectionRate: 98.3,
        falsePositiveRate: 1.7,
        threatsCaught: 342,
        isAIOptimized: true
      },
      {
        id: 'model_002',
        name: 'Behavioral Anomaly Detector',
        type: 'anomaly_detection',
        status: 'active',
        accuracy: 92.4,
        precision: 89.7,
        recall: 94.8,
        f1Score: 92.2,
        lastTrained: '1 day ago',
        trainingDataSize: 1800000,
        detectionRate: 95.6,
        falsePositiveRate: 4.4,
        threatsCaught: 489,
        isAIOptimized: true
      },
      {
        id: 'model_003',
        name: 'DDoS Pattern Recognition',
        type: 'ddos_detection',
        status: 'active',
        accuracy: 98.1,
        precision: 97.3,
        recall: 98.9,
        f1Score: 98.1,
        lastTrained: '3 hours ago',
        trainingDataSize: 950000,
        detectionRate: 99.2,
        falsePositiveRate: 0.8,
        threatsCaught: 156,
        isAIOptimized: true
      },
      {
        id: 'model_004',
        name: 'AI Traffic Guardian',
        type: 'behavior_analysis',
        status: 'training',
        accuracy: 94.7,
        precision: 92.1,
        recall: 96.8,
        f1Score: 94.4,
        lastTrained: '6 hours ago',
        trainingDataSize: 3200000,
        detectionRate: 96.8,
        falsePositiveRate: 3.2,
        threatsCaught: 234,
        isAIOptimized: true
      }
    ],
    recentAlerts: [
      {
        id: 'alert_001',
        type: 'intrusion',
        severity: 'critical',
        title: 'Potential SQL Injection Attack',
        description: 'Suspicious SQL patterns detected in HTTP requests to web server',
        sourceIP: '203.0.113.45',
        targetIP: '192.168.1.50',
        timestamp: '2 min ago',
        confidence: 0.94,
        riskScore: 8.7,
        status: 'active',
        affectedAssets: ['web-server-01', 'database-01'],
        mitigationActions: ['Block source IP', 'Enable WAF rules', 'Alert security team'],
        evidenceData: {
          packetCount: 1247,
          byteCount: 89456,
          duration: 180,
          protocols: ['HTTP', 'TCP'],
          ports: [80, 443]
        }
      },
      {
        id: 'alert_002',
        type: 'ddos',
        severity: 'high',
        title: 'DDoS Attack Detected',
        description: 'Volumetric attack targeting AI inference servers',
        sourceIP: '198.51.100.0/24',
        targetIP: '192.168.1.105',
        timestamp: '5 min ago',
        confidence: 0.98,
        riskScore: 7.9,
        status: 'investigating',
        affectedAssets: ['ai-inference-01', 'load-balancer-01'],
        mitigationActions: ['Rate limiting activated', 'Traffic scrubbing enabled', 'Failover initiated'],
        evidenceData: {
          packetCount: 45672,
          byteCount: 2345678,
          duration: 300,
          protocols: ['UDP', 'TCP'],
          ports: [8080, 9090]
        }
      },
      {
        id: 'alert_003',
        type: 'anomaly',
        severity: 'medium',
        title: 'Unusual AI Model Access Pattern',
        description: 'AI inference requests from unexpected geographic location',
        sourceIP: '185.199.108.153',
        targetIP: '192.168.1.105',
        timestamp: '8 min ago',
        confidence: 0.76,
        riskScore: 5.4,
        status: 'active',
        affectedAssets: ['ai-inference-01'],
        mitigationActions: ['Geographic filtering', 'Enhanced monitoring', 'User verification'],
        evidenceData: {
          packetCount: 234,
          byteCount: 12456,
          duration: 120,
          protocols: ['AI_MODEL', 'HTTPS'],
          ports: [8080, 443]
        }
      }
    ]
  });

  const [networkAnomalies, setNetworkAnomalies] = useState<NetworkAnomaly[]>([
    {
      id: 'anomaly_001',
      type: 'ai_model_anomaly',
      description: 'AI inference latency 300% above baseline',
      severity: 'high',
      confidence: 0.89,
      timestamp: '3 min ago',
      affectedEntities: ['ai-inference-01', 'ml-training-02'],
      baselineDeviation: 3.2,
      isAIRelated: true
    },
    {
      id: 'anomaly_002',
      type: 'traffic_spike',
      description: 'Unusual traffic volume to database server',
      severity: 'medium',
      confidence: 0.72,
      timestamp: '7 min ago',
      affectedEntities: ['database-01'],
      baselineDeviation: 2.1,
      isAIRelated: false
    },
    {
      id: 'anomaly_003',
      type: 'off_hours_activity',
      description: 'AI model training activity during maintenance window',
      severity: 'low',
      confidence: 0.65,
      timestamp: '12 min ago',
      affectedEntities: ['ml-training-02'],
      baselineDeviation: 1.8,
      isAIRelated: true
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time threat detection updates
      setSecurityMetrics(prev => ({
        ...prev,
        activeThreats: Math.max(0, prev.activeThreats + Math.floor((Math.random() - 0.7) * 3)),
        detectionAccuracy: Math.max(90, Math.min(99, prev.detectionAccuracy + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(1, prev.responseTime + (Math.random() - 0.5) * 0.5),
        behaviorProfiles: prev.behaviorProfiles.map(profile => ({
          ...profile,
          anomalyScore: Math.max(0, Math.min(1, profile.anomalyScore + (Math.random() - 0.5) * 0.1)),
          currentMetrics: {
            ...profile.currentMetrics,
            bandwidth: Math.max(0, profile.currentMetrics.bandwidth + (Math.random() - 0.5) * 50),
            connections: Math.max(0, profile.currentMetrics.connections + Math.floor((Math.random() - 0.5) * 20))
          }
        }))
      }));

      // Update ML model metrics
      setSecurityMetrics(prev => ({
        ...prev,
        mlModels: prev.mlModels.map(model => ({
          ...model,
          accuracy: Math.max(85, Math.min(99, model.accuracy + (Math.random() - 0.5) * 1)),
          detectionRate: Math.max(90, Math.min(99.5, model.detectionRate + (Math.random() - 0.5) * 0.5)),
          falsePositiveRate: Math.max(0.1, Math.min(10, model.falsePositiveRate + (Math.random() - 0.5) * 0.3))
        }))
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setSecurityMetrics(prev => ({
      ...prev,
      recentAlerts: prev.recentAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'investigating' as const } : alert
      )
    }));
  };

  const resolveAlert = (alertId: string) => {
    setSecurityMetrics(prev => ({
      ...prev,
      recentAlerts: prev.recentAlerts.map(alert =>
        alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
      ),
      activeThreats: Math.max(0, prev.activeThreats - 1),
      resolvedThreats: prev.resolvedThreats + 1
    }));
  };

  return {
    securityMetrics,
    networkAnomalies,
    acknowledgeAlert,
    resolveAlert
  };
};