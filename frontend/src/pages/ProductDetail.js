import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiStar } from 'react-icons/fi';
import client from '../api/client';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useToast } from '../App';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const { addToCart } = useCartStore();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data: productData } = await client.get(`/products/${id}`);
      setProduct(productData);
      try {
        const { data: reviewsData } = await client.get(`/products/${id}/reviews`);
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        console.log('Error fetching reviews:', err);
        showToast('Unable to load reviews', 'warning');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('Product is unavailable', 'error');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewMessage('');

    try {
      await client.post(`/products/${id}/review`, {
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      });
      setReviewMessage('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchProduct();
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="container-custom py-12">Loading...</div>;
  if (!product) return <div className="container-custom py-12">Product not found</div>;

  return (
    <div className="container-custom py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-orange-600 hover:text-orange-700 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 mb-4 overflow-hidden">
            <img
              src={product.thumbnail || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="bg-gray-200 rounded h-20 cursor-pointer hover:opacity-75">
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={i < Math.round(product.rating || 0) ? "fill-current" : ""}
                />
              ))}
            </div>
            <span className="ml-2 font-semibold">{product.rating ? product.rating.toFixed(1) : 'No'}</span>
            <span className="ml-2 text-gray-600">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-orange-600">₹{product.finalPrice}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-500 line-through ml-4">₹{product.price}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded ml-4 text-sm">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
            {product.details?.material && <p><strong>Material:</strong> {product.details.material}</p>}
            {product.details?.color && <p><strong>Color:</strong> {product.details.color}</p>}
            {product.details?.size && <p><strong>Size:</strong> {product.details.size}</p>}
            {product.details?.careInstructions && <p><strong>Care:</strong> {product.details.careInstructions}</p>}
          </div>

          {/* Inventory Status */}
          <div className="mb-6">
            <p className={`text-lg font-semibold ${product.inventory.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.inventory.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-0 focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({ ...product, id: product._id });
                }
                navigate('/cart');
              }}
              disabled={product.inventory.quantity === 0}
              className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Artisan Info */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-2">Sold by</p>
            <p className="font-bold text-lg">{product.artisanId?.businessName}</p>
            <p className="text-sm text-gray-600">Verified Seller ✓</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Add Review Button */}
        {user && user.role === 'customer' && (
          <div className="mb-8">
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary"
              >
                Write a Review
              </button>
            ) : (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                {reviewMessage && (
                  <div className={`p-3 rounded mb-4 ${reviewMessage.includes('Error') || reviewMessage.includes('cannot') || reviewMessage.includes('only') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {reviewMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Bad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Share your experience with this product..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="btn-primary disabled:opacity-50"
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{review.customerName || review.customerId?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={i < review.rating ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
}