import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Importa o AuthContext para obter o token

const API_URL = 'http://localhost:3000';

// 1. Cria o Contexto
export const CartContext = createContext();

// 2. Cria o Hook (como o seu Canvas, o Header.jsx, o utiliza)
export function useCart() {
  return useContext(CartContext);
}

// 3. O Provedor com a nova lógica de API
export function CartProvider({ children, isLoggedIn, setNotification }) {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState('0.00');
  const [itemCount, setItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { token } = useAuth(); // Obtém o token do contexto de autenticação

  const deliveryFee = 6.90; // Taxa de entrega fixa

  // --- FUNÇÃO PARA BUSCAR O CARRINHO DA API ---
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]); // Se não há token, o carrinho está vazio
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar carrinho.');
      
      const data = await response.json();
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Efeito que busca o carrinho da API assim que o utilizador faz login
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCart();
    } else {
      setCartItems([]); // Limpa o carrinho se o utilizador fizer logout
    }
  }, [isLoggedIn, token]);

  // Atualiza a contagem de itens sempre que o cartItems mudar
  useEffect(() => {
    setItemCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  // --- FUNÇÕES DE API ---

  const addToCart = async (item) => {
    if (!token) {
      setNotification('Você precisa estar logado para adicionar itens.');
      return; 
    }
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: item.id, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Falha ao adicionar item.');
      
      const data = await response.json();
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeFromCart = async (productId) => {
     try {
      const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao remover item.');
      
      const data = await response.json();
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  const increaseQuantity = async (productId) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;
    
    try {
      const response = await fetch(`${API_URL}/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar quantidade.');
      
      const data = await response.json();
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    // Se a quantidade for 1, remove o item
    if (item.quantity <= 1) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar quantidade.');
      
      const data = await response.json();
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems([]);
      setSubtotal('0.00');
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  const finalTotal = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    toggleCart,
    itemCount,
    subtotal,
    deliveryFee,
    finalTotal,
    isLoggedIn, // Passa o estado de login
    setNotification, // Passa a função de notificação
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

