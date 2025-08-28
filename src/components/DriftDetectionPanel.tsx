import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Brain, Clock } from 'lucide-react';
import { DriftAlert } from '../types/modelMetrics';

interface DriftDetectionPanelProps {
  alerts: DriftAlert[];
}

const DriftDetectionPanel: React.FC<DriftDetectionPanelProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-danger-500 bg-danger-500/5 text-danger-400';
      case 'medium': return 'border-l-warning-500 bg-warning-500/5 text-warning-400';
      case 'low': return 'border-l-info-500 bg-info-500/5 text-info-400';
      default: return 'border-l-gray-500 bg-gray-500/5 text-gray-400';
    }
  };

  const getDriftTypeIcon = (type: string) => {
    switch (type) {
      case 'data': return TrendingUp;
      case 'concept': return Brain;
      case 'prediction': return TrendingDown;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Drift Detection Alerts</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Active Monitoring</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.map(alert => {
          const Icon = getDriftTypeIcon(alert.driftType);
          return (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)} hover:bg-opacity-10 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white truncate">{alert.modelName}</h4>
                    <span className="text-xs text-gray-400 ml-2">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">
                      Threshold: {alert.threshold.toFixed(2)}
                    </span>
                    <span className="text-gray-400">
                      Current: {alert.currentValue.toFixed(2)}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getSeverityColor(alert.severity)} bg-opacity-20`}>
                      {alert.driftType} drift
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-600/50">
        <button className="w-full text-center text-sm text-info-400 hover:text-info-300 transition-colors duration-200">
          Configure drift thresholds →
        </button>
      </div>
    </div>
  );
};

export default DriftDetectionPanel;