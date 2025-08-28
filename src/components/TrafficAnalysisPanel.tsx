import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Network, Activity, Zap, Filter, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { TrafficMetrics } from '../types/trafficMetrics';

interface TrafficAnalysisPanelProps {
  trafficMetrics: TrafficMetrics;
}

const TrafficAnalysisPanel: React.FC<TrafficAnalysisPanelProps> = ({ trafficMetrics }) => {
  const [selectedView, setSelectedView] = useState<'protocols' | 'applications' | 'ips'>('protocols');

  const protocolData = Object.entries(trafficMetrics.protocolDistribution).map(([protocol, percentage]) => ({
    name: protocol,
    value: percentage,
    color: protocol === 'AI_MODEL' ? '#22c55e' : protocol.includes('HTTP') ? '#3b82f6' : '#6b7280'
  }));

  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-danger-400 bg-danger-400/10';
      case 'high': return 'text-warning-400 bg-warning-400/10';
      case 'medium': return 'text-info-400 bg-info-400/10';
      case 'low': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getQoSColor = (qosClass: string) => {
    switch (qosClass) {
      case 'AI_TRAFFIC': return 'text-success-400 bg-success-400/10';
      case 'BUSINESS_CRITICAL': return 'text-warning-400 bg-warning-400/10';
      case 'STANDARD': return 'text-info-400 bg-info-400/10';
      case 'BACKGROUND': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Traffic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info-400/10 text-info-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-sm text-info-400 font-medium">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{trafficMetrics.totalBandwidth.toFixed(1)} Mbps</h3>
          <p className="text-gray-400 text-sm">Total Bandwidth</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">+8.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{trafficMetrics.aiTrafficBandwidth.toFixed(1)} Mbps</h3>
          <p className="text-gray-400 text-sm">AI Traffic</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning-400/10 text-warning-400">
              <Network className="w-6 h-6" />
            </div>
            <span className="text-sm text-warning-400 font-medium">{trafficMetrics.aiTrafficPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{trafficMetrics.activeFlows.length}</h3>
          <p className="text-gray-400 text-sm">Active Flows</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">Optimal</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{trafficMetrics.qosPolicies.filter(p => p.isActive).length}</h3>
          <p className="text-gray-400 text-sm">QoS Policies</p>
        </div>
      </div>

      {/* Protocol Distribution and Traffic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Distribution */}
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Protocol Distribution</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Filter className="w-4 h-4" />
              <span>Real-time</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value.toFixed(1)}%`, 'Usage']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {protocolData.slice(0, 6).map((protocol, index) => (
              <div key={protocol.name} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-gray-300">{protocol.name}</span>
                <span className="text-gray-400">{protocol.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Applications */}
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Applications</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Bandwidth Usage</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {trafficMetrics.topApplications.map((app, index) => (
              <div key={index} className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {app.isAIRelated && <Zap className="w-4 h-4 text-success-400" />}
                    <span className="text-sm font-medium text-white">{app.name}</span>
                  </div>
                  <span className="text-sm font-bold text-info-400">{app.bandwidth.toFixed(1)} Mbps</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>{app.protocol} • {app.connections} connections</span>
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(app.priority)}`}>
                    {app.priority}
                  </span>
                </div>
                
                <div className="w-full bg-dark-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-info-400 transition-all duration-500"
                    style={{ width: `${app.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Traffic Flows */}
      <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Active Traffic Flows</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Live Monitoring</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Flow</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Protocol</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Bandwidth</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">QoS Class</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {trafficMetrics.activeFlows.map((flow) => (
                <tr key={flow.id} className="border-b border-dark-600/20 hover:bg-dark-800/20">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {flow.isAITraffic && <Zap className="w-3 h-3 text-success-400" />}
                      <div>
                        <div className="text-white text-xs font-medium">{flow.sourceIP} → {flow.destinationIP}</div>
                        <div className="text-gray-400 text-xs">:{flow.port}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${flow.protocol === 'AI_MODEL' ? 'bg-success-400/10 text-success-400' : 'bg-info-400/10 text-info-400'}`}>
                      {flow.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{flow.bandwidth.toFixed(1)} Mbps</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(flow.priority)}`}>
                      {flow.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getQoSColor(flow.qosClass)}`}>
                      {flow.qosClass}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{Math.floor(flow.duration / 60)}m {flow.duration % 60}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QoS Policies */}
      <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">QoS Policies & AI Traffic Prioritization</h3>
          <button className="flex items-center space-x-2 px-3 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200">
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trafficMetrics.qosPolicies.map((policy) => (
            <div key={policy.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">{policy.name}</h4>
                <div className="flex items-center space-x-2">
                  {policy.aiTrafficOptimized && <Zap className="w-3 h-3 text-success-400" />}
                  <div className={`w-2 h-2 rounded-full ${policy.isActive ? 'bg-success-400' : 'bg-gray-400'}`}></div>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-gray-400">
                <div>Priority: <span className="text-white">#{policy.priority}</span></div>
                {policy.bandwidthGuarantee && (
                  <div>Guaranteed: <span className="text-success-400">{policy.bandwidthGuarantee} Mbps</span></div>
                )}
                {policy.bandwidthLimit && (
                  <div>Limit: <span className="text-warning-400">{policy.bandwidthLimit} Mbps</span></div>
                )}
                <div>Protocols: <span className="text-info-400">{policy.protocols.join(', ')}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalysisPanel;