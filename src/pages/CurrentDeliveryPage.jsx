import { useState } from 'react';
import styles from './CurrentDeliveryPage.module.css';

function CurrentDeliveryPage({ delivery, onCompleteDelivery }) {
  // Estado para controlar o fluxo de confirmação em duas etapas
  const [arrived, setArrived] = useState(false);

  if (!delivery) {
    return <div>Nenhuma entrega ativa.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.deliveryCard}>
        <h1>Em Rota de Entrega</h1>
        
        <div className={styles.addressSection}>
          <div className={styles.address}>
            <span className={styles.label}>RECOLHA</span>
            <p>{delivery.pickupAddress}</p>
          </div>
          <div className={styles.arrow}>↓</div>
          <div className={styles.address}>
            <span className={styles.label}>ENTREGA</span>
            <p>{delivery.deliveryAddress}</p>
          </div>
        </div>
        
        <div className={styles.statusInfo}>
          {arrived 
            ? "Confirme que a entrega foi concluída."
            : "Avise quando chegar ao endereço de entrega."
          }
        </div>
        
        <div className={styles.actions}>
          {!arrived ? (
            <button 
              onClick={() => setArrived(true)}
              className={styles.actionButton}
            >
              Cheguei ao endereço
            </button>
          ) : (
            <button 
              onClick={() => onCompleteDelivery(delivery.id)}
              className={`${styles.actionButton} ${styles.confirmButton}`}
            >
              Confirmar Entrega
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrentDeliveryPage;
