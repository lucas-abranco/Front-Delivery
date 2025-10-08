import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import FloatingCart from './components/FloatingCart';
import OrdersModal from './components/OrdersModal/OrdersModal';
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
import ProfilePage from './pages/ProfilePage';
import OrderConfirmationPage from './pages/OrderConfirmationPage'; // Importar a nova página
import styles from './App.module.css';
import { initialUsers } from './data/users';
import { initialDrivers } from './data/drivers';
import { isValidCPF } from './utils/validators';

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notification, setNotification] = useState('');
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);

  const handleLogin = (email, password) => {
    const userFound = users.find(u => u.email === email && u.password === password);
    if (userFound) {
      setIsLoggedIn(true);
      setUserType('client');
      setCurrentUser(userFound);
      navigate('/');
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentUser(null);
    navigate('/');
  };
  
  const handleUpdateUser = (formData) => {
    const userToUpdate = users.find(u => u.id === currentUser.id);
    if (formData.newPassword) {
      if (userToUpdate.password !== formData.currentPassword) {
        return false;
      }
    }
    const updatedData = {
      name: formData.name,
      email: formData.email,
      password: formData.newPassword ? formData.newPassword : userToUpdate.password,
    };
    const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u);
    setUsers(updatedUsers);
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    return true;
  };
  
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
    if (!isValidCPF(newUserData.cpf)) {
      return { success: false, message: 'O CPF informado é inválido.' };
    }
    if (users.some(u => u.cpf === newUserData.cpf)) {
      return { success: false, message: 'Este CPF já está cadastrado.' };
    }
    if (users.some(u => u.email === newUserData.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newUser = { id: users.length + 1, ...newUserData };
    setUsers(prev => [...prev, newUser]);
    setNotification('Cliente registado com sucesso! Faça o login.');
    navigate('/login');
    return { success: true };
  };

  const handleSignupDriver = (newDriverData) => {
    if (!isValidCPF(newDriverData.cpf)) {
      return { success: false, message: 'O CPF informado é inválido.' };
    }
    if (drivers.some(d => d.cpf === newDriverData.cpf)) {
      return { success: false, message: 'Este CPF já está cadastrado.' };
    }
    if (drivers.some(d => d.email === newDriverData.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const newDriver = { id: drivers.length + 1, ...newDriverData };
    setDrivers(prev => [...prev, newDriver]);
    setNotification('Registo de entregador realizado! Faça o seu login.');
    navigate('/login-entregador');
    return { success: true };
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
          {/* ROTA ADICIONADA AQUI */}
          <Route path="/pedido-confirmado" element={<OrderConfirmationPage />} />
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;

