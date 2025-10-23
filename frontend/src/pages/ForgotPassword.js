import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data } = await client.post('/auth/forgot-password', { email });
      setMessage(data.message || 'If this email is registered, an OTP has been sent');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your email address and we will send a one-time password (OTP) to reset your password.
          </p>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="w-full btn-secondary"
            >
              Go to Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}