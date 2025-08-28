import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session, SecurityEvent } from '../types/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, mfaCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demonstration
  const mockUser: User = {
    id: 'user_001',
    username: 'admin',
    email: 'admin@netai.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: {
      id: 'role_admin',
      name: 'Administrator',
      description: 'Full system access',
      permissions: [
        { id: 'perm_001', name: 'view_dashboard', resource: 'dashboard', action: 'read', description: 'View dashboard' },
        { id: 'perm_002', name: 'manage_users', resource: 'users', action: 'write', description: 'Manage users' },
        { id: 'perm_003', name: 'configure_system', resource: 'system', action: 'write', description: 'Configure system' },
        { id: 'perm_004', name: 'view_security', resource: 'security', action: 'read', description: 'View security data' },
        { id: 'perm_005', name: 'manage_ai_models', resource: 'ai_models', action: 'write', description: 'Manage AI models' }
      ],
      isSystemRole: true
    },
    permissions: [],
    isActive: true,
    lastLogin: new Date().toISOString(),
    mfaEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  };

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const storedSession = localStorage.getItem('netai_session');
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          if (new Date(sessionData.expiresAt) > new Date()) {
            setSession(sessionData);
            setUser(mockUser);
          } else {
            localStorage.removeItem('netai_session');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('netai_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string, mfaCode?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      if (username === 'admin' && password === 'admin123') {
        const newSession: Session = {
          id: `session_${Date.now()}`,
          userId: mockUser.id,
          token: `token_${Date.now()}`,
          refreshToken: `refresh_${Date.now()}`,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          isActive: true,
          createdAt: new Date().toISOString()
        };

        localStorage.setItem('netai_session', JSON.stringify(newSession));
        setSession(newSession);
        setUser(mockUser);
        
        // Log security event
        logSecurityEvent('login_attempt', 'low', 'Successful login', mockUser.id);
        
        return true;
      } else {
        // Log failed login
        logSecurityEvent('failed_login', 'medium', 'Failed login attempt', undefined, { username });
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Log security event
      if (user) {
        logSecurityEvent('login_attempt', 'low', 'User logout', user.id);
      }
      
      localStorage.removeItem('netai_session');
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!session) return false;
      
      // Simulate token refresh
      const newSession: Session = {
        ...session,
        token: `token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem('netai_session', JSON.stringify(newSession));
      setSession(newSession);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    const allPermissions = [...user.permissions, ...user.role.permissions];
    return allPermissions.some(perm => 
      perm.resource === resource && perm.action === action
    );
  };

  const hasRole = (roleName: string): boolean => {
    return user?.role.name === roleName;
  };

  const logSecurityEvent = (
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    description: string,
    userId?: string,
    metadata: Record<string, any> = {}
  ) => {
    const event: SecurityEvent = {
      id: `event_${Date.now()}`,
      type,
      severity,
      description,
      userId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      metadata,
      timestamp: new Date().toISOString(),
      isResolved: false
    };
    
    // In a real implementation, this would be sent to the backend
    console.log('Security Event:', event);
  };

  return {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole
  };
};

export { AuthContext };