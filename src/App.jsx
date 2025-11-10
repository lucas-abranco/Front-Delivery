// Caminho: src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
// Caminhos corrigidos para corresponder à sua estrutura de pastas
import FloatingCart from './components/FloatingCart/FloatingCart.jsx'; 
import OrdersModal from './components/OrdersModal/OrdersModal.jsx';
import Header from './components/header/Header.jsx';
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
// Mocks de dados (como 'ordersData' e 'restaurants') foram removidos.

// A URL base da nossa API de back-end
const API_URL = 'http://localhost:3000';

function App() {
  const { isLoggedIn, userType, user, token } = useAuth();
 
  
  const [notification, setNotification] = useState('');
  const [orders, setOrders] = useState([]); // Começa vazio, será preenchido pela API
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);

  // --- LÓGICA DE DADOS (API) ---

  // Função para buscar os pedidos (Cliente ou Entregador)
  const fetchOrders = async () => {
    if (!token) return;
    
    let url = '';
    // Define a URL da API com base no tipo de utilizador
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

  // Efeito que busca os pedidos corretos quando o utilizador logado muda
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchOrders();
    } else {
      setOrders([]); // Limpa os pedidos ao fazer logout
    }
  }, [isLoggedIn, token, userType]); // Re-executa se o utilizador logado mudar

  // Função para criar um novo pedido via API (passada para o CheckoutPage)
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
    // O CartProvider envolve a aplicação, passando o estado de login
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        {/* O Header já não recebe props de login, ele obtém do useAuth() */}
        <Header onToggleOrders={() => { fetchOrders(); setOrdersModalOpen(true); }} /> 
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
          {/* O ProfilePage agora obtém o 'user' do useAuth() */}
          <Route path="/perfil" element={isLoggedIn ? <ProfilePage /> : <LoginPage />} />
          <Route path="/pedido-confirmado" element={<OrderConfirmationPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;