import styles from './DriverDashboardPage.module.css';

// Componente para exibir um único cartão de rota
function RouteCard({ order, onAcceptRoute }) {
  // Simula o cálculo da distância, pagamento e tempo para fins de exibição
  const distance = (Math.random() * 5 + 2).toFixed(1);
  const payment = (Math.random() * 10 + 10).toFixed(2);
  const time = Math.floor(Math.random() * 20 + 15);

  return (
    <div className={styles.routeCard}>
      <div className={styles.routeInfo}>
        {/* CORREÇÃO: Removido o endereço de recolha */}
        <div>
          <span className={styles.label}>ENDEREÇO DE ENTREGA</span>
          {/* Garante que o endereço do cliente seja exibido */}
          <p>{order.deliveryAddress || 'Endereço não informado'}</p>
        </div>
      </div>
      <div className={styles.routeDetails}>
        <span>{distance} km</span>
        <span className={styles.payment}>{`R$ ${payment} - ${time} min`}</span>
        {/* Passa o objeto do pedido inteiro ao ser aceite */}
        <button onClick={() => onAcceptRoute(order)} className={styles.acceptButton}>Aceitar rota</button>
      </div>
    </div>
  );
}

// A página principal do painel do entregador
function DriverDashboardPage({ orders, onAcceptRoute }) {
  // Filtra apenas os pedidos que estão "Em andamento" e ainda não têm um entregador associado
  const availableOrders = orders.filter(order => order.status === 'Em andamento' && !order.driverId);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Escolher Rota</h1>
        <p>Pedidos disponíveis para entrega</p>
      </div>
      <div className={styles.routesList}>
        {availableOrders.length > 0 ? (
          availableOrders.map(order => (
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

