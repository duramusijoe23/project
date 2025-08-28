import React from 'react';
import { Activity, Zap, Users, TrendingUp, Wifi, Server, Brain, Target, Clock, AlertTriangle, Network, Shield, Database, Settings, Bell } from 'lucide-react';
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ModelPerformanceCard from './components/ModelPerformanceCard';
import NetworkTopology from './components/NetworkTopology';
import AlertPanel from './components/AlertPanel';
import PerformanceChart from './components/PerformanceChart';
import ModelPerformanceChart from './components/ModelPerformanceChart';
import DriftDetectionPanel from './components/DriftDetectionPanel';
import FeedbackLoopPanel from './components/FeedbackLoopPanel';
import ConfidenceScorePanel from './components/ConfidenceScorePanel';
import TrafficAnalysisPanel from './components/TrafficAnalysisPanel';
import IPTrafficPanel from './components/IPTrafficPanel';
import ThreatDetectionPanel from './components/ThreatDetectionPanel';
import AnomalyDetectionPanel from './components/AnomalyDetectionPanel';
import MalwareDetectionPanel from './components/MalwareDetectionPanel';
import BandwidthManagementPanel from './components/BandwidthManagementPanel';
import SecurityDashboard from './components/security/SecurityDashboard';
import NotificationCenter from './components/notifications/NotificationCenter';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useRealTimeData } from './hooks/useRealTimeData';
import { useModelMetrics } from './hooks/useModelMetrics';
import { useTrafficAnalysis } from './hooks/useTrafficAnalysis';
import { useThreatDetection } from './hooks/useThreatDetection';
import { useMalwareDetection } from './hooks/useMalwareDetection';
import { useBandwidthManagement } from './hooks/useBandwidthManagement';
import { useSocket } from './contexts/SocketContext';
import { formatPercentage, formatLatency, formatUptime, getStatusFromMetric } from './utils/formatters';

