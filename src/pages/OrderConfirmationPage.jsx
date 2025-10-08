import { Link } from 'react-router-dom';
import styles from './OrderConfirmationPage.module.css';

function OrderConfirmationPage() {
  return (
    <div className={styles.confirmationContainer}>
      <div className={styles.confirmationBox}>
        <div className={styles.icon}>✔</div>
        <h1>Pedido Confirmado!</h1>
        <p>O seu pedido foi recebido e já está a ser preparado.</p>
        <div className={styles.deliveryInfo}>
          <span>Tempo estimado de entrega:</span>
          <strong>40-50 min</strong>
        </div>
        <Link to="/" className={styles.homeButton}>Voltar para o início</Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
