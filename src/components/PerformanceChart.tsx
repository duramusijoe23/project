import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PerformanceChart: React.FC = () => {
  const data = [
    { time: '00:00', bandwidth: 65, latency: 12, packetLoss: 0.1 },
    { time: '04:00', bandwidth: 45, latency: 15, packetLoss: 0.2 },
    { time: '08:00', bandwidth: 85, latency: 8, packetLoss: 0.05 },
    { time: '12:00', bandwidth: 92, latency: 6, packetLoss: 0.03 },
    { time: '16:00', bandwidth: 78, latency: 10, packetLoss: 0.08 },
    { time: '20:00', bandwidth: 68, latency: 14, packetLoss: 0.12 },
    { time: '24:00', bandwidth: 55, latency: 16, packetLoss: 0.15 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'bandwidth' ? '%' : entry.dataKey === 'latency' ? 'ms' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Network Performance (24h)</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-info-400"></div>
            <span className="text-gray-400">Bandwidth</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-warning-400"></div>
            <span className="text-gray-400">Latency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-danger-400"></div>
            <span className="text-gray-400">Packet Loss</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="bandwidth"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#bandwidthGradient)"
            />
            <Line
              type="monotone"
              dataKey="latency"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="packetLoss"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;