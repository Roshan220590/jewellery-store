import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check credentials - supports password change
    const storedEmail = localStorage.getItem('adminEmail') || 'rs.jewellery.shop22@gmail.com';
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    const defaultEmail = 'rs.jewellery.shop22@gmail.com';
    const defaultPassword = 'admin123';

    const emailMatch = credentials.email === storedEmail || credentials.email === defaultEmail;
    const passwordMatch = credentials.password === storedPassword;

    if (emailMatch && passwordMatch) {
      // Store admin session
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', credentials.email);
      toast.success('Welcome to Admin Panel!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials');
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full" style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-yellow-400" style={{ fontFamily: '"Playfair Display", serif' }}>
              Admin Panel
            </h2>
            <p className="mt-2 text-gray-300">
              R&S Jewellery Management System
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-yellow-400/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
                placeholder="rs.jewellery.shop22@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <p className="text-xs text-gray-400 text-center">
                <strong>Default Credentials:</strong><br />
                Email: rs.jewellery.shop22@gmail.com<br />
                Password: {localStorage.getItem('adminPassword') ? '(Changed - use your new password)' : 'admin123'}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F4E4C1)' }}
              >
                {isLoading ? 'Signing in...' : 'Access Admin Panel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
