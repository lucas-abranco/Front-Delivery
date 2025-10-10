import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ isLoggedIn, userType, onLogout, onToggleOrders }) {
  const location = useLocation();

  // Lógica para decidir se os botões de "Entrar" e "Criar conta" devem aparecer
  const showAuthButtons = !['/login', '/cadastro', '/login-entregador', '/cadastro-entregador'].includes(location.pathname);

  const renderButtons = () => {
    // Menu para utilizadores logados
    if (isLoggedIn) {
      // Menu específico para o entregador
      if (userType === 'driver') {
        return (
          <div className={styles.userActions}>
            <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Meu Perfil</Link>
            <button onClick={onLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair</button>
          </div>
        );
      }
      // Menu padrão para o cliente
      return (
        <div className={styles.userActions}>
          <button onClick={onToggleOrders} className={`${styles.btn} ${styles.btnSecondary}`}>Pedidos</button>
          <Link to="/perfil" className={`${styles.btn} ${styles.btnSecondary}`}>Perfil</Link>
          <button onClick={onLogout} className={`${styles.btn} ${styles.btnSecondary}`}>Sair da conta</button>
        </div>
      );
    }
    
    // Botão especial para a página de login do cliente
    if (location.pathname === '/login') {
      return (
        <Link to="/login-entregador" className={`${styles.btn} ${styles.btnSecondary}`}>
          É um entregador?
        </Link>
      );
    }

    // Botões padrão para utilizadores deslogados (Home, etc.)
    if (showAuthButtons) {
      return (
        <div className={styles.actions}>
          <Link to="/cadastro" className={`${styles.btn} ${styles.btnPrimary}`}>Criar conta</Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>Entrar</Link>
        </div>
      );
    }
    
    // Não mostra nada no cabeçalho em páginas de cadastro
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

