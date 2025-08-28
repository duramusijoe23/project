import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Send, User, Bot } from 'lucide-react';
import { FeedbackEntry } from '../types/modelMetrics';

interface FeedbackLoopPanelProps {
  feedbackEntries: FeedbackEntry[];
  onAddFeedback: (feedback: Partial<FeedbackEntry>) => void;
}

const FeedbackLoopPanel: React.FC<FeedbackLoopPanelProps> = ({ feedbackEntries, onAddFeedback }) => {
  const [newFeedback, setNewFeedback] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState('');

  const handleSubmitFeedback = () => {
    if (newFeedback.trim() && selectedPrediction) {
      onAddFeedback({
        predictionId: selectedPrediction,
        userFeedback: newFeedback,
        timestamp: 'just now',
        id: Date.now().toString()
      });
      setNewFeedback('');
      setSelectedPrediction('');
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Feedback Loop</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <MessageSquare className="w-4 h-4" />
          <span>Human-in-the-loop</span>
        </div>
      </div>

      {/* Feedback Input */}
      <div className="mb-6 p-4 bg-dark-800/50 rounded-lg border border-dark-600/30">
        <h4 className="text-sm font-medium text-white mb-3">Provide Model Feedback</h4>
        <div className="space-y-3">
          <select
            value={selectedPrediction}
            onChange={(e) => setSelectedPrediction(e.target.value)}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-info-400"
          >
            <option value="">Select a recent prediction...</option>
            <option value="pred_003">Network Anomaly Detection - pred_003</option>
            <option value="pred_004">Traffic Pattern Analysis - pred_004</option>
            <option value="pred_005">Security Threat Assessment - pred_005</option>
          </select>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Describe the accuracy of this prediction..."
              className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-info-400"
            />
            <button
              onClick={handleSubmitFeedback}
              disabled={!newFeedback.trim() || !selectedPrediction}
              className="px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Feedback */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Feedback</h4>
        {feedbackEntries.map(entry => (
          <div
            key={entry.id}
            className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {entry.isCorrect ? (
                  <ThumbsUp className="w-4 h-4 text-success-400" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-danger-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Prediction ID: {entry.predictionId}
                  </span>
                  <span className="text-xs text-gray-400">{entry.timestamp}</span>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-gray-300">Predicted: </span>
                  <span className="text-info-400">{entry.predictedValue}</span>
                  <span className="text-gray-300 ml-2">Actual: </span>
                  <span className={entry.isCorrect ? 'text-success-400' : 'text-danger-400'}>
                    {entry.actualValue}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Confidence: {(entry.confidence * 100).toFixed(1)}%
                </div>
                {entry.userFeedback && (
                  <div className="mt-2 p-2 bg-dark-700/50 rounded text-xs text-gray-300">
                    <User className="w-3 h-3 inline mr-1" />
                    {entry.userFeedback}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackLoopPanel;