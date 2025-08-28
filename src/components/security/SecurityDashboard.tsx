import React, { useState } from 'react';
import { Shield, Users, Key, Activity, AlertTriangle, CheckCircle, Clock, Eye, Lock, Database } from 'lucide-react';
import { SecurityMetrics, AuditLog, SecurityEvent } from '../../types/security';

const SecurityDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'audit' | 'events' | 'policies'>('overview');

  const securityMetrics: SecurityMetrics = {
    totalUsers: 24,
    activeUsers: 18,
    failedLogins: 7,
    suspiciousActivities: 3,
    dataBreachAttempts: 0,
    encryptedDataPercentage: 98.7,
    complianceScore: 94.2,
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 12
    }
  };

  const recentAuditLogs: AuditLog[] = [
    {
      id: 'audit_001',
      userId: 'user_001',
      username: 'admin',
      action: 'LOGIN',
      resource: 'authentication',
      details: { method: 'password', mfa: true },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      status: 'success',
      timestamp: '2 min ago',
      severity: 'low'
    },
    {
      id: 'audit_002',
      userId: 'user_002',
      username: 'analyst',
      action: 'VIEW_THREATS',
      resource: 'threat_detection',
      resourceId: 'alert_001',
      details: { alertType: 'intrusion', severity: 'critical' },
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0...',
      status: 'success',
      timestamp: '5 min ago',
      severity: 'medium'
    },
    {
      id: 'audit_003',
      userId: 'user_003',
      username: 'operator',
      action: 'MODIFY_BANDWIDTH_RULE',
      resource: 'bandwidth_management',
      resourceId: 'rule_ai_001',
      details: { oldValue: '1000 Mbps', newValue: '1200 Mbps' },
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0...',
      status: 'success',
      timestamp: '12 min ago',
      severity: 'high'
    }
  ];

  const securityEvents: SecurityEvent[] = [
    {
      id: 'event_001',
      type: 'failed_login',
      severity: 'medium',
      description: 'Multiple failed login attempts from suspicious IP',
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
      metadata: { attempts: 5, username: 'admin' },
      timestamp: '8 min ago',
      isResolved: false
    },
    {
      id: 'event_002',
      type: 'suspicious_activity',
      severity: 'high',
      description: 'Unusual data access pattern detected',
      userId: 'user_004',
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0...',
      metadata: { resourcesAccessed: 15, timeWindow: '5 minutes' },
      timestamp: '15 min ago',
      isResolved: false
    },
    {
      id: 'event_003',
      type: 'permission_denied',
      severity: 'low',
      description: 'User attempted to access restricted resource',
      userId: 'user_005',
      ipAddress: '192.168.1.150',
      userAgent: 'Mozilla/5.0...',
      metadata: { resource: 'system_config', action: 'write' },
      timestamp: '22 min ago',
      isResolved: true
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger-400 bg-danger-400/10';
      case 'high': return 'text-warning-400 bg-warning-400/10';
      case 'medium': return 'text-info-400 bg-info-400/10';
      case 'low': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success-400';
      case 'failure': return 'text-danger-400';
      case 'error': return 'text-warning-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">{securityMetrics.complianceScore.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Secure</h3>
          <p className="text-gray-400 text-sm">Compliance Score</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info-400/10 text-info-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm text-info-400 font-medium">{securityMetrics.activeUsers}/{securityMetrics.totalUsers}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{securityMetrics.activeUsers}</h3>
          <p className="text-gray-400 text-sm">Active Users</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning-400/10 text-warning-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-sm text-warning-400 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{securityMetrics.suspiciousActivities}</h3>
          <p className="text-gray-400 text-sm">Security Events</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">{securityMetrics.encryptedDataPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Encrypted</h3>
          <p className="text-gray-400 text-sm">Data Protection</p>
        </div>
      </div>

      {/* Main Security Panel */}
      <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Security Management</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Real-time Monitoring</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-dark-800/50 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'audit', label: 'Audit Logs', icon: Database },
            { id: 'events', label: 'Security Events', icon: AlertTriangle },
            { id: 'policies', label: 'Policies', icon: Key }
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
            {/* Vulnerability Summary */}
            <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <h4 className="text-sm font-medium text-white mb-4">Vulnerability Assessment</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger-400">{securityMetrics.vulnerabilities.critical}</div>
                  <div className="text-xs text-gray-400">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-400">{securityMetrics.vulnerabilities.high}</div>
                  <div className="text-xs text-gray-400">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info-400">{securityMetrics.vulnerabilities.medium}</div>
                  <div className="text-xs text-gray-400">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{securityMetrics.vulnerabilities.low}</div>
                  <div className="text-xs text-gray-400">Low</div>
                </div>
              </div>
            </div>

            {/* Security Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <h4 className="text-sm font-medium text-white mb-3">Authentication Security</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">MFA Enabled Users:</span>
                    <span className="text-success-400">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Strong Passwords:</span>
                    <span className="text-success-400">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Failed Login Rate:</span>
                    <span className="text-warning-400">2.3%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <h4 className="text-sm font-medium text-white mb-3">Data Protection</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Encrypted Storage:</span>
                    <span className="text-success-400">{securityMetrics.encryptedDataPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Secure Transmission:</span>
                    <span className="text-success-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Backup Encryption:</span>
                    <span className="text-success-400">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'audit' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white">Recent Audit Logs</h4>
              <button className="text-sm text-info-400 hover:text-info-300">Export Logs</button>
            </div>
            {recentAuditLogs.map(log => (
              <div key={log.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-info-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{log.action}</div>
                      <div className="text-xs text-gray-400">{log.username} • {log.resource}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm ${getStatusColor(log.status)}`}>{log.status}</span>
                    <div className="text-xs text-gray-400">{log.timestamp}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-2">
                  <div>IP: <span className="text-white">{log.ipAddress}</span></div>
                  <div>Severity: <span className={`${getSeverityColor(log.severity).split(' ')[0]}`}>{log.severity}</span></div>
                </div>
                
                {log.details && (
                  <div className="text-xs text-gray-300 bg-dark-700/50 rounded p-2">
                    {JSON.stringify(log.details, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-white">Security Events</h4>
              <button className="text-sm text-info-400 hover:text-info-300">Configure Alerts</button>
            </div>
            {securityEvents.map(event => (
              <div key={event.id} className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-medium text-white">{event.description}</div>
                      <div className="text-xs text-gray-400">{event.type} • {event.ipAddress}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${event.isResolved ? 'bg-success-500/20 text-success-400' : 'bg-warning-500/20 text-warning-400'}`}>
                      {event.isResolved ? 'Resolved' : 'Active'}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{event.timestamp}</div>
                  </div>
                </div>
                
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="text-xs text-gray-300 bg-dark-700/50 rounded p-2">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">User Management</h4>
            <p className="text-gray-400 mb-4">Comprehensive user and role management system</p>
            <button className="px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200">
              Configure Users & Roles
            </button>
          </div>
        )}

        {selectedTab === 'policies' && (
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">Security Policies</h4>
            <p className="text-gray-400 mb-4">Manage security policies and compliance rules</p>
            <button className="px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200">
              Configure Policies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;