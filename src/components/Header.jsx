// Header Atualizado (Canvas):src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

// Recebe a nova função 'onToggleOrders'
function Header({ isLoggedIn, userType, onLogout, onToggleOrders }) {
  const location = useLocation();
  const showAuthButtons = !['/login', '/cadastro', '/login-entregador', '/cadastro-entregador'].includes(location.pathname);

  const renderButtons = () => {
    if (isLoggedIn) {
      if (userType === 'driver') {
        return (
          <div className={styles.userActions}>
            <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>Minhas Rotas</Link>
            <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Perfil</Link>
            <button onClick={onLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair</button>
          </div>
        );
      }
      return (
        <div className={styles.userActions}>
          {/* O link de Pedidos agora é um botão que abre o modal */}
          <button onClick={onToggleOrders} className={`${styles.btn} ${styles.btnSecondary}`}>Pedidos</button>
          <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Perfil</Link>
          <button onClick={onLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair da conta</button>
        </div>
      );
    }
    
    if (showAuthButtons) {
      return (
        <div className={styles.actions}>
          <Link to="/cadastro" className={`${styles.btn} ${styles.btnPrimary}`}>Criar conta</Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>Entrar</Link>
        </div>
      );
    }
    
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