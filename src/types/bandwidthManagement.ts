export interface BandwidthRule {
  id: string;
  name: string;
  type: 'user' | 'ip' | 'application' | 'protocol' | 'ai_workload';
  target: string; // IP, user ID, application name, etc.
  priority: number; // 1-10, 1 being highest
  guaranteedBandwidth?: number; // Mbps
  maxBandwidth?: number; // Mbps
  burstBandwidth?: number; // Mbps
  timeRestrictions?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
  isActive: boolean;
  isAIOptimized: boolean;
  createdAt: string;
  lastModified: string;
  enforcementMethod: 'tc' | 'iptables' | 'custom' | 'hardware';
  violationCount: number;
  bytesTransferred: number;
}

export interface BandwidthUsage {
  entityId: string;
  entityType: 'ip' | 'user' | 'application' | 'protocol';
  entityName: string;
  currentUsage: number; // Mbps
  allocatedBandwidth: number; // Mbps
  utilizationPercentage: number;
  peakUsage: number;
  averageUsage: number;
  totalBytes: number;
  ruleId?: string;
  isViolating: boolean;
  violationDuration: number; // seconds
  lastViolation?: string;
  isAITraffic: boolean;
  qosClass: 'premium' | 'business' | 'standard' | 'background';
}

export interface TrafficShapingPolicy {
  id: string;
  name: string;
  description: string;
  algorithm: 'htb' | 'cbq' | 'tbf' | 'sfq' | 'fq_codel';
  parameters: {
    rate?: string; // e.g., "100mbit"
    ceil?: string; // e.g., "200mbit"
    burst?: string; // e.g., "15k"
    quantum?: number;
    perturb?: number;
  };
  classId: string;
  parentClassId?: string;
  filters: {
    protocol?: string;
    sourceIP?: string;
    destinationIP?: string;
    port?: number;
    dscp?: number;
  };
  isActive: boolean;
  statistics: {
    packetsProcessed: number;
    bytesProcessed: number;
    droppedPackets: number;
    queueLength: number;
  };
}

export interface BandwidthMetrics {
  totalBandwidth: number;
  allocatedBandwidth: number;
  availableBandwidth: number;
  utilizationPercentage: number;
  activeRules: number;
  violatingEntities: number;
  aiTrafficAllocation: number;
  aiTrafficUsage: number;
  topConsumers: BandwidthUsage[];
  recentViolations: Array<{
    entityId: string;
    entityName: string;
    violationType: 'exceeded_limit' | 'burst_violation' | 'time_restriction';
    timestamp: string;
    severity: 'minor' | 'major' | 'critical';
  }>;
  shapingPolicies: TrafficShapingPolicy[];
  enforcementStats: {
    rulesEnforced: number;
    packetsDropped: number;
    connectionsThrottled: number;
    bytesShapped: number;
  };
}

export interface BandwidthAllocationRequest {
  entityType: 'ip' | 'user' | 'application' | 'protocol';
  entityId: string;
  requestedBandwidth: number;
  priority: number;
  duration?: number; // minutes, undefined for permanent
  justification: string;
  isAIWorkload: boolean;
}