import React from 'react';
import { Server, Router, Smartphone, Monitor, Wifi, AlertTriangle } from 'lucide-react';

const NetworkTopology: React.FC = () => {
  const devices = [
    { id: 1, name: 'Core Router', type: 'router', status: 'online', x: 50, y: 20, connections: [2, 3, 4] },
    { id: 2, name: 'Server Rack A', type: 'server', status: 'online', x: 20, y: 50, connections: [5] },
    { id: 3, name: 'Server Rack B', type: 'server', status: 'warning', x: 80, y: 50, connections: [6] },
    { id: 4, name: 'WiFi Access Point', type: 'wifi', status: 'online', x: 50, y: 80, connections: [7, 8] },
    { id: 5, name: 'Database Server', type: 'server', status: 'online', x: 10, y: 70, connections: [] },
    { id: 6, name: 'Web Server', type: 'server', status: 'error', x: 90, y: 70, connections: [] },
    { id: 7, name: 'Mobile Device', type: 'mobile', status: 'online', x: 35, y: 95, connections: [] },
    { id: 8, name: 'Workstation', type: 'desktop', status: 'online', x: 65, y: 95, connections: [] },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'router': return Router;
      case 'server': return Server;
      case 'wifi': return Wifi;
      case 'mobile': return Smartphone;
      case 'desktop': return Monitor;
      default: return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success-400 bg-success-400/20 border-success-400/30';
      case 'warning': return 'text-warning-400 bg-warning-400/20 border-warning-400/30';
      case 'error': return 'text-danger-400 bg-danger-400/20 border-danger-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Network Topology</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-400 rounded-full"></div>
            <span className="text-gray-400">Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning-400 rounded-full"></div>
            <span className="text-gray-400">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-danger-400 rounded-full"></div>
            <span className="text-gray-400">Error</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-96 bg-dark-900/50 rounded-lg overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {devices.map(device => 
            device.connections.map(connId => {
              const connDevice = devices.find(d => d.id === connId);
              if (!connDevice) return null;
              
              return (
                <line
                  key={`${device.id}-${connId}`}
                  x1={`${device.x}%`}
                  y1={`${device.y}%`}
                  x2={`${connDevice.x}%`}
                  y2={`${connDevice.y}%`}
                  stroke="rgba(75, 85, 99, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })
          )}
        </svg>
        
        {/* Devices */}
        {devices.map(device => {
          const Icon = getIcon(device.type);
          return (
            <div
              key={device.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${device.x}%`, top: `${device.y}%` }}
            >
              <div className={`p-3 rounded-lg border ${getStatusColor(device.status)} hover:scale-110 transition-all duration-200`}>
                <Icon className="w-6 h-6" />
                {device.status === 'error' && (
                  <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-danger-400 animate-bounce" />
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {device.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-dark-800"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkTopology;