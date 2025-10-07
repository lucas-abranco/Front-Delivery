import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import styles from './Header.module.css';

function Header({ isLoggedIn, userType, onLogout }) {
  const { toggleCart, itemCount } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const showAuthButtons = !['/login', '/cadastro', '/login-entregador', '/cadastro-entregador'].includes(location.pathname);

  const renderButtons = () => {
    if (isLoggedIn) {
      if (userType === 'driver') {
        return (
          <div className={styles.userActions}>
            <Link to="/" className={styles.link}>Minhas Rotas</Link>
            <Link to="/perfil" className={styles.link}>Perfil</Link>
            <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair</button>
          </div>
        );
      }
      return (
        <div className={styles.userActions}>
          <Link to="/pedidos" className={styles.link}>Pedidos</Link>
          <button onClick={toggleCart} className={styles.cartButton}>
            Carrinho ({itemCount})
          </button>
          <Link to="/perfil" className={styles.link}>Perfil</Link>
          <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair da conta</button>
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

