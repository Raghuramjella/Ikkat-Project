import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-xl mb-4">IkkatBazaar</h3>
            <p className="text-gray-400 text-sm">
              Empowering handloom artisans by connecting them directly with global customers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Sarees</a></li>
              <li><a href="#" className="hover:text-white transition">Dupattas</a></li>
              <li><a href="#" className="hover:text-white transition">Fabrics</a></li>
              <li><a href="#" className="hover:text-white transition">Accessories</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
              <FiMail />
              <span>info@ikkatbazaar.com</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-white transition"><FiTwitter size={20} /></a>
              <a href="#" className="hover:text-white transition"><FiInstagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 IkkatBazaar. All rights reserved. | Weaving a brighter future for handloom.</p>
        </div>
      </div>
    </footer>
  );
}