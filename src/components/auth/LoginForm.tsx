import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mfaCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showMFA, setShowMFA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(formData.username, formData.password, formData.mfaCode);
    
    if (!success) {
      setError('Invalid credentials. Please try again.');
      setFormData(prev => ({ ...prev, password: '', mfaCode: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-info-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NetAI Monitor</h1>
          <p className="text-gray-400">Secure Access Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-glass backdrop-blur-md border border-dark-600/50 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info-400 focus:ring-1 focus:ring-info-400 transition-colors duration-200"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info-400 focus:ring-1 focus:ring-info-400 transition-colors duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* MFA Code Field (conditional) */}
            {showMFA && (
              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-300 mb-2">
                  MFA Code
                </label>
                <input
                  type="text"
                  id="mfaCode"
                  name="mfaCode"
                  value={formData.mfaCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-info-400 focus:ring-1 focus:ring-info-400 transition-colors duration-200"
                  placeholder="Enter 6-digit MFA code"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-danger-400 flex-shrink-0" />
                <span className="text-danger-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-info-500 hover:bg-info-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              This system is protected by advanced security measures.
              <br />
              All access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;