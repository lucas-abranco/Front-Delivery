import styles from './Cart.module.css';

function Cart() {
  // Por enquanto, o carrinho é estático
  return (
    <div className={styles.cartContainer}>
      <h3 className={styles.title}>Carrinho</h3>
      <div className={styles.cartBody}>
        <p className={styles.emptyText}>Seu carrinho está vazio</p>
        <div className={styles.total}>
          <span>0 itens</span>
          <span>R$ 0,00</span>
        </div>
      </div>
      <button className={styles.checkoutButton}>Ver carrinho</button>
    </div>
  );
}
export default Cart;
