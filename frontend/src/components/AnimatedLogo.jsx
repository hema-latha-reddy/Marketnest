import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const AnimatedLogo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 5000); // Bounce every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Icon */}
      <div className={`relative`}>
        <div className={`bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl transition-all duration-300 ${
          isHovered ? 'scale-110 rotate-6' : bounce ? 'animate-bounce' : ''
        }`}>
          <ShoppingBag className={`h-6 w-6 text-white transition-all duration-300 ${
            isHovered ? 'scale-110' : ''
          }`} />
        </div>
        
        {/* Glow effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-50 -z-10"></div>
        )}
      </div>
      
      {/* Text with animation */}
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${
          isHovered ? 'tracking-wide' : ''
        }`}>
          Market
        </span>
        <span className={`text-2xl font-bold text-purple-600 transition-all duration-300 ${
          isHovered ? 'tracking-wide' : ''
        }`}>
          Nest
        </span>
      </div>
      
      {/* Tagline that fades in on hover */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isHovered ? 'max-w-[120px] ml-2 opacity-100' : 'max-w-0 opacity-0'
      }`}>
        <span className="text-xs text-gray-500 whitespace-nowrap">Fashion Hub</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;