import { useState, useEffect } from 'react';
import { TrafficMetrics, TrafficFlow, ApplicationTraffic, IPTrafficSummary, QoSPolicy } from '../types/trafficMetrics';

export const useTrafficAnalysis = () => {
  const [trafficMetrics, setTrafficMetrics] = useState<TrafficMetrics>({
    totalBandwidth: 2847.5,
    aiTrafficBandwidth: 1423.8,
    protocolDistribution: {
      'HTTP': 35.2,
      'HTTPS': 28.7,
      'AI_MODEL': 15.8,
      'TCP': 8.4,
      'UDP': 6.2,
      'FTP': 3.1,
      'SSH': 1.8,
      'DNS': 0.8
    },
    topApplications: [
      { name: 'AI Model Inference', bandwidth: 856.3, percentage: 30.1, protocol: 'AI_MODEL', connections: 247, priority: 'critical', isAIRelated: true },
      { name: 'Web Traffic', bandwidth: 625.4, percentage: 22.0, protocol: 'HTTPS', connections: 1834, priority: 'medium', isAIRelated: false },
      { name: 'ML Training Data', bandwidth: 567.5, percentage: 19.9, protocol: 'TCP', connections: 89, priority: 'high', isAIRelated: true },
      { name: 'Database Sync', bandwidth: 341.2, percentage: 12.0, protocol: 'TCP', connections: 156, priority: 'high', isAIRelated: false },
      { name: 'File Transfer', bandwidth: 284.7, percentage: 10.0, protocol: 'FTP', connections: 45, priority: 'low', isAIRelated: false },
      { name: 'Remote Access', bandwidth: 172.4, percentage: 6.0, protocol: 'SSH', connections: 23, priority: 'medium', isAIRelated: false }
    ],
    topIPs: [
      { ip: '192.168.1.105', hostname: 'ai-inference-01', totalBandwidth: 856.3, inbound: 423.1, outbound: 433.2, connections: 247, topProtocols: ['AI_MODEL', 'TCP'], isAINode: true, location: 'Data Center A' },
      { ip: '192.168.1.110', hostname: 'ml-training-02', totalBandwidth: 567.5, inbound: 284.2, outbound: 283.3, connections: 89, topProtocols: ['TCP', 'UDP'], isAINode: true, location: 'Data Center A' },
      { ip: '192.168.1.50', hostname: 'web-server-01', totalBandwidth: 425.8, inbound: 198.4, outbound: 227.4, connections: 934, topProtocols: ['HTTPS', 'HTTP'], isAINode: false, location: 'DMZ' },
      { ip: '192.168.1.75', hostname: 'database-01', totalBandwidth: 341.2, inbound: 170.6, outbound: 170.6, connections: 156, topProtocols: ['TCP'], isAINode: false, location: 'Data Center B' },
      { ip: '192.168.1.200', hostname: 'file-server-01', totalBandwidth: 284.7, inbound: 142.3, outbound: 142.4, connections: 45, topProtocols: ['FTP', 'TCP'], isAINode: false, location: 'Storage' }
    ],
    activeFlows: [
      { id: 'flow_001', sourceIP: '192.168.1.105', destinationIP: '192.168.1.110', protocol: 'AI_MODEL', port: 8080, bandwidth: 156.3, packets: 45672, bytes: 234567890, duration: 3600, priority: 'critical', qosClass: 'AI_TRAFFIC', applicationName: 'Neural Network Inference', isAITraffic: true, timestamp: '2 min ago' },
      { id: 'flow_002', sourceIP: '192.168.1.50', destinationIP: '10.0.0.15', protocol: 'HTTPS', port: 443, bandwidth: 89.4, packets: 23456, bytes: 123456789, duration: 1800, priority: 'medium', qosClass: 'STANDARD', applicationName: 'Web Application', isAITraffic: false, timestamp: '1 min ago' },
      { id: 'flow_003', sourceIP: '192.168.1.110', destinationIP: '192.168.1.105', protocol: 'TCP', port: 9090, bandwidth: 234.7, packets: 67890, bytes: 345678901, duration: 7200, priority: 'high', qosClass: 'AI_TRAFFIC', applicationName: 'Model Training', isAITraffic: true, timestamp: '30 sec ago' }
    ],
    qosPolicies: [
      { id: 'qos_001', name: 'AI Traffic Priority', priority: 1, bandwidthGuarantee: 1000, protocols: ['AI_MODEL', 'TCP'], sourceIPs: ['192.168.1.105', '192.168.1.110'], destinationIPs: [], applications: ['Neural Network Inference', 'Model Training'], isActive: true, aiTrafficOptimized: true },
      { id: 'qos_002', name: 'Business Critical', priority: 2, bandwidthLimit: 800, protocols: ['HTTPS', 'TCP'], sourceIPs: [], destinationIPs: [], applications: ['Database Sync', 'Web Application'], isActive: true, aiTrafficOptimized: false },
      { id: 'qos_003', name: 'Background Traffic', priority: 3, bandwidthLimit: 200, protocols: ['FTP', 'SSH'], sourceIPs: [], destinationIPs: [], applications: ['File Transfer', 'Remote Access'], isActive: true, aiTrafficOptimized: false }
    ],
    aiTrafficPercentage: 50.0,
    criticalTrafficHealth: 'excellent'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficMetrics(prev => ({
        ...prev,
        totalBandwidth: Math.max(1000, prev.totalBandwidth + (Math.random() - 0.5) * 200),
        aiTrafficBandwidth: Math.max(500, prev.aiTrafficBandwidth + (Math.random() - 0.5) * 100),
        aiTrafficPercentage: Math.max(30, Math.min(70, prev.aiTrafficPercentage + (Math.random() - 0.5) * 5)),
        topApplications: prev.topApplications.map(app => ({
          ...app,
          bandwidth: Math.max(50, app.bandwidth + (Math.random() - 0.5) * 50),
          connections: Math.max(1, app.connections + Math.floor((Math.random() - 0.5) * 10))
        }))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return { trafficMetrics };
};