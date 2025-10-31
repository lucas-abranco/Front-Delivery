import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
// CORREÇÃO: O caminho foi ajustado para corresponder à sua estrutura de ficheiros
import FloatingCart from './components/FloatingCart.jsx'; 
import OrdersModal from './components/OrdersModal/OrdersModal';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoginDriverPage from './pages/LoginDriverPage';
import SignupPage from './pages/SignupPage';
import SignupDriverPage from './pages/SignupDriverPage';
import DriverDashboardPage from './pages/DriverDashboardPage';
import CurrentDeliveryPage from './pages/CurrentDeliveryPage';
import RestaurantListPage from './pages/RestaurantListPage';
import RestaurantPage from './pages/RestaurantPage';
import PharmacyPage from './pages/PharmacyPage';
import PetShopPage from './pages/PetShopPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import styles from './App.module.css';
// REMOVIDO: As importações de 'ordersData' e 'restaurants' foram apagadas.

// Define a URL base da nossa API de back-end
const API_URL = 'http://localhost:3000';

function App() {
  const { isLoggedIn, userType, user, token } = useAuth();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState('');
  const [orders, setOrders] = useState([]); // Começa vazio, será preenchido pela API
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);

  // --- LÓGICA DE DADOS (API) ---

  // Função para buscar os pedidos (usada pelo Cliente e Entregador)
  const fetchOrders = async () => {
    if (!token) return;
    
    let url = '';
    if (userType === 'client') {
      url = `${API_URL}/orders`; // Rota de pedidos do cliente
    } else if (userType === 'driver') {
      // Rota de pedidos disponíveis para o entregador
      url = `${API_URL}/orders/available`; 
    } else {
      return; // Se não for nenhum dos dois, não faz nada
    }

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar pedidos.');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Efeito que busca os pedidos corretos quando o utilizador logado muda
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders();
    } else {
      setOrders([]); // Limpa os pedidos ao fazer logout
    }
  }, [isLoggedIn, token, userType]);


  // Função para criar um novo pedido via API
  const handleConfirmOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Falha ao criar pedido.');
      await response.json();
      fetchOrders(); // Atualiza a lista de pedidos após a criação
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // Função para aceitar uma rota via API
  const handleAcceptRoute = async (orderId) => {
     try {
      await fetch(`${API_URL}/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Rota aceite!');
      fetchOrders(); // Atualiza a lista de pedidos disponíveis
    } catch (error) {
      console.error(error.message);
    }
  };

  // Função para completar uma entrega via API
  const handleCompleteDelivery = async (orderId) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Entrega concluída!');
      fetchOrders(); // Atualiza a lista (para voltar ao Dashboard)
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // Define qual página o entregador vê
  const renderDriverPage = () => {
    // Procura na lista de pedidos (vinda da API) se há uma entrega ativa
    const activeDelivery = orders.find(o => o.driverId === user?.id && o.status === 'Em rota de entrega');
    
    if (activeDelivery) {
      return (
        <CurrentDeliveryPage 
          delivery={activeDelivery} 
          onCompleteDelivery={handleCompleteDelivery} 
        />
      );
    }
    
    // Passa os pedidos disponíveis (da API) para o painel
    return (
      <DriverDashboardPage 
        orders={orders} 
        onAcceptRoute={handleAcceptRoute} 
      />
    );
  };

  return (
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        <Header onToggleOrders={() => { fetchOrders(); setOrdersModalOpen(true); }} />
        <FloatingCart />
        <OrdersModal 
          isOpen={isOrdersModalOpen} 
          onClose={() => setOrdersModalOpen(false)} 
          orders={orders.filter(o => o.userId === user?.id)}
        />
        
        <Routes>
          <Route path="/" element={isLoggedIn && userType === 'driver' ? renderDriverPage() : <HomePage />} />
          <Route path="/login" element={<LoginPage notification={notification} setNotification={setNotification} />} />
          <Route path="/login-entregador" element={<LoginDriverPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/cadastro-entregador" element={<SignupDriverPage />} />
          <Route path="/restaurantes/:category" element={<RestaurantListPage />} />
          <Route path="/restaurantes" element={<RestaurantListPage />} />
          <Route path="/restaurante/:restaurantId" element={<RestaurantPage />} />
          <Route path="/farmacia/:pharmacyId" element={<PharmacyPage />} />
          <Route path="/petshop/:petShopId" element={<PetShopPage />} />
          <Route path="/finalizar-pedido" element={isLoggedIn ? <CheckoutPage onConfirmOrder={handleConfirmOrder} /> : <LoginPage />} />
          <Route path="/perfil" element={isLoggedIn ? <ProfilePage /> : <LoginPage />} />
          <Route path="/pedido-confirmado" element={<OrderConfirmationPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;

