import React from 'react';
import { Server, Globe, TrendingUp, TrendingDown, MapPin, Zap } from 'lucide-react';
import { IPTrafficSummary } from '../types/trafficMetrics';

interface IPTrafficPanelProps {
  ipTraffic: IPTrafficSummary[];
}

const IPTrafficPanel: React.FC<IPTrafficPanelProps> = ({ ipTraffic }) => {
  const formatBandwidth = (bandwidth: number) => {
    if (bandwidth >= 1000) {
      return `${(bandwidth / 1000).toFixed(1)} Gbps`;
    }
    return `${bandwidth.toFixed(1)} Mbps`;
  };

  return (
    <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Top IP Addresses by Traffic</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Globe className="w-4 h-4" />
          <span>Bandwidth Usage</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {ipTraffic.map((ip, index) => (
          <div key={ip.ip} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20 hover:border-dark-500/30 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${ip.isAINode ? 'bg-success-400/10 text-success-400' : 'bg-info-400/10 text-info-400'}`}>
                    {ip.isAINode ? <Zap className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{ip.hostname || ip.ip}</div>
                    <div className="text-xs text-gray-400">{ip.ip}</div>
                  </div>
                </div>
                {ip.isAINode && (
                  <span className="px-2 py-1 bg-success-400/10 text-success-400 text-xs rounded-full">
                    AI Node
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{formatBandwidth(ip.totalBandwidth)}</div>
                <div className="text-xs text-gray-400">{ip.connections} connections</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-3 h-3 text-info-400" />
                <span className="text-xs text-gray-400">Inbound:</span>
                <span className="text-xs text-white font-medium">{formatBandwidth(ip.inbound)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3 text-success-400" />
                <span className="text-xs text-gray-400">Outbound:</span>
                <span className="text-xs text-white font-medium">{formatBandwidth(ip.outbound)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Protocols:</span>
                <div className="flex space-x-1">
                  {ip.topProtocols.map((protocol, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded ${protocol === 'AI_MODEL' ? 'bg-success-400/10 text-success-400' : 'bg-gray-600/20 text-gray-300'}`}>
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>
              {ip.location && (
                <div className="flex items-center space-x-1 text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{ip.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IPTrafficPanel;