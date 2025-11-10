// Caminho: src/components/FloatingCart/FloatingCart.jsx
import { useContext } from 'react'; // 1. Importar o useContext do React
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext'; // 2. Importar o CartContext diretamente
import styles from './FloatingCart.module.css';

function FloatingCart() {
  // 3. Usar o useContext(CartContext) em vez do useCart()
  const { 
    isCartOpen, 
    cartItems, 
    removeFromCart, 
    increaseQuantity,
    decreaseQuantity,
    toggleCart, 
    itemCount, 
    subtotal,
    isLoggedIn,
    setNotification
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(); // Fecha sempre o carrinho
    if (isLoggedIn) {
      navigate('/finalizar-pedido'); // Se estiver logado, vai para o checkout
    } else {
      // Se não, envia notificação e vai para o login
      setNotification('Você precisa estar logado para finalizar o pedido.');
      navigate('/login');
    }
  };

  if (!isCartOpen) {
    return itemCount > 0 ? (
      <button onClick={toggleCart} className={styles.floatingButton}>
        🛒 Carrinho ({itemCount})
      </button>
    ) : null;
  }
  
  return (
    <div className={styles.overlay} onClick={toggleCart}>
      <div className={styles.cartModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>O seu Carrinho</h2>
          <button onClick={toggleCart} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.itemList}>
          {cartItems.length === 0 ? (
            <p>O seu carrinho está vazio.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <div className={styles.quantityControl}>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                </div>
                <div className={styles.itemPriceInfo}>
                  <span>R$ {(parseFloat(item.price.replace(',', '.')) * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>Remover</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Subtotal</span>
            <span>R$ {subtotal}</span>
          </div>
          <button onClick={handleCheckout} className={styles.checkoutButton}>Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
}

export default FloatingCart;