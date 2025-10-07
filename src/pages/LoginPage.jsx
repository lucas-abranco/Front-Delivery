import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link
import styles from './LoginPage.module.css';

// 2. Remover 'onNavigate' das propriedades
function LoginPage({ onLogin, notification, setNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    const loginSuccessful = onLogin(email, password);
    if (!loginSuccessful) {
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {notification && <p className={styles.success}>{notification}</p>}
        <h1 className={styles.title}>Entrar na sua conta</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitButton}>Entrar</button>
        </form>
        <p className={styles.signupText}>
          Não tem conta? 
          {/* 3. Usar o Link para navegação para a rota de cadastro */}
          <Link to="/cadastro" className={styles.linkButton}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

