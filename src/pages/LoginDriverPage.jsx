import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Reutiliza o mesmo estilo da página de login do cliente
import { useAuth } from '../contexts/AuthContext'; // 1. Importar o hook de Autenticação

function LoginDriverPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginDriver } = useAuth(); // 2. Obter a função específica de login de entregador
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // 3. Chamar a função loginDriver do AuthContext
      await loginDriver(email, password);
      // Se o login for bem-sucedido, o AuthContext irá guardar o token
      // e o App.jsx irá redirecionar automaticamente para o Painel do Entregador
      navigate('/');
    } catch (err) {
      // 4. Se a API retornar um erro (ex: 401)
      setError(err.message || 'Falha no login. Verifique as suas credenciais.');
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
            <input 
              type="email" 
              id="email" 
              placeholder="email@entregador.com"
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
          Não é um parceiro? 
          <Link to="/cadastro-entregador" className={styles.linkButton}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginDriverPage;

