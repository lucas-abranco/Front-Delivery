// Crie a pasta src/components/PaymentModal
// Componente para o Modal de Pagamento:src/components/PaymentModal/PaymentModal.jsx
import { useState } from 'react';
import styles from './PaymentModal.module.css';

function PaymentModal({ onClose, onSave, orderTotal }) {
  const [method, setMethod] = useState('PIX');
  const [cashValue, setCashValue] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    let paymentDetails = { type: method };

    if (method === 'Dinheiro') {
      const cash = parseFloat(cashValue.replace(',', '.'));
      if (!cash || cash < orderTotal) {
        setError('O valor para troco deve ser igual ou maior que o total do pedido.');
        return;
      }
      paymentDetails.changeFor = cash;
    }
    
    // Lógica para cartão (simplificada)
    if (method === 'Cartão') {
        paymentDetails.cardInfo = 'Mastercard **** 1234';
    }

    onSave(paymentDetails);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Forma de Pagamento</h2>
        <div className={styles.methodSelector}>
          <button onClick={() => setMethod('PIX')} className={method === 'PIX' ? styles.active : ''}>PIX</button>
          <button onClick={() => setMethod('Cartão')} className={method === 'Cartão' ? styles.active : ''}>Cartão</button>
          <button onClick={() => setMethod('Dinheiro')} className={method === 'Dinheiro' ? styles.active : ''}>Na Entrega</button>
        </div>

        <div className={styles.methodDetails}>
          {method === 'PIX' && (
            <div className={styles.pixContent}>
              <p>Faça a leitura do QR Code para pagar:</p>
              <img src="https://placehold.co/200x200/eee/ccc?text=QR+Code+PIX" alt="QR Code PIX" />
            </div>
          )}
          {method === 'Cartão' && (
            <div className={styles.cardForm}>
              <input placeholder="Número do Cartão" />
              <input placeholder="Nome no Cartão" />
              <div className={styles.cardRow}>
                <input placeholder="Validade (MM/AA)" />
                <input placeholder="CVV" />
              </div>
            </div>
          )}
          {method === 'Dinheiro' && (
            <div className={styles.cashForm}>
              <p>Precisa de troco?</p>
              <input 
                type="text" 
                placeholder="Ex: 50,00" 
                value={cashValue}
                onChange={(e) => setCashValue(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleSave} className={styles.saveButton}>Salvar</button>
      </div>
    </div>
  );
}
export default PaymentModal;