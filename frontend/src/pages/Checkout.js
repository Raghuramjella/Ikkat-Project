import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shippingAddress: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    paymentMethod: 'razorpay'
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  const loadRazorpayScript = () => {
    if (window.Razorpay) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
      document.body.appendChild(script);
    });
  };

  const startRazorpayCheckout = async (order, payment) => {
    try {
      setPaymentLoading(true);
      await loadRazorpayScript();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: payment.amount,
        currency: payment.currency,
        name: 'IkkatBazaar',
        description: 'Order Payment',
        order_id: payment.orderId,
        prefill: {
          name: formData.shippingAddress.name,
          email: user?.email,
          contact: formData.shippingAddress.phone
        },
        notes: {
          orderId: order._id,
          paymentMethod: formData.paymentMethod
        },
        handler: async function (response) {
          try {
            await client.post(`/orders/${order._id}/payment/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentMethod: formData.paymentMethod
            });
            clearCart();
            navigate('/orders', { state: { highlightedOrderId: order._id, order } });
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          }
        },
        theme: {
          color: '#F97316'
        }
      };

      if (formData.paymentMethod === 'upi') {
        options.method = {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false
        };
      }

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (paymentError) {
      setError(paymentError.message || 'Unable to initiate payment');
      setPaymentLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      };

      const { data } = await client.post('/orders', orderData);

      if (formData.paymentMethod === 'razorpay' || formData.paymentMethod === 'upi') {
        const { order, payment } = data;
        await startRazorpayCheckout(order, payment);
        return;
      }

      clearCart();
      navigate('/orders', { state: { highlightedOrderId: data.order._id, order: data.order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="shippingAddress.name"
                placeholder="Full Name"
                value={formData.shippingAddress.name}
                onChange={handleChange}
                required
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="tel"
                name="shippingAddress.phone"
                placeholder="Phone"
                value={formData.shippingAddress.phone}
                onChange={handleChange}
                required
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="shippingAddress.street"
                placeholder="Street Address"
                value={formData.shippingAddress.street}
                onChange={handleChange}
                required
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="shippingAddress.city"
                placeholder="City"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="shippingAddress.state"
                placeholder="State"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="shippingAddress.pincode"
                placeholder="Pincode"
                value={formData.shippingAddress.pincode}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <h2 className="text-xl font-bold mb-4 mt-8">Payment Method</h2>
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Credit/Debit Card (Razorpay)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank-transfer"
                  checked={formData.paymentMethod === 'bank-transfer'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Bank Transfer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm border-b pb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.finalPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-orange-600">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}