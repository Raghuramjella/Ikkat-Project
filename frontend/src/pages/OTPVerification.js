import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    // Get email from navigation state
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await client.post('/auth/verify-otp', { email, otp });
      setVerified(true);
      setMessage('OTP verified successfully! Redirecting to change password...');
      
      setTimeout(() => {
        navigate('/change-password', { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await client.post('/auth/forgot-password-otp', { email });
      setMessage('OTP resent successfully! Check your email.');
      setTimer(600); // Reset timer to 10 minutes
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-2 text-center">Verify OTP</h2>
          <p className="text-gray-600 text-center mb-6">Enter the OTP sent to your email</p>

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

          {timer === 0 && !verified && (
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
              OTP has expired. Please request a new one.
            </div>
          )}

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">Time remaining:</p>
            <p className={`text-2xl font-bold ${timer < 120 ? 'text-red-600' : 'text-gray-700'}`}>
              {formatTime(timer)}
            </p>
          </div>

          {!verified ? (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength="6"
                  placeholder="000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl letter-spacing tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || timer === 0}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full btn-secondary disabled:opacity-50"
              >
                Resend OTP
              </button>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full text-gray-600 hover:text-gray-800 py-2"
              >
                Back to Forgot Password
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <p className="text-4xl mb-2">✓</p>
                <p className="font-semibold">OTP Verified Successfully!</p>
              </div>
              <p className="text-gray-600">Redirecting to change password...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}