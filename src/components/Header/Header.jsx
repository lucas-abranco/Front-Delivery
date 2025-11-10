import React from 'react'; // O useContext e CartContext não são mais necessários
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../contexts/AuthContext';
// O CartContext não é mais importado aqui

function Header({ onToggleOrders }) {
  const { isLoggedIn, userType, logout } = useAuth();
  // toggleCart e itemCount foram removidos
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redireciona para a home após o logout
  };

  // Lógica para esconder os botões de autenticação (Entrar, Criar conta)
  const showAuthButtons = !['/login', '/cadastro', '/login-entregador', '/cadastro-entregador'].includes(location.pathname);

  const renderButtons = () => {
    // 1. Se o utilizador estiver logado
    if (isLoggedIn) {
      if (userType === 'driver') {
        return (
          <div className={styles.userActions}>
            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>Minhas Rotas</Link>
            <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Perfil</Link>
            <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair</button>
          </div>
        );
      }
      // CORREÇÃO: O botão "Carrinho" foi removido daqui
      return (
        <div className={styles.userActions}>
          <button onClick={onToggleOrders} className={`${styles.btn} ${styles.btnSecondary}`}>Pedidos</button>
          <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Perfil</Link>
          <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair da conta</button>
        </div>
      );
    }
    
    // 2. Se estiver na página de login do CLIENTE
    if (location.pathname === '/login') {
      return (
        <Link to="/login-entregador" className={`${styles.btn} ${styles.btnSecondary}`}>
          É um entregador?
        </Link>
      );
    }
    
    // 3. Se estiver na Home (ou noutra página pública)
    if (showAuthButtons) {
      return (
        <div className={styles.actions}>
          <Link to="/cadastro" className={`${styles.btn} ${styles.btnPrimary}`}>Criar conta</Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>Entrar</Link>
        </div>
      );
    }
    
    // 4. Se estiver noutra página de autenticação (ex: /cadastro), não mostra nada.
    return null;
  };

  return (
    <header className={styles.container}>
      <Link to="/" className={styles.logo}>DelivOne</Link>
      <nav>{renderButtons()}</nav>
    </header>
  );
}
export default Header;