import { useState } from 'react';
import styles from './SignupPage.module.css'; // Reutilizaremos o mesmo estilo
import { isValidCPF } from '../utils/validators';

function SignupDriverPage({ onSignupDriver }) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    vehicleType: '',
    licensePlate: '',
    cnh: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
    if (!isValidCPF(formData.cpf)) newErrors.cpf = "O CPF informado não é válido.";
    if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = "Os e-mails não correspondem.";
    if (formData.password.length < 8) newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não correspondem.";
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const signupSuccessful = onSignupDriver(formData);
    if (!signupSuccessful) {
      setErrors({ form: "Este e-mail ou CPF já está cadastrado. Tente outro." });
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h1 className={styles.title}>Cadastro de Parceiro Entregador</h1>
        {errors.form && <p className={styles.error}>{errors.form}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome completo</label>
            <input type="text" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="cpf">CPF</label>
              <input type="text" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required />
              {errors.cpf && <p className={styles.fieldError}>{errors.cpf}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" name="phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmEmail">Confirmar e-mail</label>
            <input type="email" name="confirmEmail" placeholder="repita seu e-mail" value={formData.confirmEmail} onChange={handleChange} required />
            {errors.confirmEmail && <p className={styles.fieldError}>{errors.confirmEmail}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>
              <input type="password" name="password" placeholder="mín. 8 caracteres" value={formData.password} onChange={handleChange} required />
              {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input type="password" name="confirmPassword" placeholder="repita sua senha" value={formData.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <p className={styles.fieldError}>{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className={styles.row}>
             <div className={styles.inputGroup}>
              <label htmlFor="vehicleType">Tipo de veículo</label>
              <input type="text" name="vehicleType" placeholder="moto, carro, bike..." value={formData.vehicleType} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="licensePlate">Placa do veículo (se aplicável)</label>
              <input type="text" name="licensePlate" placeholder="ABC-1D23" value={formData.licensePlate} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="cnh">CNH (se motorizado)</label>
            <input type="text" name="cnh" placeholder="número ou anexo" value={formData.cnh} onChange={handleChange} />
          </div>

          <button type="submit" className={styles.submitButton}>Cadastrar entregador</button>
        </form>
      </div>
    </div>
  );
}

export default SignupDriverPage;
