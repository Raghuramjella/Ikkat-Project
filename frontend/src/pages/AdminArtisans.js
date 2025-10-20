import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';

export default function AdminArtisans() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [message, setMessage] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchArtisans();
  }, [filter]);

  const fetchArtisans = async () => {
    try {
      let url = 'http://localhost:5000/api/admin/artisans';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setArtisans(data);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (artisanId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/artisans/${artisanId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          verificationNotes
        })
      });

      if (response.ok) {
        setMessage(`Artisan ${status} successfully`);
        setSelectedArtisan(null);
        setVerificationNotes('');
        fetchArtisans();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating artisan verification');
    }
  };

  if (loading) return <div className="container-custom py-12">Loading artisans...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Artisan Verification</h1>
          <Link to="/admin/dashboard" className="text-orange-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded ${filter === 'verified' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            Verified
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            Rejected
          </button>
        </div>

        {/* Artisans List */}
        <div className="grid gap-6">
          {artisans.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center text-gray-500">
              No artisans found
            </div>
          ) : (
            artisans.map(artisan => (
              <div key={artisan._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{artisan.businessName}</h3>
                    <p className="text-gray-600">{artisan.userId?.name} • {artisan.userId?.email}</p>
                    <p className="text-gray-600 text-sm mt-1">Phone: {artisan.userId?.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    artisan.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                    artisan.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {artisan.verificationStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Experience</p>
                    <p className="font-semibold">{artisan.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Specialties</p>
                    <p className="font-semibold">{artisan.specialties?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Products</p>
                    <p className="font-semibold">{artisan.totalProducts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-semibold">{artisan.rating?.toFixed(1)} ⭐</p>
                  </div>
                </div>

                {artisan.bio && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm"><strong>Bio:</strong> {artisan.bio}</p>
                  </div>
                )}

                {artisan.verificationStatus === 'pending' && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Add verification notes (optional)"
                      value={selectedArtisan === artisan._id ? verificationNotes : ''}
                      onChange={(e) => {
                        setSelectedArtisan(artisan._id);
                        setVerificationNotes(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerification(artisan._id, 'verified')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <FiCheck /> Verify
                      </button>
                      <button
                        onClick={() => handleVerification(artisan._id, 'rejected')}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {artisan.verificationNotes && (
                  <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                    <p><strong>Notes:</strong> {artisan.verificationNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}