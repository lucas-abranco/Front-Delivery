import { useState } from 'react';
// Vamos reutilizar os estilos da página de login do cliente
import styles from './LoginPage.module.css';

function LoginDriverPage({ onLoginDriver, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginSuccessful = onLoginDriver(email, password);
    if (!loginSuccessful) {
      setError('E-mail ou senha de entregador inválidos.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login do Parceiro Entregador</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitButton}>Entrar</button>
        </form>
        <p className={styles.signupText}>
          Não é um parceiro? 
          <button onClick={() => onNavigate('signupDriver')} className={styles.linkButton}>
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginDriverPage;
