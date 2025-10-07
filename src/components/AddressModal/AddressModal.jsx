// Crie a pasta src/components/AddressModal
// Componente para o Modal de Endereço:src/components/AddressModal/AddressModal.jsx
import { useState } from 'react';
import styles from './AddressModal.module.css';

function AddressModal({ currentAddress, onClose, onSave }) {
  const [address, setAddress] = useState(currentAddress);

  const handleSave = () => {
    onSave(address);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Endereço de Entrega</h2>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          className={styles.input}
        />
        <button onClick={handleSave} className={styles.saveButton}>Salvar</button>
      </div>
    </div>
  );
}

export default AddressModal;