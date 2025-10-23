import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useToast } from '../App';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  if (cart.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <FiArrowLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <img
                  src={item.thumbnail || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">₹{item.finalPrice}</p>
                  <div className="flex items-center border border-gray-300 rounded w-fit">
                    <button
                      onClick={() => {
                        const changed = updateQuantity(item._id, Math.max(1, item.quantity - 1));
                        if (changed) {
                          showToast('Updated cart quantity', 'info');
                        }
                      }}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const changed = updateQuantity(item._id, item.quantity + 1);
                        if (changed) {
                          showToast('Updated cart quantity', 'info');
                        }
                      }}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.finalPrice * item.quantity}</p>
                  <button
                    onClick={() => {
                      const removed = removeFromCart(item._id);
                      if (removed) {
                        showToast('Removed from cart', 'warning');
                      }
                    }}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{tax}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total:</span>
            <span className="text-orange-600">₹{finalTotal}</span>
          </div>
          <button
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
            className="w-full btn-primary"
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/products" className="block text-center mt-4 text-orange-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}