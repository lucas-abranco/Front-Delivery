import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import styles from './ProductModal.module.css';

function ProductModal({ item, onClose }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item);
    onClose(); // Fecha o modal após adicionar
  };

  if (!item) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.imagePlaceholder}></div>
        <div className={styles.content}>
          <h2>{item.name}</h2>
          <p className={styles.description}>{item.description}</p>
          <span className={styles.price}>R$ {item.price}</span>
          <button className={styles.addButton} onClick={handleAddToCart}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
