import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import client from '../api/client';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const token = localStorage.getItem('token');

  const orderStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['razorpay', 'upi', 'bank-transfer', 'cod'];

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await client.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      await client.patch(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      setMessage('Order status updated successfully');
      setEditingOrderId(null);
      setNewStatus('');
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating order status');
    }
  };

  if (loading) return <div className="container-custom py-12">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <Link to="/admin/dashboard" className="text-orange-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className={`p-4 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{order._id.slice(-8)}</td>
                    <td className="px-4 py-4 text-sm">
                      <div>
                        <p className="font-semibold">{order.customerId?.name || 'Unknown'}</p>
                        <p className="text-gray-600 text-xs">{order.customerId?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">₹{order.finalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ml-1 ${
                        order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {editingOrderId === order._id ? (
                        <div className="flex gap-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select Status</option>
                            {orderStatuses.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(order._id)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingOrderId(null)}
                            className="bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.orderStatus?.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      {editingOrderId !== order._id && (
                        <button
                          onClick={() => {
                            setEditingOrderId(order._id);
                            setNewStatus(order.orderStatus);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-orange-600">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.orderStatus === 'delivered').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.orderStatus === 'shipped').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.orderStatus === 'placed').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-600 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{orders.filter(o => o.orderStatus === 'cancelled').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}