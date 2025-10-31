import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuth } from '../contexts/AuthContext'; // Importa o hook de autenticação

// Recebe as props 'notification' e 'setNotification' do App.jsx
function LoginPage({ notification, setNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para erros de login
  
  const { login } = useAuth(); // Obtém a função de login do nosso AuthContext
  const navigate = useNavigate();

  // Efeito para limpar a notificação (ex: "Você precisa estar logado...")
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(''); // Limpa a notificação após 5 segundos
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Limpa erros anteriores
    
    try {
      // Chama a função de login do AuthContext, que fala com a API
      await login(email, password);
      // Se o login for bem-sucedido, o AuthContext irá guardar o token
      // e o App.jsx (no Canvas) irá re-renderizar e mostrar a página correta (Home ou Dashboard)
      navigate('/'); // Redireciona para a página principal
    } catch (err) {
      // Se a função login() do AuthContext lançar um erro (ex: 401 do back-end)
      setError(err.message || 'Falha no login. Verifique as suas credenciais.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {/* Exibe a notificação vinda do App.jsx (ex: "Precisa estar logado") */}
        {notification && <p className={styles.success}>{notification}</p>}
        
        <h1 className={styles.title}>Entrar na sua conta</h1>
        
        {/* Exibe erros de falha no login */}
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Entrar</button>
        </form>
        <p className={styles.signupText}>
          Não tem conta? 
          <Link to="/cadastro" className={styles.linkButton}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

