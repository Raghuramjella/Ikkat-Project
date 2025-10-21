import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import client from '../api/client';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : undefined;
      const { data } = await client.get('/admin/products', { params });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (productId, isActive) => {
    try {
      await client.patch(`/admin/products/${productId}/toggle`);
      setMessage(`Product ${isActive ? 'deactivated' : 'activated'} successfully`);
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error toggling product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await client.delete(`/admin/products/${productId}`);
        setMessage('Product deleted successfully');
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting product');
      }
    }
  };

  if (loading) return <div className="container-custom py-12">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Products</h1>
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
            All Products
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded ${filter === 'inactive' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            Inactive
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Artisan</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.artisanId?.businessName || 'Unknown'}</td>
                    <td className="px-6 py-4">₹{product.finalPrice}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit2 size={20} />
                      </Link>
                      <button
                        onClick={() => handleToggle(product._id, product.isActive)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}