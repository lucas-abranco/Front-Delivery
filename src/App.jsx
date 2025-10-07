import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
// CORREÇÃO AQUI: O caminho foi ajustado para corresponder à sua estrutura de ficheiros
import FloatingCart from './components/FloatingCart.jsx'; 
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
import styles from './App.module.css';
import { initialUsers } from './data/users';
import { initialDrivers } from './data/drivers';
import { isValidCPF } from './utils/validators';

function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(initialUsers);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notification, setNotification] = useState('');

  const handleLogin = (email, password) => {
    const userFound = users.find(u => u.email === email && u.password === password);
    if (userFound) {
      setIsLoggedIn(true);
      setUserType('client');
      navigate(-1) || navigate('/');
      return true;
    }
    return false;
  };

  const handleLoginDriver = (email, password) => {
    const driverFound = drivers.find(d => d.email === email && d.password === password);
    if (driverFound) {
      setIsLoggedIn(true);
      setUserType('driver');
      navigate('/');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  const handleSignup = (newUserData) => {
    if (!isValidCPF(newUserData.cpf) || users.some(u => u.email === newUserData.email || u.cpf === newUserData.cpf)) return false;
    setUsers(prev => [...prev, { id: users.length + 1, ...newUserData }]);
    setNotification('Cliente registado com sucesso! Faça o login.');
    navigate('/login');
    return true;
  };

  const handleSignupDriver = (newDriverData) => {
    if (!isValidCPF(newDriverData.cpf) || drivers.some(d => d.email === newDriverData.email || d.cpf === newDriverData.cpf)) return false;
    setDrivers(prev => [...prev, { id: drivers.length + 1, ...newDriverData }]);
    setNotification('Registo de entregador realizado! Faça o seu login.');
    navigate('/login-entregador');
    return true;
  };

  return (
    <CartProvider isLoggedIn={isLoggedIn} setNotification={setNotification}>
      <div className={styles.appWrapper}>
        <Header isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
        <FloatingCart />
        
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
        </Routes>
      </div>
    </CartProvider>
  );
}
export default App;

