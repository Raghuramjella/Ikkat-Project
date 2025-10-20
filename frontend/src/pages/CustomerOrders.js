import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import client from '../api/client';
import useAuthStore from '../store/authStore';

const STATUS_META = {
  placed: {
    label: 'Order Placed',
    description: 'We have received your order.',
    icon: <FiPackage className="text-lg" />
  },
  confirmed: {
    label: 'Order Confirmed',
    description: 'Your order is being prepared.',
    icon: <FiCheckCircle className="text-lg" />
  },
  shipped: {
    label: 'Order Shipped',
    description: 'Your order is on the way.',
    icon: <FiTruck className="text-lg" />
  },
  delivered: {
    label: 'Order Delivered',
    description: 'Package delivered successfully.',
    icon: <FiCheckCircle className="text-lg" />
  },
  cancelled: {
    label: 'Order Cancelled',
    description: 'Order was cancelled by you or the artisan.',
    icon: <FiXCircle className="text-lg" />
  }
};

const STATUS_FLOW = ['placed', 'confirmed', 'shipped', 'delivered'];

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatDateTime = (value) => new Date(value).toLocaleString();

export default function CustomerOrders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/orders/customer/my-orders');
      setOrders(data);
      if (!data.length) {
        setMessage('You have not placed any orders yet.');
      } else {
        setMessage('');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage(error.response?.data?.message || 'Unable to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await client.patch(`/orders/${orderId}/cancel`);
      setMessage('Order cancelled successfully.');
      fetchOrders();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error cancelling order.');
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTimeline = (order) => {
    const currentStatus = order.orderStatus || 'placed';
    const isCancelled = currentStatus === 'cancelled';
    const currentIndex = Math.max(STATUS_FLOW.indexOf(currentStatus), 0);

    return (
      <div className="space-y-3">
        {STATUS_FLOW.map((statusKey, index) => {
          const meta = STATUS_META[statusKey];
          const isCompleted = !isCancelled && currentIndex >= index;
          const isCurrent = !isCancelled && currentIndex === index;
          return (
            <div
              key={statusKey}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition ${
                isCompleted ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600'
              } ${isCurrent ? 'shadow-md' : ''}`}
            >
              <div className={`mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {meta.icon}
              </div>
              <div>
                <p className="font-semibold">{meta.label}</p>
                <p className="text-sm text-gray-600">{meta.description}</p>
              </div>
            </div>
          );
        })}

        {isCancelled && (
          <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            <div className="mt-1">
              <FiXCircle className="text-lg" />
            </div>
            <div>
              <p className="font-semibold">{STATUS_META.cancelled.label}</p>
              <p className="text-sm">{STATUS_META.cancelled.description}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="flex flex-col items-center gap-3">
          <FiClock className="text-3xl text-orange-500 animate-pulse" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track your purchases, view order details, and follow delivery progress.</p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-xl shadow">
          <p className="text-gray-500 mb-4">Looks like you haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Shop Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div key={order._id} className="bg-white rounded-xl shadow border border-gray-100">
                <div className="flex flex-col gap-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Order ID</p>
                      <p className="font-mono text-sm text-gray-800">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Placed On</p>
                      <p className="font-medium text-gray-800">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Total Amount</p>
                      <p className="font-semibold text-orange-600">{formatCurrency(order.finalAmount)}</p>
                      <p className="text-xs text-gray-500">(Tax: {formatCurrency(order.tax)})</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Order Status</p>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Payment</p>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          <FiCreditCard />
                          {order.paymentMethod?.toUpperCase()} • {order.paymentStatus || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="font-semibold text-gray-700 mb-3">Items in this order</p>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={`${order._id}-${idx}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-4 flex-1">
                            {item.productId?.images?.[0] && (
                              <img
                                src={item.productId.images[0]}
                                alt={item.productId?.name || 'Product image'}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{item.productId?.name || 'Product removed'}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      {isExpanded ? 'Hide Order Details' : 'View Order Details'}
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

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-gray-700 mb-3">Order Progress</h3>
                        {renderTimeline(order)}
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <p className="font-semibold text-gray-700 mb-2">Shipping Address</p>
                          {order.shippingAddress ? (
                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.street}</p>
                              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                              <p>Phone: {order.shippingAddress.phone}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Address details unavailable.</p>
                          )}
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <p className="font-semibold text-gray-700 mb-2">Payment Summary</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax (GST)</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-800 border-t border-dashed pt-2">
                              <span>Total Paid</span>
                              <span>{formatCurrency(order.finalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-700 text-sm">
                            <p className="font-semibold">Tracking Number</p>
                            <p className="font-mono text-xs mt-1">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}