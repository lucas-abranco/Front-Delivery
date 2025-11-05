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
  // 1. NOVO ESTADO: Vamos guardar o ID da loja aqui
  const [storeId, setStoreId] = useState(null); 
  
  const { token } = useAuth();

  const deliveryFee = 6.90;

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
      setCartItems(data.items);
      setSubtotal(data.subtotal);
      
      // 2. Tenta inferir o storeId a partir do back-end (embora ele não o envie)
      //    A lógica principal será no addToCart
      if (data.items.length > 0) {
        // Esta é a limitação: a API não nos diz o storeId aqui.
        // Vamos confiar no 'addToCart' para o definir.
      } else {
        setStoreId(null); // Limpa o ID da loja se o carrinho estiver vazio
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchCart();
    } else {
      setCartItems([]);
      setStoreId(null); // Limpa o ID da loja no logout
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
    
    // 3. LÓGICA DE LOJA ÚNICA
    if (cartItems.length > 0 && storeId !== item.storeId) {
      alert("Você só pode adicionar itens de um restaurante por vez. Limpe o seu carrinho para continuar.");
      return;
    }
    
    // 4. Guarda o ID da loja no momento em que o primeiro item é adicionado
    setStoreId(item.storeId);

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
      
      // 5. Adiciona manualmente o storeId aos itens (porque o back-end não o envia)
      const newCartItems = data.items.map(cartItem => ({
        ...cartItem,
        storeId: item.storeId // Adiciona o storeId que temos
      }));

      setCartItems(newCartItems);
      setSubtotal(data.subtotal);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // ... (funções removeFromCart, increaseQuantity, decreaseQuantity) ...
  // Estas funções também precisam de ser atualizadas para usar a nova lógica
  
  const updateCartItems = (data) => {
      const newCartItems = data.items.map(cartItem => ({
        ...cartItem,
        storeId: storeId // Mantém o storeId que já tínhamos
      }));
      setCartItems(newCartItems);
      setSubtotal(data.subtotal);
      if (newCartItems.length === 0) {
        setStoreId(null); // Limpa o ID da loja se o carrinho ficar vazio
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
      updateCartItems(data);
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
      updateCartItems(data);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar quantidade.');
      const data = await response.json();
      updateCartItems(data);
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
      setStoreId(null); // Limpa o ID da loja
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
    storeId, // 6. Exporta o storeId
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

