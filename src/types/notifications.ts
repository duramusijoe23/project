export interface EmailConfig {
  id: string;
  name: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  username: string;
  password: string; // encrypted
  fromEmail: string;
  fromName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'threat_alert' | 'malware_detection' | 'bandwidth_violation' | 'model_drift' | 'system_error' | 'security_event';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'all';
  conditions: Record<string, any>;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  isActive: boolean;
  cooldownMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  id: string;
  type: 'user' | 'group' | 'external';
  identifier: string; // user ID, group ID, or email address
  name: string;
  email: string;
  isActive: boolean;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'webhook' | 'slack';
  config: Record<string, any>;
  isActive: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  triggerType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerType: string;
  severity: string;
  recipients: string[];
  channels: string[];
  status: 'sent' | 'failed' | 'pending' | 'throttled';
  errorMessage?: string;
  sentAt?: string;
  createdAt: string;
}

export interface NotificationMetrics {
  totalSent: number;
  successRate: number;
  failureRate: number;
  avgDeliveryTime: number;
  recentNotifications: NotificationLog[];
  topRecipients: Array<{
    email: string;
    count: number;
    lastSent: string;
  }>;
  channelStats: Record<string, {
    sent: number;
    failed: number;
    successRate: number;
  }>;
}