// Caminho: src/pages/DriverDashboardPage.jsx
import React from 'react'; // Este componente não precisa de 'useState' ou 'useEffect'
import styles from './DriverDashboardPage.module.css';
// Este componente não precisa do 'useAuth' porque o 'App.jsx' já tratou da autenticação

// --- Componente do Cartão de Rota ---
function RouteCard({ order, onAcceptRoute }) {
  // Simula o cálculo da distância, pagamento e tempo para fins de exibição
  const distance = (Math.random() * 5 + 2).toFixed(1);
  const payment = (Math.random() * 10 + 10).toFixed(2);
  const time = Math.floor(Math.random() * 20 + 15);

  return (
    <div className={styles.routeCard}>
      <div className={styles.routeInfo}>
        {/* Mostra o endereço de entrega do pedido */}
        <div>
          <span className={styles.label}>ENTREGA</span>
          <p>{order.deliveryAddress || 'Endereço não informado'}</p>
        </div>
        {/* Mostra o nome da loja (do back-end) */}
        <div>
          <span className={styles.label}>DA LOJA</span>
          <p>{order.store?.name || 'Loja não identificada'}</p>
        </div>
      </div>
      <div className={styles.routeDetails}>
        <span>{distance} km</span>
        <span className={styles.payment}>{`R$ ${payment} - ${time} min`}</span>
        {/* Passa o ID do pedido ao ser aceite */}
        <button onClick={() => onAcceptRoute(order.id)} className={styles.acceptButton}>Aceitar rota</button>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---
// Recebe 'orders' (já filtrados pelo App.jsx) e 'onAcceptRoute' como props
function DriverDashboardPage({ orders, onAcceptRoute }) {

  // A lógica de 'loading' e 'fetch' já foi tratada pelo App.jsx.
  // O App.jsx também já verificou se há uma entrega ativa.
  // Este componente agora só precisa de renderizar a lista de pedidos disponíveis.

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Escolher Rota</h1>
        <p>Pedidos disponíveis para entrega</p>
      </div>
      <div className={styles.routesList}>
        {orders && orders.length > 0 ? (
          orders.map(order => (
            // Renderiza um cartão para cada pedido disponível
            <RouteCard key={order.id} order={order} onAcceptRoute={onAcceptRoute} />
          ))
        ) : (
          <p>Nenhum pedido disponível no momento.</p>
        )}
      </div>
    </div>
  );
}

export default DriverDashboardPage;