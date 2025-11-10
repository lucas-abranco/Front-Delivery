// Caminho: src/components/RestaurantCard/RestaurantCard.jsx
import { Link } from 'react-router-dom';
import styles from './RestaurantCard.module.css';

function RestaurantCard({ restaurant }) {
  return (
    // O cartão inteiro é um link para a página do restaurante
    <Link to={`/restaurante/${restaurant.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={restaurant.image} alt={restaurant.name} className={styles.cardImage} />
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{restaurant.name}</h3>
          <div className={styles.cardInfo}>
            <span>⭐ {restaurant.rating}</span>
            <span>•</span>
            <span>{restaurant.cuisine}</span>
          </div>
          <div className={styles.cardDelivery}>
            <span>{restaurant.deliveryTime}</span>
            <span>•</span>
            <span>R$ {restaurant.deliveryFee.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;