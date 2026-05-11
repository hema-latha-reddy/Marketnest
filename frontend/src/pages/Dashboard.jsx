import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Archive, 
  Package, 
  TrendingUp, 
  Trash2,
  X,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  EyeOff
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, published: 0, archived: 0 });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'draft',
    images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400']
  });

  useEffect(() => {
    if (user && user.role !== 'brand') {
      navigate('/marketplace');
      return;
    }
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [products, activeFilter, searchTerm]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const summaryRes = await api.get('/products/brand/summary');
      setStats(summaryRes.data);
      const productsRes = await api.get('/products/brand/products');
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    // Apply active filter
    if (activeFilter === 'published') {
      filtered = filtered.filter(p => p.status === 'published' && !p.isArchived);
    } else if (activeFilter === 'archived') {
      filtered = filtered.filter(p => p.isArchived === true);
    } else {
      filtered = filtered.filter(p => !p.isArchived);
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Archive this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchDashboardData();
      } catch (error) {
        alert('Failed to archive product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      status: formData.status,
      images: Array.isArray(formData.images) ? formData.images : [formData.images]
    };
    
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', status: 'draft', images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'] });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to save product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <p className="text-blue-100">Here's what's happening with your marketplace today.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <Plus size={20} /> Create New Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setActiveFilter('all')}
            className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              activeFilter === 'all' ? 'scale-105' : ''
            }`}
          >
            <div className={`bg-white rounded-2xl shadow-lg p-6 border-b-4 ${
              activeFilter === 'all' ? 'border-blue-500' : 'border-transparent'
            } hover:shadow-xl transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Products</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">{stats.total}</p>
                  <p className="text-green-500 text-sm mt-2">All products</p>
                </div>
                <div className="bg-blue-100 rounded-full p-4">
                  <Package className="text-blue-600" size={32} />
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('published')}
            className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              activeFilter === 'published' ? 'scale-105' : ''
            }`}
          >
            <div className={`bg-white rounded-2xl shadow-lg p-6 border-b-4 ${
              activeFilter === 'published' ? 'border-green-500' : 'border-transparent'
            } hover:shadow-xl transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Published</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.published}</p>
                  <p className="text-green-500 text-sm mt-2">Live on marketplace</p>
                </div>
                <div className="bg-green-100 rounded-full p-4">
                  <TrendingUp className="text-green-600" size={32} />
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveFilter('archived')}
            className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              activeFilter === 'archived' ? 'scale-105' : ''
            }`}
          >
            <div className={`bg-white rounded-2xl shadow-lg p-6 border-b-4 ${
              activeFilter === 'archived' ? 'border-red-500' : 'border-transparent'
            } hover:shadow-xl transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Archived</p>
                  <p className="text-4xl font-bold text-red-600 mt-2">{stats.archived}</p>
                  <p className="text-red-500 text-sm mt-2">In archive</p>
                </div>
                <div className="bg-red-100 rounded-full p-4">
                  <Archive className="text-red-600" size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilter !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {activeFilter === 'published' ? 'Published Only' : 'Archived Only'}
                <button onClick={() => setActiveFilter('all')} className="hover:text-blue-600">
                  <X size={14} />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-gray-600">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'archived' 
                ? 'You have no archived products.' 
                : activeFilter === 'published'
                ? 'No published products yet.'
                : 'Get started by creating your first product'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Create Your First Product
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.isArchived 
                        ? 'bg-red-500 text-white'
                        : product.status === 'published' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                    }`}>
                      {product.isArchived ? 'Archived' : product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-3">₹{product.price}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>
                  {!product.isArchived && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setFormData({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            status: product.status,
                            images: product.images
                          });
                          setShowModal(true);
                        }}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <Archive size={16} /> Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isArchived 
                            ? 'bg-red-100 text-red-800'
                            : product.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.isArchived ? 'Archived' : product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!product.isArchived && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setFormData({
                                  name: product.name,
                                  description: product.description,
                                  price: product.price,
                                  category: product.category,
                                  status: product.status,
                                  images: product.images
                                });
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Archive size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal with better design */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft (Not visible to customers)</option>
                  <option value="published">Published (Visible to customers)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images[0] && (
                  <div className="mt-2">
                    <img src={formData.images[0]} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;