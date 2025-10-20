import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      navigate('/forgot-password');
      return;
    }
    setEmail(emailFromState);
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await client.post('/auth/change-password-otp', {
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setMessage('Password changed successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-2 text-center">Set New Password</h2>
          <p className="text-gray-600 text-center mb-6">Create a strong password for your account</p>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.newPassword.length < 6 && formData.newPassword ? '⚠️ Min 6 characters' : '✓ Valid'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword 
                  ? '✓ Passwords match' 
                  : formData.confirmPassword ? '⚠️ Passwords do not match' : ''}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || formData.newPassword.length < 6 || formData.newPassword !== formData.confirmPassword}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full btn-secondary"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}