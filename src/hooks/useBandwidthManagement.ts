import { useState, useEffect } from 'react';
import { BandwidthMetrics, BandwidthRule, BandwidthUsage, TrafficShapingPolicy } from '../types/bandwidthManagement';

export const useBandwidthManagement = () => {
  const [bandwidthMetrics, setBandwidthMetrics] = useState<BandwidthMetrics>({
    totalBandwidth: 10000, // 10 Gbps
    allocatedBandwidth: 7850,
    availableBandwidth: 2150,
    utilizationPercentage: 78.5,
    activeRules: 24,
    violatingEntities: 3,
    aiTrafficAllocation: 3500,
    aiTrafficUsage: 2847,
    topConsumers: [
      {
        entityId: '192.168.1.105',
        entityType: 'ip',
        entityName: 'ai-inference-01',
        currentUsage: 856.3,
        allocatedBandwidth: 1000,
        utilizationPercentage: 85.6,
        peakUsage: 987.4,
        averageUsage: 743.2,
        totalBytes: 2456789012,
        ruleId: 'rule_ai_001',
        isViolating: false,
        violationDuration: 0,
        isAITraffic: true,
        qosClass: 'premium'
      },
      {
        entityId: '192.168.1.110',
        entityType: 'ip',
        entityName: 'ml-training-02',
        currentUsage: 1247.8,
        allocatedBandwidth: 1200,
        utilizationPercentage: 104.0,
        peakUsage: 1456.7,
        averageUsage: 892.3,
        totalBytes: 5678901234,
        ruleId: 'rule_ai_002',
        isViolating: true,
        violationDuration: 180,
        lastViolation: '2 min ago',
        isAITraffic: true,
        qosClass: 'premium'
      },
      {
        entityId: '192.168.1.50',
        entityType: 'ip',
        entityName: 'web-server-01',
        currentUsage: 425.8,
        allocatedBandwidth: 500,
        utilizationPercentage: 85.2,
        peakUsage: 567.3,
        averageUsage: 387.9,
        totalBytes: 1234567890,
        ruleId: 'rule_web_001',
        isViolating: false,
        violationDuration: 0,
        isAITraffic: false,
        qosClass: 'business'
      },
      {
        entityId: 'video_streaming',
        entityType: 'application',
        entityName: 'Video Streaming',
        currentUsage: 1567.2,
        allocatedBandwidth: 1500,
        utilizationPercentage: 104.5,
        peakUsage: 1789.4,
        averageUsage: 1234.5,
        totalBytes: 8901234567,
        ruleId: 'rule_video_001',
        isViolating: true,
        violationDuration: 420,
        lastViolation: '7 min ago',
        isAITraffic: false,
        qosClass: 'standard'
      },
      {
        entityId: 'backup_service',
        entityType: 'application',
        entityName: 'Backup Service',
        currentUsage: 234.7,
        allocatedBandwidth: 200,
        utilizationPercentage: 117.4,
        peakUsage: 345.6,
        averageUsage: 156.8,
        totalBytes: 3456789012,
        ruleId: 'rule_backup_001',
        isViolating: true,
        violationDuration: 600,
        lastViolation: '10 min ago',
        isAITraffic: false,
        qosClass: 'background'
      }
    ],
    recentViolations: [
      {
        entityId: '192.168.1.110',
        entityName: 'ml-training-02',
        violationType: 'exceeded_limit',
        timestamp: '2 min ago',
        severity: 'major'
      },
      {
        entityId: 'video_streaming',
        entityName: 'Video Streaming',
        violationType: 'burst_violation',
        timestamp: '7 min ago',
        severity: 'minor'
      },
      {
        entityId: 'backup_service',
        entityName: 'Backup Service',
        violationType: 'time_restriction',
        timestamp: '10 min ago',
        severity: 'minor'
      }
    ],
    shapingPolicies: [
      {
        id: 'policy_ai_premium',
        name: 'AI Premium Traffic',
        description: 'High priority shaping for AI workloads',
        algorithm: 'htb',
        parameters: {
          rate: '3500mbit',
          ceil: '5000mbit',
          burst: '50k'
        },
        classId: '1:10',
        filters: {
          protocol: 'AI_MODEL',
          dscp: 46
        },
        isActive: true,
        statistics: {
          packetsProcessed: 2456789,
          bytesProcessed: 5678901234,
          droppedPackets: 1234,
          queueLength: 45
        }
      },
      {
        id: 'policy_business_critical',
        name: 'Business Critical Applications',
        description: 'Medium priority for business applications',
        algorithm: 'htb',
        parameters: {
          rate: '2000mbit',
          ceil: '3000mbit',
          burst: '30k'
        },
        classId: '1:20',
        filters: {
          protocol: 'HTTPS',
          dscp: 34
        },
        isActive: true,
        statistics: {
          packetsProcessed: 1234567,
          bytesProcessed: 2345678901,
          droppedPackets: 567,
          queueLength: 23
        }
      },
      {
        id: 'policy_background',
        name: 'Background Traffic',
        description: 'Low priority for background services',
        algorithm: 'htb',
        parameters: {
          rate: '500mbit',
          ceil: '1000mbit',
          burst: '15k'
        },
        classId: '1:30',
        filters: {
          dscp: 8
        },
        isActive: true,
        statistics: {
          packetsProcessed: 567890,
          bytesProcessed: 890123456,
          droppedPackets: 2345,
          queueLength: 67
        }
      }
    ],
    enforcementStats: {
      rulesEnforced: 24,
      packetsDropped: 4146,
      connectionsThrottled: 89,
      bytesShapped: 8901234567
    }
  });

  const [bandwidthRules, setBandwidthRules] = useState<BandwidthRule[]>([
    {
      id: 'rule_ai_001',
      name: 'AI Inference Priority',
      type: 'ip',
      target: '192.168.1.105',
      priority: 1,
      guaranteedBandwidth: 800,
      maxBandwidth: 1000,
      burstBandwidth: 1200,
      isActive: true,
      isAIOptimized: true,
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      enforcementMethod: 'tc',
      violationCount: 0,
      bytesTransferred: 2456789012
    },
    {
      id: 'rule_ai_002',
      name: 'ML Training Allocation',
      type: 'ip',
      target: '192.168.1.110',
      priority: 2,
      guaranteedBandwidth: 1000,
      maxBandwidth: 1200,
      burstBandwidth: 1500,
      timeRestrictions: {
        startTime: '22:00',
        endTime: '06:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      isActive: true,
      isAIOptimized: true,
      createdAt: '2024-01-10',
      lastModified: '2024-01-18',
      enforcementMethod: 'tc',
      violationCount: 3,
      bytesTransferred: 5678901234
    },
    {
      id: 'rule_web_001',
      name: 'Web Server Limit',
      type: 'application',
      target: 'web_traffic',
      priority: 5,
      maxBandwidth: 500,
      isActive: true,
      isAIOptimized: false,
      createdAt: '2024-01-12',
      lastModified: '2024-01-19',
      enforcementMethod: 'iptables',
      violationCount: 1,
      bytesTransferred: 1234567890
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidthMetrics(prev => ({
        ...prev,
        utilizationPercentage: Math.max(60, Math.min(95, prev.utilizationPercentage + (Math.random() - 0.5) * 5)),
        aiTrafficUsage: Math.max(2000, Math.min(4000, prev.aiTrafficUsage + (Math.random() - 0.5) * 200)),
        violatingEntities: Math.max(0, Math.min(8, prev.violatingEntities + Math.floor((Math.random() - 0.7) * 2))),
        topConsumers: prev.topConsumers.map(consumer => ({
          ...consumer,
          currentUsage: Math.max(50, consumer.currentUsage + (Math.random() - 0.5) * 100),
          utilizationPercentage: Math.max(0, Math.min(150, consumer.utilizationPercentage + (Math.random() - 0.5) * 10))
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createBandwidthRule = (rule: Omit<BandwidthRule, 'id' | 'createdAt' | 'violationCount' | 'bytesTransferred'>) => {
    const newRule: BandwidthRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      violationCount: 0,
      bytesTransferred: 0
    };
    setBandwidthRules(prev => [...prev, newRule]);
    setBandwidthMetrics(prev => ({ ...prev, activeRules: prev.activeRules + 1 }));
  };

  const updateBandwidthRule = (ruleId: string, updates: Partial<BandwidthRule>) => {
    setBandwidthRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates, lastModified: new Date().toISOString().split('T')[0] } : rule
    ));
  };

  const deleteBandwidthRule = (ruleId: string) => {
    setBandwidthRules(prev => prev.filter(rule => rule.id !== ruleId));
    setBandwidthMetrics(prev => ({ ...prev, activeRules: Math.max(0, prev.activeRules - 1) }));
  };

  const enforceRule = (ruleId: string) => {
    setBandwidthRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: true } : rule
    ));
  };

  const suspendRule = (ruleId: string) => {
    setBandwidthRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: false } : rule
    ));
  };

  return {
    bandwidthMetrics,
    bandwidthRules,
    createBandwidthRule,
    updateBandwidthRule,
    deleteBandwidthRule,
    enforceRule,
    suspendRule
  };
};