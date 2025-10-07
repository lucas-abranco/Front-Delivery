import React, { createContext, useState } from 'react';

// Criar o Contexto com um valor inicial para satisfazer o editor
export const CartContext = createContext({
  cartItems: [],
  isCartOpen: false,
  addToCart: () => {},
  removeFromCart: () => {},
  toggleCart: () => {},
  itemCount: 0,
  subtotal: '0.00',
  deliveryFee: 0,
  finalTotal: '0.00',
  isLoggedIn: false,
  setNotification: () => {},
});

export function CartProvider({ children, isLoggedIn, setNotification }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const deliveryFee = 6.90;

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(',', '.'));
    return total + (price * item.quantity);
  }, 0).toFixed(2);

  const finalTotal = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    toggleCart,
    itemCount,
    subtotal,
    deliveryFee,
    finalTotal,
    isLoggedIn,
    setNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

