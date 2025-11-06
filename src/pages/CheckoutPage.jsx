import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Importar o hook useCart
import styles from './CheckoutPage.module.css';
import AddressModal from '../components/AddressModal/AddressModal';
import PaymentModal from '../components/PaymentModal/PaymentModal';

function CheckoutPage({ onConfirmOrder }) {
  // Obtém os dados do carrinho (da API) e a função clearCart
  const { cartItems, subtotal, deliveryFee, finalTotal, clearCart, storeId } = useCart();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('Rua Barão, 321'); // Endereço de exemplo
  const [payment, setPayment] = useState({ type: 'PIX' });
  
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleConfirm = () => {
    // 1. O nosso back-end (POST /orders) espera receber o storeId, o endereço e a taxa.
    //    Usamos o 'storeId' guardado no contexto do carrinho.
    if (!storeId || cartItems.length === 0) {
        alert("Erro: Carrinho vazio ou não foi possível identificar a loja.");
        return;
    }

    // 2. Monta o objeto 'orderData' que o App.jsx espera
    const orderData = {
      storeId: storeId,
      deliveryAddress: address,
      deliveryFee: parseFloat(deliveryFee), // Garante que é um número
    };
    
    // 3. Chama a função do App.jsx para enviar o pedido à API
    onConfirmOrder(orderData);

    // 4. Limpa o carrinho (agora via API) e navega para a página de sucesso
    clearCart();
    navigate('/pedido-confirmado');
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
            {/* O botão 'Confirmar pedido' agora chama a função handleConfirm */}
            <button onClick={handleConfirm} className={styles.confirmButton}>Confirmar pedido</button>
          </div>
        </div>
      </div>
    </>
  );
}
export default CheckoutPage;