import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';
import AnimatedLogo from './AnimatedLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <AnimatedLogo />
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'brand' ? (
                  <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/marketplace" className="text-gray-700 hover:text-gray-900 font-medium">
                    Marketplace
                  </Link>
                )}
                
                {/* Cart Icon - Only show for customers */}
                {user.role === 'customer' && <CartIcon />}
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;