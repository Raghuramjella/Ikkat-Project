import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiShield } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">IkkatBazaar</h1>
          <p className="text-xl mb-8">Weaving Tradition with Modern Commerce</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover authentic handloom products directly from skilled artisans. Fair pricing, genuine quality, and rich cultural heritage.
          </p>
          <Link to="/products" className="btn-primary text-lg">
            Explore Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose IkkatBazaar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiCheckCircle className="text-orange-600" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                All artisans are verified offline to ensure genuine, high-quality handloom products.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiUsers className="text-orange-600" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Artisan Empowerment</h3>
              <p className="text-gray-600">
                Direct-to-customer platform maximizes artisan earnings and recognition.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiShield className="text-orange-600" size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">
                Safe payments, verified sellers, and transparent transactions for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 text-white py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8">Are you an artisan? List your products and reach global customers.</p>
          <Link to="/register" className="btn-secondary text-lg">
            Become an Artisan
          </Link>
        </div>
      </section>
    </div>
  );
}