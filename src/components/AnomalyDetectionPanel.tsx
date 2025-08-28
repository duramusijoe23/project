import React from 'react';
import { AlertTriangle, TrendingUp, Brain, Clock, Target, Zap } from 'lucide-react';
import { NetworkAnomaly } from '../types/threatDetection';

interface AnomalyDetectionPanelProps {
  anomalies: NetworkAnomaly[];
}

const AnomalyDetectionPanel: React.FC<AnomalyDetectionPanelProps> = ({ anomalies }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-danger-500 bg-danger-500/5 text-danger-400';
      case 'high': return 'border-l-warning-500 bg-warning-500/5 text-warning-400';
      case 'medium': return 'border-l-info-500 bg-info-500/5 text-info-400';
      case 'low': return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
      default: return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
    }
  };

  const getAnomalyTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_model_anomaly': return Brain;
      case 'traffic_spike': return TrendingUp;
      case 'unusual_protocol': return Target;
      case 'off_hours_activity': return Clock;
      case 'geographic_anomaly': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success-400';
    if (confidence >= 0.6) return 'text-warning-400';
    return 'text-danger-400';
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Network Anomaly Detection</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Brain className="w-4 h-4" />
          <span>ML-Powered Analysis</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {anomalies.map(anomaly => {
          const Icon = getAnomalyTypeIcon(anomaly.type);
          return (
            <div
              key={anomaly.id}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(anomaly.severity)} hover:bg-opacity-10 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 mt-0.5" />
                  {anomaly.isAIRelated && <Zap className="w-3 h-3 text-success-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white truncate">
                      {anomaly.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <span className="text-xs text-gray-400 ml-2">{anomaly.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{anomaly.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">
                      Confidence: <span className={getConfidenceColor(anomaly.confidence)}>{(anomaly.confidence * 100).toFixed(1)}%</span>
                    </span>
                    <span className="text-gray-400">
                      Deviation: <span className="text-warning-400">{anomaly.baselineDeviation.toFixed(1)}σ</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getSeverityColor(anomaly.severity)} bg-opacity-20`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Affected:</span>
                    {anomaly.affectedEntities.map((entity, idx) => (
                      <span key={idx} className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded">
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-600/50">
        <button className="w-full text-center text-sm text-info-400 hover:text-info-300 transition-colors duration-200">
          View anomaly detection settings →
        </button>
      </div>
    </div>
  );
};

export default AnomalyDetectionPanel;