function AppContent() {
  const { metrics, isConnected } = useRealTimeData();
  const { isConnected: socketConnected } = useSocket();
  const { modelMetrics, performanceHistory, driftAlerts, feedbackEntries, setFeedbackEntries } = useModelMetrics();
  const { trafficMetrics } = useTrafficAnalysis();
  const { securityMetrics, networkAnomalies, acknowledgeAlert, resolveAlert } = useThreatDetection();
  const { malwareMetrics, quarantineThreat, cleanThreat, markFalsePositive } = useMalwareDetection();
  const { 
    bandwidthMetrics, 
    bandwidthRules, 
    createBandwidthRule, 
    updateBandwidthRule, 
    deleteBandwidthRule, 
    enforceRule, 
    suspendRule 
  } = useBandwidthManagement();

  // Use default values if metrics is null (before backend connection is established)
  const safeMetrics = metrics || {
    bandwidth: 0,
    latency: 0,
    packetLoss: 0,
    activeDevices: 0,
    throughput: 0,
    uptime: 0
  };

  const networkMetricCards = [
    {
      title: 'Network Bandwidth',
      value: formatPercentage(safeMetrics.bandwidth),
      change: '+2.4%',
      trend: 'up' as const,
      icon: Activity,
      color: getStatusFromMetric(safeMetrics.bandwidth, { warning: 80, critical: 90 }) as 'success' | 'warning' | 'danger'
    },
    {
      title: 'Average Latency',
      value: formatLatency(safeMetrics.latency),
      change: '-0.8ms',
      trend: 'down' as const,
      icon: Zap,
      color: getStatusFromMetric(safeMetrics.latency, { warning: 20, critical: 50 }) as 'success' | 'warning' | 'danger'
    },
    {
      title: 'Active Devices',
      value: safeMetrics.activeDevices.toString(),
      change: '+12',
      trend: 'up' as const,
      icon: Users,
      color: 'info' as const
    },
    {
      title: 'Throughput',
      value: `${safeMetrics.throughput.toFixed(1)} GB/s`,
      change: '+5.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'success' as const
    },
    {
      title: 'Network Uptime',
      value: formatUptime(safeMetrics.uptime),
      change: '+0.1%',
      trend: 'up' as const,
      icon: Wifi,
      color: getStatusFromMetric(safeMetrics.uptime, { warning: 98, critical: 95 }, true) as 'success' | 'warning' | 'danger'
    },
    {
      title: 'Packet Loss',
      value: formatPercentage(safeMetrics.packetLoss),
      change: '-0.02%',
      trend: 'down' as const,
      icon: Server,
      color: getStatusFromMetric(safeMetrics.packetLoss, { warning: 0.1, critical: 0.5 }) as 'success' | 'warning' | 'danger'
    }
  ];

  const modelPerformanceCards = [
    {
      title: 'Model Accuracy',
      value: formatPercentage(modelMetrics.accuracy),
      change: '+1.2%',
      trend: 'up' as const,
      icon: Target,
      color: getStatusFromMetric(modelMetrics.accuracy, { warning: 85, critical: 80 }, true) as 'success' | 'warning' | 'danger',
      subtitle: `F1-Score: ${modelMetrics.f1Score.toFixed(1)}%`
    },
    {
      title: 'Inference Latency',
      value: `${modelMetrics.latency}ms`,
      change: '-3ms',
      trend: 'down' as const,
      icon: Clock,
      color: getStatusFromMetric(modelMetrics.latency, { warning: 50, critical: 100 }) as 'success' | 'warning' | 'danger',
      subtitle: `Throughput: ${modelMetrics.throughput}/s`
    },
    {
      title: 'Confidence Score',
      value: formatPercentage(modelMetrics.confidenceScore),
      change: '+2.1%',
      trend: 'up' as const,
      icon: Brain,
      color: getStatusFromMetric(modelMetrics.confidenceScore, { warning: 75, critical: 60 }, true) as 'success' | 'warning' | 'danger',
      subtitle: `${modelMetrics.predictionCount.toLocaleString()} predictions`
    },
    {
      title: 'Drift Score',
      value: modelMetrics.driftScore.toFixed(3),
      change: '+0.02',
      trend: 'up' as const,
      icon: AlertTriangle,
      color: getStatusFromMetric(modelMetrics.driftScore, { warning: 0.15, critical: 0.25 }) as 'success' | 'warning' | 'danger',
      subtitle: 'Data distribution shift'
    }
  ];

  const modelConfidences = [
    { name: 'Network Anomaly Detector', confidence: 92.3, predictions: 5847, status: 'excellent' as const },
    { name: 'Traffic Pattern Analyzer', confidence: 87.1, predictions: 3421, status: 'good' as const },
    { name: 'Security Threat Classifier', confidence: 79.8, predictions: 2156, status: 'fair' as const },
    { name: 'Performance Predictor', confidence: 94.5, predictions: 4423, status: 'excellent' as const }
  ];

  const handleAddFeedback = (feedback: any) => {
    const newEntry = {
      ...feedback,
      actualValue: 'pending',
      predictedValue: 'anomaly',
      confidence: 0.85,
      isCorrect: true
    };
    setFeedbackEntries(prev => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <ConnectionStatus />
      <Header alertCount={securityMetrics.activeThreats + malwareMetrics.activeThreats} />
      
      <main className="p-6 space-y-8">
        {/* Connection Status Banner */}
        {!isConnected && (
          <div className="bg-danger-500/10 border border-danger-500/20 rounded-lg p-4 text-center">
            <p className="text-danger-400">⚠️ Connection to monitoring system interrupted. Showing cached data.</p>
          </div>
        )}

        {/* Security Status Banner */}
        {(securityMetrics.activeThreats > 0 || malwareMetrics.activeThreats > 0) && (
          <div className="bg-danger-500/10 border border-danger-500/20 rounded-lg p-4 text-center">
            <p className="text-danger-400">
              🛡️ {securityMetrics.activeThreats + malwareMetrics.activeThreats} active security threats detected. 
              Review security and malware detection panels.
            </p>
          </div>
        )}

        {/* Notification Center Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Bell className="w-6 h-6 text-info-400" />
            <span>Alert Notifications & Email Configuration</span>
          </h2>
          <div className="animate-fade-in">
            <NotificationCenter />
          </div>
        </section>

        {/* Security Management Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-info-400" />
            <span>Security Management & Access Control</span>
          </h2>
          <div className="animate-fade-in">
            <SecurityDashboard />
          </div>
        </section>

        {/* Network Metrics Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-info-400" />
            <span>Network Infrastructure Metrics</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkMetricCards.map((card, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <MetricCard {...card} />
              </div>
            ))}
          </div>
        </section>

        {/* Model Performance Metrics Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Brain className="w-6 h-6 text-info-400" />
            <span>AI Model Performance Monitoring</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modelPerformanceCards.map((card, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ModelPerformanceCard {...card} />
              </div>
            ))}
          </div>
        </section>

        {/* Security & Threat Detection Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-info-400" />
            <span>AI-Powered Security & Threat Detection</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-fade-in">
              <ThreatDetectionPanel 
                securityMetrics={securityMetrics}
                onAcknowledgeAlert={acknowledgeAlert}
                onResolveAlert={resolveAlert}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <AnomalyDetectionPanel anomalies={networkAnomalies} />
            </div>
          </div>
        </section>

        {/* Malware Detection Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Database className="w-6 h-6 text-info-400" />
            <span>Malware & Signature-Based Detection</span>
          </h2>
          <div className="animate-fade-in">
            <MalwareDetectionPanel 
              malwareMetrics={malwareMetrics}
              onQuarantineThreat={quarantineThreat}
              onCleanThreat={cleanThreat}
              onMarkFalsePositive={markFalsePositive}
            />
          </div>
        </section>

        {/* Bandwidth Management Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-info-400" />
            <span>Bandwidth Allocation & Traffic Shaping</span>
          </h2>
          <div className="animate-fade-in">
            <BandwidthManagementPanel 
              bandwidthMetrics={bandwidthMetrics}
              bandwidthRules={bandwidthRules}
              onCreateRule={createBandwidthRule}
              onUpdateRule={updateBandwidthRule}
              onDeleteRule={deleteBandwidthRule}
              onEnforceRule={enforceRule}
              onSuspendRule={suspendRule}
            />
          </div>
        </section>

        {/* Traffic Analysis and Prioritization Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Network className="w-6 h-6 text-info-400" />
            <span>Traffic Analysis & QoS Prioritization</span>
          </h2>
          <div className="animate-fade-in">
            <TrafficAnalysisPanel trafficMetrics={trafficMetrics} />
          </div>
        </section>

        {/* IP Traffic Analysis */}
        <section>
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <IPTrafficPanel ipTraffic={trafficMetrics.topIPs} />
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up">
              <PerformanceChart />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <ModelPerformanceChart data={performanceHistory} />
            </div>
          </div>
        </section>

        {/* Topology and Confidence */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <NetworkTopology />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <ConfidenceScorePanel 
                overallConfidence={modelMetrics.confidenceScore}
                modelConfidences={modelConfidences}
              />
            </div>
          </div>
        </section>

        {/* Drift Detection and Feedback */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <DriftDetectionPanel alerts={driftAlerts} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <FeedbackLoopPanel 
                feedbackEntries={feedbackEntries}
                onAddFeedback={handleAddFeedback}
              />
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <AlertPanel />
          </div>
        </section>

        {/* AI Insights Section */}
        <section>
          <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-info-400" />
              <span>AI-Powered Insights & Recommendations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-info-500/10 border border-info-500/20 rounded-lg p-4">
                <h4 className="text-info-400 font-medium mb-2">Performance Optimization</h4>
                <p className="text-gray-300 text-sm">
                  AI detected potential bottleneck in Server Rack B. Recommend load balancing optimization.
                </p>
              </div>
              <div className="bg-success-500/10 border border-success-500/20 rounded-lg p-4">
                <h4 className="text-success-400 font-medium mb-2">Security Status</h4>
                <p className="text-gray-300 text-sm">
                  Threat detection models operating at 94.7% accuracy. {securityMetrics.activeThreats + malwareMetrics.activeThreats} active threats being monitored.
                </p>
              </div>
              <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                <h4 className="text-warning-400 font-medium mb-2">Bandwidth Management</h4>
                <p className="text-gray-300 text-sm">
                  AI traffic consuming {trafficMetrics.aiTrafficPercentage.toFixed(1)}% of bandwidth. 
                  {bandwidthMetrics.violatingEntities} policy violations detected.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;