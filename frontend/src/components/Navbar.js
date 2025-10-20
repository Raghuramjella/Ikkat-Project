import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-orange-100 transition">
            <span>🪡</span>
            <span>IkkatBazaar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-orange-100 transition">Products</Link>
            {user?.role === 'customer' && (
              <Link to="/orders" className="hover:text-orange-100 transition">My Orders</Link>
            )}
            <Link to="/cart" className="relative hover:text-orange-100 transition">
              <FiShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.name}</span>
                <Link to="/profile" className="hover:text-orange-100 transition">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={24} />
                  )}
                </Link>
                {user.role === 'artisan' && (
                  <Link to="/artisan/dashboard" className="hover:text-orange-100 transition text-sm">Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="hover:text-orange-100 transition text-sm">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-orange-100 transition">Login</Link>
                <Link to="/register" className="btn-secondary text-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/products" className="block hover:text-orange-100 transition py-2">Products</Link>
            {user?.role === 'customer' && (
              <Link to="/orders" className="block hover:text-orange-100 transition py-2">My Orders</Link>
            )}
            <Link to="/cart" className="block hover:text-orange-100 transition py-2">
              Cart ({cart.length})
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-orange-100 transition py-2">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <FiUser size={20} className="mr-2" />
                  )}
                  Profile
                </Link>
                {user.role === 'artisan' && (
                  <Link to="/artisan/dashboard" className="block hover:text-orange-100 transition py-2">Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block hover:text-orange-100 transition py-2">Admin</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left hover:text-orange-100 transition py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-orange-100 transition py-2">Login</Link>
                <Link to="/register" className="block hover:text-orange-100 transition py-2">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}