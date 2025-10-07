import { useState } from 'react';
import styles from './SignupPage.module.css';
// Importamos a função de validação de CPF que já temos
import { isValidCPF } from '../utils/validators';

function SignupPage({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  // O estado de erros agora guardará uma mensagem para cada campo
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para validar todos os campos do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
    if (!formData.cpf) newErrors.cpf = "O CPF é obrigatório.";
    else if (!isValidCPF(formData.cpf)) newErrors.cpf = "O CPF informado não é válido.";
    if (!formData.phone) newErrors.phone = "O telefone é obrigatório.";
    if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = "Os e-mails não correspondem.";
    if (formData.password.length < 8) newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não correspondem.";
    
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    
    // Se houver erros de validação no front-end, exibe-os e para
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Se a validação do front-end passar, limpa os erros e tenta o cadastro
    setErrors({});
    const signupSuccessful = onSignup(formData);
    
    // Se onSignup retornar false (e-mail já existe), exibe um erro geral
    if (!signupSuccessful) {
      setErrors({ form: "Este e-mail já está cadastrado. Tente outro." });
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
            {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required />
              {errors.cpf && <p className={styles.fieldError}>{errors.cpf}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" name="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} required />
              {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
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

