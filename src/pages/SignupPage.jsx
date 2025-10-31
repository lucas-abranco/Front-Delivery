import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import { useAuth } from '../contexts/AuthContext'; // 1. Importar o hook de Autenticação

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const { register } = useAuth(); // 2. Obter a função 'register' do AuthContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validação simples no front-end
  const validateForm = () => {
    const newErrors = {};
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Os e-mails não correspondem.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não correspondem.";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({}); // Limpa erros antigos

    try {
      // 3. Chamar a função 'register' do AuthContext, que fala com a API
      const dataToSubmit = {
        name: formData.name,
        cpf: formData.cpf,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      };
      
      await register(dataToSubmit);
      
      // Se o registo for bem-sucedido, redireciona para a página de login
      navigate('/login');

    } catch (err) {
      // 4. Se a API retornar um erro (ex: 409 Conflict), exibe a mensagem
      setErrors({ form: err.message || "Falha ao tentar cadastrar." });
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h1 className={styles.title}>Cadastro de Cliente</h1>
        {errors.form && <p className={styles.error}>{errors.form}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome completo</label>
            <input type="text" id="name" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" name="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmEmail">Confirmar e-mail</label>
            <input type="email" id="confirmEmail" name="confirmEmail" placeholder="repita seu e-mail" value={formData.confirmEmail} onChange={handleChange} required />
            {errors.confirmEmail && <p className={styles.fieldError}>{errors.confirmEmail}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" name="password" placeholder="mín. 8 caracteres" value={formData.password} onChange={handleChange} required />
              {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="repita sua senha" value={formData.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <p className={styles.fieldError}>{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <button type="submit" className={styles.submitButton}>Criar conta</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;

