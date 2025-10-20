import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from './pages/OTPVerification';
import ChangePassword from './pages/ChangePassword';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminArtisans from './pages/AdminArtisans';
import AdminOrders from './pages/AdminOrders';
import CustomerProfile from './pages/CustomerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerOrders from './pages/CustomerOrders';
import ArtisanOrders from './pages/ArtisanOrders';
import NotFound from './pages/NotFound';
import ArtisanProfileCreate from './pages/ArtisanProfileCreate';
import ArtisanProfileEdit from './pages/ArtisanProfileEdit';
import ArtisanProductCreate from './pages/ArtisanProductCreate';
import ArtisanProductEdit from './pages/ArtisanProductEdit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
            <Route path="/artisan/profile/create" element={<ArtisanProfileCreate />} />
            <Route path="/artisan/profile/edit" element={<ArtisanProfileEdit />} />
            <Route path="/artisan/products/create" element={<ArtisanProductCreate />} />
            <Route path="/artisan/products/:id/edit" element={<ArtisanProductEdit />} />
            <Route path="/artisan/orders" element={<ArtisanOrders />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/artisans" element={<AdminArtisans />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;