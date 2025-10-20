import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function ArtisanOrders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user || user.role !== 'artisan') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await client.get('/orders/artisan/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await client.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      'placed': 'confirmed',
      'confirmed': 'shipped',
      'shipped': 'delivered'
    };
    return flow[currentStatus];
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filterStatus);

  if (loading) return <div className="container-custom py-12">Loading orders...</div>;

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Orders</h1>
        <p className="text-gray-600">Manage orders from your customers</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No orders with this status</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              {/* Header */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm font-medium">{order._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.customerId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-bold text-orange-600">₹{order.finalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Your Products */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Your Products in Order</h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 flex-1">
                        {item.productId?.images?.[0] && (
                          <img 
                            src={item.productId.images[0]} 
                            alt={item.productId.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.productId?.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p>{order.customerId?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p>{order.customerId?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.name}<br/>
                  {order.shippingAddress.street}, {order.shippingAddress.city}<br/>
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}<br/>
                  Ph: {order.shippingAddress.phone}
                </p>
              </div>

              {/* Tracking */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Tracking</h3>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  defaultValue={order.trackingNumber || ''}
                  onBlur={(e) => {
                    if (e.target.value !== order.trackingNumber) {
                      updateOrderStatus(order._id, order.orderStatus);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Status Update */}
              {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Update Order Status</p>
                  <button
                    onClick={() => {
                      const nextStatus = getNextStatus(order.orderStatus);
                      if (nextStatus) {
                        updateOrderStatus(order._id, nextStatus);
                      }
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Mark as {getNextStatus(order.orderStatus)?.charAt(0).toUpperCase() + getNextStatus(order.orderStatus)?.slice(1)}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}