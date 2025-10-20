import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import useCartStore from '../store/cartStore';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/products', {
        params: { category: category || undefined, search: search || undefined }
      });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['sarees', 'dupattas', 'fabrics', 'clothing', 'accessories', 'home-decor'];

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Handloom Products</h1>

      <div className="mb-8 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg transition ${
              category === '' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg transition capitalize ${
                category === cat ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card">
              <Link to={`/products/${product._id}`}>
                <div className="bg-gray-200 h-48 rounded-lg mb-4 overflow-hidden hover:scale-105 transition">
                  <img
                    src={product.thumbnail || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-orange-600">₹{product.finalPrice}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500" />
                  <span className="text-sm ml-1">{product.rating || 0}</span>
                </div>
              </div>

              <button
                onClick={() => addToCart({ ...product, id: product._id })}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}