import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfidenceScorePanelProps {
  overallConfidence: number;
  modelConfidences: Array<{
    name: string;
    confidence: number;
    predictions: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
  }>;
}

const ConfidenceScorePanel: React.FC<ConfidenceScorePanelProps> = ({ 
  overallConfidence, 
  modelConfidences 
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success-400 bg-success-400/10';
    if (confidence >= 75) return 'text-info-400 bg-info-400/10';
    if (confidence >= 60) return 'text-warning-400 bg-warning-400/10';
    return 'text-danger-400 bg-danger-400/10';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return Target;
      case 'fair': return TrendingUp;
      case 'poor': return AlertCircle;
      default: return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success-400';
      case 'good': return 'text-info-400';
      case 'fair': return 'text-warning-400';
      case 'poor': return 'text-danger-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Model Confidence Scores</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Target className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Overall Confidence */}
      <div className="mb-6 p-4 bg-dark-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Overall System Confidence</span>
          <span className={`text-lg font-bold ${getConfidenceColor(overallConfidence).split(' ')[0]}`}>
            {overallConfidence.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getConfidenceColor(overallConfidence).split(' ')[1]}`}
            style={{ width: `${overallConfidence}%` }}
          ></div>
        </div>
      </div>

      {/* Individual Model Confidences */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Individual Models</h4>
        {modelConfidences.map((model, index) => {
          const StatusIcon = getStatusIcon(model.status);
          return (
            <div
              key={index}
              className="p-3 bg-dark-800/20 rounded-lg border border-dark-600/20 hover:border-dark-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`w-4 h-4 ${getStatusColor(model.status)}`} />
                  <span className="text-sm font-medium text-white">{model.name}</span>
                </div>
                <span className={`text-sm font-bold ${getConfidenceColor(model.confidence).split(' ')[0]}`}>
                  {model.confidence.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{model.predictions.toLocaleString()} predictions</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(model.status)} bg-opacity-10`}>
                  {model.status}
                </span>
              </div>
              
              <div className="w-full bg-dark-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getConfidenceColor(model.confidence).split(' ')[1]}`}
                  style={{ width: `${model.confidence}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfidenceScorePanel;