// Caminho: src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { useAuth } from '../contexts/AuthContext'; // 1. Importar o hook de Autenticação

// A página já não recebe 'props' (como 'user' ou 'onUpdate')
function ProfilePage() {
  // 2. Obter o 'user' E a função 'updateProfile' diretamente do AuthContext
  const { user, updateProfile } = useAuth(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // 3. Usar o useEffect para preencher o formulário quando os dados do 'user' chegarem
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
  }, [user]); // Este efeito corre sempre que o objeto 'user' mudar

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. O handleSubmit agora é 'async' para poder chamar a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não correspondem.' });
      return;
    }

    try {
      // 5. Prepara os dados a serem enviados para a API
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
      };
      
      // Só envia os campos de senha se o utilizador preencheu uma nova senha
      if (formData.newPassword) {
        dataToUpdate.currentPassword = formData.currentPassword;
        dataToUpdate.newPassword = formData.newPassword;
      }

      // 6. Chama a função 'updateProfile' do AuthContext (que fala com o back-end)
      await updateProfile(dataToUpdate);
      
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    
    } catch (err) {
      // 7. Captura o erro do back-end (ex: senha atual incorreta)
      setMessage({ type: 'error', text: err.message || 'Falha ao atualizar perfil.' });
    }
  };

  if (!user) {
    return <div>A carregar dados do perfil...</div>;
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
            <input type="password" id="currentPassword" name="currentPassword" placeholder="Apenas se for alterar a senha" value={formData.currentPassword} onChange={handleChange} />
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