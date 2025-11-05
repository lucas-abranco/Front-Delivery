import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
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
// Mocks de dados foram removidos. A aplicação é agora 100% baseada na API.

const API_URL = 'http://localhost:3000';

function App() {
  const { isLoggedIn, userType, user, token } = useAuth();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState('');
  // O estado dos pedidos (orders) foi removido. Os componentes agora buscam os seus próprios dados.
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);

  // --- LÓGICA DE DADOS (API) ---

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
      // (O OrdersModal agora irá buscar os pedidos atualizados quando for aberto)
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
    } catch (error) {
      console.error(error.message);
    }
  };
  
  // Define qual página o entregador vê
  const renderDriverPage = () => {
    // A lógica de qual página mostrar (Dashboard vs Entrega Ativa)
    // será movida para dentro dos próprios componentes.
    // O App.jsx agora apenas renderiza o ponto de entrada do fluxo do motorista.
    return (
      <DriverDashboardPage 
        onAcceptRoute={handleAcceptRoute}
        onCompleteDelivery={handleCompleteDelivery}
      />
    );
  };

  return (
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        <Header onToggleOrders={() => setOrdersModalOpen(true)} />
        <FloatingCart />
        <OrdersModal 
          isOpen={isOrdersModalOpen} 
          onClose={() => setOrdersModalOpen(false)}
          // O OrdersModal agora buscará os seus próprios dados
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
          {/* CORREÇÃO: A rota de Perfil agora passa a função de update correta */}
          <Route path="/perfil" element={isLoggedIn ? <ProfilePage /> : <LoginPage />} />
          <Route path="/pedido-confirmado" element={<OrderConfirmationPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;

