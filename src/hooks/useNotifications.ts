import { useState, useEffect } from 'react';
import { NotificationRule, NotificationMetrics, EmailConfig, NotificationLog } from '../types/notifications';

export const useNotifications = () => {
  const [notificationMetrics, setNotificationMetrics] = useState<NotificationMetrics>({
    totalSent: 1247,
    successRate: 98.3,
    failureRate: 1.7,
    avgDeliveryTime: 2.4,
    recentNotifications: [],
    topRecipients: [],
    channelStats: {
      email: { sent: 1156, failed: 21, successRate: 98.2 },
      slack: { sent: 67, failed: 0, successRate: 100 },
      webhook: { sent: 24, failed: 3, successRate: 87.5 }
    }
  });

  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);

  // Simulate sending email notification
  const sendEmailNotification = async (
    recipients: string[],
    subject: string,
    body: string,
    alertData: any
  ): Promise<boolean> => {
    try {
      // In a real implementation, this would call your email service
      console.log('Sending email notification:', {
        recipients,
        subject,
        body,
        alertData
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log the notification
      const notificationLog: NotificationLog = {
        id: `notif_${Date.now()}`,
        ruleId: 'manual',
        ruleName: 'Manual Notification',
        triggerType: 'manual',
        severity: alertData.severity || 'medium',
        recipients,
        channels: ['email'],
        status: 'sent',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setNotificationMetrics(prev => ({
        ...prev,
        totalSent: prev.totalSent + 1,
        recentNotifications: [notificationLog, ...prev.recentNotifications.slice(0, 9)]
      }));

      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  };

  // Check if email is configured
  const isEmailConfigured = (): boolean => {
    return emailConfig !== null && emailConfig.isActive;
  };

  // Get default recipients for different alert types
  const getDefaultRecipients = (alertType: string): string[] => {
    const defaultRecipients: Record<string, string[]> = {
      'threat_alert': ['security@company.com', 'admin@company.com'],
      'malware_detection': ['security@company.com'],
      'bandwidth_violation': ['network@company.com'],
      'model_drift': ['ml@company.com'],
      'system_error': ['admin@company.com'],
      'security_event': ['security@company.com']
    };

    return defaultRecipients[alertType] || ['admin@company.com'];
  };

  // Create notification rule
  const createNotificationRule = (rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: NotificationRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotificationRules(prev => [...prev, newRule]);
    return newRule;
  };

  // Update notification rule
  const updateNotificationRule = (ruleId: string, updates: Partial<NotificationRule>) => {
    setNotificationRules(prev => prev.map(rule =>
      rule.id === ruleId 
        ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
        : rule
    ));
  };

  // Delete notification rule
  const deleteNotificationRule = (ruleId: string) => {
    setNotificationRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  // Test email configuration
  const testEmailConfig = async (): Promise<boolean> => {
    if (!emailConfig) return false;

    try {
      const testResult = await sendEmailNotification(
        ['admin@company.com'],
        'NetAI Monitor - Email Test',
        'This is a test email from NetAI Monitor to verify email configuration.',
        { severity: 'low', type: 'test' }
      );

      return testResult;
    } catch (error) {
      console.error('Email test failed:', error);
      return false;
    }
  };

  return {
    notificationMetrics,
    emailConfig,
    notificationRules,
    sendEmailNotification,
    isEmailConfigured,
    getDefaultRecipients,
    createNotificationRule,
    updateNotificationRule,
    deleteNotificationRule,
    testEmailConfig
  };
};