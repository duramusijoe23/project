import React, { useState } from 'react';
import { Network, Bell, Settings, User, Shield, LogOut, Key, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  alertCount: number;
}

const Header: React.FC<HeaderProps> = ({ alertCount }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Network className="w-8 h-8 text-info-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NetAI Monitor</h1>
              <p className="text-xs text-gray-400">AI-Powered Network Intelligence</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Security Status */}
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Shield className="w-4 h-4 text-success-400" />
            <span>Secure</span>
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 hover:bg-dark-700/50 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-300" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
          
          {/* Settings */}
          <button className="p-2 hover:bg-dark-700/50 rounded-lg transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-dark-700/50 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-info-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-400">{user.role.name}</div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-dark-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-info-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                      <div className="text-xs text-info-400">{user.role.name}</div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs text-gray-400 font-medium">Account Status</div>
                    <div className="px-3 py-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">MFA Enabled:</span>
                        <span className={user.mfaEnabled ? 'text-success-400' : 'text-warning-400'}>
                          {user.mfaEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-300">Last Login:</span>
                        <span className="text-gray-400">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dark-600 pt-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded transition-colors duration-200">
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded transition-colors duration-200">
                      <Key className="w-4 h-4" />
                      <span>Security Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded transition-colors duration-200">
                      <Activity className="w-4 h-4" />
                      <span>Activity Log</span>
                    </button>
                  </div>

                  <div className="border-t border-dark-600 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-danger-400 hover:bg-danger-500/10 rounded transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;