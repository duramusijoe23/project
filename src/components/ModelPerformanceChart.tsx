import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { ModelPerformanceData } from '../types/modelMetrics';

interface ModelPerformanceChartProps {
  data: ModelPerformanceData[];
}

const ModelPerformanceChart: React.FC<ModelPerformanceChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (dataKey: string) => {
    switch (dataKey) {
      case 'accuracy': return '%';
      case 'latency': return 'ms';
      case 'throughput': return '/s';
      case 'confidence': return '%';
      case 'drift': return '';
      default: return '';
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Model Performance Trends (24h)</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-success-400"></div>
            <span className="text-gray-400">Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-info-400"></div>
            <span className="text-gray-400">Latency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-warning-400"></div>
            <span className="text-gray-400">Drift</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              name="Accuracy"
            />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Latency"
            />
            <Bar
              dataKey="drift"
              fill="#eab308"
              opacity={0.6}
              name="Drift Score"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ModelPerformanceChart;