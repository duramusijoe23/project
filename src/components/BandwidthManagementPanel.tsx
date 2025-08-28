import React, { useState } from 'react';
import { Activity, Settings, Users, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Plus, Edit, Trash2 } from 'lucide-react';
import { BandwidthMetrics, BandwidthRule, BandwidthUsage } from '../types/bandwidthManagement';

interface BandwidthManagementPanelProps {
  bandwidthMetrics: BandwidthMetrics;
  bandwidthRules: BandwidthRule[];
  onCreateRule: (rule: Omit<BandwidthRule, 'id' | 'createdAt' | 'violationCount' | 'bytesTransferred'>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<BandwidthRule>) => void;
  onDeleteRule: (ruleId: string) => void;
  onEnforceRule: (ruleId: string) => void;
  onSuspendRule: (ruleId: string) => void;
}

const BandwidthManagementPanel: React.FC<BandwidthManagementPanelProps> = ({ 
  bandwidthMetrics, 
  bandwidthRules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onEnforceRule,
  onSuspendRule
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rules' | 'usage' | 'shaping'>('overview');
  const [showCreateRule, setShowCreateRule] = useState(false);

  const formatBandwidth = (bandwidth: number) => {
    if (bandwidth >= 1000) {
      return `${(bandwidth / 1000).toFixed(1)} Gbps`;
    }
    return `${bandwidth.toFixed(0)} Mbps`;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 100) return 'text-danger-400 bg-danger-400/10';
    if (percentage >= 85) return 'text-warning-400 bg-warning-400/10';
    if (percentage >= 70) return 'text-info-400 bg-info-400/10';
    return 'text-success-400 bg-success-400/10';
  };

  const getViolationSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger-400 bg-danger-400/10';
      case 'major': return 'text-warning-400 bg-warning-400/10';
      case 'minor': return 'text-info-400 bg-info-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-danger-400 bg-danger-400/10';
    if (priority <= 5) return 'text-warning-400 bg-warning-400/10';
    if (priority <= 7) return 'text-info-400 bg-info-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="space-y-6">
      {/* Bandwidth Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info-400/10 text-info-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-sm text-info-400 font-medium">{bandwidthMetrics.utilizationPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatBandwidth(bandwidthMetrics.totalBandwidth)}</h3>
          <p className="text-gray-400 text-sm">Total Bandwidth</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">{((bandwidthMetrics.aiTrafficUsage / bandwidthMetrics.aiTrafficAllocation) * 100).toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{formatBandwidth(bandwidthMetrics.aiTrafficUsage)}</h3>
          <p className="text-gray-400 text-sm">AI Traffic Usage</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning-400/10 text-warning-400">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-sm text-warning-400 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{bandwidthMetrics.activeRules}</h3>
          <p className="text-gray-400 text-sm">Bandwidth Rules</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-danger-400/10 text-danger-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-sm text-danger-400 font-medium">Violations</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{bandwidthMetrics.violatingEntities}</h3>
          <p className="text-gray-400 text-sm">Policy Violations</p>
        </div>
      </div>

      {/* Main Bandwidth Management Panel */}
      <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Bandwidth Allocation & Traffic Shaping</h3>
          <button
            onClick={() => setShowCreateRule(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-dark-800/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'rules', label: 'Bandwidth Rules', icon: Settings },
            { id: 'usage', label: 'Usage Monitoring', icon: TrendingUp },
            { id: 'shaping', label: 'Traffic Shaping', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-info-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Bandwidth Utilization */}
            <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <h4 className="text-sm font-medium text-white mb-4">Bandwidth Utilization</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Usage</span>
                  <span className="text-sm text-white font-medium">{formatBandwidth(bandwidthMetrics.allocatedBandwidth)} / {formatBandwidth(bandwidthMetrics.totalBandwidth)}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-info-400 transition-all duration-500"
                    style={{ width: `${bandwidthMetrics.utilizationPercentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Available:</span>
                    <span className="text-success-400 ml-1 font-medium">{formatBandwidth(bandwidthMetrics.availableBandwidth)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">AI Traffic:</span>
                    <span className="text-info-400 ml-1 font-medium">{formatBandwidth(bandwidthMetrics.aiTrafficUsage)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Violations */}
            <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <h4 className="text-sm font-medium text-white mb-4">Recent Policy Violations</h4>
              <div className="space-y-2">
                {bandwidthMetrics.recentViolations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-warning-400" />
                      <div>
                        <div className="text-sm text-white">{violation.entityName}</div>
                        <div className="text-xs text-gray-400">{violation.violationType.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${getViolationSeverityColor(violation.severity)}`}>
                        {violation.severity}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">{violation.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enforcement Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20 text-center">
                <div className="text-lg font-bold text-info-400">{bandwidthMetrics.enforcementStats.rulesEnforced}</div>
                <div className="text-xs text-gray-400">Rules Enforced</div>
              </div>
              <div className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20 text-center">
                <div className="text-lg font-bold text-warning-400">{bandwidthMetrics.enforcementStats.packetsDropped.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Packets Dropped</div>
              </div>
              <div className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20 text-center">
                <div className="text-lg font-bold text-danger-400">{bandwidthMetrics.enforcementStats.connectionsThrottled}</div>
                <div className="text-xs text-gray-400">Connections Throttled</div>
              </div>
              <div className="p-3 bg-dark-800/30 rounded-lg border border-dark-600/20 text-center">
                <div className="text-lg font-bold text-success-400">{formatBandwidth(bandwidthMetrics.enforcementStats.bytesShapped / 1000000)}</div>
                <div className="text-xs text-gray-400">Bytes Shaped</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rules' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-600/50">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Rule Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Target</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Bandwidth</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bandwidthRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-dark-600/20 hover:bg-dark-800/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {rule.isAIOptimized && <Zap className="w-3 h-3 text-success-400" />}
                          <span className="text-white font-medium">{rule.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-info-400/10 text-info-400 text-xs rounded">
                          {rule.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{rule.target}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rule.priority)}`}>
                          #{rule.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          {rule.guaranteedBandwidth && (
                            <div className="text-success-400">Min: {rule.guaranteedBandwidth} Mbps</div>
                          )}
                          {rule.maxBandwidth && (
                            <div className="text-warning-400">Max: {rule.maxBandwidth} Mbps</div>
                          )}
                          {rule.burstBandwidth && (
                            <div className="text-info-400">Burst: {rule.burstBandwidth} Mbps</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-success-400' : 'bg-gray-400'}`}></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => rule.isActive ? onSuspendRule(rule.id) : onEnforceRule(rule.id)}
                            className={`px-2 py-1 text-xs rounded ${
                              rule.isActive 
                                ? 'bg-warning-500/20 text-warning-400 hover:bg-warning-500/30' 
                                : 'bg-success-500/20 text-success-400 hover:bg-success-500/30'
                            } transition-colors duration-200`}
                          >
                            {rule.isActive ? 'Suspend' : 'Enforce'}
                          </button>
                          <button
                            onClick={() => onDeleteRule(rule.id)}
                            className="px-2 py-1 bg-danger-500/20 text-danger-400 text-xs rounded hover:bg-danger-500/30 transition-colors duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'usage' && (
          <div className="space-y-4">
            {bandwidthMetrics.topConsumers.map((consumer, index) => (
              <div key={consumer.entityId} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${consumer.isAITraffic ? 'bg-success-400/10 text-success-400' : 'bg-info-400/10 text-info-400'}`}>
                      {consumer.isAITraffic ? <Zap className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{consumer.entityName}</div>
                      <div className="text-xs text-gray-400">{consumer.entityType} • {consumer.entityId}</div>
                    </div>
                    {consumer.isViolating && (
                      <AlertTriangle className="w-4 h-4 text-danger-400" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{formatBandwidth(consumer.currentUsage)}</div>
                    <div className={`text-xs ${consumer.isViolating ? 'text-danger-400' : 'text-gray-400'}`}>
                      {consumer.utilizationPercentage.toFixed(1)}% of {formatBandwidth(consumer.allocatedBandwidth)}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        consumer.utilizationPercentage > 100 ? 'bg-danger-400' : 
                        consumer.utilizationPercentage > 85 ? 'bg-warning-400' : 'bg-success-400'
                      }`}
                      style={{ width: `${Math.min(consumer.utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Peak:</span>
                    <span className="text-white ml-1">{formatBandwidth(consumer.peakUsage)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Average:</span>
                    <span className="text-white ml-1">{formatBandwidth(consumer.averageUsage)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white ml-1">{(consumer.totalBytes / 1000000000).toFixed(1)} GB</span>
                  </div>
                  <div>
                    <span className="text-gray-400">QoS:</span>
                    <span className={`ml-1 ${getUtilizationColor(consumer.utilizationPercentage).split(' ')[0]}`}>
                      {consumer.qosClass}
                    </span>
                  </div>
                </div>
                
                {consumer.isViolating && (
                  <div className="mt-3 p-2 bg-danger-500/10 border border-danger-500/20 rounded text-xs">
                    <div className="flex items-center space-x-2 text-danger-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Policy violation for {consumer.violationDuration}s</span>
                      {consumer.lastViolation && <span>• Last: {consumer.lastViolation}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'shaping' && (
          <div className="space-y-4">
            {bandwidthMetrics.shapingPolicies.map((policy) => (
              <div key={policy.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-info-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">{policy.name}</h4>
                      <p className="text-xs text-gray-400">{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-info-400/10 text-info-400 text-xs rounded">
                      {policy.algorithm.toUpperCase()}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${policy.isActive ? 'bg-success-400' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-white ml-1">{policy.parameters.rate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ceiling:</span>
                    <span className="text-white ml-1">{policy.parameters.ceil || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Burst:</span>
                    <span className="text-white ml-1">{policy.parameters.burst || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Class ID:</span>
                    <span className="text-white ml-1">{policy.classId}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Packets:</span>
                    <span className="text-success-400 ml-1">{policy.statistics.packetsProcessed.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Bytes:</span>
                    <span className="text-info-400 ml-1">{(policy.statistics.bytesProcessed / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Dropped:</span>
                    <span className="text-danger-400 ml-1">{policy.statistics.droppedPackets.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Queue:</span>
                    <span className="text-warning-400 ml-1">{policy.statistics.queueLength}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BandwidthManagementPanel;