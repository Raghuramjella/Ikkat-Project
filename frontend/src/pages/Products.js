import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import useCartStore from '../store/cartStore';
import { useToast } from '../App';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();
  const { showToast } = useToast();
  const limit = 12;

  useEffect(() => {
    fetchProducts();
  }, [category, search, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/products', {
        params: {
          category: category || undefined,
          search: search || undefined,
          page,
          limit
        }
      });
      setProducts(data.products);
      setTotalPages(data.pagination?.pages || 1);
      setTotalProducts(data.pagination?.total || data.products.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Unable to fetch products right now', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const status = addToCart({ ...product, id: product._id });
    if (status === 'updated') {
      showToast('Increased quantity in cart', 'info');
    } else {
      showToast('Added to cart', 'success');
    }
  };

  const categories = ['sarees', 'dupattas', 'fabrics', 'clothing', 'accessories', 'home-decor'];
  const startItem = products.length === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = products.length === 0 ? 0 : Math.min((page - 1) * limit + products.length, totalProducts);
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const buttons = [];
    for (let i = start; i <= end; i += 1) {
      buttons.push(i);
    }
    return buttons;
  }, [page, totalPages]);

  const handlePageChange = (nextPage) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Handloom Products</h1>

      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCategory('');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg transition ${
              category === '' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
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
        <>
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span>Showing {startItem}-{endItem} of {totalProducts}</span>
            <span>Page {page} of {totalPages}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
              <div key={product._id} className="card relative">
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                  {index + 1 + (page - 1) * limit}
                </span>
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
                  onClick={() => handleAddToCart(product)}
                  className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {pageNumbers.length > 0 && pageNumbers[0] > 1 && (
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  1
                </button>
              )}

              {pageNumbers.length > 0 && pageNumbers[0] > 2 && <span className="px-2">...</span>}

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`px-3 py-1 rounded border ${
                    num === page ? 'border-orange-500 text-orange-600' : 'border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}

              {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2">...</span>
              )}

              {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}