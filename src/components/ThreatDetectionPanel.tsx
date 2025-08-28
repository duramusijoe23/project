import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, CheckCircle, Clock, Brain, Target, Zap, Activity } from 'lucide-react';
import { SecurityMetrics, ThreatAlert } from '../types/threatDetection';

interface ThreatDetectionPanelProps {
  securityMetrics: SecurityMetrics;
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

const ThreatDetectionPanel: React.FC<ThreatDetectionPanelProps> = ({ 
  securityMetrics, 
  onAcknowledgeAlert, 
  onResolveAlert 
}) => {
  const [selectedTab, setSelectedTab] = useState<'alerts' | 'models' | 'behavior'>('alerts');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-danger-500 bg-danger-500/5 text-danger-400';
      case 'high': return 'border-l-warning-500 bg-warning-500/5 text-warning-400';
      case 'medium': return 'border-l-info-500 bg-info-500/5 text-info-400';
      case 'low': return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
      default: return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-danger-500/10 text-danger-400';
      case 'investigating': return 'bg-warning-500/10 text-warning-400';
      case 'resolved': return 'bg-success-500/10 text-success-400';
      case 'false_positive': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case 'intrusion': return Shield;
      case 'ddos': return Activity;
      case 'anomaly': return AlertTriangle;
      case 'malware': return Target;
      default: return AlertTriangle;
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-400 bg-success-400/10';
      case 'training': return 'text-warning-400 bg-warning-400/10';
      case 'updating': return 'text-info-400 bg-info-400/10';
      case 'offline': return 'text-danger-400 bg-danger-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">AI-Powered Threat Detection</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Real-time Protection</span>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-danger-400" />
            <span className="text-lg font-bold text-danger-400">{securityMetrics.activeThreats}</span>
          </div>
          <p className="text-sm text-gray-400">Active Threats</p>
        </div>

        <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-success-400" />
            <span className="text-lg font-bold text-success-400">{securityMetrics.detectionAccuracy.toFixed(1)}%</span>
          </div>
          <p className="text-sm text-gray-400">Detection Accuracy</p>
        </div>

        <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-info-400" />
            <span className="text-lg font-bold text-info-400">{securityMetrics.responseTime.toFixed(1)}m</span>
          </div>
          <p className="text-sm text-gray-400">Avg Response Time</p>
        </div>

        <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-success-400" />
            <span className="text-lg font-bold text-success-400">{securityMetrics.aiProtectedAssets}</span>
          </div>
          <p className="text-sm text-gray-400">AI Protected Assets</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-dark-800/50 rounded-lg p-1">
        {[
          { id: 'alerts', label: 'Threat Alerts', icon: AlertTriangle },
          { id: 'models', label: 'ML Models', icon: Brain },
          { id: 'behavior', label: 'Behavior Profiles', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTab === tab.id
                  ? 'bg-info-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {selectedTab === 'alerts' && (
        <div className="space-y-3">
          {securityMetrics.recentAlerts.map(alert => {
            const Icon = getThreatTypeIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)} hover:bg-opacity-10 transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(alert.status)}`}>
                            {alert.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-400">{alert.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-3">
                        <div>Source: <span className="text-white">{alert.sourceIP}</span></div>
                        <div>Target: <span className="text-white">{alert.targetIP || 'Multiple'}</span></div>
                        <div>Confidence: <span className="text-info-400">{(alert.confidence * 100).toFixed(1)}%</span></div>
                        <div>Risk Score: <span className="text-warning-400">{alert.riskScore.toFixed(1)}/10</span></div>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-gray-400">Affected Assets:</span>
                        {alert.affectedAssets.map((asset, idx) => (
                          <span key={idx} className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded">
                            {asset}
                          </span>
                        ))}
                      </div>
                      {alert.status === 'active' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-3 py-1 bg-warning-500/20 text-warning-400 text-xs rounded hover:bg-warning-500/30 transition-colors duration-200"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => onResolveAlert(alert.id)}
                            className="px-3 py-1 bg-success-500/20 text-success-400 text-xs rounded hover:bg-success-500/30 transition-colors duration-200"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTab === 'models' && (
        <div className="space-y-4">
          {securityMetrics.mlModels.map(model => (
            <div key={model.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Brain className={`w-5 h-5 ${model.isAIOptimized ? 'text-success-400' : 'text-info-400'}`} />
                  <div>
                    <h4 className="text-sm font-medium text-white">{model.name}</h4>
                    <p className="text-xs text-gray-400">{model.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {model.isAIOptimized && <Zap className="w-3 h-3 text-success-400" />}
                  <span className={`px-2 py-1 rounded text-xs ${getModelStatusColor(model.status)}`}>
                    {model.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-success-400 ml-1 font-medium">{model.accuracy.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Detection Rate:</span>
                  <span className="text-info-400 ml-1 font-medium">{model.detectionRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">False Positive:</span>
                  <span className="text-warning-400 ml-1 font-medium">{model.falsePositiveRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Threats Caught:</span>
                  <span className="text-white ml-1 font-medium">{model.threatsCaught}</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-400">
                Last trained: {model.lastTrained} • Training data: {(model.trainingDataSize / 1000000).toFixed(1)}M samples
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'behavior' && (
        <div className="space-y-4">
          {securityMetrics.behaviorProfiles.map(profile => (
            <div key={profile.entityId} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${profile.isAIEntity ? 'bg-success-400/10 text-success-400' : 'bg-info-400/10 text-info-400'}`}>
                    {profile.isAIEntity ? <Zap className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{profile.entityName}</h4>
                    <p className="text-xs text-gray-400">{profile.entityId} • {profile.entityType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${profile.anomalyScore > 0.5 ? 'text-danger-400' : profile.anomalyScore > 0.3 ? 'text-warning-400' : 'text-success-400'}`}>
                    {(profile.anomalyScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Anomaly Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <span className="text-gray-400">Bandwidth:</span>
                  <span className="text-white ml-1">{profile.currentMetrics.bandwidth} Mbps</span>
                  <span className="text-gray-500 ml-1">(avg: {profile.baselineMetrics.avgBandwidth})</span>
                </div>
                <div>
                  <span className="text-gray-400">Connections:</span>
                  <span className="text-white ml-1">{profile.currentMetrics.connections}</span>
                  <span className="text-gray-500 ml-1">(avg: {profile.baselineMetrics.avgConnections})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Protocols:</span>
                  <div className="flex space-x-1">
                    {profile.currentMetrics.protocols.map((protocol, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded ${protocol === 'AI_MODEL' ? 'bg-success-400/10 text-success-400' : 'bg-gray-600/20 text-gray-300'}`}>
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-400">Updated: {profile.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreatDetectionPanel;