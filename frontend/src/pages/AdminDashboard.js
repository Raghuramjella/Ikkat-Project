import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiBox, FiUsers, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin/login');
  };

  if (loading) return <div className="container-custom py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container-custom py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.totalUsers || 0}</p>
              </div>
              <FiUsers size={32} className="text-orange-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Verified Artisans</p>
                <p className="text-3xl font-bold text-green-600">{stats?.verifiedArtisans || 0}</p>
              </div>
              <FiUsers size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Artisans</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pendingArtisans || 0}</p>
              </div>
              <FiUsers size={32} className="text-yellow-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
              </div>
              <FiShoppingCart size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <FiBarChart2 size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/products" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <FiBox size={40} className="text-orange-600" />
              <div>
                <h2 className="text-2xl font-bold">Manage Products</h2>
                <p className="text-gray-600">View, edit, delete, and manage product listings</p>
              </div>
            </div>
            <button className="btn-primary mt-4">Go to Products →</button>
          </Link>

          <Link to="/admin/artisans" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <FiUsers size={40} className="text-green-600" />
              <div>
                <h2 className="text-2xl font-bold">Verify Artisans</h2>
                <p className="text-gray-600">Review and verify pending artisan applications</p>
              </div>
            </div>
            <button className="btn-primary mt-4">Go to Artisans →</button>
          </Link>

          <Link to="/admin/orders" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <FiShoppingCart size={40} className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Manage Orders</h2>
                <p className="text-gray-600">Update order status and track shipments</p>
              </div>
            </div>
            <button className="btn-primary mt-4">Go to Orders →</button>
          </Link>

          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <FiBarChart2 size={40} className="text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">Reports</h2>
                <p className="text-gray-600">View platform analytics and statistics</p>
              </div>
            </div>
            <button disabled className="btn-primary mt-4 opacity-50 cursor-not-allowed">Coming Soon →</button>
          </div>
        </div>
      </div>
    </div>
  );
}