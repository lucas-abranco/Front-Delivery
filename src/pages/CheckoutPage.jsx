import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar o hook de navegação
import { CartContext } from '../contexts/CartContext';
import styles from './CheckoutPage.module.css';
import AddressModal from '../components/AddressModal/AddressModal';
import PaymentModal from '../components/PaymentModal/PaymentModal';

function CheckoutPage() {
  // 2. Obter a função 'clearCart' do contexto
  const { cartItems, subtotal, deliveryFee, finalTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate(); // 3. Inicializar o hook
  
  const [address, setAddress] = useState('Rua Exemplo, 123 - Centro');
  const [payment, setPayment] = useState({ type: 'PIX' });
  
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  // 4. Esta é a função que é chamada ao clicar no botão
  const handleConfirmOrder = () => {
    // No futuro, aqui chamaríamos a API
    console.log("Pedido confirmado:", { address, payment, items: cartItems, total: finalTotal });
    clearCart(); // Limpa o carrinho
    navigate('/pedido-confirmado'); // Navega para a página de confirmação
  };

  const getPaymentMethodString = () => {
    if (payment.type === 'Dinheiro') return `Na Entrega (troco para R$ ${payment.changeFor?.toFixed(2)})`;
    if (payment.type === 'Cartão') return `Cartão de Crédito (${payment.cardInfo || '**** 1234'})`;
    return 'PIX';
  };

  return (
    <>
      {isAddressModalOpen && <AddressModal currentAddress={address} onClose={() => setAddressModalOpen(false)} onSave={setAddress} />}
      {isPaymentModalOpen && <PaymentModal onClose={() => setPaymentModalOpen(false)} onSave={setPayment} orderTotal={parseFloat(finalTotal)} />}

      <div className={styles.checkoutContainer}>
        <h1>Finalizar Pedido</h1>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h2>Itens do pedido</h2>
              {cartItems.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(parseFloat(item.price.replace(',', '.')) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <h3>Endereço de entrega</h3>
              <p>{address}</p>
              <button onClick={() => setAddressModalOpen(true)} className={styles.changeButton}>Trocar</button>
            </div>
            <div className={styles.card}>
              <h3>Pagamento</h3>
              <p>{getPaymentMethodString()}</p>
              <button onClick={() => setPaymentModalOpen(true)} className={styles.changeButton}>Alterar</button>
            </div>
            <div className={styles.card}>
              <h3>Resumo</h3>
              <div className={styles.summaryLine}><span>Subtotal</span><span>R$ {subtotal}</span></div>
              <div className={styles.summaryLine}><span>Taxa de entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
              <div className={`${styles.summaryLine} ${styles.total}`}><span>Total</span><span>R$ {finalTotal}</span></div>
            </div>
            {/* 5. O botão chama a função handleConfirmOrder ao ser clicado */}
            <button onClick={handleConfirmOrder} className={styles.confirmButton}>Confirmar pedido</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default CheckoutPage;

