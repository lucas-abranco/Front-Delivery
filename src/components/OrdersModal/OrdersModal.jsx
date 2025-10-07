import React from 'react';
// CORREÇÃO AQUI: Importa o seu próprio ficheiro de estilos
import styles from './OrdersModal.module.css'; 
import { ordersData } from '../../data/orders.js';

function OrderCard({ order }) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.cardHeader}>
        <h4>{order.restaurant}</h4>
        <span className={order.status === 'Em andamento' ? styles.inProgress : styles.delivered}>
          {order.status}
        </span>
      </div>
      <div className={styles.cardBody}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.orderItem}>
            <span>{item.name}</span>
            <span>R$ {item.price}</span>
          </div>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <span>{order.date}</span>
        <strong>Total: R$ {order.total}</strong>
      </div>
    </div>
  );
}

function OrdersModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentOrders = ordersData.filter(o => o.status === 'Em andamento');
  const pastOrders = ordersData.filter(o => o.status === 'Entregue');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Meus Pedidos</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          <section>
            <h3>Em andamento</h3>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <p>Nenhum pedido em andamento.</p>
            )}
          </section>
          <section>
            <h3>Histórico</h3>
            {pastOrders.length > 0 ? (
              pastOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <p>Nenhum pedido anterior.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrdersModal;
