import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, Truck, Shield, RotateCcw, Heart, ShoppingBag, Plus, Minus, CheckCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={20} /> Back to Marketplace
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={product.images?.[selectedImage]} 
                  alt={product.name}
                  className="w-full h-96 object-cover hover:scale-105 transition duration-500"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === idx ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Heart className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} size={24} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.2 (128 reviews)</span>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
                <span className="text-gray-500 line-through ml-3">₹{Math.round(product.price * 1.2)}</span>
                <span className="text-green-600 ml-2">20% off</span>
              </div>

              <div className="border-t border-b py-6 mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 border border-gray-300 rounded-xl">
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 hover:bg-gray-100 transition rounded-l-xl"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-3 hover:bg-gray-100 transition rounded-r-xl"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">In stock (10+ items)</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck size={20} />
                  <span>Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield size={20} />
                  <span>2 year warranty</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw size={20} />
                  <span>30 days return policy</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} /> Add to Cart
                </button>
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                  Buy Now
                </button>
              </div>

              {addedToCart && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle size={18} />
                  Item added to cart! <Link to="/cart" className="font-semibold underline">View Cart</Link>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                Sold by: {product.brand?.name || 'MarketNest'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;