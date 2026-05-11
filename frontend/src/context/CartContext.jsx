import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('marketnest_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          updateCartSummary(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('marketnest_cart', JSON.stringify(cartItems));
      updateCartSummary(cartItems);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const updateCartSummary = (items) => {
    const count = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product._id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      } else {
        return [...prevItems, {
          id: product._id,
          name: product.name || 'Unknown Product',
          price: product.price || 0,
          image: product.images?.[0] || 'https://via.placeholder.com/300',
          category: product.category || 'Uncategorized',
          quantity: quantity
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};