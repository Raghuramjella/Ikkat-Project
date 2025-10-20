import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera } from 'react-icons/fi';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {}
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await client.get('/customer/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...formData[keys[0]],
          [keys[1]]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append('profileImage', file);

      const { data } = await client.post('/auth/upload-profile-image', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfileImage(data.profileImage);
      setUser(data.user);
      setMessage('Profile image updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to upload profile image');
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await client.put('/customer/profile', formData);
      // Update formData with response, merging address fields properly
      setFormData({
        name: data.name || formData.name,
        phone: data.phone || formData.phone,
        address: {
          street: data.address?.street || formData.address?.street || '',
          city: data.address?.city || formData.address?.city || '',
          state: data.address?.state || formData.address?.state || '',
          pincode: data.address?.pincode || formData.address?.pincode || '',
          country: data.address?.country || formData.address?.country || ''
        }
      });
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            {message && (
              <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            {/* Profile Image Section */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-orange-200 flex items-center justify-center text-gray-400">
                    <FiCamera size={48} />
                  </div>
                )}
                <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition">
                  <FiCamera size={20} />
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {uploadingImage && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
              <p className="text-sm text-gray-600 mt-4 text-center">Click the camera icon to upload or edit your profile picture</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Stats */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-orange-600">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">₹{order.finalAmount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}