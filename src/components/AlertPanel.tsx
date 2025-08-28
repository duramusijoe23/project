import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'resolved';
  title: string;
  description: string;
  timestamp: string;
  device?: string;
}

const AlertPanel: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Server Connection Lost',
      description: 'Web Server (192.168.1.105) is unresponsive',
      timestamp: '2 min ago',
      device: 'Web Server'
    },
    {
      id: '2',
      type: 'warning',
      title: 'High CPU Usage Detected',
      description: 'Server Rack B showing 89% CPU utilization',
      timestamp: '5 min ago',
      device: 'Server Rack B'
    },
    {
      id: '3',
      type: 'info',
      title: 'AI Analysis Complete',
      description: 'Network optimization suggestions available',
      timestamp: '15 min ago'
    },
    {
      id: '4',
      type: 'resolved',
      title: 'Bandwidth Issue Resolved',
      description: 'Network congestion on subnet 192.168.1.0/24 cleared',
      timestamp: '1 hour ago'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      case 'resolved': return CheckCircle;
      default: return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-danger-500 bg-danger-500/5';
      case 'warning': return 'border-l-warning-500 bg-warning-500/5';
      case 'info': return 'border-l-info-500 bg-info-500/5';
      case 'resolved': return 'border-l-success-500 bg-success-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-danger-400';
      case 'warning': return 'text-warning-400';
      case 'info': return 'text-info-400';
      case 'resolved': return 'text-success-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.map(alert => {
          const Icon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)} hover:bg-opacity-10 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(alert.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white truncate">{alert.title}</h4>
                    <span className="text-xs text-gray-400 ml-2">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                  {alert.device && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-700 text-gray-300">
                        {alert.device}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-dark-600/50">
        <button className="w-full text-center text-sm text-info-400 hover:text-info-300 transition-colors duration-200">
          View all alerts →
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;