export interface TrafficFlow {
  id: string;
  sourceIP: string;
  destinationIP: string;
  protocol: 'HTTP' | 'HTTPS' | 'FTP' | 'SSH' | 'DNS' | 'SMTP' | 'TCP' | 'UDP' | 'AI_MODEL' | 'OTHER';
  port: number;
  bandwidth: number; // Mbps
  packets: number;
  bytes: number;
  duration: number; // seconds
  priority: 'critical' | 'high' | 'medium' | 'low';
  qosClass: 'AI_TRAFFIC' | 'BUSINESS_CRITICAL' | 'STANDARD' | 'BACKGROUND';
  applicationName?: string;
  isAITraffic: boolean;
  timestamp: string;
}

export interface ApplicationTraffic {
  name: string;
  bandwidth: number;
  percentage: number;
  protocol: string;
  connections: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isAIRelated: boolean;
}

export interface IPTrafficSummary {
  ip: string;
  hostname?: string;
  totalBandwidth: number;
  inbound: number;
  outbound: number;
  connections: number;
  topProtocols: string[];
  isAINode: boolean;
  location?: string;
}

export interface QoSPolicy {
  id: string;
  name: string;
  priority: number;
  bandwidthLimit?: number;
  bandwidthGuarantee?: number;
  protocols: string[];
  sourceIPs: string[];
  destinationIPs: string[];
  applications: string[];
  isActive: boolean;
  aiTrafficOptimized: boolean;
}

export interface TrafficMetrics {
  totalBandwidth: number;
  aiTrafficBandwidth: number;
  protocolDistribution: Record<string, number>;
  topApplications: ApplicationTraffic[];
  topIPs: IPTrafficSummary[];
  activeFlows: TrafficFlow[];
  qosPolicies: QoSPolicy[];
  aiTrafficPercentage: number;
  criticalTrafficHealth: 'excellent' | 'good' | 'degraded' | 'critical';
}