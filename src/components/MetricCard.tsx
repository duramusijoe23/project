import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: LucideIcon;
  color: 'success' | 'warning' | 'danger' | 'info';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    success: 'text-success-400 bg-success-400/10 border-success-400/20',
    warning: 'text-warning-400 bg-warning-400/10 border-warning-400/20',
    danger: 'text-danger-400 bg-danger-400/10 border-danger-400/20',
    info: 'text-info-400 bg-info-400/10 border-info-400/20',
  };

  const trendColors = {
    up: trend === 'up' ? 'text-success-400' : 'text-danger-400',
    down: trend === 'down' ? 'text-danger-400' : 'text-success-400',
    stable: 'text-gray-400'
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6 hover:border-dark-500/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`text-sm font-medium ${trendColors[trend]}`}>
          {change}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;