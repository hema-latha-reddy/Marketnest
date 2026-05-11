import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart" className="relative">
      <div className="p-2 hover:bg-gray-100 rounded-full transition">
        <ShoppingBag className="h-5 w-5 text-gray-700" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;