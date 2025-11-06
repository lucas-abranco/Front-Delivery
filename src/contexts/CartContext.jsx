import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Importa o AuthContext para obter o token

const API_URL = 'http://localhost:3000';

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children, isLoggedIn, setNotification }) {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState('0.00');
  const [itemCount, setItemCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // 1. ESTADO-CHAVE: Guarda o ID da loja do pedido atual
  const [storeId, setStoreId] = useState(localStorage.getItem('cartStoreId') || null);
  
  const { token } = useAuth();

  const deliveryFee = 6.90;

  // Função para buscar o carrinho da API
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar carrinho.');
      
      const data = await response.json();
      
      // 2. Tenta inferir o storeId a partir dos itens (se o back-end o enviar)
      //    Se não, mantém o que está no localStorage
      if (data.items.length > 0 && data.items[0].storeId) {
        setStoreId(data.items[0].storeId);
        localStorage.setItem('cartStoreId', data.items[0].storeId);
      } else if (data.items.length === 0) {
        setStoreId(null);
        localStorage.removeItem('cartStoreId');
      }
      
      setCartItems(data.items);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCart();
    } else {
      setCartItems([]);
      setStoreId(null);
      localStorage.removeItem('cartStoreId');
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    setItemCount(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = async (item) => {
    if (!token) {
      setNotification('Você precisa estar logado para adicionar itens.');
      return; 
    }
    
    // 3. LÓGICA DE LOJA ÚNICA: Verifica se o carrinho já tem itens de outra loja
    if (cartItems.length > 0 && storeId !== item.storeId) {
      alert("Você só pode adicionar itens de um restaurante por vez. Limpe o seu carrinho para continuar.");
      return;
    }
    
    // 4. Guarda o ID da loja no estado e no localStorage
    setStoreId(item.storeId);
    localStorage.setItem('cartStoreId', item.storeId);

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
  
  // Função auxiliar para atualizar o estado após uma modificação
  const handleCartUpdate = (data) => {
    setCartItems(data.items);
    setSubtotal(data.subtotal);
    if (data.items.length === 0) {
      setStoreId(null); // Limpa o ID da loja se o carrinho ficar vazio
      localStorage.removeItem('cartStoreId');
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
      handleCartUpdate(data);
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar quantidade.');
      const data = await response.json();
      handleCartUpdate(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;
    if (item.quantity <= 1) {
      await removeFromCart(productId);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/cart/update/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar quantidade.');
      const data = await response.json();
      handleCartUpdate(data);
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
      setStoreId(null);
      localStorage.removeItem('cartStoreId');
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
    storeId, // Exporta o ID da loja
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
    isLoggedIn,
    setNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}