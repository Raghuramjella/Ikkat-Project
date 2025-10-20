import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const isVerified = profile?.verificationStatus === 'verified';

  useEffect(() => {
    if (!user || user.role !== 'artisan') navigate('/');
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [profileRes, productsRes, salesRes] = await Promise.all([
        client.get('/artisan/profile'),
        client.get('/artisan/products'),
        client.get('/artisan/sales/summary')
      ]);
      setProfile(profileRes.data);
      setProducts(productsRes.data.products);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container-custom py-12">Loading...</div>;

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Artisan Dashboard</h1>
        <button
          onClick={() => navigate('/artisan/orders')}
          className="btn-secondary w-full md:w-auto"
        >
          Manage Orders
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {['overview', 'products', 'profile'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-orange-600">{sales.totalProducts || 0}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Total Sales</p>
            <p className="text-3xl font-bold text-green-600">₹{sales.totalSales || 0}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Rating</p>
            <p className="text-3xl font-bold text-yellow-600">{sales.rating || 0} ⭐</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-600 mb-2">Status</p>
            <p className={`text-2xl font-bold ${profile?.verificationStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
              {profile?.verificationStatus ? profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1) : 'Pending'}
            </p>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <button
            onClick={() => navigate('/artisan/products/create')}
            className={`btn-primary mb-6 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isVerified}
          >
            + Add New Product
          </button>
          {!isVerified && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-6">
              Your profile is pending verification. You will be able to add and manage products once an administrator approves your account.
            </div>
          )}

          {products.length === 0 ? (
            <p className="text-gray-600">No products yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="card">
                  <img
                    src={product.thumbnail || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <p className="text-orange-600 font-bold mb-2">₹{product.finalPrice}</p>
                  <p className="text-sm text-gray-600 mb-4">Inventory: {product.inventory.quantity}</p>
                  <button
                    onClick={() => navigate(`/artisan/products/${product._id}/edit`)}
                    className={`btn-secondary w-full text-sm ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isVerified}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
          {profile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <p className="text-lg">{profile.businessName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <p className="text-lg">{profile.yearsOfExperience}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialties</label>
                <p className="text-lg">{profile.specialties?.join(', ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="text-lg">{profile.bio}</p>
              </div>
              <button onClick={() => navigate('/artisan/profile/edit')} className="btn-primary mt-6">
                Edit Profile
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">No profile information yet</p>
              <button onClick={() => navigate('/artisan/profile/create')} className="btn-primary">
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}