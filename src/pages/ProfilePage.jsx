import { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';

function ProfilePage({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Atualiza o formulário quando o utilizador muda (ex: de cliente para entregador)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não correspondem.' });
      return;
    }
    const success = onUpdate(formData);
    if (success) {
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } else {
      setMessage({ type: 'error', text: 'A senha atual está incorreta.' });
    }
  };

  if (!user) {
    return <div>Você precisa estar logado para ver esta página.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileBox}>
        <h1>Meu Perfil</h1>
        {message.text && <p className={message.type === 'success' ? styles.notificationSuccess : styles.notificationError}>{message.text}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome completo</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          
          <hr className={styles.divider} />
          
          <h4>Alterar Senha</h4>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword">Senha Atual</label>
            <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Nova Senha</label>
            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          
          <button type="submit" className={styles.saveButton}>Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;

