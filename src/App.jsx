// Controlador Principal Atualizado:src/App.jsx
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import FloatingCart from './components/FloatingCart';
import OrdersModal from './components/OrdersModal/OrdersModal'; // Importar o novo modal
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoginDriverPage from './pages/LoginDriverPage';
import SignupPage from './pages/SignupPage';
import SignupDriverPage from './pages/SignupDriverPage';
import DriverDashboardPage from './pages/DriverDashboardPage';
import RestaurantPage from './pages/RestaurantPage';
import PharmacyPage from './pages/PharmacyPage';
import PetShopPage from './pages/PetShopPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage'; // Importar a nova página
import styles from './App.module.css';
import { initialUsers } from './data/users';
import { initialDrivers } from './data/drivers';
import { isValidCPF } from './utils/validators';

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [currentUser, setCurrentUser] = useState(null); // Guardar dados do user logado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notification, setNotification] = useState('');
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false); // Estado para o modal de pedidos

  const handleLogin = (email, password) => {
    const userFound = users.find(u => u.email === email && u.password === password);
    if (userFound) {
      setIsLoggedIn(true);
      setUserType('client');
      setCurrentUser(userFound); // Guarda os dados do utilizador
      navigate('/');
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentUser(null); // Limpa os dados do utilizador
    navigate('/');
  };
  
  // Função para atualizar os dados do utilizador
  const handleUpdateUser = (updatedData) => {
    // Não atualiza se a password estiver vazia
    const dataToUpdate = { ...updatedData };
    if (!dataToUpdate.password) {
      delete dataToUpdate.password;
    }
    
    // Atualiza o "banco de dados" e o estado do utilizador atual
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...dataToUpdate } : u));
    setCurrentUser(prev => ({ ...prev, ...dataToUpdate }));
    console.log("Utilizador atualizado:", users.find(u => u.id === currentUser.id));
  };
  
  // ... (outras funções handle sem alterações) ...
  const handleLoginDriver = (email, password) => {
    const driverFound = drivers.find(d => d.email === email && d.password === password);
    if (driverFound) {
      setIsLoggedIn(true);
      setUserType('driver');
      setCurrentUser(driverFound);
      navigate('/');
      return true;
    }
    return false;
  };

  const handleSignup = (newUserData) => {
    if (!isValidCPF(newUserData.cpf) || users.some(u => u.email === newUserData.email || u.cpf === newUserData.cpf)) return false;
    const newUser = { id: users.length + 1, ...newUserData };
    setUsers(prev => [...prev, newUser]);
    setNotification('Cliente registado com sucesso! Faça o login.');
    navigate('/login');
    return true;
  };

  const handleSignupDriver = (newDriverData) => {
    if (!isValidCPF(newDriverData.cpf) || drivers.some(d => d.email === newDriverData.email || d.cpf === newDriverData.cpf)) return false;
    const newDriver = { id: drivers.length + 1, ...newDriverData };
    setDrivers(prev => [...prev, newDriver]);
    setNotification('Registo de entregador realizado! Faça o seu login.');
    navigate('/login-entregador');
    return true;
  };

  return (
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        <Header isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} onToggleOrders={() => setOrdersModalOpen(true)} />
        <FloatingCart />
        <OrdersModal isOpen={isOrdersModalOpen} onClose={() => setOrdersModalOpen(false)} />
        
        <Routes>
          <Route path="/" element={isLoggedIn && userType === 'driver' ? <DriverDashboardPage /> : <HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} notification={notification} setNotification={setNotification} />} />
          <Route path="/login-entregador" element={<LoginDriverPage onLoginDriver={handleLoginDriver} />} />
          <Route path="/cadastro" element={<SignupPage onSignup={handleSignup} />} />
          <Route path="/cadastro-entregador" element={<SignupDriverPage onSignupDriver={handleSignupDriver} />} />
          <Route path="/restaurante/:restaurantId" element={<RestaurantPage />} />
          <Route path="/farmacia/:pharmacyId" element={<PharmacyPage />} />
          <Route path="/petshop/:petShopId" element={<PetShopPage />} />
          <Route path="/finalizar-pedido" element={isLoggedIn ? <CheckoutPage /> : <LoginPage />} />
          <Route path="/perfil" element={<ProfilePage user={currentUser} onUpdate={handleUpdateUser} />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;