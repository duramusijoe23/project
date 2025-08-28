export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  username?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'error';
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'permission_denied' | 'suspicious_activity' | 'data_access' | 'configuration_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
  timestamp: string;
  isResolved: boolean;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  type: 'password' | 'session' | 'access' | 'data_retention' | 'encryption';
  rules: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  keySize: number;
  purpose: 'data_encryption' | 'token_signing' | 'api_key' | 'backup';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface APIKey {
  id: string;
  name: string;
  keyHash: string;
  userId: string;
  permissions: Permission[];
  rateLimit: number;
  isActive: boolean;
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  failedLogins: number;
  suspiciousActivities: number;
  dataBreachAttempts: number;
  encryptedDataPercentage: number;
  complianceScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}