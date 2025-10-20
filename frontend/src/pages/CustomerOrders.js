import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await client.get('/orders/customer/my-orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await client.patch(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error cancelling order');
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

  if (loading) return <div className="container-custom py-12">Loading orders...</div>;

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm">{order._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-orange-600">₹{order.finalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Products</h3>
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
              {order.trackingNumber && (
                <div className="border-t pt-4 mb-4">
                  <h3 className="font-semibold mb-2">Tracking Number</h3>
                  <p className="font-mono text-sm">{order.trackingNumber}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                  className="btn-secondary text-sm"
                >
                  {selectedOrder?._id === order._id ? 'Hide Details' : 'View Details'}
                </button>

                {order.orderStatus === 'placed' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        cancelOrder(order._id);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}