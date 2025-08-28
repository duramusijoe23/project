import React, { useState } from 'react';
import { Mail, Bell, Settings, Users, MessageSquare, AlertTriangle, CheckCircle, Clock, Send, Plus, Edit, Trash2 } from 'lucide-react';
import { NotificationRule, EmailConfig, NotificationMetrics, EmailTemplate } from '../../types/notifications';

const NotificationCenter: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rules' | 'templates' | 'config' | 'logs'>('overview');
  const [showCreateRule, setShowCreateRule] = useState(false);

  // Mock data - in real implementation, this would come from hooks/API
  const notificationMetrics: NotificationMetrics = {
    totalSent: 1247,
    successRate: 98.3,
    failureRate: 1.7,
    avgDeliveryTime: 2.4,
    recentNotifications: [
      {
        id: 'notif_001',
        ruleId: 'rule_001',
        ruleName: 'Critical Threat Alerts',
        triggerType: 'threat_alert',
        severity: 'critical',
        recipients: ['admin@company.com', 'security@company.com'],
        channels: ['email'],
        status: 'sent',
        sentAt: '2 min ago',
        createdAt: '2 min ago'
      },
      {
        id: 'notif_002',
        ruleId: 'rule_002',
        ruleName: 'Malware Detection',
        triggerType: 'malware_detection',
        severity: 'high',
        recipients: ['security@company.com'],
        channels: ['email', 'slack'],
        status: 'sent',
        sentAt: '15 min ago',
        createdAt: '15 min ago'
      },
      {
        id: 'notif_003',
        ruleId: 'rule_003',
        ruleName: 'Bandwidth Violations',
        triggerType: 'bandwidth_violation',
        severity: 'medium',
        recipients: ['network@company.com'],
        channels: ['email'],
        status: 'failed',
        errorMessage: 'SMTP connection timeout',
        createdAt: '1 hour ago'
      }
    ],
    topRecipients: [
      { email: 'admin@company.com', count: 45, lastSent: '2 min ago' },
      { email: 'security@company.com', count: 38, lastSent: '15 min ago' },
      { email: 'network@company.com', count: 23, lastSent: '1 hour ago' }
    ],
    channelStats: {
      email: { sent: 1156, failed: 21, successRate: 98.2 },
      slack: { sent: 67, failed: 0, successRate: 100 },
      webhook: { sent: 24, failed: 3, successRate: 87.5 }
    }
  };

  const notificationRules: NotificationRule[] = [
    {
      id: 'rule_001',
      name: 'Critical Security Threats',
      description: 'Immediate notification for critical security threats',
      triggerType: 'threat_alert',
      severity: 'critical',
      conditions: { confidence: '>= 0.9', riskScore: '>= 8.0' },
      recipients: [
        { id: 'rec_001', type: 'user', identifier: 'admin', name: 'System Admin', email: 'admin@company.com', isActive: true },
        { id: 'rec_002', type: 'group', identifier: 'security_team', name: 'Security Team', email: 'security@company.com', isActive: true }
      ],
      channels: [
        { type: 'email', config: { template: 'critical_alert' }, isActive: true },
        { type: 'sms', config: { provider: 'twilio' }, isActive: true }
      ],
      isActive: true,
      cooldownMinutes: 5,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'rule_002',
      name: 'Malware Detection Alerts',
      description: 'Notifications for malware detections',
      triggerType: 'malware_detection',
      severity: 'high',
      conditions: { confidence: '>= 0.8', malwareType: 'any' },
      recipients: [
        { id: 'rec_002', type: 'group', identifier: 'security_team', name: 'Security Team', email: 'security@company.com', isActive: true }
      ],
      channels: [
        { type: 'email', config: { template: 'malware_alert' }, isActive: true },
        { type: 'slack', config: { channel: '#security-alerts' }, isActive: true }
      ],
      isActive: true,
      cooldownMinutes: 10,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'rule_003',
      name: 'AI Model Drift Warnings',
      description: 'Notifications when AI models show drift',
      triggerType: 'model_drift',
      severity: 'medium',
      conditions: { driftScore: '>= 0.15' },
      recipients: [
        { id: 'rec_003', type: 'user', identifier: 'ml_engineer', name: 'ML Engineer', email: 'ml@company.com', isActive: true }
      ],
      channels: [
        { type: 'email', config: { template: 'drift_warning' }, isActive: true }
      ],
      isActive: true,
      cooldownMinutes: 60,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    }
  ];

  const emailConfig: EmailConfig = {
    id: 'email_001',
    name: 'Primary SMTP Server',
    smtpHost: 'smtp.company.com',
    smtpPort: 587,
    smtpSecure: true,
    username: 'netai-alerts@company.com',
    password: '***encrypted***',
    fromEmail: 'netai-alerts@company.com',
    fromName: 'NetAI Monitor',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-success-400 bg-success-400/10';
      case 'failed': return 'text-danger-400 bg-danger-400/10';
      case 'pending': return 'text-warning-400 bg-warning-400/10';
      case 'throttled': return 'text-info-400 bg-info-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger-400 bg-danger-400/10';
      case 'high': return 'text-warning-400 bg-warning-400/10';
      case 'medium': return 'text-info-400 bg-info-400/10';
      case 'low': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info-400/10 text-info-400">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-sm text-info-400 font-medium">24h</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{notificationMetrics.totalSent}</h3>
          <p className="text-gray-400 text-sm">Notifications Sent</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-400/10 text-success-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm text-success-400 font-medium">{notificationMetrics.successRate.toFixed(1)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Success</h3>
          <p className="text-gray-400 text-sm">Delivery Rate</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning-400/10 text-warning-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm text-warning-400 font-medium">avg</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{notificationMetrics.avgDeliveryTime.toFixed(1)}s</h3>
          <p className="text-gray-400 text-sm">Delivery Time</p>
        </div>

        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info-400/10 text-info-400">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-sm text-info-400 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{notificationRules.filter(r => r.isActive).length}</h3>
          <p className="text-gray-400 text-sm">Alert Rules</p>
        </div>
      </div>

      {/* Main Notification Panel */}
      <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Notification Center</h3>
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
            { id: 'overview', label: 'Overview', icon: Bell },
            { id: 'rules', label: 'Alert Rules', icon: Settings },
            { id: 'templates', label: 'Templates', icon: MessageSquare },
            { id: 'config', label: 'Email Config', icon: Mail },
            { id: 'logs', label: 'Delivery Logs', icon: Clock }
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
            {/* Channel Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(notificationMetrics.channelStats).map(([channel, stats]) => (
                <div key={channel} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white capitalize">{channel}</h4>
                    <span className="text-sm text-success-400">{stats.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sent:</span>
                      <span className="text-white">{stats.sent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Failed:</span>
                      <span className="text-danger-400">{stats.failed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Recipients */}
            <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <h4 className="text-sm font-medium text-white mb-4">Top Recipients</h4>
              <div className="space-y-2">
                {notificationMetrics.topRecipients.map((recipient, index) => (
                  <div key={recipient.email} className="flex items-center justify-between p-2 bg-dark-700/50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-info-500 rounded-full flex items-center justify-center text-xs text-white">
                        {index + 1}
                      </div>
                      <span className="text-sm text-white">{recipient.email}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-info-400">{recipient.count} alerts</div>
                      <div className="text-xs text-gray-400">{recipient.lastSent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rules' && (
          <div className="space-y-4">
            {notificationRules.map(rule => (
              <div key={rule.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-success-400' : 'bg-gray-400'}`}></div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{rule.name}</h4>
                      <p className="text-xs text-gray-400">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(rule.severity)}`}>
                      {rule.severity}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-danger-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                  <div>
                    <span className="text-gray-400">Trigger:</span>
                    <span className="text-white ml-1">{rule.triggerType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cooldown:</span>
                    <span className="text-white ml-1">{rule.cooldownMinutes}m</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-gray-400">Recipients:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rule.recipients.map(recipient => (
                      <span key={recipient.id} className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded">
                        {recipient.email}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400">Channels:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rule.channels.map((channel, idx) => (
                      <span key={idx} className="px-2 py-1 bg-info-400/10 text-info-400 text-xs rounded">
                        {channel.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'config' && (
          <div className="space-y-6">
            <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-white">SMTP Configuration</h4>
                <div className={`w-2 h-2 rounded-full ${emailConfig.isActive ? 'bg-success-400' : 'bg-gray-400'}`}></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">SMTP Host:</span>
                  <span className="text-white ml-2">{emailConfig.smtpHost}</span>
                </div>
                <div>
                  <span className="text-gray-400">Port:</span>
                  <span className="text-white ml-2">{emailConfig.smtpPort}</span>
                </div>
                <div>
                  <span className="text-gray-400">From Email:</span>
                  <span className="text-white ml-2">{emailConfig.fromEmail}</span>
                </div>
                <div>
                  <span className="text-gray-400">From Name:</span>
                  <span className="text-white ml-2">{emailConfig.fromName}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-600/50">
                <button className="px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200 mr-2">
                  Test Connection
                </button>
                <button className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200">
                  Edit Configuration
                </button>
              </div>
            </div>

            <div className="p-4 bg-warning-500/10 border border-warning-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-warning-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-warning-400 mb-1">Email Configuration Required</h4>
                  <p className="text-sm text-gray-300">
                    To enable email notifications, you need to configure SMTP settings. 
                    Contact your system administrator to set up email delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div className="space-y-3">
            {notificationMetrics.recentNotifications.map(notification => (
              <div key={notification.id} className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-info-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{notification.ruleName}</div>
                      <div className="text-xs text-gray-400">{notification.triggerType.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{notification.sentAt || notification.createdAt}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mb-2">
                  <div>Recipients: <span className="text-white">{notification.recipients.length}</span></div>
                  <div>Channels: <span className="text-white">{notification.channels.join(', ')}</span></div>
                </div>

                {notification.errorMessage && (
                  <div className="text-xs text-danger-400 bg-danger-500/10 rounded p-2">
                    Error: {notification.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'templates' && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">Email Templates</h4>
            <p className="text-gray-400 mb-4">Customize email templates for different alert types</p>
            <button className="px-4 py-2 bg-info-500 text-white rounded-lg hover:bg-info-600 transition-colors duration-200">
              Manage Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;