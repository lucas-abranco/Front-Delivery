import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
// Caminho corrigido para a sua estrutura de ficheiros
import FloatingCart from './components/FloatingCart/FloatingCart.jsx'; 
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

// A URL base da nossa API de back-end
const API_URL = 'http://localhost:3000';

function App() {
  // A lógica de autenticação (isLoggedIn, userType, user, token)
  // vem agora do nosso hook useAuth()
  const { isLoggedIn, userType, user, token } = useAuth();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState('');
  // O estado dos pedidos é gerido aqui, mas é preenchido pela API
  const [orders, setOrders] = useState([]); 
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);

  // --- LÓGICA DE DADOS (API) ---

  // Função para buscar os pedidos (Cliente ou Entregador)
  const fetchOrders = async () => {
    if (!token) return;
    
    let url = '';
    if (userType === 'client') {
      url = `${API_URL}/orders`; // Histórico do cliente
    } else if (userType === 'driver') {
      url = `${API_URL}/orders/available`; // Pedidos disponíveis
    } else {
      return;
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

  // Busca os pedidos sempre que o utilizador logado muda
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders();
    } else {
      setOrders([]); // Limpa os pedidos ao fazer logout
    }
  }, [isLoggedIn, token, userType]);

  // Função para criar um novo pedido (passada para o Checkout)
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
      fetchOrders(); // Atualiza a lista de pedidos do cliente
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // --- LÓGICA DO ENTREGADOR (API) ---
  
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
    const activeDelivery = orders.find(o => o.driverId === user?.id && o.status === 'Em rota de entrega');
    
    if (activeDelivery) {
      return (
        <CurrentDeliveryPage 
          delivery={activeDelivery} 
          onCompleteDelivery={handleCompleteDelivery} 
        />
      );
    }
    
    return (
      <DriverDashboardPage 
        orders={orders} // Passa os pedidos disponíveis (da API)
        onAcceptRoute={handleAcceptRoute} 
      />
    );
  };

  return (
    // O CartProvider envolve a aplicação, passando o estado de login
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        <Header onToggleOrders={() => { fetchClientOrders(); setOrdersModalOpen(true); }} />
        <FloatingCart />
        <OrdersModal 
          isOpen={isOrdersModalOpen} 
          onClose={() => setOrdersModalOpen(false)} 
          orders={orders.filter(o => o.userId === user?.id)} // Mostra apenas os pedidos do utilizador logado
        />
        
        {/* Define todas as rotas da aplicação */}
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