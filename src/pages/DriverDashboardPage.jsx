import { availableRoutes } from '../data/routes';
import styles from './DriverDashboardPage.module.css';

function RouteCard({ route }) {
  return (
    <div className={styles.routeCard}>
      <div className={styles.routeInfo}>
        <div>
          <span className={styles.label}>Retirada</span>
          <p>{route.pickup}</p>
        </div>
        <div>
          <span className={styles.label}>Entrega</span>
          <p>{route.dropoff}</p>
        </div>
      </div>
      <div className={styles.routeDetails}>
        <span>{route.distance}</span>
        <span className={styles.payment}>{`${route.payment} - ${route.time}`}</span>
        <button className={styles.acceptButton}>Aceitar rota</button>
      </div>
    </div>
  );
}

function DriverDashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Escolher Rota</h1>
        <p>Rotas disponíveis</p>
      </div>
      <div className={styles.routesList}>
        {availableRoutes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}

export default DriverDashboardPage;
