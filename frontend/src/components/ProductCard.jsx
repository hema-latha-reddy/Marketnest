import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, userRole, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const API_BASE_URL = "https://marketnest-goea.onrender.com";

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.images?.[0] ? `${API_BASE_URL}/api/products${product.images[0]}` : 'https://images.unsplash.com/photo-1539109132314-64775a600d7c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Requirement: Brand sees status [cite: 64, 72] */}
        {userRole === 'brand' && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full shadow-md ${
              product.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              {product.status}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">{product.category}</p>
            <h3 className="text-xl font-bold text-slate-900 truncate">{product.name}</h3>
          </div>
          <span className="text-xl font-black text-slate-900">₹{product.price}</span>
        </div>

        <div className="mt-6 flex gap-3">
          {/* Requirement: Role-based Action [cite: 66, 67, 81] */}
          {userRole === 'brand' ? (
            <>
              <button 
                onClick={() => onEdit(product)}
                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-colors uppercase tracking-widest"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(product._id)}
                className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-2xl text-xs font-bold hover:bg-rose-100 transition-colors uppercase tracking-widest"
              >
                Archive
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate(`/product/${product._id}`)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
            >
              View Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;