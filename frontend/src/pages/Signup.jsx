import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { User, Mail, Lock, Store, ShoppingBag, Sparkles, Eye, EyeOff, CheckCircle, XCircle, Shield } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation checks
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password as user types
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const validatePassword = () => {
    return passwordValidation.minLength && 
           passwordValidation.hasUpperCase && 
           passwordValidation.hasLowerCase && 
           passwordValidation.hasNumber && 
           passwordValidation.hasSpecialChar;
  };

  const getPasswordStrength = () => {
    const checks = Object.values(passwordValidation).filter(Boolean).length;
    if (checks <= 2) return { text: 'Weak', color: 'text-red-500', bg: 'bg-red-100' };
    if (checks <= 3) return { text: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (checks <= 4) return { text: 'Good', color: 'text-blue-500', bg: 'bg-blue-100' };
    return { text: 'Strong', color: 'text-green-500', bg: 'bg-green-100' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (!validatePassword()) {
      setError('Please meet all password requirements');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      if (user.role === 'brand') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join MarketNest
          </h2>
          <p className="mt-2 text-gray-600">Start your fashion journey today</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements Box - Always visible */}
              <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Password Requirements:</span>
                  {formData.password && (
                    <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${strength.bg} ${strength.color}`}>
                      {strength.text} Password
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.minLength ? 
                      <CheckCircle size={16} className="text-green-500" /> : 
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    <span className={passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}>
                      At least <strong>8 characters</strong> long
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasUpperCase ? 
                      <CheckCircle size={16} className="text-green-500" /> : 
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    <span className={passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                      At least <strong>1 uppercase letter</strong> (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasLowerCase ? 
                      <CheckCircle size={16} className="text-green-500" /> : 
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    <span className={passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                      At least <strong>1 lowercase letter</strong> (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasNumber ? 
                      <CheckCircle size={16} className="text-green-500" /> : 
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                      At least <strong>1 number</strong> (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasSpecialChar ? 
                      <CheckCircle size={16} className="text-green-500" /> : 
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                    <span className={passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                      At least <strong>1 special character</strong> (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <XCircle size={12} /> Passwords do not match
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> Passwords match
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'customer'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <ShoppingBag className={`mx-auto mb-2 ${formData.role === 'customer' ? 'text-blue-600' : 'text-gray-400'}`} size={24} />
                  <div className={`font-semibold ${formData.role === 'customer' ? 'text-blue-600' : 'text-gray-700'}`}>Customer</div>
                  <p className="text-xs text-gray-500 mt-1">Browse & Shop</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'brand' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'brand'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Store className={`mx-auto mb-2 ${formData.role === 'brand' ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
                  <div className={`font-semibold ${formData.role === 'brand' ? 'text-purple-600' : 'text-gray-700'}`}>Brand</div>
                  <p className="text-xs text-gray-500 mt-1">Sell Products</p>
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !validatePassword() || formData.password !== formData.confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;