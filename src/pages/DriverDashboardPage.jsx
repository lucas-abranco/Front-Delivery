import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importar o hook de Autenticação
import styles from './DriverDashboardPage.module.css';

// URL da nossa API de back-end
const API_URL = 'http://localhost:3000';

// Componente para exibir um único cartão de rota
function RouteCard({ order, onAcceptRoute }) {
  // Simula o cálculo da distância, pagamento e tempo para fins de exibição
  const distance = (Math.random() * 5 + 2).toFixed(1);
  const payment = (Math.random() * 10 + 10).toFixed(2);
  const time = Math.floor(Math.random() * 20 + 15);

  return (
    <div className={styles.routeCard}>
      <div className={styles.routeInfo}>
        <div>
          <span className={styles.label}>ENTREGA</span>
          <p>{order.deliveryAddress || 'Endereço não informado'}</p>
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

// A página principal do painel do entregador
function DriverDashboardPage({ onAcceptRoute }) {
  const { token } = useAuth(); // Obtém o token para a chamada de API
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os pedidos disponíveis na API
  const fetchAvailableOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders/available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar pedidos disponíveis.');
      
      const data = await response.json();
      setAvailableOrders(data);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  };

  // Busca os pedidos quando o componente carrega (e sempre que o token mudar)
  useEffect(() => {
    if (token) {
      fetchAvailableOrders();
    }
  }, [token]);

  // Função para lidar com a aceitação e atualizar a lista
  const handleAccept = async (orderId) => {
    await onAcceptRoute(orderId); // Chama a função do App.jsx para atualizar o back-end
    fetchAvailableOrders(); // Atualiza a lista de pedidos disponíveis no front-end
  };

  if (loading) {
    return <div className={styles.dashboardContainer}><p>A carregar rotas...</p></div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Escolher Rota</h1>
        <p>Pedidos disponíveis para entrega</p>
      </div>
      <div className={styles.routesList}>
        {availableOrders.length > 0 ? (
          availableOrders.map(order => (
            <RouteCard key={order.id} order={order} onAcceptRoute={handleAccept} />
          ))
        ) : (
          <p>Nenhum pedido disponível no momento.</p>
        )}
      </div>
    </div>
  );
}

export default DriverDashboardPage;
